# Engraving mask for the Kalemkar sini: white = engraved groove. Maps object x,y in [-1,1].
import math, random
from PIL import Image, ImageDraw, ImageFilter
N=4096; C=N/2; R=N/2  # 1.0 object unit = R px
im=Image.new('L',(N,N),0); d=ImageDraw.Draw(im)
random.seed(7)
def P(r,a): return (C+r*R*math.cos(a), C+r*R*math.sin(a))
def circle(r,w):
    d.ellipse([C-r*R,C-r*R,C+r*R,C+r*R],outline=255,width=w)
def poly_curve(pts,w): d.line(pts,fill=255,width=w,joint="curve")
LW=7
# outer rim band 0.80-0.88
circle(0.885,LW); circle(0.872,4); circle(0.80,LW); circle(0.812,4)
n=40
for i in range(n):
    a0=2*math.pi*i/n; a1=2*math.pi*(i+1)/n; am=(a0+a1)/2
    # rumi leaf: teardrop between radii .818 and .866
    pts=[]
    for t in [k/30 for k in range(31)]:
        ang=am+ (a1-a0)*0.42*math.sin(math.pi*t)*(1 if t<0.5 else 1)
        pts.append(P(0.818+0.048*t, am+(a1-a0)*0.38*math.sin(math.pi*t)))
    pts2=[P(0.818+0.048*t, am-(a1-a0)*0.38*math.sin(math.pi*t)) for t in [k/30 for k in range(31)]]
    poly_curve(pts,5); poly_curve(pts2,5)
    # inner vein
    poly_curve([P(0.826+0.03*t, am) for t in [k/10 for k in range(11)]],3)
    # dot between leaves
    x,y=P(0.842,a0); d.ellipse([x-9,y-9,x+9,y+9],fill=255)
# text band is left plain between 0.64 and 0.78 (SVG text sits there on the site)
circle(0.785,4); circle(0.635,4)
# hatch ring 0.58-0.625
circle(0.625,LW); circle(0.58,LW)
for i in range(180):
    a=2*math.pi*i/180
    poly_curve([P(0.585,a),P(0.62,a+0.012)],3)
# medallion
circle(0.30,LW); circle(0.288,4)
# 8-point star (two squares)
for rot in (0, math.pi/4):
    pts=[P(0.27, rot+math.pi/4+k*math.pi/2) for k in range(5)]
    poly_curve(pts,LW)
circle(0.115,LW); circle(0.104,4)
# petals inside star points
for k in range(8):
    a=k*math.pi/4
    pts=[P(0.125+0.11*t, a+0.16*math.sin(math.pi*t)) for t in [j/30 for j in range(31)]]
    pts2=[P(0.125+0.11*t, a-0.16*math.sin(math.pi*t)) for t in [j/30 for j in range(31)]]
    poly_curve(pts,5); poly_curve(pts2,5)
# punched dot ground (cukurlama) between star and medallion ring, and in center
def inside_star(x,y):
    r=math.hypot(x,y); a=math.atan2(y,x)
    # star boundary approx: distance to square edges
    def sq(rot):
        aa=(a-rot)%(math.pi/2)-math.pi/4
        return 0.27*math.cos(math.pi/4)/math.cos(aa)
    return r< max(sq(0),sq(math.pi/4))
for _ in range(9000):
    x=random.uniform(-0.3,0.3); y=random.uniform(-0.3,0.3); r=math.hypot(x,y)
    if 0.12<r<0.282 and not inside_star(x,y):
        px,py=C+x*R,C+y*R; s=random.uniform(3.5,5.5); d.ellipse([px-s,py-s,px+s,py+s],fill=255)
for _ in range(2600):
    x=random.uniform(-0.1,0.1); y=random.uniform(-0.1,0.1); r=math.hypot(x,y)
    if r<0.098:
        px,py=C+x*R,C+y*R; s=random.uniform(3.5,5.5); d.ellipse([px-s,py-s,px+s,py+s],fill=255)
im=im.filter(ImageFilter.GaussianBlur(1.6))
im.save('engrave.png')
im.resize((1024,1024)).save('engrave-prev.png')
print('ok')
