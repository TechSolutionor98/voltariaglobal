from PIL import Image, ImageDraw, ImageFont
import os

width, height = 1920, 600
banner = Image.new('RGBA', (width, height), (255, 255, 255, 255))
draw = ImageDraw.Draw(banner)

# Soft gradient background
for x in range(width):
    ratio = x / width
    r = int(248 + 7 * ratio)
    g = int(249 + 6 * ratio)
    b = int(251 + 4 * ratio)
    draw.line([(x, 0), (x, height)], fill=(r, g, b, 255))

# Draw modern red accent bars
draw.rectangle([(80, 80), (86, 130)], fill=(220, 38, 38, 255))

# Load fonts
try:
    font_badge = ImageFont.truetype('arialbd.ttf', 22)
    font_title1 = ImageFont.truetype('arialbd.ttf', 54)
    font_title2 = ImageFont.truetype('arialbd.ttf', 32)
    font_desc = ImageFont.truetype('arial.ttf', 20)
    font_pill = ImageFont.truetype('arialbd.ttf', 15)
except Exception:
    font_badge = ImageFont.load_default()
    font_title1 = font_badge
    font_title2 = font_badge
    font_desc = font_badge
    font_pill = font_badge

# Text on left
draw.text((105, 85), 'VOLTARIA DC SOLAR WATER PUMP', font=font_badge, fill=(220, 38, 38, 255))
draw.text((80, 150), 'HIGH EFFICIENCY.', font=font_title1, fill=(20, 20, 20, 255))
draw.text((80, 215), 'MAXIMUM WATER FLOW.', font=font_title1, fill=(220, 38, 38, 255))
draw.text((80, 290), '900W / 1.2HP Brushless DC Motor with Smart MPPT Controller', font=font_title2, fill=(50, 50, 50, 255))
draw.text((80, 345), 'Engineered for high-capacity agricultural irrigation, livestock, and deep water transfer.', font=font_desc, fill=(100, 100, 100, 255))
draw.text((80, 375), 'Max Flow: 30m3/h | Max Head: 16m | Suction Lift: 8m | 100% Pure Copper PMSM Motor', font=font_desc, fill=(100, 100, 100, 255))

# Highlights / pills at bottom
pills = [
    '100% PURE COPPER',
    '30m3/h MAX FLOW',
    'IP65 MPPT CONTROLLER',
    'DRY-RUN PROTECTION',
    '3\" x 3\" INLET & OUTLET'
]

cur_x = 80
y_pill = 440
for p in pills:
    bbox = draw.textbbox((cur_x + 16, y_pill + 10), p, font=font_pill)
    pill_w = bbox[2] - cur_x + 16
    draw.rounded_rectangle([(cur_x, y_pill), (cur_x + pill_w, y_pill + 38)], radius=19, fill=(254, 242, 242, 255), outline=(254, 202, 202, 255), width=1)
    draw.text((cur_x + 16, y_pill + 10), p, font=font_pill, fill=(220, 38, 38, 255))
    cur_x += pill_w + 14

# Prepare clean pump
pump_path = r'e:\ts\voltarialatest\Voltaria-Global-Latest\public\images\dc-solar-water-pump.png'
if os.path.exists(pump_path):
    pump = Image.open(pump_path).convert('RGBA')
    # Clean any artifacts on edges
    p_pix = pump.load()
    pw, ph = pump.size
    for y in range(ph):
        for x in range(pw):
            r, g, b, a = p_pix[x, y]
            if r > 235 and g > 235 and b > 235:
                p_pix[x, y] = (255, 255, 255, 0)
    
    aspect = pump.width / pump.height
    new_h = 510
    new_w = int(new_h * aspect)
    pump_resized = pump.resize((new_w, new_h), Image.Resampling.LANCZOS)
    banner.paste(pump_resized, (1330, 45), pump_resized)

# Prepare clean circular badge
badge_path = r'e:\ts\voltarialatest\Voltaria-Global-Latest\public\images\copper-guarantee-badge.png'
if os.path.exists(badge_path):
    badge = Image.open(badge_path).convert('RGBA')
    # Make outer white pixels transparent
    bw, bh = badge.size
    b_pix = badge.load()
    for by in range(bh):
        for bx in range(bw):
            r, g, b, a = b_pix[bx, by]
            if r > 230 and g > 230 and b > 230:
                b_pix[bx, by] = (255, 255, 255, 0)
    
    badge_resized = badge.resize((160, 160), Image.Resampling.LANCZOS)
    banner.paste(badge_resized, (1200, 60), badge_resized)

# Save
banner.convert('RGB').save(r'e:\ts\voltarialatest\Voltaria-Global-Latest\public\images\solar-water-pump-bg.png')
banner.convert('RGB').save(r'e:\ts\voltarialatest\Voltaria-Global-Latest\public\images\solar-water-pumps-bg.png')
banner.convert('RGB').save(r'e:\ts\voltarialatest\Voltaria-Global-Latest\public\images\water-pumps-bg.png')
print('Refined banner created!')
