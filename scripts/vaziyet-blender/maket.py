# Vaziyet: table-top model ("maket") renders, built entirely from code.
# Green cutting mat with a 1 cm / 5 cm grid, cork plot boards, grey card road,
# cobalt acrylic houses at 1:100 (the five models of content/vaziyet/modeller.ts,
# exported to modeller.json), sponge trees, a steel ruler. No downloaded model,
# texture, HDRI or photo. Light: one large soft "desk lamp" area light + a dim
# world.
#
#   blender -b --factory-startup -P maket.py -- <scene> <out.png> [width height samples]
#   scenes: raf | model:<id> | panel | tir | vinc
import bpy, bmesh, json, math, os, random, sys
from mathutils import Vector

ARGV = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SAHNE = ARGV[0] if ARGV else "model:sofa"
CIKTI = ARGV[1] if len(ARGV) > 1 else os.path.join(os.path.dirname(__file__), "onizleme.png")
GEN = int(ARGV[2]) if len(ARGV) > 2 else 1200
YUK = int(ARGV[3]) if len(ARGV) > 3 else 800
ORNEK = int(ARGV[4]) if len(ARGV) > 4 else 64

POZ = float(os.environ.get("VZ_POZ", "-0.75"))
S = 0.01  # 1:100 — one metre of house is one centimetre of model
HERE = os.path.dirname(os.path.abspath(__file__))
MODELLER = {m["id"]: m for m in json.load(open(os.path.join(HERE, "modeller.json"), encoding="utf-8"))}

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
random.seed(7)


def hex2lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def principled(mat):
    return next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def malzeme(ad, renk, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.1, spec=0.5):
    m = bpy.data.materials.new(ad)
    m.use_nodes = True
    p = principled(m)
    p.inputs["Base Color"].default_value = hex2lin(renk)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    try:
        p.inputs["Coat Weight"].default_value = coat
        p.inputs["Coat Roughness"].default_value = coat_rough
        p.inputs["Specular IOR Level"].default_value = spec
    except KeyError:
        pass
    return m


def mat_izgara():
    """cutting mat: green with 1 cm minor and 5 cm major lines (object coordinates)"""
    m = bpy.data.materials.new("kesim_mati")
    m.use_nodes = True
    nt = m.node_tree
    p = principled(m)
    p.inputs["Roughness"].default_value = 0.82
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sep.inputs[0])

    def cizgi(eksen, adim, kal):
        a = nt.nodes.new("ShaderNodeMath"); a.operation = "DIVIDE"; a.inputs[1].default_value = adim
        nt.links.new(sep.outputs[eksen], a.inputs[0])
        b = nt.nodes.new("ShaderNodeMath"); b.operation = "PINGPONG"; b.inputs[1].default_value = 0.5
        nt.links.new(a.outputs[0], b.inputs[0])
        c = nt.nodes.new("ShaderNodeMath"); c.operation = "LESS_THAN"; c.inputs[1].default_value = kal
        nt.links.new(b.outputs[0], c.inputs[0])
        return c

    def maks(x, y):
        n = nt.nodes.new("ShaderNodeMath"); n.operation = "MAXIMUM"
        nt.links.new(x.outputs[0], n.inputs[0]); nt.links.new(y.outputs[0], n.inputs[1])
        return n

    ince = maks(cizgi("X", 0.01, 0.045), cizgi("Y", 0.01, 0.045))
    kalin = maks(cizgi("X", 0.05, 0.016), cizgi("Y", 0.05, 0.016))
    mx1 = nt.nodes.new("ShaderNodeMix"); mx1.data_type = "RGBA"
    mx1.inputs[6].default_value = hex2lin("#1d5444")
    mx1.inputs[7].default_value = hex2lin("#2c6654")
    nt.links.new(ince.outputs[0], mx1.inputs[0])
    mx2 = nt.nodes.new("ShaderNodeMix"); mx2.data_type = "RGBA"
    nt.links.new(mx1.outputs[2], mx2.inputs[6])
    mx2.inputs[7].default_value = hex2lin("#4a8673")
    nt.links.new(kalin.outputs[0], mx2.inputs[0])
    # a faint mottling so the mat does not read as a flat render colour
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 180
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    mx3 = nt.nodes.new("ShaderNodeMix"); mx3.data_type = "RGBA"; mx3.blend_type = "MULTIPLY"
    mx3.inputs[0].default_value = 0.08
    nt.links.new(mx2.outputs[2], mx3.inputs[6]); nt.links.new(nz.outputs["Color"], mx3.inputs[7])
    nt.links.new(mx3.outputs[2], p.inputs["Base Color"])
    return m


