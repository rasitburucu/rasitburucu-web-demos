# Engraving for the long counter tray. Maps object x in [-1.5,1.5], y in [-0.5,0.5].
import math, random
from PIL import Image, ImageDraw, ImageFilter
W,H=4800,1600; K=W/3.0   # px per unit
im=Image.new('L',(W,H),0); d=ImageDraw.Draw(im)
def px(x,y): return (W/2+x*K, H/2-y*K)
def rrect(inset,w):
    hw,hh,r=1.5-inset,0.5-inset,max(0.02,0.22-inset)
    x0,y0=px(-hw,hh); x1,y1=px(hw,-hh)
    d.rounded_rectangle([x0,y0,x1,y1],radius=r*K,outline=255,width=w)
rrect(0.075,7); rrect(0.088,4); rrect(0.155,7); rrect(0.143,4)
# leaf chain along long edges
random.seed(3)
def leaf(cx,cy,ang,L=0.05,Wd=0.016):
    pts=[];pts2=[]
    for t in [k/24 for k in range(25)]:
        ax=-L/2+L*t; ay=Wd*math.sin(math.pi*t)
        for sgn,arr in ((1,pts),(-1,pts2)):
            x=cx+ax*math.cos(ang)-sgn*ay*math.sin(ang); y=cy+ax*math.sin(ang)+sgn*ay*math.cos(ang)
            arr.append(px(x,y))
    d.line(pts,fill=255,width=5,joint="curve"); d.line(pts2,fill=255,width=5,joint="curve")
ym=0.5-0.1215
n=34
for i in range(n):
    x=-1.2+2.4*i/(n-1)
    leaf(x,ym,0); leaf(x,-ym,0)
    for yy in (ym,-ym):
        if i<n-1:
            cx,cy=px(x+2.4/(n-1)/2,yy); d.ellipse([cx-8,cy-8,cx+8,cy+8],fill=255)
# short edges: three leaves vertical
for xx in (1.5-0.1215,-(1.5-0.1215)):
    for y in (-0.12,0,0.12): leaf(xx,y,math.pi/2)
# three medallions along the centre line (where the plates sit, mostly hidden)
for mx in (-0.95,0,0.95):
    cx,cy=px(mx,0)
    for r,w in ((0.16,7),(0.15,4),(0.07,6)):
        d.ellipse([cx-r*K,cy-r*K,cx+r*K,cy+r*K],outline=255,width=w)
    for k in range(8):
        a=k*math.pi/4
        pts=[px(mx+(0.075+0.065*t)*math.cos(a+0.25*math.sin(math.pi*t)),(0.075+0.065*t)*math.sin(a+0.25*math.sin(math.pi*t))) for t in [j/20 for j in range(21)]]
        pts2=[px(mx+(0.075+0.065*t)*math.cos(a-0.25*math.sin(math.pi*t)),(0.075+0.065*t)*math.sin(a-0.25*math.sin(math.pi*t))) for t in [j/20 for j in range(21)]]
        d.line(pts,fill=255,width=4); d.line(pts2,fill=255,width=4)
    for _ in range(900):
        x=random.uniform(-0.065,0.065); y=random.uniform(-0.065,0.065)
        if math.hypot(x,y)<0.062:
            a,b=px(mx+x,y); s=random.uniform(3,5); d.ellipse([a-s,b-s,a+s,b+s],fill=255)
im=im.filter(ImageFilter.GaussianBlur(1.6)); im.save('engrave-tray.png'); im.resize((1200,400)).save('engrave-tray-prev.png'); print('ok')
