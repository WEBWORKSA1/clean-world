"""Generates assets/img/og.png and icon-512.png if missing (run by the workflow)."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def font(path, size):
    try: return ImageFont.truetype(path, size)
    except Exception: return ImageFont.load_default()
os.makedirs(os.path.join(ROOT,"assets/img"),exist_ok=True)
W,H=1200,630
im=Image.new("RGB",(W,H),"#0b2a22"); d=ImageDraw.Draw(im)
for y in range(H):
    t=y/H; r=int(15*(1-t)+20*t); g=int(157*(1-t)+184*t); b=int(122*(1-t)+196*t)
    d.line([(0,y),(W,y)],fill=(r,g,b))
d.ellipse((880,-140,1340,320),fill=(182,233,74))
fb="/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"; fs="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
d.text((80,190),"Clean.World",font=font(fb,118),fill="white")
d.text((84,350),"Cleaner homes. Cleaner air. Cleaner planet.",font=font(fs,40),fill="#eafff8")
d.text((84,430),"Free guides · Smart tools · Live air index · Free cleaning quotes",font=font(fs,28),fill="#d6fff0")
im.save(os.path.join(ROOT,"assets/img/"+"og.png"),optimize=True)
ic=Image.new("RGBA",(512,512),(0,0,0,0)); di=ImageDraw.Draw(ic)
di.ellipse((16,16,496,496),fill=(15,157,122)); di.arc((150,170,362,420),20,160,fill="white",width=34); di.arc((130,150,382,330),200,340,fill="white",width=34); di.ellipse((330,90,410,170),fill=(182,233,74))
ic.save(os.path.join(ROOT,"assets/img/"+"icon-512.png"),optimize=True)
