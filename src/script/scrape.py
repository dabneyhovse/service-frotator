from user import parse_user, User

from bs4 import BeautifulSoup
from bs4.element import Tag
from datetime import date
from PIL import Image

from rich.console import Console
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
)

import cloudpickle as pickle
import pandas as pd
import requests
import io
import os

from concurrent.futures import ThreadPoolExecutor, as_completed, Future
from dataclasses import dataclass
from typing import Dict, List
from urllib.parse import urljoin

console = Console()
error_console = Console(stderr=True, style="bold red")

MAX_WORKERS = 4  # Tuneable: number of concurrent requests per class
REQUEST_TIMEOUT = 15  # seconds for HTTP requests
BASE_URL = "https://donut.caltech.edu"
SESSION_KEY = input("Enter your Caltech Donut session key (see README):\t")
COOKIES = {
    "session": SESSION_KEY
}
PERMAPREFROSH_URL = input("Enter the URL to the Caltech Donut profile page of the current permaprefrosh (e.g. https://donut.caltech.edu/1/users/20079). Leave blank to skip:\t")

# An arbitrary value larger than the number of people in a particular class
MAX_CLASS_SIZE = 500

script_dir = os.path.dirname(os.path.abspath(__file__))
default_avatar_path = os.path.join(script_dir, "default_avatar.png")
default_avatar = Image.open(default_avatar_path)
default_avatar_url = BASE_URL + "/static/images/donut_man.png"

current_year = date.today().year
expected_grad_year = current_year + 4
possible_grad_years = range(current_year, expected_grad_year + 1)

prefrosh: List[User] = []


@dataclass(frozen=True)
class AvatarItem:
    """Represents a user entry from the class list page."""
    name: str
    image_url: str
    user_url: str


def build_class_url(grad_year: int) -> str:
    return (
        f"{BASE_URL}/1/users?page=1&per_page={MAX_CLASS_SIZE}&name=&house_id=&option_id=&building_id="
        f"&grad_year={grad_year}&username=&email=&timezone_from=&timezone_to=&total={MAX_CLASS_SIZE}&show_images=on"
    )


def fetch_bytes(url: str) -> bytes:
    resp = requests.get(url, cookies=COOKIES, timeout=REQUEST_TIMEOUT)
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code}: {resp.reason}")
    return resp.content


def fetch_image(url: str) -> Image.Image:
    content = fetch_bytes(url)
    return Image.open(io.BytesIO(content))


def username_from_email(email: str) -> str:
    return email.split("@")[0]

def parse_items(html: bytes) -> List[AvatarItem]:
    soup = BeautifulSoup(html, "html.parser")
    avatars = soup.find_all(name="img")
    items: List[AvatarItem] = []
    for avatar in avatars:
        if not isinstance(avatar, Tag):
            continue
        sibling = avatar.find_next_sibling()
        name = sibling.get_text(strip=True) if sibling is not None else "Unknown"

        src = avatar.attrs.get("src")
        image_url = urljoin(BASE_URL, src) if isinstance(src, str) else ""

        parent = avatar.find_parent("a")
        href = parent.get("href") if isinstance(parent, Tag) else None
        user_url = urljoin(BASE_URL, href) if isinstance(href, str) else ""

        if user_url:
            items.append(AvatarItem(name=name, image_url=image_url, user_url=user_url))
    return items

 

def process_class(grad_year: int, progress: Progress) -> List[User]:
    """Process a single graduating class: fetch list, fetch/parse profiles, fetch avatars."""
    list_html = fetch_bytes(build_class_url(grad_year))
    items = parse_items(list_html)

    task_id = progress.add_task(
        description=f"Downloading graduating class of {grad_year}", total=len(items)
    )

    class_prefrosh: List[User] = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as profile_executor, ThreadPoolExecutor(
        max_workers=MAX_WORKERS
    ) as avatar_executor:
        future_to_item: Dict[Future[bytes], AvatarItem] = {}
        for item in items:
            fut = profile_executor.submit(fetch_bytes, item.user_url)
            future_to_item[fut] = item

        avatar_futures: Dict[Future[Image.Image], User] = {}

        for fut in as_completed(future_to_item):
            item = future_to_item[fut]
            try:
                content = fut.result()
            except Exception as e:
                error_console.print(f"Error fetching data for {item.name}: {e}")
                progress.advance(task_id)
                continue

            try:
                user = parse_user(content)
                if user.matriculation_year != current_year:
                    progress.advance(task_id)
                    continue

                if not item.image_url or item.image_url == default_avatar_url:
                    class_prefrosh.append(user)
                    progress.advance(task_id)
                else:
                    af = avatar_executor.submit(fetch_image, item.image_url)
                    avatar_futures[af] = user
            except Exception as e:
                error_console.print(f"Error parsing user page for {item.name}: {e}")
                progress.advance(task_id)

        for af in as_completed(avatar_futures):
            user = avatar_futures[af]
            try:
                img = af.result()
                setattr(user, "avatar", img)
            except Exception as e:
                error_console.print(f"Error fetching avatar for {user.preferred_name}: {e}")
                setattr(user, "avatar", default_avatar.copy())
            finally:
                class_prefrosh.append(user)
                progress.advance(task_id)

    return class_prefrosh

