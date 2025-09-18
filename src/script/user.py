from bs4 import BeautifulSoup
from bs4.element import Tag
from pydantic import BaseModel
from pydantic import ConfigDict
from PIL import Image

class User(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    preferred_name: str
    username: str | None
    uid: str | None
    gender: str | None
    email: str
    phone: str | None
    msc: str | None
    hometown: str | None
    matriculation_year: int
    graduation_year: int
    option: list[str] | None
    house: list[str] | None
    positions: list[str] | None
    avatar: Image.Image | None = None
    
# Dictionary mapping attribute of User dataclass to the corresponding key string in the HTML
# Only attributes that are represented as inline fields in the HTML are included here
INLINE_ATTRIBUTE_KEY_MAP = {
    "username": "Username",
    "uid": "UID",
    "gender": "Gender",
    "phone": "Phone",
    "msc": "Mail Stop Code (MSC)",
    "hometown": "Hometown",
    "matriculation_year": "Matriculation",
    "graduation_year": "Graduation",
}

def strip_double_spaces(s: str) -> str:
    while "  " in s:
        s = s.replace("  ", " ")
    return s

def parse_inline_field(key: str, soup: BeautifulSoup) -> str | None:
    elem = soup.find("strong", string=key)
    if elem is None:
        return None
    sib = elem.next_sibling
    if sib is None:
        return None
    try:
        return str(sib).lstrip(":").strip()
    except Exception:
        return None

def parse_email(soup: BeautifulSoup) -> str | None:
    elem = soup.find("strong", string="Email")
    if elem is None:
        return None
    sib1 = elem.next_sibling
    sib2 = getattr(sib1, "next_sibling", None)
    target = sib2 if isinstance(sib2, Tag) else sib1
    if isinstance(target, Tag):
        return target.get_text(strip=True)
    return str(target).strip() if target is not None else None

def parse_preferred_name(soup: BeautifulSoup) -> str:
    elem = soup.find("h2", attrs={"class": "pos-left"})
    if elem is None:
        raise RuntimeError("Could not find preferred name in profile page")
    return strip_double_spaces(elem.get_text(" ", strip=True).replace("\n", " ").replace("\t", " ").strip())

def parse_list(key: str, soup: BeautifulSoup) -> list[str] | None:
    elem = soup.find("strong", string=key)
    if elem is None:
        return None
    parent = elem.parent if isinstance(elem.parent, Tag) else None
    sib1 = parent.next_sibling if parent is not None else None
    sib2 = getattr(sib1, "next_sibling", None)
    container = sib2 if isinstance(sib2, Tag) else None
    if container is None:
        return None
    values: list[str] = []
    for child in list(container.children):
        if isinstance(child, Tag):
            value = child.get_text(strip=True)
            if value:
                values.append(value)
    return values or None

def parse_user(profile_page_content: bytes) -> User:
    soup = BeautifulSoup(profile_page_content, "html.parser")
    
    user_payload = dict()
    
    for attr, key in INLINE_ATTRIBUTE_KEY_MAP.items():
        value = parse_inline_field(key, soup)
        user_payload[attr] = value

    email = parse_email(soup)
    preferred_name = parse_preferred_name(soup)
    
    option = parse_list("Option", soup)
    
    if option is not None:
        option = [option_name.rstrip(" (Major)") for option_name in option]
        
    house = parse_list("House", soup)
    positions = parse_list("Positions", soup)

    user_payload["email"] = email
    user_payload["preferred_name"] = preferred_name
    user_payload["option"] = option
    user_payload["house"] = house
    user_payload["positions"] = positions

    return User.model_validate(user_payload)