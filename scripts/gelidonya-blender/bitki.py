# Gelidonya: tomato plant builder (Blender 5.2, run inside Blender).
# Builds a few variants of a high-wire greenhouse tomato plant as single
# mesh objects in collection "GD_Bitkiler": stem, compound leaves (lower metre
# stripped, as growers do), trusses of fruit ripening from red at the bottom
# to green at the top. Everything is procedural; no external model.
import bpy, bmesh, math, random
from mathutils import Vector, Matrix, noise

def coll(name, parent=None):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
        (parent or bpy.context.scene.collection).children.link(c)
    return c

def principled(name, color, rough=0.5, **kw):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    nt = m.node_tree
    p = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    for k, v in kw.items():
        s = p.inputs.get(k)
        if s is not None:
            s.default_value = v
    return m

def tone_layer(bm):
    return bm.faces.layers.float.get("ton") or bm.faces.layers.float.new("ton")

def set_tone(bm, faces, value):
    lay = tone_layer(bm)
    for f in faces:
        f[lay] = value

def attr_ramp(nt, stops):
    """Attribute 'ton' (per face) -> colour ramp with the given (pos, rgb) stops."""
    at = nt.nodes.new("ShaderNodeAttribute")
    at.attribute_name = "ton"
    at.attribute_type = "GEOMETRY"
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    els = ramp.color_ramp.elements
    els[0].position, els[0].color = stops[0][0], (*stops[0][1], 1)
    els[1].position, els[1].color = stops[-1][0], (*stops[-1][1], 1)
    for pos, rgb in stops[1:-1]:
        e = els.new(pos)
        e.color = (*rgb, 1)
    nt.links.new(at.outputs["Fac"], ramp.inputs["Fac"])
    return ramp