def main() -> None:
    # Ensure output directories exist
    os.makedirs(os.path.join(script_dir, "../../public/images"), exist_ok=True)
    os.makedirs(os.path.join(script_dir, "temp"), exist_ok=True)
    
    with Progress(
        SpinnerColumn(style="cyan"),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(bar_width=None),
        TextColumn(" {task.completed}/{task.total}"),
        console=console,
    ) as progress:
        with ThreadPoolExecutor(max_workers=len(possible_grad_years)) as class_executor:
            future_to_year: Dict[Future[List[User]], int] = {}
            for grad_year in possible_grad_years:
                fut = class_executor.submit(process_class, grad_year, progress)
                future_to_year[fut] = grad_year

            for fut in as_completed(future_to_year):
                try:
                    result = fut.result()
                    prefrosh.extend(result)
                except Exception as e:
                    year = future_to_year[fut]
                    error_console.print(f"Error processing class {year}: {e}")

    # Ensure the permaprefrosh is included exactly once, regardless of matriculation year
    if PERMAPREFROSH_URL:
        try:
            content = fetch_bytes(PERMAPREFROSH_URL)
            permaprefrosh_user = parse_user(content)
            
            existing_emails = {u.email for u in prefrosh if u.email}
            
            if permaprefrosh_user.email in existing_emails:
                console.print("Permaprefrosh already included via class scraping; skipping duplicate.")
            else:
                # Fetch permaprefrosh avatar from the class list page like other students
                try:
                    class_html = fetch_bytes(build_class_url(permaprefrosh_user.graduation_year))
                    items = parse_items(class_html)
                    # Normalize trailing slashes for URL comparison
                    target_url = PERMAPREFROSH_URL.rstrip('/')
                    match = next((it for it in items if it.user_url.rstrip('/') == target_url), None)
                    if match and match.image_url and match.image_url != default_avatar_url:
                        perma_img = fetch_image(match.image_url)
                        setattr(permaprefrosh_user, "avatar", perma_img)
                except Exception as e:
                    error_console.print(f"Could not fetch permaprefrosh avatar from class list: {e}")
                    
                prefrosh.append(permaprefrosh_user)
                console.print("Included permaprefrosh.")
        except Exception as e:
            error_console.print(
                f"Error adding permaprefrosh from {PERMAPREFROSH_URL}: {e}"
            )

    console.print(f"Found [bold]{len(prefrosh)}[/] prefrosh.")
    with open(os.path.join(script_dir, "temp/prefrosh.pkl"), "wb") as file:
        pickle.dump(prefrosh, file)
        
    # Save the avatars to disk
    for user in prefrosh:
        username = username_from_email(user.email)
        with open(os.path.join(script_dir, f"../../public/images/{username}.png"), 'wb') as file:
            avatar = user.avatar or default_avatar
            avatar.save(file, format="PNG")
                
    # Save a CSV for frotator
    data = []
    
    for user in prefrosh:
        email = user.email
        username = username_from_email(email)
        
        full_name = user.preferred_name
        first_name, *last_names = full_name.split(" ")
        last_name = " ".join(last_names)
        
        preferred_name = first_name
        
        image = f"/api/frotator/images/{username}.png"
        bio_hometown = user.hometown or ''
        bio_major = ', '.join(user.option or [])
        
        data.append({
            "email": email,
            "fullName": full_name,
            "preferredName": preferred_name,
            "firstName": first_name,
            "lastName": last_name,
            "image": image,
            "bio-hometown": bio_hometown,
            "bio-major": bio_major,
            "bio-hobbies": '',
            "bio-clubs": '',
            "bio-funfact": '',
            "dinnerGroup": '',
            "anagram": ''
        })
        
    df = pd.DataFrame(data)
    df = df.sort_values(by=["lastName", "firstName"])
    df.to_csv(os.path.join(script_dir, "temp/prefrosh.csv"), index=False)

if __name__ == "__main__":
    main()