import os
import requests
import shutil
import re
import sys
import csv
from bs4 import BeautifulSoup

import numpy as np
import cv2
from rich.console import Console
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
    TimeElapsedColumn,
)

console = Console()

# year the prefrosh wil graduate
YEAR = input("What year will the prefrosh graduate:\t")
# you can get this from inspecting the network tab on donut when you are logged in
# see the readme file
YOUR_SESSION = input("Enter your session key (see readme):\t")

# greater than or equal to the number of frosh
FROSH_NUM = 500
# url to get the main search result
URL_BASE = "https://donut.caltech.edu"
URL = f"{URL_BASE}/1/users?page=1&per_page={FROSH_NUM}&name=&house_id=&option_id=&building_id=&grad_year={YEAR}&username=&email=&timezone_from=&timezone_to=&total={FROSH_NUM}&show_images=on"

COOKIES = {
    "session": YOUR_SESSION
}


def username_from_email(email):
    res = re.match("([^@]+)", email)
    if res is not None:
        return res[0]
    return email

# scrape the search page for the images
def scrape_search():
    # make initial request for main page
    res = requests.get(URL, cookies=COOKIES)
    soup = BeautifulSoup(res.content, "html.parser")
    images = soup.find_all(name="img")
    total = len(images)
    console.print(f"Found [bold]{total}[/] profile images.")
    
    default_avatar = cv2.imread("../../public/no_avatar.png")

    # save the results into a csv
    results = []
    results  = [["email", "name", "image"]]

    # ensure output directories exist
    os.makedirs("../../public/images", exist_ok=True)
    os.makedirs("temp", exist_ok=True)

    missing_names = []
    # progress bar with spinner and useful columns
    with Progress(
        SpinnerColumn(style="cyan"),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(bar_width=None),
        TextColumn(" {task.completed}/{task.total}"),
        TimeElapsedColumn(),
        TextColumn(" — {task.fields[current_name]}", style="magenta"),
        TextColumn(" [{task.fields[current_url]}]", style="blue"),
        console=console,
    ) as progress:
        task_id = progress.add_task(
            description="Downloading",
            total=total,
            current_name="",
            current_url="",
        )

        for i, img in enumerate(images):
            name = img.find_next_sibling().text
            image_url = f"{URL_BASE}{img['src']}"
            progress.update(task_id, current_name=name, current_url=image_url)

            email = scrape_email(img)
            file = download_img(username_from_email(email), image_url)
            avatar = cv2.imread(f"../../public/images/{file}")
            api_file = f"/api/frotator/images/{file}"

            # detect missing avatar by comparing to default
            is_missing = False
            if avatar is None:
                is_missing = True
            elif default_avatar is not None and avatar.shape == default_avatar.shape and np.all(avatar == default_avatar):
                is_missing = True

            if is_missing:
                missing_names.append(name)

            results += [[email, name, api_file]]
            progress.advance(task_id)

    with open("temp/scrape.csv", "w+") as scrape_file:
        csvWriter = csv.writer(scrape_file, delimiter=',')
        csvWriter.writerows(results)

    # report missing profile images
    if missing_names:
        console.print("\n[bold yellow]Students missing profile images:[/]")
        for n in missing_names:
            console.print(f" • {n}", style="yellow")
    else:
        console.print("[green]No missing profile images detected.[/]")

# scrape the email from profile page
def scrape_email(img):
    profile_url = f"{URL_BASE}{img.parent['href']}"
    res = requests.get(profile_url, cookies=COOKIES)
    soup = BeautifulSoup(res.content, "html.parser")
    # lazy search for email by finding the at
    email = soup.find(string=re.compile("@"))
    if email is None:
        return f"missing_email_{img.parent['href']}"
    return email.text

# download and save the image to the temp folder
def download_img(username, image_url):
    response = requests.get(image_url, stream=True, cookies=COOKIES)
    file = f"{username}.png"
    with open(f"../../public/images/{file}", 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)
    del response
    return file


scrape_search()