def fruit_material():
    """One tomato skin, ripeness from the per-face 'ton' attribute:
    0 green, 0.45 breaker (yellow-green blush), 0.7 orange, 1 red."""
    name = "GD_Domates"
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    ramp = attr_ramp(nt, [(0.0, (0.12, 0.26, 0.045)), (0.3, (0.2, 0.32, 0.05)), (0.48, (0.48, 0.36, 0.05)),
                          (0.68, (0.66, 0.16, 0.02)), (0.86, (0.52, 0.04, 0.015)), (1.0, (0.42, 0.02, 0.012))])
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 60
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 0.18
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    nt.links.new(ramp.outputs["Color"], mix.inputs[6])
    nt.links.new(nz.outputs["Color"], mix.inputs[7])
    nt.links.new(next(o for o in mix.outputs if o.enabled and o.type == "RGBA"), p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = 0.16
    for k, v in (("Coat Weight", 0.55), ("Coat Roughness", 0.06), ("Subsurface Weight", 0.25), ("Subsurface Scale", 0.01)):
        sk = p.inputs.get(k)
        if sk is not None:
            sk.default_value = v
    sr = p.inputs.get("Subsurface Radius")
    if sr is not None:
        sr.default_value = (1.0, 0.25, 0.1)
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m

def stem_material():
    """Tomato stem: green with a fine silvery sheen from its hairs."""
    m = principled("GD_Sap", (0.13, 0.24, 0.06), 0.58)
    p = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    for k, v in (("Sheen Weight", 0.8), ("Sheen Roughness", 0.35)):
        sk = p.inputs.get(k)
        if sk is not None:
            sk.default_value = v
    st = p.inputs.get("Sheen Tint")
    if st is not None:
        st.default_value = (0.85, 0.92, 0.75, 1)
    return m

def leaf_material():
    """Leaf: per-leaflet 'ton' attribute 0..0.75 = shades of healthy green,
    0.8..1 = old yellowing lower leaves. Translucent, with fine veins."""
    name = "GD_Yaprak"
    m = bpy.data.materials.get(name)
    if m and m.get("gd_surum") == 2:
        return m
    m = m or bpy.data.materials.new(name)
    m["gd_surum"] = 2
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    tl = nt.nodes.new("ShaderNodeBsdfTranslucent")
    mixs = nt.nodes.new("ShaderNodeMixShader")
    ramp = attr_ramp(nt, [(0.0, (0.018, 0.065, 0.01)), (0.35, (0.035, 0.12, 0.016)), (0.72, (0.075, 0.2, 0.022)),
                          (0.82, (0.12, 0.22, 0.035)), (1.0, (0.3, 0.27, 0.06))])
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 28
    nz.inputs["Detail"].default_value = 6
    mixc = nt.nodes.new("ShaderNodeMix")
    mixc.data_type = "RGBA"
    mixc.blend_type = "OVERLAY"
    mixc.inputs["Factor"].default_value = 0.35
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    # tone of the whole plant: +/-8 % value, a touch of hue (Object Info Random)
    oi = nt.nodes.new("ShaderNodeObjectInfo")
    hsv = nt.nodes.new("ShaderNodeHueSaturation")
    vmap = nt.nodes.new("ShaderNodeMapRange")
    vmap.inputs["To Min"].default_value = 0.92
    vmap.inputs["To Max"].default_value = 1.08
    nt.links.new(oi.outputs["Random"], vmap.inputs["Value"])
    hmap = nt.nodes.new("ShaderNodeMapRange")
    hmap.inputs["To Min"].default_value = 0.485
    hmap.inputs["To Max"].default_value = 0.515
    rnd2 = nt.nodes.new("ShaderNodeMath"); rnd2.operation = "FRACT"
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 7.3
    nt.links.new(oi.outputs["Random"], mul.inputs[0])
    nt.links.new(mul.outputs[0], rnd2.inputs[0])
    nt.links.new(rnd2.outputs[0], hmap.inputs["Value"])
    nt.links.new(hmap.outputs["Result"], hsv.inputs["Hue"])
    nt.links.new(vmap.outputs["Result"], hsv.inputs["Value"])
    nt.links.new(ramp.outputs["Color"], hsv.inputs["Color"])
    nt.links.new(hsv.outputs["Color"], mixc.inputs[6])
    nt.links.new(nz.outputs["Color"], mixc.inputs[7])
    col = next(o for o in mixc.outputs if o.enabled and o.type == "RGBA")
    nt.links.new(col, p.inputs["Base Color"])
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.inputs["Scale"].default_value = 90
    wv.inputs["Distortion"].default_value = 3
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    nt.links.new(tc.outputs["Object"], wv.inputs["Vector"])
    nt.links.new(wv.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    p.inputs["Roughness"].default_value = 0.42
    sk = p.inputs.get("Specular IOR Level")
    if sk is not None:
        sk.default_value = 0.45
    hs = nt.nodes.new("ShaderNodeHueSaturation")
    hs.inputs["Value"].default_value = 2.6
    hs.inputs["Hue"].default_value = 0.47
    nt.links.new(col, hs.inputs["Color"])
    nt.links.new(hs.outputs["Color"], tl.inputs["Color"])
    mixs.inputs["Fac"].default_value = 0.3
    nt.links.new(p.outputs[0], mixs.inputs[1])
    nt.links.new(tl.outputs[0], mixs.inputs[2])
    nt.links.new(mixs.outputs[0], out.inputs["Surface"])
    return m

def leaflet(bm, L, W, M, serr=0.3, droop=0.25, fold=0.35, segs=22, twist=0.0):
    """Ovate leaflet along +X with a rounded tip, fine teeth, raised midrib and
    cupped edges, transformed by M. Returns its faces (5 strips across)."""
    rows = []
    faces = []
    across = (-1.0, -0.55, 0.0, 0.55, 1.0)
    for i in range(segs + 1):
        t = i / segs
        x = t * L
        # pointed tip, rounded base, a few irregular lobes and saw teeth
        w = W * (math.sin(math.pi * min(1.0, t * 0.97 + 0.03)) ** 0.8) * (1 - 0.42 * t)
        w *= 1 + 0.22 * math.sin(t * math.pi * 4.0 + 0.6) ** 2 * (1 - t)
        w *= 1 + serr * 0.45 * (abs(math.sin(t * 40.0)) - 0.5)
        z = -droop * (t * t) * L
        tw = twist * t
        row = []
        for u in across:
            # cupped: edges fall away from a raised midrib
            h = fold * W * 0.22 * (1 - abs(u)) - 0.28 * w * u * u
            h += 0.06 * W * math.sin(t * 19.0 + u * 2.3) * abs(u)  # wrinkled lamina
            y = u * w
            row.append(bm.verts.new(M @ Vector((x, y * math.cos(tw) - h * math.sin(tw), z + y * math.sin(tw) + h * math.cos(tw)))))
        rows.append(row)
    for i in range(segs):
        r0, r1 = rows[i], rows[i + 1]
        for j in range(len(across) - 1):
            try:
                faces.append(bm.faces.new((r0[j], r1[j], r1[j + 1], r0[j + 1])))
            except ValueError:
                pass
    return faces

def compound_leaf(bm, L, M, rnd, age=0.0):
    """Tomato compound leaf: rachis with leaflet pairs and a terminal leaflet.
    age 0..1: 1 = old lower leaf, yellowing at the tips."""
    pairs = 6
    shift = rnd.uniform(-0.08, 0.08)   # each leaf a little lighter or darker
    def tone(t):
        base = max(0.0, min(0.72, rnd.uniform(0.0, 0.72) + shift))
        if age > 0:
            base = max(base, min(1.0, 0.72 + age * (0.15 + 0.35 * t) + rnd.uniform(-0.08, 0.08)))
        return base
    for k in range(pairs):
        t = (k + 1) / (pairs + 1.2)
        x = t * L
        z = -0.34 * (t * t) * L
        size = 0.3 * L * (1.1 - 0.35 * t)
        for side in (1, -1):
            ang = side * math.radians(55 + rnd.uniform(-12, 12))
            T = M @ Matrix.Translation((x, 0, z)) @ Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(side * rnd.uniform(-0.55, 0.55), 4, "X")
            sz = size * rnd.uniform(0.75, 1.25)
            fs = leaflet(bm, sz, sz * rnd.uniform(0.34, 0.44), T, droop=rnd.uniform(0.12, 0.35), twist=rnd.uniform(-0.5, 0.5))
            set_tone(bm, fs, tone(t))
            # small intermediate leaflet
            T2 = M @ Matrix.Translation((x - 0.07 * L, 0, z)) @ Matrix.Rotation(side * math.radians(rnd.uniform(60, 85)), 4, "Z")
            fs = leaflet(bm, size * rnd.uniform(0.3, 0.5), size * 0.2, T2, segs=10, twist=rnd.uniform(-0.6, 0.6))
            set_tone(bm, fs, tone(t))
    T = M @ Matrix.Translation((L * 0.9, 0, -0.34 * 0.81 * L)) @ Matrix.Rotation(rnd.uniform(-0.3, 0.3), 4, "Z")
    fs = leaflet(bm, 0.3 * L * rnd.uniform(0.85, 1.15), 0.3 * L * 0.4, T, droop=0.3, twist=rnd.uniform(-0.4, 0.4))
    set_tone(bm, fs, tone(1.0))
    # rachis: thin quad strip
    prev = None
    for i in range(7):
        t = i / 6
        p = M @ Vector((t * L * 0.95, 0, -0.34 * t * t * L))
        a = bm.verts.new(p + Vector((0, 0, 0.004)))
        b = bm.verts.new(p - Vector((0, 0, 0.004)))
        if prev:
            set_tone(bm, [bm.faces.new((prev[0], prev[1], b, a))], 0.4)
        prev = (a, b)

def tube(bm, pts, r):
    """Simple 6-sided tube through points."""
    rings = []
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        u = d.orthogonal().normalized()
        v = d.cross(u)
        ring = [bm.verts.new(p + (u * math.cos(a) + v * math.sin(a)) * r) for a in [k * math.tau / 8 for k in range(8)]]
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for k in range(8):
            bm.faces.new((a[k], a[(k + 1) % 8], b[(k + 1) % 8], b[k]))

def build_plant(seed, height=3.3, strip=1.15):
    rnd = random.Random(seed)
    mesh_parts = {}
    def bmf(key):
        if key not in mesh_parts:
            mesh_parts[key] = bmesh.new()
            tone_layer(mesh_parts[key])  # before any face exists: a new layer invalidates face refs
        return mesh_parts[key]
    # stem with gentle sway
    pts = []
    for i in range(23):
        z = 0.12 + (height - 0.12) * i / 22
        sway = 0.035 * math.sin(z * 2.1 + seed) + 0.02 * math.sin(z * 5.3 + seed * 2)
        pts.append(Vector((sway, 0.02 * math.sin(z * 3 + seed), z)))
    def stem_at(z):
        for a, b in zip(pts, pts[1:]):
            if a.z <= z <= b.z:
                t = (z - a.z) / (b.z - a.z)
                return a.lerp(b, t)
        return pts[-1]
    tube(bmf("stem"), pts, 0.011)
    # support twine from the top of the plant up to the crop wire
    top = pts[-1]
    tube(bmf("twine"), [top, top + Vector((0.01, 0, 0.5)), Vector((top.x * 0.3, 0, 4.25))], 0.0018)
    # leaves above the stripped zone
    z = strip
    flip = rnd.random() < 0.5
    while z < height - 0.05:
        base = stem_at(z)
        # leaves are trained along the row (+/-Y) so the aisle stays open
        flip = not flip
        ang = (math.pi / 2 if flip else -math.pi / 2) + rnd.uniform(-1.05, 1.05)
        # leaf length +/-25 % around 0.58 m, smaller near the growing tip
        L = 0.58 * rnd.uniform(0.75, 1.25) * (0.72 if z > height - 0.4 else 1.0)
        tilt = math.radians(rnd.uniform(4, 30))
        M = Matrix.Translation(base) @ Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(-tilt, 4, "Y")
        age = max(0.0, 1.0 - (z - strip) / 0.32) if rnd.random() < 0.55 else 0.0
        compound_leaf(bmf("leaf"), L, M, rnd, age=age)
        z += rnd.uniform(0.12, 0.17)
    # trusses: ripe below, green above
    tz = 0.5
    k = 0
    while tz < height - 0.6:
        base = stem_at(tz)
        a = rnd.uniform(0, math.tau)
        n = rnd.randint(4, 6)
        bmT = bmf("fruit")
        # the truss: a peduncle leaving the stem, arching out and down, with
        # fruit on short pedicels alternating along it (not each on its own stalk)
        out_dir = Vector((math.cos(a), math.sin(a), 0))
        side_dir = Vector((-math.sin(a), math.cos(a), 0))
        L = rnd.uniform(0.2, 0.26)
        rach = []
        for i in range(9):
            u = i / 8
            rach.append(base + out_dir * (0.03 + L * 0.75 * math.sin(u * 1.35)) + Vector((0, 0, 0.02 - L * 0.8 * u * u)))
        tube(bmf("stem"), rach, 0.0035)
        for f in range(n):
            u = 0.25 + 0.7 * f / max(1, n - 1)
            idx = u * 8
            i0 = min(7, int(idx))
            p = rach[i0].lerp(rach[i0 + 1], idx - i0)
            # trusses ripen from the bottom up and, within a truss, from the stem outwards
            ripe = max(0.0, min(1.0, 1.15 - 0.33 * (k + 0.55 * f / max(1, n - 1)) + rnd.uniform(-0.08, 0.08)))
            # +/-15 % size within the truss, a little more between plants
            r = 0.036 * rnd.uniform(0.85, 1.15) * (0.85 + 0.15 * min(1.0, ripe * 2)) * (1.0 - 0.18 * f / max(1, n - 1))
            sgn = 1 if f % 2 else -1
            c = p + side_dir * sgn * (r * 0.95) + Vector((0, 0, -r * 1.25)) + out_dir * rnd.uniform(-0.01, 0.01)
            ret = bmesh.ops.create_uvsphere(bmT, u_segments=18, v_segments=12, radius=r,
                                            matrix=Matrix.Translation(c) @ Matrix.Rotation(rnd.uniform(-0.3, 0.3), 4, "X") @ Matrix.Diagonal((1.04, 1, 0.84, 1)))
            # not a bead: shallow shoulders (five lobes), a flattened, uneven body
            lobes, ph, sq = rnd.uniform(0.02, 0.05), rnd.uniform(0, math.tau), rnd.uniform(0.9, 1.1)
            for v in ret["verts"]:
                d = v.co - c
                if d.length < 1e-6:
                    continue
                th = math.atan2(d.y, d.x)
                girth = 1 - (d.z / d.length) ** 2
                sc_ = 1 + lobes * math.cos(5 * th + ph) * girth + 0.03 * noise.noise(d * (40 / r) + Vector((ph, 0, 0)))
                v.co = c + Vector((d.x * sc_ * sq, d.y * sc_ / sq, d.z * sc_))
            fs = {fc for v in ret["verts"] for fc in v.link_faces}
            set_tone(bmT, fs, max(0.0, min(1.0, ripe + rnd.uniform(-0.06, 0.06))))
            top = c + Vector((0, 0, r * 0.8))
            tube(bmf("stem"), [p, p.lerp(top, 0.5) + Vector((0, 0, 0.004)), top], 0.0022)
            # calyx: five narrow sepals spread over the shoulder
            for q in range(5):
                ang = q * math.tau / 5 + rnd.uniform(-0.2, 0.2)
                M = Matrix.Translation(top) @ Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(18), 4, "Y")
                fs = leaflet(bmf("calyx"), r * 0.85, r * 0.16, M, serr=0.0, droop=0.6, segs=4)
                set_tone(bmf("calyx"), fs, 0.5)
        tz += rnd.uniform(0.24, 0.3)
        k += 1
    mats = {
        "stem": stem_material(),
        "leaf": leaf_material(),
        "fruit": fruit_material(),
        "twine": principled("GD_Ip", (0.7, 0.68, 0.6), 0.8),
        "calyx": leaf_material(),
    }
    me = bpy.data.meshes.new(f"GD_Bitki_{seed}")
    obj = bpy.data.objects.new(f"GD_Bitki_{seed}", me)
    big = bmesh.new()
    tones = []
    for key, bm in mesh_parts.items():
        idx = list(mats).index(key)
        lay = bm.faces.layers.float.get("ton")
        for f in bm.faces:
            f.material_index = idx
            tones.append(f[lay] if lay else 0.5)
        tmp = bpy.data.meshes.new("_tmp")
        bm.to_mesh(tmp)
        big.from_mesh(tmp)
        bpy.data.meshes.remove(tmp)
        bm.free()
    big.to_mesh(me)
    big.free()
    at = me.attributes.get("ton") or me.attributes.new("ton", "FLOAT", "FACE")
    if len(tones) == len(me.polygons):
        at.data.foreach_set("value", tones)
    else:
        print("tone count mismatch", len(tones), len(me.polygons))
    for m in mats.values():
        me.materials.append(m)
    for p in me.polygons:
        p.use_smooth = True
    return obj

def build_variants(n=6):
    c = coll("GD_Bitkiler")
    for o in list(c.objects):
        bpy.data.objects.remove(o)
    out = []
    for s in range(n):
        o = build_plant(11 + s * 7, height=3.05 + 0.18 * (s % 4), strip=0.8 + 0.14 * (s % 3))
        c.objects.link(o)
        o.location = (s * 1.0, 0, 0)
        out.append(o)
    return out

if __name__ == "__main__":
    build_variants()
