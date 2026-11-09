import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Directories
WORKSPACE = r"d:\New folder"
POSTERS_DIR = os.path.join(WORKSPACE, "assets", "posters")
SCREENSHOTS_DIR = os.path.join(WORKSPACE, "assets", "screenshots")

os.makedirs(POSTERS_DIR, exist_ok=True)
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

# System Fonts
FONT_ARIAL_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_ARIAL = r"C:\Windows\Fonts\arial.ttf"
FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_SEGOE_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_SEGOE = r"C:\Windows\Fonts\segoeui.ttf"

def get_font(font_path, size):
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_vertical_gradient(draw, width, height, top_color, bottom_color):
    """Fills an image with a smooth 2-color vertical linear gradient."""
    for y in range(height):
        factor = y / max(1, height - 1)
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * factor)
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * factor)
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

# -------------------------------------------------------------------------
# 1. MOVIE POSTER GENERATOR
# -------------------------------------------------------------------------
def create_movie_poster(movie_info):
    """
    Generates a premium 600x900 px movie poster with custom cinematic motifs,
    OTT branding badge, bold typography, star rating, cast, and director.
    """
    w, h = 600, 900
    img = Image.new("RGBA", (w, h), (10, 10, 10, 255))
    draw = ImageDraw.Draw(img)

    top_c = movie_info.get("top_color", (25, 25, 35))
    bot_c = movie_info.get("bot_color", (5, 5, 8))
    draw_vertical_gradient(draw, w, h, top_c, bot_c)

    # Ambient Glow / Radial Light in the center
    glow_color = movie_info.get("glow_color", (229, 9, 20, 45))
    glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    center_y = 360
    for radius in range(260, 20, -15):
        alpha = int(glow_color[3] * (1 - (radius / 260.0)))
        glow_draw.ellipse(
            [w//2 - radius, center_y - radius, w//2 + radius, center_y + radius],
            fill=(glow_color[0], glow_color[1], glow_color[2], alpha)
        )
    img = Image.alpha_composite(img, glow_layer)
    draw = ImageDraw.Draw(img)

    # Graphic Emblem / Motif in the Upper Half
    emblem_type = movie_info.get("emblem", "circle")
    emblem_color = movie_info.get("accent_color", (229, 9, 20))

    if emblem_type == "swords":
        # Leo / Katana Motif
        cx, cy = w // 2, 340
        draw.line([cx - 140, cy - 140, cx + 140, cy + 140], fill=emblem_color, width=8)
        draw.line([cx + 140, cy - 140, cx - 140, cy + 140], fill=(240, 240, 240), width=6)
        draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], outline=emblem_color, width=6)
        draw.polygon([(cx, cy - 80), (cx + 60, cy), (cx, cy + 80), (cx - 60, cy)], outline=(255, 255, 255), fill=None)
    elif emblem_type == "target":
        # Vikram Target / Skull motif
        cx, cy = w // 2, 340
        draw.ellipse([cx - 120, cy - 120, cx + 120, cy + 120], outline=emblem_color, width=4)
        draw.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], outline=(255, 255, 255), width=3)
        draw.line([cx - 150, cy, cx + 150, cy], fill=emblem_color, width=3)
        draw.line([cx, cy - 150, cx, cy + 150], fill=emblem_color, width=3)
        draw.polygon([(cx - 40, cy - 40), (cx + 40, cy - 40), (cx + 25, cy + 40), (cx - 25, cy + 40)], outline=(255, 255, 255), width=3)
    elif emblem_type == "sunglasses":
        # Jailer Golden Glasses motif
        cx, cy = w // 2, 340
        draw.rounded_rectangle([cx - 130, cy - 45, cx - 15, cy + 35], radius=16, fill=(15, 10, 5), outline=emblem_color, width=6)
        draw.rounded_rectangle([cx + 15, cy - 45, cx + 130, cy + 35], radius=16, fill=(15, 10, 5), outline=emblem_color, width=6)
        draw.line([cx - 15, cy - 20, cx + 15, cy - 20], fill=emblem_color, width=8)
        draw.ellipse([cx - 180, cy - 180, cx + 180, cy + 180], outline=(movie_info['bot_color'][0]+40, movie_info['bot_color'][1]+40, movie_info['bot_color'][2]+40), width=2)
    elif emblem_type == "locker":
        # Maharaja Mystery Motif
        cx, cy = w // 2, 340
        draw.rounded_rectangle([cx - 100, cy - 110, cx + 100, cy + 90], radius=18, outline=emblem_color, width=6)
        draw.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], outline=(255, 255, 255), width=5)
        draw.polygon([(cx, cy - 30), (cx + 15, cy), (cx, cy + 25), (cx - 15, cy)], fill=(255, 215, 0))
    elif emblem_type == "chola":
        # Ponniyin Selvan Chola Crown & Sword
        cx, cy = w // 2, 340
        draw.polygon([(cx - 120, cy + 60), (cx - 90, cy - 60), (cx - 40, cy + 20), (cx, cy - 100), (cx + 40, cy + 20), (cx + 90, cy - 60), (cx + 120, cy + 60)], outline=emblem_color, fill=None)
        draw.line([cx - 130, cy + 70, cx + 130, cy + 70], fill=emblem_color, width=6)
        draw.line([cx, cy - 140, cx, cy + 140], fill=(255, 255, 255), width=4)
    elif emblem_type == "handcuffs":
        # Master JD vs Bhavani Ring / Handcuffs
        cx, cy = w // 2, 340
        draw.ellipse([cx - 95, cy - 50, cx - 15, cy + 30], outline=emblem_color, width=8)
        draw.ellipse([cx + 15, cy - 50, cx + 95, cy + 30], outline=(255, 255, 255), width=8)
        draw.line([cx - 15, cy - 10, cx + 15, cy - 10], fill=emblem_color, width=6)
        draw.line([cx - 140, cy - 100, cx + 140, cy + 100], fill=(180, 20, 20), width=4)
    elif emblem_type == "lorry":
        # Kaithi Lorry in Night Rain
        cx, cy = w // 2, 340
        draw.rounded_rectangle([cx - 110, cy - 60, cx + 110, cy + 60], radius=14, outline=emblem_color, width=6)
        draw.ellipse([cx - 70, cy + 10, cx - 30, cy + 50], fill=(255, 215, 0))
        draw.ellipse([cx + 30, cy + 10, cx + 70, cy + 50], fill=(255, 215, 0))
        draw.rectangle([cx - 90, cy - 40, cx + 90, cy - 5], outline=(255, 255, 255), width=3)
    elif emblem_type == "atom":
        # Oppenheimer Atomic Orbits
        cx, cy = w // 2, 340
        draw.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], fill=(255, 100, 20))
        for angle in [0, 45, 90, 135]:
            rad = math.radians(angle)
            rx, ry = 130, 45
            points = []
            for t in range(0, 360, 10):
                trad = math.radians(t)
                x0 = rx * math.cos(trad)
                y0 = ry * math.sin(trad)
                x = cx + x0 * math.cos(rad) - y0 * math.sin(rad)
                y = cy + x0 * math.sin(rad) + y0 * math.cos(rad)
                points.append((x, y))
            draw.polygon(points, outline=emblem_color)
    elif emblem_type == "blackhole":
        # Interstellar Gargantua
        cx, cy = w // 2, 340
        draw.ellipse([cx - 80, cy - 80, cx + 80, cy + 80], fill=(0, 0, 0), outline=(255, 215, 120), width=5)
        for r in range(95, 150, 12):
            draw.arc([cx - r, cy - int(r*0.45), cx + r, cy + int(r*0.45)], start=0, end=360, fill=(240, 180, 50), width=3)
        draw.arc([cx - 130, cy - 130, cx + 130, cy + 130], start=200, end=340, fill=(255, 255, 255), width=4)
    elif emblem_type == "star":
        # 12th Fail Restart Flame & Star
        cx, cy = w // 2, 340
        draw.ellipse([cx - 100, cy - 100, cx + 100, cy + 100], outline=emblem_color, width=4)
        draw.polygon([(cx, cy - 65), (cx + 20, cy - 15), (cx + 65, cy - 15), (cx + 30, cy + 15), (cx + 45, cy + 60), (cx, cy + 35), (cx - 45, cy + 60), (cx - 30, cy + 15), (cx - 65, cy - 15), (cx - 20, cy - 15)], fill=(255, 215, 0))
    elif emblem_type == "portal":
        # The Last Horizon Sci-Fi portal
        cx, cy = w // 2, 340
        for r in range(140, 20, -20):
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=emblem_color, width=3)
        draw.line([cx - 160, cy, cx + 160, cy], fill=(255, 255, 255), width=2)
        draw.polygon([(cx, cy - 50), (cx + 40, cy + 30), (cx - 40, cy + 30)], outline=(16, 185, 129), fill=(5, 46, 22))
    elif emblem_type == "axe":
        # Animal Axe / Blood
        cx, cy = w // 2, 340
        draw.line([cx - 30, cy - 120, cx + 30, cy + 120], fill=(160, 160, 160), width=10)
        draw.polygon([(cx - 30, cy - 100), (cx - 120, cy - 70), (cx - 110, cy - 20), (cx - 15, cy - 40)], fill=emblem_color)
        draw.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], outline=(180, 20, 20), width=3)

    # Top OTT Platform Ribbon
    ribbon_bg = movie_info.get("ott_bg", (229, 9, 20))
    ribbon_txt = movie_info.get("ott_name", "NETFLIX")
    f_ribbon = get_font(FONT_ARIAL_BOLD, 15)
    draw.rounded_rectangle([35, 30, 35 + 135, 62], radius=6, fill=ribbon_bg)
    draw.text((35 + 67, 36), ribbon_txt, font=f_ribbon, fill=(255, 255, 255), anchor="mt")

    # Audio/Quality Badge top right
    quality_txt = movie_info.get("quality", "4K DOLBY")
    f_qual = get_font(FONT_SEGOE_BOLD, 12)
    draw.rounded_rectangle([w - 150, 32, w - 35, 60], radius=6, fill=(20, 20, 20), outline=(80, 80, 80), width=1)
    draw.text((w - 92, 38), quality_txt, font=f_qual, fill=(220, 220, 220), anchor="mt")

    # Bottom Gradient Overlay (For crisp legibility of title and cast)
    scrim = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    scrim_draw = ImageDraw.Draw(scrim)
    for y in range(480, h):
        fac = (y - 480) / (h - 480)
        scrim_draw.line([(0, y), (w, y)], fill=(0, 0, 0, int(245 * fac)))
    img = Image.alpha_composite(img, scrim)
    draw = ImageDraw.Draw(img)

    # Rating Pill
    rating_str = f"★  {movie_info.get('rating', '8.0')} / 10"
    f_rating = get_font(FONT_SEGOE_BOLD, 14)
    draw.rounded_rectangle([35, 520, 160, 552], radius=16, fill=(0, 0, 0), outline=(255, 215, 0), width=2)
    draw.text((97, 527), rating_str, font=f_rating, fill=(255, 215, 0), anchor="mt")

    # Year & Genre
    year_genre = f"{movie_info.get('year', 2024)}  •  {movie_info.get('genre', 'Action')}"
    f_yg = get_font(FONT_SEGOE_BOLD, 13)
    draw.text((180, 529), year_genre, font=f_yg, fill=(180, 180, 180))

    # Giant Stylized Movie Title
    title = movie_info.get("title", "MOVIE")
    f_title = get_font(FONT_IMPACT, 54 if len(title) <= 10 else 42)
    # Title Drop Shadow
    draw.text((37, 572), title, font=f_title, fill=(0, 0, 0))
    draw.text((35, 570), title, font=f_title, fill=(255, 255, 255))

    # Subtitle / Tagline
    tagline = movie_info.get("tagline", "")
    f_tag = get_font(FONT_ARIAL_BOLD, 16)
    draw.text((36, 638), tagline.upper(), font=f_tag, fill=emblem_color)

    # Cast Line
    cast = movie_info.get("cast", "STARRING TOP CAST")
    f_cast = get_font(FONT_SEGOE_BOLD, 13)
    draw.text((36, 680), "CAST", font=get_font(FONT_ARIAL_BOLD, 11), fill=(130, 130, 130))
    draw.text((36, 700), cast.upper(), font=f_cast, fill=(230, 230, 230))

    # Director Line
    director = movie_info.get("director", "DIRECTOR NAME")
    draw.text((36, 735), "DIRECTED BY", font=get_font(FONT_ARIAL_BOLD, 11), fill=(130, 130, 130))
    draw.text((36, 755), director.upper(), font=f_cast, fill=(255, 255, 255))

    # Bottom Cinema Footer
    draw.line([(35, 805), (w - 35, 805)], fill=(60, 60, 60), width=1)
    f_foot = get_font(FONT_SEGOE_BOLD, 11)
    draw.text((35, 822), "STREAMVERSE ENTERTAINMENT", font=f_foot, fill=(229, 9, 20))
    draw.text((w - 35, 822), "OFFICIAL OTT METADATA", font=f_foot, fill=(120, 120, 120), anchor="rt")

    # Red/Gold outer border
    draw.rectangle([0, 0, w-1, h-1], outline=movie_info.get("border_color", (40, 40, 40)), width=2)

    return img.convert("RGB")