def mat_mantar(ad="mantar", taban="#c89b68", koyu="#9a6b3c", acik="#e2bf8f"):
    """cork board: granules from two Voronoi layers, a little bump"""
    m = bpy.data.materials.new(ad)
    m.use_nodes = True
    nt = m.node_tree
    p = principled(m)
    p.inputs["Roughness"].default_value = 0.9
    tc = nt.nodes.new("ShaderNodeTexCoord")
    v1 = nt.nodes.new("ShaderNodeTexVoronoi"); v1.inputs["Scale"].default_value = 900
    v2 = nt.nodes.new("ShaderNodeTexVoronoi"); v2.inputs["Scale"].default_value = 2300
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 60
    for t in (v1, v2, nz):
        nt.links.new(tc.outputs["Object"], t.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.25; cr.color_ramp.elements[0].color = hex2lin(koyu)
    cr.color_ramp.elements[1].position = 0.75; cr.color_ramp.elements[1].color = hex2lin(acik)
    e = cr.color_ramp.elements.new(0.5); e.color = hex2lin(taban)
    mixf = nt.nodes.new("ShaderNodeMath"); mixf.operation = "ADD"
    nt.links.new(v1.outputs["Distance"], mixf.inputs[0]); nt.links.new(v2.outputs["Distance"], mixf.inputs[1])
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 0.5
    nt.links.new(mixf.outputs[0], mul.inputs[0])
    add = nt.nodes.new("ShaderNodeMath"); add.operation = "MULTIPLY_ADD"; add.inputs[1].default_value = 0.35; add.inputs[2].default_value = 0.0
    nt.links.new(nz.outputs["Fac"], add.inputs[0])
    tot = nt.nodes.new("ShaderNodeMath"); tot.operation = "ADD"
    nt.links.new(mul.outputs[0], tot.inputs[0]); nt.links.new(add.outputs[0], tot.inputs[1])
    nt.links.new(tot.outputs[0], cr.inputs[0])
    nt.links.new(cr.outputs[0], p.inputs["Base Color"])
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.35; bump.inputs["Distance"].default_value = 0.0004
    nt.links.new(v2.outputs["Distance"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


def mat_sunger():
    m = bpy.data.materials.new("sunger")
    m.use_nodes = True
    nt = m.node_tree
    p = principled(m)
    p.inputs["Roughness"].default_value = 1.0
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 700; nz.inputs["Detail"].default_value = 6
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.3; cr.color_ramp.elements[0].color = hex2lin("#2c6b3a")
    cr.color_ramp.elements[1].position = 0.7; cr.color_ramp.elements[1].color = hex2lin("#5aa66a")
    nt.links.new(nz.outputs["Fac"], cr.inputs[0])
    nt.links.new(cr.outputs[0], p.inputs["Base Color"])
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.8; bump.inputs["Distance"].default_value = 0.0015
    nt.links.new(nz.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


M = {}


def malzemeler():
    M["mat"] = mat_izgara()
    M["mantar"] = mat_mantar()
    M["mantar_kenar"] = malzeme("mantar_kenar", "#9e7445", 0.85)
    M["mantar_koyu"] = mat_mantar("mantar_koyu", "#a8784a", "#7e5530", "#c39463")
    M["karton"] = malzeme("gri_karton", "#8c9996", 0.92)
    M["beyaz"] = malzeme("beyaz_bant", "#f1ece0", 0.7)
    M["kobalt"] = malzeme("kobalt_akrilik", "#3157d5", 0.22, coat=0.45, coat_rough=0.12)
    M["kobalt_cati"] = malzeme("kobalt_cati", "#3d63e2", 0.26, coat=0.4, coat_rough=0.14)
    M["kobalt_koyu"] = malzeme("kobalt_oyma", "#14286e", 0.25)
    M["sunger"] = mat_sunger()
    M["govde"] = malzeme("tel_govde", "#6b4e2e", 0.7)
    M["cetvel"] = malzeme("plastik_cetvel", "#f2f1ea", 0.35, coat=0.3)
    M["beton"] = malzeme("beton", "#b6b5ad", 0.85)
    M["kirmizi"] = malzeme("kirmizi", "#e5392d", 0.4)
    M["vinc"] = malzeme("vinc_govde", "#e9e6dc", 0.45, coat=0.3)
    M["koyu"] = malzeme("koyu_plastik", "#2a2f31", 0.5)
    M["cam"] = malzeme("kabin_cam", "#9fb6c4", 0.08, spec=0.8)
    M["teker"] = malzeme("teker", "#1b1d1e", 0.75)


def obje(ad, me, mat=None):
    o = bpy.data.objects.new(ad, me)
    sc.collection.objects.link(o)
    if mat is not None:
        if isinstance(mat, list):
            for x in mat:
                o.data.materials.append(x)
        else:
            o.data.materials.append(mat)
    return o


def kutu(ad, sx, sy, sz, x, y, z, mat, pah=0.0):
    """box with its base centre at (x, y, z); sizes in scene units"""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx; v.co.y *= sy; v.co.z *= sz
        v.co.z += sz / 2
    me = bpy.data.meshes.new(ad)
    bm.to_mesh(me); bm.free()
    o = obje(ad, me, mat)
    o.location = (x, y, z)
    if pah > 0:
        b = o.modifiers.new("pah", "BEVEL"); b.width = pah; b.segments = 2; b.limit_method = "ANGLE"
    return o


def prizma(ad, uzun, derin, h, x, y, z, mat, eksen="x", tasma=0.0):
    """gable roof: triangle across `derin`, extruded along `uzun`; base centre at (x, y, z)"""
    bm = bmesh.new()
    L = uzun / 2 + tasma
    Dd = derin / 2 + tasma
    if eksen == "x":
        pts = [(-L, -Dd, 0), (L, -Dd, 0), (L, Dd, 0), (-L, Dd, 0), (-L, 0, h), (L, 0, h)]
    else:
        pts = [(-Dd, -L, 0), (Dd, -L, 0), (Dd, L, 0), (-Dd, L, 0), (0, -L, h), (0, L, h)]
    vs = [bm.verts.new(p) for p in pts]
    bm.faces.new([vs[0], vs[3], vs[2], vs[1]])
    bm.faces.new([vs[0], vs[1], vs[5], vs[4]])
    bm.faces.new([vs[3], vs[4], vs[5], vs[2]])
    bm.faces.new([vs[0], vs[4], vs[3]])
    bm.faces.new([vs[1], vs[2], vs[5]])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ad)
    bm.to_mesh(me); bm.free()
    o = obje(ad, me, mat)
    o.location = (x, y, z)
    return o


def ev(m, cx, cy, z0=0.0, rot=0.0, ad="ev", parca=1.0):
    """a model house at 1:100, centred at (cx, cy); entrance facade towards -y.
    parca < 1 builds only the lower part of the walls (for the assembly scene)."""
    w, d, h, r = m["w"] * S, m["d"] * S, m["sacak"] * S, m["mahya"] * S
    kok = bpy.data.objects.new(ad, None)
    sc.collection.objects.link(kok)
    kok.location = (cx, cy, z0)
    kok.rotation_euler = (0, 0, rot)
    govde = kutu(ad + "_govde", w, d, h * parca, 0, 0, 0, M["kobalt"], pah=0.0005)
    govde.parent = kok
    if parca >= 1:
        cati = prizma(ad + "_cati", w, d, r - h, 0, 0, h, M["kobalt_cati"], "x", tasma=0.0025)
        cati.parent = kok
    # engraved windows and the front door (from the plan data)
    for f, liste in enumerate(m["pencereler"]):
        taban = (0.5 + f * 2.9) * S
        if taban + 2.2 * S > h * parca:
            continue
        for p in liste:
            orta = (p["a"] + p["b"]) / 2 * S
            boy = (p["b"] - p["a"]) * S
            zz = taban + 0.9 * S
            t = 0.0006
            if p["duvar"] == "on":
                o = kutu("pen", boy, t, 1.25 * S, orta - w / 2, -d / 2 - t / 2 + 0.0002, zz, M["kobalt_koyu"])
            elif p["duvar"] == "arka":
                o = kutu("pen", boy, t, 1.25 * S, orta - w / 2, d / 2 + t / 2 - 0.0002, zz, M["kobalt_koyu"])
            elif p["duvar"] == "sol":
                o = kutu("pen", t, boy, 1.25 * S, -w / 2 - t / 2 + 0.0002, orta - d / 2, zz, M["kobalt_koyu"])
            else:
                o = kutu("pen", t, boy, 1.25 * S, w / 2 + t / 2 - 0.0002, orta - d / 2, zz, M["kobalt_koyu"])
            o.parent = kok
    for k in m["kapilar"][0]:
        o = kutu("kapi", k["w"] * S, 0.0006, 2.1 * S, (k["x"] + k["w"] / 2) * S - w / 2, -d / 2 - 0.0001, 0.5 * S, M["kobalt_koyu"])
        o.parent = kok
    if m["kat"] == 2 and parca >= 1:
        o = kutu("kat_cizgi", w + 0.0003, d + 0.0003, 0.0006, 0, 0, 3.4 * S, M["kobalt_koyu"])
        o.parent = kok
    return kok


def agac(x, y, z0, boy=1.0):
    g = kutu("govde", 0.0006, 0.0006, 1.9 * S * boy, x, y, z0, M["govde"])
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.1 * S * boy, location=(x, y, z0 + 2.55 * S * boy))
    t = bpy.context.active_object
    t.data.materials.append(M["sunger"])
    t.scale = (1.0, 1.0, 0.92)
    d = t.modifiers.new("sunger", "DISPLACE")
    tex = bpy.data.textures.new("sunger_tex", "VORONOI")
    tex.noise_scale = 0.004
    d.texture = tex
    d.strength = 0.0011
    d.texture_coords = "GLOBAL"
    sub = t.modifiers.new("yumusat", "SUBSURF"); sub.levels = 1; sub.render_levels = 2
    bpy.ops.object.shade_smooth()
    return t


def arsa(W, D, x0, y0, on=5, yan=3, arka=3, kalin=0.45, serit=True):
    """cork plot board (W × D metres) with its road-side corner at (x0, y0), road below it"""
    w, d, k = W * S, D * S, kalin * S
    p = kutu("arsa", w, d, k, x0 + w / 2, y0 + d / 2, 0, [M["mantar"], M["mantar_kenar"]])
    # top face cork, sides edge colour
    for poly in p.data.polygons:
        poly.material_index = 0 if poly.normal.z > 0.5 else 1
    if serit:
        z = k + 0.00008
        t = 0.00012
        kutu("serit_on", w, on * S, t, x0 + w / 2, y0 + on * S / 2, z - t, M["mantar_koyu"])
        kutu("serit_arka", w, arka * S, t, x0 + w / 2, y0 + d - arka * S / 2, z - t, M["mantar_koyu"])
        kutu("serit_sol", yan * S, d - (on + arka) * S, t, x0 + yan * S / 2, y0 + d / 2 + (on - arka) * S / 2, z - t, M["mantar_koyu"])
        kutu("serit_sag", yan * S, d - (on + arka) * S, t, x0 + w - yan * S / 2, y0 + d / 2 + (on - arka) * S / 2, z - t, M["mantar_koyu"])
        # white tape dashes on the buildable line
        bx0, bx1, by0, by1 = x0 + yan * S, x0 + w - yan * S, y0 + on * S, y0 + d - arka * S
        def tire(ax, ay, bx, by):
            L = math.hypot(bx - ax, by - ay)
            n = int(L / (0.8 * S))
            for i in range(n):
                f0 = (i * 0.8 * S) / L
                f1 = min(1, (i * 0.8 * S + 0.5 * S) / L)
                mx, my = ax + (bx - ax) * (f0 + f1) / 2, ay + (by - ay) * (f0 + f1) / 2
                l = (f1 - f0) * L
                if ay == by:
                    kutu("tire", l, 0.1 * S, 0.00008, mx, my, k + 0.00012, M["beyaz"])
                else:
                    kutu("tire", 0.1 * S, l, 0.00008, mx, my, k + 0.00012, M["beyaz"])
        tire(bx0, by0, bx1, by0); tire(bx0, by1, bx1, by1); tire(bx0, by0, bx0, by1); tire(bx1, by0, bx1, by1)
    return k


def yol(W, x0, y0):
    w = (W + 2.4) * S
    kutu("yol", w, 6.75 * S, 0.2 * S, x0 + W * S / 2, y0 - 0.45 * S - 6.75 * S / 2, 0, M["karton"])
    n = int(w / (2.2 * S))
    for i in range(n):
        kutu("yol_tire", 1.2 * S, 0.12 * S, 0.00006, x0 - 1.2 * S + (i + 0.5) * 2.2 * S, y0 - 0.45 * S - 3.35 * S, 0.2 * S, M["beyaz"])


def zemin():
    # a mat large enough that its edge never enters the frame
    bpy.ops.mesh.primitive_plane_add(size=6.0, location=(0, 0.5, 0))
    p = bpy.context.active_object
    p.name = "kesim_mati"
    p.data.materials.append(M["mat"])


def cetvel(x, y, uzun=0.3, rot=0.0):
    o = kutu("cetvel", uzun, 0.03, 0.0015, x, y, 0, M["cetvel"], pah=0.0003)
    o.rotation_euler = (0, 0, rot)
    for i in range(int(uzun / 0.005) + 1):
        L = 0.008 if i % 10 == 0 else (0.0055 if i % 2 == 0 else 0.0035)
        t = kutu("cizik", 0.0005, L, 0.00006, 0, 0, 0.0015, M["koyu"])
        t.parent = o
        t.location = (-uzun / 2 + i * 0.005, 0.015 - L / 2, 0.0015)


def isik(odak=Vector((0, 0, 0)), guc=60.0, boy=0.9):
    w = bpy.data.worlds.new("dunya")
    sc.world = w
    w.use_nodes = True
    bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = hex2lin("#cfd8d2")
    bg.inputs["Strength"].default_value = 0.35
    L = bpy.data.lights.new("lamba", "AREA")
    L.energy = guc
    L.size = boy
    L.color = (1.0, 0.96, 0.9)
    o = bpy.data.objects.new("lamba", L)
    sc.collection.objects.link(o)
    o.location = odak + Vector((-0.85, 0.35, 0.8))
    yon = odak - o.location
    o.rotation_euler = yon.to_track_quat("-Z", "Y").to_euler()
    F = bpy.data.lights.new("dolgu", "AREA")
    F.energy = guc * 0.18
    F.size = 1.2
    fo = bpy.data.objects.new("dolgu", F)
    sc.collection.objects.link(fo)
    fo.location = odak + Vector((0.6, -0.7, 0.5))
    fo.rotation_euler = (odak - fo.location).to_track_quat("-Z", "Y").to_euler()


def kamera(konum, hedef, lens=50, fstop=2.8, odak=None):
    c = bpy.data.cameras.new("kamera")
    c.lens = lens
    c.clip_start = 0.002
    c.clip_end = 20
    c.dof.use_dof = True
    c.dof.aperture_fstop = fstop
    o = bpy.data.objects.new("kamera", c)
    sc.collection.objects.link(o)
    o.location = Vector(konum)
    o.rotation_euler = (Vector(hedef) - o.location).to_track_quat("-Z", "Y").to_euler()
    c.dof.focus_distance = (Vector(odak or hedef) - o.location).length
    sc.camera = o
    return o


def ayarlar():
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for kind in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = kind
            prefs.get_devices()
            devs = [d for d in prefs.devices if d.type == kind]
            if devs:
                for d in prefs.devices:
                    d.use = d.type == kind
                break
        except TypeError:
            continue
    sc.cycles.device = "GPU"
    sc.cycles.samples = ORNEK
    sc.cycles.use_denoising = True
    sc.render.resolution_x = GEN
    sc.render.resolution_y = YUK
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_depth = "8"
    try:
        sc.view_settings.view_transform = "AgX"
    except TypeError:
        pass
    for cand in ("AgX - Punchy", "Punchy", "AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            sc.view_settings.look = cand
            break
        except TypeError:
            continue
    sc.view_settings.exposure = POZ
    print("LOOK", sc.view_settings.view_transform, sc.view_settings.look)


# ------------------------------------------------------------------ scenes

def sahne_model(mid):
    m = MODELLER[mid]
    W = round(m["w"] + 9, 1)
    D = round(m["d"] + 11, 1)
    x0, y0 = -W * S / 2, -D * S / 2 + 0.02
    k = arsa(W, D, x0, y0)
    yol(W, x0, y0)
    hx = x0 + W * S / 2
    hy = y0 + (5 + 1) * S + m["d"] * S / 2
    ev(m, hx, hy, k)
    for (ax, ay) in [(1.9, D - 1.9), (W - 1.9, D - 2.4), (1.6, 2.1), (W - 1.7, 2.8)]:
        agac(x0 + ax * S, y0 + ay * S, k, 1.0 + random.uniform(-0.12, 0.12))
    cetvel(x0 - 0.045, y0 + 0.02, 0.3, math.radians(78))
    hedef = Vector((hx, hy, m["sacak"] * S * 0.55))
    uzak = 0.33 + max(W, D) * S * 0.85
    kamera(hedef + Vector((-0.55, -0.82, 0.62)).normalized() * uzak, hedef, lens=58, fstop=3.2)
    isik(hedef)


def sahne_raf():
    ids = ["sundurma", "sofa", "hayat", "cumba", "avlu"]
    x = -0.40
    k = 0.45 * S
    merkez = []
    for mid in ids:
        m = MODELLER[mid]
        Wt, Dt = m["w"] + 3, m["d"] + 3
        arsa(Wt, Dt, x, -Dt * S / 2, on=1.5, yan=1.5, arka=1.5, serit=False)
        cx = x + Wt * S / 2
        ev(m, cx, 0, k)
        merkez.append(cx)
        x += Wt * S + 0.035
    toplam = x - 0.035 + 0.40
    # recentre everything on x = 0
    kay = -(toplam / 2 - 0.40) + 0.0
    for o in sc.objects:
        if o.parent is None and o.type in ("MESH", "EMPTY"):
            o.location.x += kay - 0.0
    agac(merkez[0] + kay - 0.085, 0.06, 0, 1.2)
    agac(merkez[4] + kay + 0.1, -0.05, 0, 1.1)
    cetvel(-0.05, -0.115, 0.36, math.radians(-3))
    hedef = Vector((0.0, -0.01, 0.022))
    kamera(hedef + Vector((0.05, -1.25, 0.36)), hedef, lens=50, fstop=5.6, odak=Vector((merkez[2] + kay, 0.0, 0.03)))
    isik(hedef, 75)


def panel(ad, en, boy, x, y, z, rot=0.0, pencere=None, kalin=0.18):
    """a wall panel lying flat: en × boy metres, 18 cm thick, optional window opening"""
    o = kutu(ad, en * S, boy * S, kalin * S, x, y, z, M["kobalt"], pah=0.0002)
    o.rotation_euler = (0, 0, rot)
    if pencere:
        px, py, pw, ph = pencere
        h = kutu(ad + "_bosluk", pw * S, ph * S, kalin * S * 3, (px - en / 2) * S, (py - boy / 2) * S, -kalin * S, None)
        b = o.modifiers.new("bosluk", "BOOLEAN"); b.object = h; b.operation = "DIFFERENCE"
        h.hide_render = True; h.hide_viewport = True
        h.parent = o
    return o


def sahne_panel():
    # factory floor: a concrete plate on the mat, a gantry over the panel table
    beton = mat_mantar("fabrika_zemin", "#b9b8b0", "#a3a29a", "#cfcec6")
    kutu("zemin_plaka", 0.34, 0.24, 0.003, 0.0, 0.03, 0, beton)
    z = 0.003
    kutu("masa", 14 * S, 9.5 * S, 0.8 * S, -0.055, 0.035, z, M["koyu"], pah=0.0002)
    zt = z + 0.8 * S
    panel("p1", 12, 3.0, -0.055, 0.065, zt, 0, pencere=(4.0, 1.5, 3.2, 1.3))
    panel("p2", 12, 3.0, -0.055, 0.03, zt, 0, pencere=(8.4, 1.4, 1.0, 2.1))
    panel("p3", 6.5, 3.0, -0.08, -0.005, zt, 0, pencere=(3.2, 1.5, 1.6, 1.3))
    # stacks waiting for the truck, each with a white tag
    for i in range(6):
        panel(f"s{i}", 6.5, 3.0, 0.1, 0.06, z + i * 0.2 * S, math.radians(random.uniform(-1.2, 1.2)))
    kutu("etiket", 0.9 * S, 0.6 * S, 0.0001, 0.1 - 2.4 * S, 0.06 - 0.9 * S, z + 6 * 0.2 * S, M["beyaz"])
    for i in range(5):
        panel(f"r{i}", 12, 3.2, 0.1, -0.0, z + i * 0.2 * S, math.radians(random.uniform(-1, 1)))
    kutu("etiket2", 0.9 * S, 0.6 * S, 0.0001, 0.1 - 5.2 * S, -0.0 - 1.0 * S, z + 5 * 0.2 * S, M["beyaz"])
    cetvel(0.0, -0.105, 0.3, math.radians(2))
    hedef = Vector((0.005, 0.03, 0.008))
    kamera(hedef + Vector((-0.1, -0.27, 0.2)), hedef, lens=50, fstop=4.0, odak=Vector((-0.04, 0.035, 0.01)))
    isik(hedef, 55)


def tir(x, y, z, rot=0.0, yuk=True):
    kok = bpy.data.objects.new("tir", None)
    sc.collection.objects.link(kok)
    kok.location = (x, y, z)
    kok.rotation_euler = (0, 0, rot)
    parts = []
    # cab
    parts.append(kutu("kabin", 2.4 * S, 2.5 * S, 2.9 * S, 7.6 * S, 0, 0.9 * S, M["vinc"], pah=0.0004))
    parts.append(kutu("cam", 0.05 * S, 2.1 * S, 1.0 * S, 8.81 * S, 0, 2.5 * S, M["cam"]))
    parts.append(kutu("yan_cam", 1.3 * S, 0.05 * S, 0.9 * S, 7.9 * S, -1.26 * S, 2.6 * S, M["cam"]))
    parts.append(kutu("sasi", 16 * S, 2.3 * S, 0.5 * S, 0.5 * S, 0, 0.7 * S, M["koyu"]))
    parts.append(kutu("romork", 13 * S, 2.5 * S, 0.25 * S, -1.2 * S, 0, 1.2 * S, M["koyu"]))
    for xx in (7.4, 3.0, -4.0, -5.4, -6.8):
        for yy in (-1.1, 1.1):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.5 * S, depth=0.35 * S, location=(xx * S, yy * S, 0.5 * S), rotation=(math.radians(90), 0, 0))
            t = bpy.context.active_object
            t.data.materials.append(M["teker"])
            parts.append(t)
    if yuk:
        for j, (xx, n) in enumerate([(-5.0, 7), (1.6, 6)]):
            for i in range(n):
                p = kutu(f"yuk{j}{i}", 6.2 * S, 2.3 * S, 0.18 * S, xx * S, 0, 1.45 * S + i * 0.2 * S, M["kobalt"], pah=0.0002)
                parts.append(p)
                if i == n - 1:
                    parts.append(kutu("etiket", 0.7 * S, 0.45 * S, 0.0001, xx * S - 2.2 * S, -0.6 * S, 1.45 * S + (i + 1) * 0.2 * S - 0.00002, M["beyaz"]))
        # straps
        for xx in (-6.5, -3.5, 0.2, 3.0):
            parts.append(kutu("kayis", 0.12 * S, 2.38 * S, 1.6 * S, xx * S, 0, 1.4 * S, M["kirmizi"]))
    for p in parts:
        p.parent = kok
    return kok


def sahne_tir():
    yol_w = 34
    kutu("yol", yol_w * S, 7.5 * S, 0.2 * S, 0, 0, 0, M["karton"])
    for i in range(int(yol_w / 2.2)):
        kutu("yol_tire", 1.2 * S, 0.12 * S, 0.00006, -yol_w * S / 2 + (i + 0.5) * 2.2 * S, 0, 0.2 * S, M["beyaz"])
    tir(0.02, -1.8 * S, 0.2 * S, 0.0)
    # roadside cork plots and trees
    arsa(14, 10, -0.1, 4.2 * S, serit=False)
    for (ax, ay) in [(-0.085, 0.07), (0.07, 0.085), (0.12, 0.06)]:
        agac(ax, ay, 0.45 * S if ax < 0.05 else 0, 1.0)
    cetvel(-0.02, -0.12, 0.3, 0.0)
    hedef = Vector((0.02, -0.01, 0.015))
    kamera(hedef + Vector((-0.22, -0.4, 0.2)), hedef, lens=55, fstop=3.2)
    isik(hedef, 60)


def vinc(x, y, z, aci=0.0, boom_aci=48.0, boom_boy=16.0):
    kok = bpy.data.objects.new("vinc", None)
    sc.collection.objects.link(kok)
    kok.location = (x, y, z)
    kok.rotation_euler = (0, 0, aci)
    p = []
    p.append(kutu("arac", 9 * S, 2.6 * S, 1.6 * S, 0, 0, 0.6 * S, M["vinc"], pah=0.0004))
    p.append(kutu("kabin", 2 * S, 2.5 * S, 1.6 * S, 3.6 * S, 0, 2.2 * S, M["vinc"], pah=0.0003))
    p.append(kutu("cam", 0.05 * S, 2.0 * S, 0.9 * S, 4.61 * S, 0, 2.6 * S, M["cam"]))
    for xx in (3.2, 1.6, -1.6, -3.2):
        for yy in (-1.2, 1.2):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.55 * S, depth=0.4 * S, location=(xx * S, yy * S, 0.55 * S), rotation=(math.radians(90), 0, 0))
            t = bpy.context.active_object
            t.data.materials.append(M["teker"])
            p.append(t)
    # outriggers
    for yy in (-1, 1):
        for xx in (-3.8, 3.0):
            p.append(kutu("ayak", 0.3 * S, 2.2 * S, 0.25 * S, xx * S, yy * 2.1 * S, 0.0, M["koyu"]))
            p.append(kutu("taban", 0.8 * S, 0.8 * S, 0.12 * S, xx * S, yy * 3.1 * S, 0.0, M["koyu"]))
    # turret and boom
    tor = kutu("tur", 2.6 * S, 2.4 * S, 1.2 * S, -1.6 * S, 0, 2.2 * S, M["vinc"], pah=0.0003)
    p.append(tor)
    boom = kutu("bom", boom_boy * S, 0.9 * S, 0.9 * S, 0, 0, 0, M["koyu"], pah=0.0002)
    boom.location = (-1.6 * S, 0, 3.0 * S)
    boom.rotation_euler = (0, -math.radians(boom_aci), 0)
    # pivot the boom at its end: shift the mesh so its base sits at the origin
    for v in boom.data.vertices:
        v.co.x += boom_boy * S / 2
    p.append(boom)
    uc = Vector((-1.6 * S, 0, 3.0 * S)) + Vector((math.cos(math.radians(boom_aci)) * boom_boy * S, 0, math.sin(math.radians(boom_aci)) * boom_boy * S))
    for q in p:
        q.parent = kok
    return kok, uc


def sahne_kurulum(yakin=False):
    """assembly day: walls up on the raft, one roof slope on, the other waiting on the ground"""
    m = MODELLER["sofa"]
    W, D = 21, 17.5
    x0, y0 = -W * S / 2, -D * S / 2 + 0.02
    k = arsa(W, D, x0, y0)
    yol(W, x0, y0)
    hx = x0 + W * S / 2
    hy = y0 + 6 * S + m["d"] * S / 2
    kutu("temel", (m["w"] + 0.6) * S, (m["d"] + 0.6) * S, 0.35 * S, hx, hy, k, M["beton"], pah=0.0002)
    z = k + 0.35 * S
    ev(m, hx, hy, z, 0.0, "yarim", parca=1.0)
    for o in list(sc.objects):
        if o.name.startswith("yarim_cati"):
            bpy.data.objects.remove(o, do_unlink=True)
    w, d, h, r = m["w"] * S, m["d"] * S, m["sacak"] * S, m["mahya"] * S
    egim = math.atan2(r - h, d / 2)
    yari = (d / 2 + 0.25 * S) / math.cos(egim)
    t = 0.2 * S
    # back slope, in place
    arka = kutu("cati_arka", w + 0.5 * S, yari, t, 0, 0, 0, M["kobalt_cati"], pah=0.0002)
    for v in arka.data.vertices:
        v.co.y += yari / 2
    # pivot along the ridge line: from the ridge down towards the back eave
    arka.location = (hx, hy, z + r)
    arka.rotation_euler = (-egim, 0, 0)
    # the two gable ends go up before the roof
    for xs in (-1, 1):
        g = prizma("ucgen_duvar", 0.18 * S, d, r - h, hx + xs * (w / 2 - 0.09 * S), hy, z + h, M["kobalt"], "x")
    # front slope waits on the ground beside the house, on two timber blocks
    for xx in (-4.0, 4.0):
        kutu("takoz", 0.4 * S, 3.0 * S, 0.3 * S, hx + xx * S, hy - d / 2 - 3.6 * S, k, M["govde"])
    kutu("cati_on_yerde", w + 0.5 * S, yari, t, hx, hy - d / 2 - 3.6 * S, k + 0.3 * S, M["kobalt_cati"], pah=0.0002)
    # a small stack of gable panels
    for i in range(3):
        panel(f"ucgen{i}", 6.5, 1.4, x0 + 3.2 * S, y0 + D * S - 3.0 * S, k + i * 0.2 * S, math.radians(random.uniform(-2, 2)))
    for (ax, ay) in [(1.9, D - 1.9), (W - 1.9, D - 2.4), (W - 1.7, 2.8)]:
        agac(x0 + ax * S, y0 + ay * S, k, 1.0)
    cetvel(x0 - 0.045, y0 + 0.02, 0.3, math.radians(78))
    hedef = Vector((hx, hy - 0.01, 0.02))
    if yakin:
        # close, from the front right: the roof slope waiting on its blocks in front
        kamera(hedef + Vector((0.5, -0.75, 0.42)).normalized() * 0.3, hedef + Vector((0.0, -0.03, 0.0)), lens=50, fstop=2.8)
    else:
        kamera(hedef + Vector((-0.55, -0.82, 0.62)).normalized() * 0.5, hedef, lens=55, fstop=3.5)
    isik(hedef, 60)


malzemeler()
zemin()
if SAHNE == "raf":
    sahne_raf()
elif SAHNE.startswith("model:"):
    sahne_model(SAHNE.split(":")[1])
elif SAHNE == "panel":
    sahne_panel()
elif SAHNE == "tir":
    sahne_tir()
elif SAHNE == "kurulum":
    sahne_kurulum()
elif SAHNE == "kurulum-yakin":
    sahne_kurulum(yakin=True)
ayarlar()
sc.render.filepath = CIKTI
print("RENDER", SAHNE, CIKTI, GEN, YUK, ORNEK)
bpy.ops.render.render(write_still=True)
print("DONE", CIKTI)
