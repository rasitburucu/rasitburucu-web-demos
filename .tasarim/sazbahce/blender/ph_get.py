"""Download CC0 Poly Haven assets (models as glTF 1k, textures as 1k/2k jpg maps) into assets/.
python ph_get.py model <id>... | tex <id>... """
import json, os, sys, urllib.request
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
UA = {"User-Agent": "sazbahce-render/1.0"}
def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f: f.write(r.read())
def files(i):
    with urllib.request.urlopen(urllib.request.Request(f"https://api.polyhaven.com/files/{i}", headers=UA), timeout=60) as r: return json.load(r)
kind, ids = sys.argv[1], sys.argv[2:]
for i in ids:
    f = files(i)
    d = os.path.join(ROOT, i)
    if kind == "model":
        g = f["gltf"]["1k"]["gltf"]
        get(g["url"], os.path.join(d, os.path.basename(g["url"])))
        for p, inc in g.get("include", {}).items(): get(inc["url"], os.path.join(d, p))
    else:
        res = "2k"
        for m, key in [("diff", "Diffuse"), ("rough", "Rough"), ("nor_gl", "nor_gl"), ("disp", "Displacement"), ("arm", "arm")]:
            for k in (key, m):
                if k in f and res in f[k]:
                    v = f[k][res].get("jpg") or f[k][res].get("png")
                    if v: get(v["url"], os.path.join(d, f"{m}.jpg")); break
    print("ok", i, sorted(os.listdir(d))[:6])