# -------------------------------------------------------------------------
# CATALOG SPECIFICATION FOR ALL 12 MOVIES
# -------------------------------------------------------------------------
MOVIES_CATALOG = [
    {
        "filename": "leo.png",
        "title": "LEO",
        "tagline": "Bloody Sweet • A Lokesh Kanagaraj Universe",
        "year": 2023,
        "genre": "Action / Crime / Thriller",
        "rating": "7.3",
        "ott_name": "NETFLIX",
        "ott_bg": (229, 9, 20),
        "quality": "4K DOLBY VISION",
        "cast": "Thalapathy Vijay • Trisha • Sanjay Dutt • Arjun",
        "director": "Lokesh Kanagaraj",
        "top_color": (90, 10, 15),
        "bot_color": (8, 6, 8),
        "glow_color": (220, 20, 30, 90),
        "accent_color": (230, 30, 40),
        "border_color": (229, 9, 20),
        "emblem": "swords"
    },
    {
        "filename": "vikram.png",
        "title": "VIKRAM",
        "tagline": "Hitlist • Once Upon A Time There Lived A Ghost",
        "year": 2022,
        "genre": "Action / Noir / Thriller",
        "rating": "8.1",
        "ott_name": "JIOHOTSTAR",
        "ott_bg": (0, 43, 102),
        "quality": "4K UHD 5.1",
        "cast": "Kamal Haasan • Vijay Sethupathi • Fahadh Faasil • Suriya",
        "director": "Lokesh Kanagaraj",
        "top_color": (15, 30, 50),
        "bot_color": (5, 8, 12),
        "glow_color": (245, 158, 11, 80),
        "accent_color": (245, 158, 11),
        "border_color": (245, 158, 11),
        "emblem": "target"
    },
    {
        "filename": "jailer.png",
        "title": "JAILER",
        "tagline": "Muthuvel Pandian • Hukum Tiger Ka Hukum",
        "year": 2023,
        "genre": "Action / Dark Comedy / Crime",
        "rating": "7.2",
        "ott_name": "PRIME VIDEO",
        "ott_bg": (0, 168, 225),
        "quality": "4K UHD HDR",
        "cast": "Superstar Rajinikanth • Shiva Rajkumar • Mohanlal",
        "director": "Nelson Dilipkumar",
        "top_color": (80, 40, 10),
        "bot_color": (10, 8, 5),
        "glow_color": (255, 140, 0, 85),
        "accent_color": (255, 165, 0),
        "border_color": (255, 165, 0),
        "emblem": "sunglasses"
    },
    {
        "filename": "maharaja.png",
        "title": "MAHARAJA",
        "tagline": "Where Is Lakshmi? • An Unflinching Vendetta",
        "year": 2024,
        "genre": "Action / Mystery / Thriller",
        "rating": "8.4",
        "ott_name": "NETFLIX",
        "ott_bg": (229, 9, 20),
        "quality": "4K DOLBY ATMOS",
        "cast": "Vijay Sethupathi • Anurag Kashyap • Mamta Mohandas",
        "director": "Nithilan Saminathan",
        "top_color": (20, 35, 50),
        "bot_color": (6, 10, 14),
        "glow_color": (6, 182, 212, 85),
        "accent_color": (6, 182, 212),
        "border_color": (6, 182, 212),
        "emblem": "locker"
    },
    {
        "filename": "ponniyin_selvan.png",
        "title": "PONNIYIN SELVAN",
        "tagline": "Part I • Glory Of The Chola Empire",
        "year": 2022,
        "genre": "Historic Epic / Action / Drama",
        "rating": "7.7",
        "ott_name": "PRIME VIDEO",
        "ott_bg": (0, 168, 225),
        "quality": "4K IMAX ENHANCED",
        "cast": "Chiyaan Vikram • Aishwarya Rai • Karthi • Jayam Ravi",
        "director": "Mani Ratnam",
        "top_color": (70, 45, 10),
        "bot_color": (15, 10, 4),
        "glow_color": (234, 179, 8, 90),
        "accent_color": (234, 179, 8),
        "border_color": (234, 179, 8),
        "emblem": "chola"
    },
    {
        "filename": "master.png",
        "title": "MASTER",
        "tagline": "JD vs Bhavani • Vaathi Coming",
        "year": 2021,
        "genre": "Action / Crime / Drama",
        "rating": "7.4",
        "ott_name": "PRIME VIDEO",
        "ott_bg": (0, 168, 225),
        "quality": "4K UHD 5.1",
        "cast": "Thalapathy Vijay • Vijay Sethupathi • Malavika Mohanan",
        "director": "Lokesh Kanagaraj",
        "top_color": (25, 30, 70),
        "bot_color": (6, 8, 16),
        "glow_color": (59, 130, 246, 80),
        "accent_color": (59, 130, 246),
        "border_color": (59, 130, 246),
        "emblem": "handcuffs"
    },
    {
        "filename": "kaithi.png",
        "title": "KAITHI",
        "tagline": "One Night • 800KG Drugs • Zero Escape",
        "year": 2019,
        "genre": "Action / Crime / Thriller",
        "rating": "8.0",
        "ott_name": "JIOHOTSTAR",
        "ott_bg": (0, 43, 102),
        "quality": "1080P FULL HD",
        "cast": "Karthi • Narain • Arjun Das • George Maryan",
        "director": "Lokesh Kanagaraj",
        "top_color": (15, 20, 25),
        "bot_color": (4, 6, 8),
        "glow_color": (245, 158, 11, 70),
        "accent_color": (245, 158, 11),
        "border_color": (245, 158, 11),
        "emblem": "lorry"
    },
    {
        "filename": "oppenheimer.png",
        "title": "OPPENHEIMER",
        "tagline": "Now I Am Become Death, The Destroyer Of Worlds",
        "year": 2023,
        "genre": "Biography / Drama / History",
        "rating": "8.1",
        "ott_name": "JIOHOTSTAR",
        "ott_bg": (0, 43, 102),
        "quality": "4K DOLBY ATMOS",
        "cast": "Cillian Murphy • Emily Blunt • Matt Damon • Robert Downey Jr.",
        "director": "Christopher Nolan",
        "top_color": (85, 35, 10),
        "bot_color": (10, 5, 2),
        "glow_color": (249, 115, 22, 95),
        "accent_color": (249, 115, 22),
        "border_color": (249, 115, 22),
        "emblem": "atom"
    },
    {
        "filename": "interstellar.png",
        "title": "INTERSTELLAR",
        "tagline": "Mankind Was Born On Earth, It Was Never Meant To Die Here",
        "year": 2014,
        "genre": "Sci-Fi / Adventure / Drama",
        "rating": "8.4",
        "ott_name": "PRIME VIDEO",
        "ott_bg": (0, 168, 225),
        "quality": "4K UHD HDR",
        "cast": "Matthew McConaughey • Anne Hathaway • Jessica Chastain",
        "director": "Christopher Nolan",
        "top_color": (10, 25, 45),
        "bot_color": (2, 4, 10),
        "glow_color": (234, 179, 8, 85),
        "accent_color": (234, 179, 8),
        "border_color": (234, 179, 8),
        "emblem": "blackhole"
    },
    {
        "filename": "12th_fail.png",
        "title": "12TH FAIL",
        "tagline": "Restart! • Haarna Nahin Maanunga",
        "year": 2023,
        "genre": "Biography / Drama / Inspirational",
        "rating": "8.5",
        "ott_name": "JIOHOTSTAR",
        "ott_bg": (0, 43, 102),
        "quality": "4K UHD 5.1",
        "cast": "Vikrant Massey • Medha Shankr • Anant Joshi",
        "director": "Vidhu Vinod Chopra",
        "top_color": (30, 45, 60),
        "bot_color": (8, 12, 18),
        "glow_color": (245, 158, 11, 80),
        "accent_color": (245, 158, 11),
        "border_color": (245, 158, 11),
        "emblem": "star"
    },
    {
        "filename": "the_last_horizon.png",
        "title": "THE LAST HORIZON",
        "tagline": "STREAMVERSE Exclusive • Beyond Known Space",
        "year": 2024,
        "genre": "Sci-Fi / Space Opera / 4K",
        "rating": "8.8",
        "ott_name": "STREAMVERSE",
        "ott_bg": (16, 185, 129),
        "quality": "PROPRIETARY 4K STREAM",
        "cast": "STREAMVERSE Studio Cast • Cinema Grade",
        "director": "STREAMVERSE Originals",
        "top_color": (8, 45, 30),
        "bot_color": (2, 14, 8),
        "glow_color": (16, 185, 129, 90),
        "accent_color": (16, 185, 129),
        "border_color": (16, 185, 129),
        "emblem": "portal"
    },
    {
        "filename": "animal.png",
        "title": "ANIMAL",
        "tagline": "Father & Son • A Violent Descent",
        "year": 2023,
        "genre": "Action / Crime / Intense Drama",
        "rating": "7.0",
        "ott_name": "NETFLIX",
        "ott_bg": (229, 9, 20),
        "quality": "4K DOLBY VISION",
        "cast": "Ranbir Kapoor • Anil Kapoor • Bobby Deol • Rashmika",
        "director": "Sandeep Reddy Vanga",
        "top_color": (70, 15, 15),
        "bot_color": (10, 4, 4),
        "glow_color": (220, 38, 38, 85),
        "accent_color": (220, 38, 38),
        "border_color": (220, 38, 38),
        "emblem": "axe"
    }
]

# -------------------------------------------------------------------------
# 2. GENERATE SCREENSHOTS (1920x1080)
# -------------------------------------------------------------------------

def create_top10_row_screenshot(poster_images):
    """
    Creates a full 1920x950 desktop screenshot mockup of STREAMVERSE's
    Top 10 Today in India numbered row with giant 3D numbers and actual poster cards.
    """
    w, h = 1920, 950
    img = Image.new("RGBA", (w, h), (18, 18, 18, 255))
    draw = ImageDraw.Draw(img)

    # Window Top Bar (macOS Mockup)
    draw.rectangle([0, 0, w, 44], fill=(26, 26, 26))
    draw.ellipse([24, 15, 38, 29], fill=(255, 95, 86))
    draw.ellipse([46, 15, 60, 29], fill=(255, 189, 46))
    draw.ellipse([68, 15, 82, 29], fill=(39, 201, 63))

    # Browser URL Pill
    draw.rounded_rectangle([w//2 - 280, 8, w//2 + 280, 36], radius=8, fill=(35, 35, 35), outline=(55, 55, 55), width=1)
    f_url = get_font(FONT_SEGOE, 13)
    draw.text((w//2, 14), "🔒 https://streamverse.app/browse/top10-india", font=f_url, fill=(160, 160, 160), anchor="mt")

    # STREAMVERSE App Header Navigation
    draw.rectangle([0, 44, w, 114], fill=(12, 12, 12))
    f_logo = get_font(FONT_ARIAL_BOLD, 28)
    draw.text((60, 62), "STREAMVERSE", font=f_logo, fill=(229, 9, 20))

    f_nav = get_font(FONT_SEGOE_BOLD, 15)
    draw.text((290, 68), "Home", font=f_nav, fill=(255, 255, 255))
    draw.text((370, 68), "Tamil Cinema", font=f_nav, fill=(160, 160, 160))
    draw.text((500, 68), "AI Top Picks", font=f_nav, fill=(160, 160, 160))
    draw.text((630, 68), "STREAMVERSE Originals", font=f_nav, fill=(160, 160, 160))
    draw.text((840, 68), "My List (2)", font=f_nav, fill=(160, 160, 160))

    # Region Pill
    draw.rounded_rectangle([w - 240, 60, w - 60, 96], radius=18, fill=(17, 34, 23), outline=(16, 185, 129), width=1)
    f_reg = get_font(FONT_SEGOE_BOLD, 13)
    draw.text((w - 150, 70), "⚡ REGION: INDIA (IN)", font=f_reg, fill=(52, 211, 153), anchor="mt")

    # Section Header: Top 10 Movies Today in India
    draw.rounded_rectangle([60, 145, 102, 187], radius=6, fill=(229, 9, 20))
    draw.text((81, 156), "TOP", font=get_font(FONT_ARIAL_BOLD, 16), fill=(255, 255, 255), anchor="mt")
    draw.text((118, 150), "Top 10 Movies Today in India", font=get_font(FONT_ARIAL_BOLD, 30), fill=(255, 255, 255))
    draw.text((565, 160), "• Synced across Netflix, Prime Video, JioHotstar, ZEE5 & STREAMVERSE", font=get_font(FONT_SEGOE, 15), fill=(140, 140, 140))

    # 5 Big Cards on Row 1 (Rank 1 - 5)
    card_w, card_h = 200, 300
    gap = 145
    start_x = 75
    y1 = 215

    f_num = get_font(FONT_IMPACT, 290)

    for i in range(5):
        movie = MOVIES_CATALOG[i]
        rank = i + 1
        pos_x = start_x + (i * (card_w + gap))

        # Giant Stylized 3D Netflix Number
        num_str = str(rank)
        # Deep shadow
        draw.text((pos_x - 45, y1 - 25), num_str, font=f_num, fill=(0, 0, 0))
        draw.text((pos_x - 50, y1 - 30), num_str, font=f_num, fill=(24, 24, 24))
        # Stroke
        for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2)]:
            draw.text((pos_x - 50 + dx, y1 - 30 + dy), num_str, font=f_num, fill=(110, 110, 110))
        draw.text((pos_x - 50, y1 - 30), num_str, font=f_num, fill=(18, 18, 18))

        # Poster Image
        if movie["filename"] in poster_images:
            p_img = poster_images[movie["filename"]].resize((card_w, card_h), Image.Resampling.LANCZOS)
            img.paste(p_img, (pos_x + 95, y1))
            draw = ImageDraw.Draw(img)
            # Poster border
            outline_color = (229, 9, 20) if rank == 1 else ((16, 185, 129) if "STREAMVERSE" in movie["ott_name"] else (70, 70, 70))
            draw.rounded_rectangle([pos_x + 95, y1, pos_x + 95 + card_w, y1 + card_h], radius=8, outline=outline_color, width=2)

        # Bottom Title & Rating under card
        cx = pos_x + 95 + card_w // 2
        draw.text((cx, y1 + card_h + 12), movie["title"], font=get_font(FONT_ARIAL_BOLD, 17), fill=(255, 255, 255), anchor="mt")
        draw.text((cx, y1 + card_h + 36), f"★ {movie['rating']}  •  {movie['ott_name']}", font=get_font(FONT_SEGOE_BOLD, 13), fill=(245, 158, 11), anchor="mt")

    # Second Section / Carousel Preview: Ranks 6 to 10
    draw.text((60, 620), "Trending Next (Ranks 6 to 10)", font=get_font(FONT_ARIAL_BOLD, 22), fill=(220, 220, 220))

    card2_w, card2_h = 145, 215
    start2_x = 60
    gap2 = 36
    y2 = 665

    for j in range(5, 10):
        movie = MOVIES_CATALOG[j]
        rank = j + 1
        pos_x = start2_x + ((j - 5) * (card2_w + gap2 + 185))

        # Rank badge
        draw.rounded_rectangle([pos_x, y2 + 10, pos_x + 40, y2 + 50], radius=8, fill=(35, 35, 35), outline=(90, 90, 90), width=1)
        draw.text((pos_x + 20, y2 + 19), f"#{rank}", font=get_font(FONT_ARIAL_BOLD, 16), fill=(255, 255, 255), anchor="mt")

        # Poster Image
        if movie["filename"] in poster_images:
            p_img = poster_images[movie["filename"]].resize((card2_w, card2_h), Image.Resampling.LANCZOS)
            img.paste(p_img, (pos_x + 50, y2))
            draw = ImageDraw.Draw(img)
            draw.rounded_rectangle([pos_x + 50, y2, pos_x + 50 + card2_w, y2 + card2_h], radius=6, outline=(70, 70, 70), width=1)

        # Meta Details alongside card
        meta_x = pos_x + 50 + card2_w + 14
        draw.text((meta_x, y2 + 25), movie["title"], font=get_font(FONT_ARIAL_BOLD, 16), fill=(255, 255, 255))
        draw.text((meta_x, y2 + 55), f"★ {movie['rating']}", font=get_font(FONT_SEGOE_BOLD, 14), fill=(255, 215, 0))
        draw.rounded_rectangle([meta_x, y2 + 82, meta_x + 95, y2 + 108], radius=4, fill=movie["ott_bg"])
        draw.text((meta_x + 47, y2 + 88), movie["ott_name"], font=get_font(FONT_ARIAL_BOLD, 11), fill=(255, 255, 255), anchor="mt")
        draw.text((meta_x, y2 + 120), movie["quality"], font=get_font(FONT_SEGOE, 11), fill=(140, 140, 140))
        draw.text((meta_x, y2 + 140), f"{movie['year']} • {movie['genre'][:12]}", font=get_font(FONT_SEGOE, 11), fill=(110, 110, 110))

    return img.convert("RGB")

def create_streamverse_banner_screenshot(poster_images):
    """
    Creates a full 1920x1080 desktop browser screenshot mockup featuring
    the full Netflix-style hero billboard with Leo, streaming modal cards, and carousel row.
    """
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), (14, 14, 14, 255))
    draw = ImageDraw.Draw(img)

    # Hero Backdrop: Cinematic Dark Crimson / Slate Gradient with Particle Glow
    draw_vertical_gradient(draw, w, h, (45, 12, 16), (10, 10, 10))

    # Add dramatic ambient light from top right
    back_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(back_glow)
    for r in range(650, 40, -35):
        alpha = int(75 * (1 - r/650.0))
        bg_draw.ellipse([w - 600 - r, 380 - r, w - 600 + r, 380 + r], fill=(220, 38, 38, alpha))
    img = Image.alpha_composite(img, back_glow)
    draw = ImageDraw.Draw(img)

    # macOS Top Bar
    draw.rectangle([0, 0, w, 44], fill=(22, 22, 22))
    draw.ellipse([24, 15, 38, 29], fill=(255, 95, 86))
    draw.ellipse([46, 15, 60, 29], fill=(255, 189, 46))
    draw.ellipse([68, 15, 82, 29], fill=(39, 201, 63))
    draw.rounded_rectangle([w//2 - 280, 8, w//2 + 280, 36], radius=8, fill=(35, 35, 35), outline=(55, 55, 55), width=1)
    draw.text((w//2, 14), "🔒 https://streamverse.app/watch/leo", font=get_font(FONT_SEGOE, 13), fill=(160, 160, 160), anchor="mt")

    # Header Navigation Bar
    draw.rectangle([0, 44, w, 115], fill=(0, 0, 0, 160))
    draw.text((70, 62), "STREAMVERSE", font=get_font(FONT_ARIAL_BOLD, 28), fill=(229, 9, 20))
    f_nav = get_font(FONT_SEGOE_BOLD, 15)
    draw.text((310, 68), "Discover", font=f_nav, fill=(255, 255, 255))
    draw.text((410, 68), "Tamil Cinema", font=f_nav, fill=(170, 170, 170))
    draw.text((540, 68), "AI Recommender", font=f_nav, fill=(170, 170, 170))
    draw.text((690, 68), "STREAMVERSE Originals", font=f_nav, fill=(170, 170, 170))
    draw.text((900, 68), "My List (2)", font=f_nav, fill=(170, 170, 170))

    # Search Bar & Profile Pill
    draw.rounded_rectangle([w - 480, 60, w - 240, 96], radius=18, fill=(30, 30, 30), outline=(60, 60, 60), width=1)
    draw.text((w - 455, 70), "🔍 Search Leo, Vikram, OTT...", font=get_font(FONT_SEGOE, 13), fill=(140, 140, 140))
    draw.rounded_rectangle([w - 220, 58, w - 70, 98], radius=20, fill=(229, 9, 20))
    draw.text((w - 145, 70), "Vijay (Active)", font=get_font(FONT_SEGOE_BOLD, 13), fill=(255, 255, 255), anchor="mt")

    # HERO BILLBOARD CONTENT (LEO)
    # Trending Badge
    draw.rounded_rectangle([70, 185, 280, 222], radius=18, fill=(229, 9, 20, 50), outline=(229, 9, 20), width=1)
    draw.text((175, 195), "⚡ TRENDING #1 IN INDIA", font=get_font(FONT_ARIAL_BOLD, 12), fill=(255, 82, 82), anchor="mt")

    # Title
    f_hero_title = get_font(FONT_IMPACT, 72)
    draw.text((72, 242), "LEO : BLOODY SWEET", font=f_hero_title, fill=(0, 0, 0))
    draw.text((70, 240), "LEO : BLOODY SWEET", font=f_hero_title, fill=(255, 255, 255))

    # Meta Badges
    y_b = 335
    draw.rounded_rectangle([70, y_b, 160, y_b + 30], radius=5, fill=(229, 9, 20))
    draw.text((115, y_b + 7), "NETFLIX", font=get_font(FONT_ARIAL_BOLD, 13), fill=(255, 255, 255), anchor="mt")

    draw.rounded_rectangle([175, y_b, 260, y_b + 30], radius=5, fill=(30, 30, 30), outline=(60, 60, 60), width=1)
    draw.text((217, y_b + 7), "★ 7.3 / 10", font=get_font(FONT_SEGOE_BOLD, 13), fill=(255, 215, 0), anchor="mt")

    draw.rounded_rectangle([275, y_b, 350, y_b + 30], radius=5, fill=(30, 30, 30))
    draw.text((312, y_b + 7), "TAMIL", font=get_font(FONT_SEGOE_BOLD, 13), fill=(255, 255, 255), anchor="mt")

    draw.rounded_rectangle([365, y_b, 470, y_b + 30], radius=5, fill=(30, 30, 30))
    draw.text((417, y_b + 7), "4K DOLBY VISION", font=get_font(FONT_SEGOE_BOLD, 12), fill=(255, 255, 255), anchor="mt")

    draw.rounded_rectangle([485, y_b, 560, y_b + 30], radius=5, fill=(30, 30, 30))
    draw.text((522, y_b + 7), "2h 44m", font=get_font(FONT_SEGOE_BOLD, 13), fill=(160, 160, 160), anchor="mt")

    # Synopsis
    synopsis_p1 = "Parthiban is a mild-mannered cafe owner living in tranquil Kashmir with his family."
    synopsis_p2 = "When he fends off a murderous gang of robbers, he catches the national spotlight and the"
    synopsis_p3 = "attention of a lethal drug cartel claiming he was once their enforcer: Leo Das."
    f_syn = get_font(FONT_SEGOE, 17)
    draw.text((70, 395), synopsis_p1, font=f_syn, fill=(210, 210, 210))
    draw.text((70, 425), synopsis_p2, font=f_syn, fill=(210, 210, 210))
    draw.text((70, 455), synopsis_p3, font=f_syn, fill=(210, 210, 210))

    # Action Buttons
    # Play Now (White Netflix Button)
    draw.rounded_rectangle([70, 515, 300, 570], radius=8, fill=(255, 255, 255))
    draw.polygon([(100, 532), (100, 552), (120, 542)], fill=(0, 0, 0))
    draw.text((195, 532), "Play on Netflix", font=get_font(FONT_ARIAL_BOLD, 17), fill=(0, 0, 0), anchor="mt")

    # More Info (Glassmorphic Button)
    draw.rounded_rectangle([320, 515, 490, 570], radius=8, fill=(45, 45, 45, 180), outline=(90, 90, 90), width=1)
    draw.text((405, 532), "ℹ More Info", font=get_font(FONT_ARIAL_BOLD, 17), fill=(255, 255, 255), anchor="mt")

    # Streamverse Original Stream Button
    draw.rounded_rectangle([510, 515, 780, 570], radius=8, fill=(16, 185, 129))
    draw.text((645, 532), "⚡ STREAMVERSE Originals", font=get_font(FONT_ARIAL_BOLD, 15), fill=(255, 255, 255), anchor="mt")

    # RIGHT SIDE: Movie Poster Card + OTT Availability Matrix Card
    if "leo.png" in poster_images:
        leo_poster = poster_images["leo.png"].resize((280, 420), Image.Resampling.LANCZOS)
        img.paste(leo_poster, (w - 740, 180))
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle([w - 740, 180, w - 740 + 280, 180 + 420], radius=10, outline=(229, 9, 20), width=2)

    # OTT Availability Box
    matrix_x = w - 430
    draw.rounded_rectangle([matrix_x, 180, matrix_x + 360, 180 + 420], radius=12, fill=(20, 20, 20), outline=(50, 50, 50), width=1)
    draw.text((matrix_x + 25, 205), "WHERE TO WATCH (IN)", font=get_font(FONT_ARIAL_BOLD, 15), fill=(255, 255, 255))
    draw.text((matrix_x + 25, 230), "Region: India • Legal Deep Links", font=get_font(FONT_SEGOE, 12), fill=(140, 140, 140))
    draw.line([(matrix_x + 25, 255), (matrix_x + 335, 255)], fill=(45, 45, 45), width=1)

    # Provider 1: Netflix
    draw.rounded_rectangle([matrix_x + 25, 275, matrix_x + 335, 335], radius=8, fill=(28, 28, 28), outline=(229, 9, 20), width=1)
    draw.rounded_rectangle([matrix_x + 40, 287, matrix_x + 115, 323], radius=4, fill=(229, 9, 20))
    draw.text((matrix_x + 77, 296), "NETFLIX", font=get_font(FONT_ARIAL_BOLD, 12), fill=(255, 255, 255), anchor="mt")
    draw.text((matrix_x + 130, 287), "Included in Subscription", font=get_font(FONT_SEGOE_BOLD, 13), fill=(255, 255, 255))
    draw.text((matrix_x + 130, 307), "4K Dolby Vision • Direct Link", font=get_font(FONT_SEGOE, 11), fill=(16, 185, 129))

    # Provider 2: Amazon Prime Video (Rent)
    draw.rounded_rectangle([matrix_x + 25, 350, matrix_x + 335, 410], radius=8, fill=(28, 28, 28), outline=(50, 50, 50), width=1)
    draw.rounded_rectangle([matrix_x + 40, 362, matrix_x + 115, 398], radius=4, fill=(0, 168, 225))
    draw.text((matrix_x + 77, 371), "PRIME", font=get_font(FONT_ARIAL_BOLD, 12), fill=(255, 255, 255), anchor="mt")
    draw.text((matrix_x + 130, 362), "Rent / Purchase Option", font=get_font(FONT_SEGOE_BOLD, 13), fill=(220, 220, 220))
    draw.text((matrix_x + 130, 382), "₹149 • 4K UHD Available", font=get_font(FONT_SEGOE, 11), fill=(160, 160, 160))

    # Provider 3: YouTube Official Trailer
    draw.rounded_rectangle([matrix_x + 25, 425, matrix_x + 335, 485], radius=8, fill=(28, 28, 28), outline=(50, 50, 50), width=1)
    draw.rounded_rectangle([matrix_x + 40, 437, matrix_x + 115, 473], radius=4, fill=(255, 0, 0))
    draw.text((matrix_x + 77, 446), "YOUTUBE", font=get_font(FONT_ARIAL_BOLD, 11), fill=(255, 255, 255), anchor="mt")
    draw.text((matrix_x + 130, 437), "Official Trailer HD", font=get_font(FONT_SEGOE_BOLD, 13), fill=(220, 220, 220))
    draw.text((matrix_x + 130, 457), "Free • 75M+ Views", font=get_font(FONT_SEGOE, 11), fill=(160, 160, 160))

    # Availability Verified Tag
    draw.text((matrix_x + 180, 530), "✔ Verified by JustWatch / TMDB API", font=get_font(FONT_SEGOE_BOLD, 12), fill=(52, 211, 153), anchor="mt")

    # BOTTOM CAROUSEL ROW: "More Tamil Blockbusters Like Leo"
    draw.text((70, 640), "Recommended For You: High-Octane Action Blockbusters", font=get_font(FONT_ARIAL_BOLD, 22), fill=(255, 255, 255))
    draw.text((680, 646), "• Powered by Scikit-learn AI Recommender", font=get_font(FONT_SEGOE, 14), fill=(140, 140, 140))

    r_w, r_h = 175, 260
    r_gap = 25
    r_y = 690

    carousel_movies = ["vikram.png", "jailer.png", "maharaja.png", "master.png", "kaithi.png", "the_last_horizon.png", "animal.png"]
    for idx, m_fn in enumerate(carousel_movies):
        pos_x = 70 + (idx * (r_w + r_gap))
        if pos_x + r_w > w - 40:
            break
        if m_fn in poster_images:
            card_img = poster_images[m_fn].resize((r_w, r_h), Image.Resampling.LANCZOS)
            img.paste(card_img, (pos_x, r_y))
            draw = ImageDraw.Draw(img)
            draw.rounded_rectangle([pos_x, r_y, pos_x + r_w, r_y + r_h], radius=6, outline=(60, 60, 60), width=1)

    # Bottom Footer
    draw.rectangle([0, 1030, w, 1080], fill=(10, 10, 10))
    draw.text((70, 1045), "STREAMVERSE v2.0 • All-in-One OTT Discovery & Proprietary Video Streaming Platform", font=get_font(FONT_SEGOE, 13), fill=(120, 120, 120))
    draw.text((w - 70, 1045), "Designed for Cinema Lovers", font=get_font(FONT_SEGOE_BOLD, 13), fill=(229, 9, 20), anchor="rt")

    return img.convert("RGB")

def create_profile_selector_screenshot():
    """
    Creates a full 1920x1080 screenshot mockup of Netflix's 'Who's watching?' screen.
    """
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), (18, 18, 18, 255))
    draw = ImageDraw.Draw(img)

    # Window Top Bar
    draw.rectangle([0, 0, w, 44], fill=(26, 26, 26))
    draw.ellipse([24, 15, 38, 29], fill=(255, 95, 86))
    draw.ellipse([46, 15, 60, 29], fill=(255, 189, 46))
    draw.ellipse([68, 15, 82, 29], fill=(39, 201, 63))
    draw.rounded_rectangle([w//2 - 280, 8, w//2 + 280, 36], radius=8, fill=(35, 35, 35), outline=(55, 55, 55), width=1)
    draw.text((w//2, 14), "🔒 https://streamverse.app/profiles", font=get_font(FONT_SEGOE, 13), fill=(160, 160, 160), anchor="mt")

    # Logo Top Left
    draw.text((80, 80), "STREAMVERSE", font=get_font(FONT_ARIAL_BOLD, 36), fill=(229, 9, 20))

    # Center Heading
    draw.text((w//2, 260), "Who's watching?", font=get_font(FONT_ARIAL, 58), fill=(255, 255, 255), anchor="mt")

    # 4 Profiles
    profiles = [
        {"name": "Vijay", "color": (229, 9, 20), "initial": "V", "sub": "Tamil Cinema & Action", "badge": "ACTIVE"},
        {"name": "Tamil Cinema Fan", "color": (0, 113, 235), "initial": "T", "sub": "Kollywood Classics", "badge": None},
        {"name": "Binge Watcher", "color": (245, 158, 11), "initial": "B", "sub": "Worldwide Sci-Fi & Crime", "badge": None},
        {"name": "Kids & Family", "color": (16, 185, 129), "initial": "K", "sub": "Animation & G-Rated", "badge": None}
    ]

    card_size = 180
    gap = 60
    total_w = len(profiles) * card_size + (len(profiles) - 1) * gap
    start_x = (w - total_w) // 2
    y_card = 400

    for idx, p in enumerate(profiles):
        px = start_x + (idx * (card_size + gap))
        # Profile Box
        draw.rounded_rectangle([px, y_card, px + card_size, y_card + card_size], radius=16, fill=p["color"])
        # White initial
        draw.text((px + card_size//2, y_card + 35), p["initial"], font=get_font(FONT_ARIAL_BOLD, 90), fill=(255, 255, 255), anchor="mt")

        if p["badge"]:
            draw.rounded_rectangle([px + card_size//2 - 45, y_card + card_size - 30, px + card_size//2 + 45, y_card + card_size - 6], radius=6, fill=(0, 0, 0))
            draw.text((px + card_size//2, y_card + card_size - 27), p["badge"], font=get_font(FONT_ARIAL_BOLD, 12), fill=(255, 255, 255), anchor="mt")

        # Name
        draw.text((px + card_size//2, y_card + card_size + 24), p["name"], font=get_font(FONT_SEGOE_BOLD, 20), fill=(255, 255, 255) if p["badge"] else (170, 170, 170), anchor="mt")
        # Sub
        draw.text((px + card_size//2, y_card + card_size + 56), p["sub"], font=get_font(FONT_SEGOE, 13), fill=(120, 120, 120), anchor="mt")

    # Manage Profiles Button
    draw.rounded_rectangle([w//2 - 130, 750, w//2 + 130, 805], radius=6, outline=(120, 120, 120), width=2)
    draw.text((w//2, 765), "Manage Profiles", font=get_font(FONT_SEGOE_BOLD, 18), fill=(180, 180, 180), anchor="mt")

    return img.convert("RGB")

def create_netflix_player_screenshot():
    """
    Creates a full 1920x1080 screenshot mockup of the custom in-browser Netflix video player.
    """
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), (5, 5, 5, 255))
    draw = ImageDraw.Draw(img)

    # Simulated cinematic 4K video frame: Deep space portal with glowing starship
    draw_vertical_gradient(draw, w, h, (4, 25, 30), (2, 8, 10))
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    for r in range(400, 20, -20):
        g_draw.ellipse([w//2 - r, h//2 - r, w//2 + r, h//2 + r], outline=(16, 185, 129, int(90 * (1 - r/400.0))), width=3)
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Top overlay header
    top_scrim = Image.new("RGBA", (w, 180), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(top_scrim)
    for y in range(180):
        t_draw.line([(0, y), (w, y)], fill=(0, 0, 0, int(220 * (1 - y/180.0))))
    img.paste(top_scrim, (0, 0), top_scrim)
    draw = ImageDraw.Draw(img)

    # Back Arrow & Title
    draw.polygon([(65, 50), (45, 65), (65, 80)], fill=(255, 255, 255))
    draw.text((90, 48), "THE LAST HORIZON (2024)", font=get_font(FONT_ARIAL_BOLD, 24), fill=(255, 255, 255))
    draw.text((90, 80), "STREAMVERSE Cinema Studio  •  Episode 1: The Gateway  •  4K HDR Dolby 5.1", font=get_font(FONT_SEGOE, 14), fill=(180, 180, 180))

    # Bottom overlay controls
    bot_scrim = Image.new("RGBA", (w, 240), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(bot_scrim)
    for y in range(240):
        b_draw.line([(0, y), (w, y)], fill=(0, 0, 0, int(235 * (y/240.0))))
    img.paste(bot_scrim, (0, h - 240), bot_scrim)
    draw = ImageDraw.Draw(img)

    # Red Timeline Scrubber
    bar_y = h - 110
    draw.line([(60, bar_y), (w - 60, bar_y)], fill=(80, 80, 80), width=6)
    # Buffered
    draw.line([(60, bar_y), (int(w * 0.65), bar_y)], fill=(140, 140, 140), width=6)
    # Played (Netflix Red)
    played_x = int(w * 0.42)
    draw.line([(60, bar_y), (played_x, bar_y)], fill=(229, 9, 20), width=6)
    # Scrubber thumb
    draw.ellipse([played_x - 10, bar_y - 10, played_x + 10, bar_y + 10], fill=(229, 9, 20))

    # Controls Row
    ctrl_y = h - 65
    # Play/Pause Icon
    draw.polygon([(70, ctrl_y - 15), (70, ctrl_y + 15), (95, ctrl_y)], fill=(255, 255, 255))
    # 10s Rewind / Forward
    draw.text((130, ctrl_y - 12), "↺ 10s", font=get_font(FONT_ARIAL_BOLD, 18), fill=(255, 255, 255))
    draw.text((200, ctrl_y - 12), "10s ↻", font=get_font(FONT_ARIAL_BOLD, 18), fill=(255, 255, 255))
    # Volume
    draw.text((275, ctrl_y - 12), "🔊", font=get_font(FONT_SEGOE, 20), fill=(255, 255, 255))
    draw.line([(310, ctrl_y), (390, ctrl_y)], fill=(255, 255, 255), width=4)

    # Time
    draw.text((430, ctrl_y - 10), "47:18 / 1:52:40", font=get_font(FONT_SEGOE_BOLD, 15), fill=(200, 200, 200))

    # Right Controls
    draw.text((w - 460, ctrl_y - 10), "💬 Audio & Subtitles (Tamil / Eng)", font=get_font(FONT_SEGOE_BOLD, 15), fill=(255, 255, 255))
    draw.text((w - 220, ctrl_y - 10), "⚡ 1.0x", font=get_font(FONT_SEGOE_BOLD, 15), fill=(255, 255, 255))
    draw.text((w - 140, ctrl_y - 10), "4K 60fps", font=get_font(FONT_SEGOE_BOLD, 13), fill=(16, 185, 129))
    draw.text((w - 65, ctrl_y - 12), "⛶", font=get_font(FONT_SEGOE_BOLD, 22), fill=(255, 255, 255))

    return img.convert("RGB")

def main():
    print("🎨 Generating 12 Individual Movie Posters...")
    poster_images = {}
    for movie in MOVIES_CATALOG:
        fn = movie["filename"]
        poster_img = create_movie_poster(movie)
        out_path = os.path.join(POSTERS_DIR, fn)
        poster_img.save(out_path, "PNG", quality=95)
        poster_images[fn] = poster_img
        print(f"  ✓ Saved Poster: {fn}")

    print("\n📸 Generating Full Resolution Screenshots...")

    # 1. Top 10 Row (1920x950)
    top10_img = create_top10_row_screenshot(poster_images)
    top10_path = os.path.join(SCREENSHOTS_DIR, "top10_row.png")
    top10_img.save(top10_path, "PNG", quality=95)
    print(f"  ✓ Saved Screenshot: {top10_path}")

    # 2. Streamverse Banner (1920x1080)
    banner_img = create_streamverse_banner_screenshot(poster_images)
    banner_path = os.path.join(SCREENSHOTS_DIR, "streamverse_banner.png")
    banner_img.save(banner_path, "PNG", quality=95)
    print(f"  ✓ Saved Screenshot: {banner_path}")

    # 3. Profile Selector (1920x1080)
    prof_img = create_profile_selector_screenshot()
    prof_path = os.path.join(SCREENSHOTS_DIR, "profile_selector.png")
    prof_img.save(prof_path, "PNG", quality=95)
    print(f"  ✓ Saved Screenshot: {prof_path}")

    # 4. Netflix Player (1920x1080)
    player_img = create_netflix_player_screenshot()
    player_path = os.path.join(SCREENSHOTS_DIR, "netflix_video_player.png")
    player_img.save(player_path, "PNG", quality=95)
    print(f"  ✓ Saved Screenshot: {player_path}")

    print("\n🎉 ALL POSTERS AND SCREENSHOTS SUCCESSFULLY GENERATED!")

if __name__ == "__main__":
    main()

