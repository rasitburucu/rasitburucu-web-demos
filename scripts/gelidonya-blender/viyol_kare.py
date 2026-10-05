# Gelidonya: the seedling tray of the order form, rendered top-down so the
# canvas on the site can fill it cell by cell in the same light as the
# greenhouse render (sun from the upper left, warm, soft shadow).
#
#   blender -b --factory-startup -P viyol_kare.py -- <out folder> [samples]
#
# Writes (PNG with alpha):
#   viyol-45-bos.png, viyol-45-torf.png   9 x 5 tray: empty cells / every cell peat-filled
#   viyol-28-bos.png, viyol-28-torf.png   7 x 4 tray
#   fide-<kind>.png                       sprite sheet, 4 x 2 seedlings of one crop at
#                                         cotyledon + first true leaf stage, with their
#                                         shadow on the peat (shadow catcher)
#   viyol-kare.json                       pixel geometry for the canvas
import bpy, bmesh, math, random, sys, json, os
from mathutils import Vector, Matrix, noise

PPM = 2200.0           # pixels per metre, same for every image
PAD = 0.045            # margin round the tray for its shadow (m)
TRAYS = {45: (9, 5, 0.059), 28: (7, 4, 0.0758)}
DEPTH = 0.055
KINDS = {"domates": 45, "biber": 45, "patlican": 45, "hiyar": 45, "karpuz": 28, "kavun": 28}

def clear():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o)

def principled(name, color, rough=0.5, **kw):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    p = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    for k, v in kw.items():
        s = p.inputs.get(k)
        if s is not None:
            s.default_value = v
    return m

def peat_material():
    m = bpy.data.materials.get("GD_TorfK") or bpy.data.materials.new("GD_TorfK")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    p = N.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.92
    tc = N.new("ShaderNodeTexCoord")
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 140
    nz.inputs["Detail"].default_value = 10
    nz.inputs["Roughness"].default_value = 0.7
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    e = ramp.color_ramp.elements
    e[0].position, e[0].color = 0.3, (0.012, 0.0075, 0.005, 1)
    e[1].position, e[1].color = 0.72, (0.06, 0.037, 0.021, 1)
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    # fine crumbs and a few lighter sphagnum fibres
    fine = N.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 900
    fine.inputs["Detail"].default_value = 4
    L.new(tc.outputs["Object"], fine.inputs["Vector"])
    fr = N.new("ShaderNodeValToRGB")
    fe = fr.color_ramp.elements
    fe[0].position, fe[0].color = 0.62, (1, 1, 1, 1)
    fe[1].position, fe[1].color = 0.7, (1.9, 1.7, 1.5, 1)
    L.new(fine.outputs["Fac"], fr.inputs["Fac"])
    mul = N.new("ShaderNodeMix"); mul.data_type = "RGBA"; mul.blend_type = "MULTIPLY"
    mul.inputs["Factor"].default_value = 1.0
    L.new(ramp.outputs["Color"], mul.inputs[6])
    L.new(fr.outputs["Color"], mul.inputs[7])
    L.new(next(o for o in mul.outputs if o.enabled and o.type == "RGBA"), p.inputs["Base Color"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.7
    L.new(nz.outputs["Fac"], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], p.inputs["Normal"])
    L.new(p.outputs[0], out.inputs["Surface"])
    return m

def leaf_mat(name, a, b, sheen=0.0, vein=(0.6, 0.75, 0.45)):
    """Seedling leaf: colour varies over the blade (a -> b), pale midrib and
    veins, translucent, a little wax sheen."""
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    p = N.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.45
    p.inputs["Specular IOR Level"].default_value = 0.5
    if sheen:
        p.inputs["Sheen Weight"].default_value = sheen
    tc = N.new("ShaderNodeTexCoord")
    at = N.new("ShaderNodeAttribute"); at.attribute_name = "uvt"; at.attribute_type = "GEOMETRY"
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(at.outputs["Vector"], sep.inputs[0])
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 260
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    e = ramp.color_ramp.elements
    e[0].position, e[0].color = 0.25, (*a, 1)
    e[1].position, e[1].color = 0.75, (*b, 1)
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    # midrib: |v| small (v = across the blade, -1..1)
    absv = N.new("ShaderNodeMath"); absv.operation = "ABSOLUTE"
    L.new(sep.outputs["Y"], absv.inputs[0])
    rib = N.new("ShaderNodeMapRange")
    rib.inputs["From Min"].default_value = 0.07
    rib.inputs["From Max"].default_value = 0.0
    L.new(absv.outputs[0], rib.inputs["Value"])
    # side veins: bands slanting from the midrib towards the tip
    sv = N.new("ShaderNodeMath"); sv.operation = "MULTIPLY_ADD"
    L.new(absv.outputs[0], sv.inputs[0]); sv.inputs[1].default_value = -0.55
    L.new(sep.outputs["X"], sv.inputs[2])
    sn = N.new("ShaderNodeMath"); sn.operation = "SINE"
    sm = N.new("ShaderNodeMath"); sm.operation = "MULTIPLY"; sm.inputs[1].default_value = 34.0
    L.new(sv.outputs[0], sm.inputs[0]); L.new(sm.outputs[0], sn.inputs[0])
    sp = N.new("ShaderNodeMath"); sp.operation = "POWER"; sp.inputs[1].default_value = 24.0
    sa = N.new("ShaderNodeMath"); sa.operation = "ABSOLUTE"
    L.new(sn.outputs[0], sa.inputs[0]); L.new(sa.outputs[0], sp.inputs[0])
    veins = N.new("ShaderNodeMath"); veins.operation = "MAXIMUM"
    L.new(rib.outputs["Result"], veins.inputs[0])
    vs = N.new("ShaderNodeMath"); vs.operation = "MULTIPLY"
    vz = N.new("ShaderNodeMath"); vz.operation = "MULTIPLY"; vz.inputs[1].default_value = 0.4
    L.new(sep.outputs["Z"], vz.inputs[0])   # side-vein strength per vertex (palmate blades: weak)
    L.new(sp.outputs[0], vs.inputs[0]); L.new(vz.outputs[0], vs.inputs[1]); L.new(vs.outputs[0], veins.inputs[1])
    mix = N.new("ShaderNodeMix"); mix.data_type = "RGBA"
    L.new(veins.outputs[0], mix.inputs["Factor"])
    L.new(ramp.outputs["Color"], mix.inputs[6])
    mix.inputs[7].default_value = (*vein, 1)
    col = next(o for o in mix.outputs if o.enabled and o.type == "RGBA")
    L.new(col, p.inputs["Base Color"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    L.new(veins.outputs[0], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], p.inputs["Normal"])
    tl = N.new("ShaderNodeBsdfTranslucent")
    L.new(col, tl.inputs["Color"])
    ms = N.new("ShaderNodeMixShader")
    ms.inputs["Fac"].default_value = 0.22
    L.new(p.outputs[0], ms.inputs[1])
    L.new(tl.outputs[0], ms.inputs[2])
    L.new(ms.outputs[0], out.inputs["Surface"])
    return m

# ---------------------------------------------------------------- tray

def tray(cells, peat):
    cols, rows, cell = TRAYS[cells]
    W, D = cols * cell + 0.014, rows * cell + 0.014
    bm = bmesh.new()
    def box(c, s):
        bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation(c) @ Matrix.Diagonal((*s, 1)))
    # rounded-ish rim and the thin cell walls (tapered cells read as walls from above)
    for sx in (-1, 1):
        box((sx * (W / 2 - 0.004), 0, DEPTH - 0.003), (0.012, D, 0.006))
    for sy in (-1, 1):
        box((0, sy * (D / 2 - 0.004), DEPTH - 0.003), (W, 0.012, 0.006))
    for i in range(cols + 1):
        box((-cols * cell / 2 + i * cell, 0, DEPTH / 2), (0.0028, rows * cell, DEPTH))
    for j in range(rows + 1):
        box((0, -rows * cell / 2 + j * cell, DEPTH / 2), (cols * cell, 0.0028, DEPTH))
    # cell floor with a drain hole look: floor slightly below
    box((0, 0, 0.003), (cols * cell, rows * cell, 0.006))
    me = bpy.data.meshes.new(f"GD_Viyol{cells}")
    bm.to_mesh(me)
    bm.free()
    me.materials.append(principled("GD_ViyolPS", (0.004, 0.004, 0.0045), 0.5, **{"Specular IOR Level": 0.3}))
    o = bpy.data.objects.new(me.name, me)
    bpy.context.scene.collection.objects.link(o)
    if peat:
        rnd = random.Random(cells)
        bp = bmesh.new()
        grains = bmesh.new()
        for i in range(cols):
            for j in range(rows):
                cx = -cols * cell / 2 + (i + 0.5) * cell
                cy = -rows * cell / 2 + (j + 0.5) * cell
                peat_plug(bp, grains, Vector((cx, cy, DEPTH - 0.007)), cell - 0.003, rnd)
        for name, b, m in (("GD_Torf", bp, peat_material()), ("GD_Perlit", grains, principled("GD_PerlitK", (0.82, 0.81, 0.77), 0.6))):
            me = bpy.data.meshes.new(name)
            b.to_mesh(me)
            b.free()
            me.materials.append(m)
            for poly in me.polygons:
                poly.use_smooth = True
            ob = bpy.data.objects.new(name, me)
            bpy.context.scene.collection.objects.link(ob)
    return W, D

def peat_plug(bp, grains, c, s, rnd):
    """Peat surface of one cell: a little domed and lumpy, perlite grains on top."""
    n = 10
    vs = []
    seed = rnd.random() * 50
    for j in range(n + 1):
        row = []
        for i in range(n + 1):
            u, v = i / n - 0.5, j / n - 0.5
            dome = 0.004 * (1 - (2 * u) ** 2) * (1 - (2 * v) ** 2)
            lump = 0.0018 * noise.noise(Vector((u * 9 + seed, v * 9, 0.5)))
            row.append(bp.verts.new(c + Vector((u * s, v * s, dome + lump))))
        vs.append(row)
    for j in range(n):
        for i in range(n):
            bp.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
    for k in range(rnd.randint(9, 16)):
        u, v = rnd.uniform(-0.42, 0.42), rnd.uniform(-0.42, 0.42)
        r = rnd.uniform(0.0009, 0.0018)
        z = 0.004 * (1 - (2 * u) ** 2) * (1 - (2 * v) ** 2)
        bmesh.ops.create_icosphere(grains, subdivisions=1, radius=r,
                                   matrix=Matrix.Translation(c + Vector((u * s, v * s, z + r * 0.4))) @ Matrix.Diagonal((1, rnd.uniform(0.7, 1.1), 0.7, 1)))

# ---------------------------------------------------------------- seedlings

def blade(bm, M, L, wfun, cup=0.25, droop=0.2, segs=18, across=6, uvt=None):
    """Leaf blade along +X from the base: half-width wfun(t) (t 0..1 along the
    midrib); edges curl up (cup), the tip droops. Records (t, v) per vertex."""
    rows = []
    for i in range(segs + 1):
        t = i / segs
        w = wfun(t) * L
        row = []
        for k in range(across + 1):
            v = -1 + 2 * k / across
            z = cup * w * v * v - droop * L * t * t
            p = M @ Vector((t * L, v * w, z))
            vert = bm.verts.new(p)
            row.append(vert)
            if uvt is not None:
                vert[uvt] = (t, v, 1)
        rows.append(row)
    for i in range(segs):
        for k in range(across):
            try:
                bm.faces.new((rows[i][k], rows[i + 1][k], rows[i + 1][k + 1], rows[i][k + 1]))
            except ValueError:
                pass

def palm(bm, M, R, rfun, cup=0.2, rings=10, spokes=36, uvt=None):
    """Palmate blade around the petiole point (origin), radius rfun(a) * R for
    angle a in -pi..pi (0 = forward); centre slightly sunk, rim lifted."""
    centre = bm.verts.new(M @ Vector((0, 0, 0)))
    if uvt is not None:
        centre[uvt] = (0, 0, 0.15)
    ringv = []
    for r_ in range(1, rings + 1):
        f = r_ / rings
        ring = []
        for s in range(spokes):
            a = -math.pi + 2 * math.pi * s / spokes
            rr = rfun(a) * R * f
            z = cup * R * f * f - 0.0
            vert = bm.verts.new(M @ Vector((math.cos(a) * rr, math.sin(a) * rr, z)))
            ring.append(vert)
            if uvt is not None:
                # 'across' value small along the five main veins
                vein = min(abs(((a / (2 * math.pi / 5)) + 0.5) % 1 - 0.5) * 2, 1.0)
                vert[uvt] = (f * 0.35, vein * 0.5 + 0.04, 0.15)
        ringv.append(ring)
    for s in range(spokes):
        bm.faces.new((centre, ringv[0][s], ringv[0][(s + 1) % spokes]))
    for a_, b_ in zip(ringv, ringv[1:]):
        for s in range(spokes):
            bm.faces.new((a_[s], b_[s], b_[(s + 1) % spokes], a_[(s + 1) % spokes]))

def stem(bm, a, b, r):
    d = b - a
    rot = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r, radius2=r * 0.8, depth=d.length,
                          matrix=Matrix.Translation((a + b) / 2) @ rot)

lance = lambda t: 0.2 * math.sin(math.pi * min(1, t * 0.95 + 0.05)) ** 0.9 * (1 - 0.3 * t)
oval = lambda t: 0.36 * math.sin(math.pi * min(1, t * 0.97 + 0.03)) ** 0.7
ovate = lambda t: 0.36 * math.sin(math.pi * min(1, t * 0.95 + 0.05)) ** 0.75 * (1 - 0.35 * t)

def seedling(kind, c, rnd, parts):
    """One seedling at peat point c. parts: dict of bmesh per material."""
    a0 = rnd.uniform(0, math.tau)
    lean = Vector((rnd.uniform(-0.003, 0.003), rnd.uniform(-0.003, 0.003), 0))
    big = kind in ("hiyar", "karpuz", "kavun")
    h = rnd.uniform(0.026, 0.036) if not big else rnd.uniform(0.03, 0.04)
    top = c + Vector((0, 0, h)) + lean
    stem(parts["stem"], c, top, 0.0017 if not big else 0.0024)
    uv_c, uv_l = parts["uv_cot"], parts["uv_leaf"]
    # cotyledons
    cl = {"domates": 0.024, "biber": 0.022, "patlican": 0.021, "hiyar": 0.03, "karpuz": 0.022, "kavun": 0.025}[kind]
    cw = {"domates": lance, "biber": lance, "patlican": lambda t: 0.27 * math.sin(math.pi * min(1, t * 0.96 + 0.04)) ** 0.8,
          "hiyar": oval, "karpuz": oval, "kavun": oval}[kind]
    for s in (0, math.pi):
        M = Matrix.Translation(top - Vector((0, 0, 0.003))) @ Matrix.Rotation(a0 + s + rnd.uniform(-0.15, 0.15), 4, "Z") @ Matrix.Rotation(math.radians(-rnd.uniform(8, 20)), 4, "Y")
        blade(parts["cot"], M, cl * rnd.uniform(0.9, 1.1) * (1.25 if kind == "domates" else 1.0), cw, cup=0.3, droop=0.12, segs=14, across=6, uvt=uv_c)
    # first true leaf (one or two), across the cotyledons
    n_true = 1 if big else 2
    for k in range(n_true):
        s = math.pi / 2 + k * math.pi + rnd.uniform(-0.35, 0.35)
        base = top + Vector((0, 0, 0.002))
        lift = math.radians(-rnd.uniform(18, 35))
        scale = rnd.uniform(0.85, 1.12) * (1.0 if k == 0 else 0.5)
        M = Matrix.Translation(base) @ Matrix.Rotation(a0 + s, 4, "Z") @ Matrix.Rotation(lift, 4, "Y")
        if kind == "domates":
            # small compound leaf: terminal leaflet + 2 pairs of leaflets
            Lr = 0.04 * scale
            stem(parts["stem"], base, M @ Vector((Lr * 0.85, 0, -0.002)), 0.0009)
            for t, sz in ((0.35, 0.42), (0.62, 0.5)):
                for side in (1, -1):
                    Ml = M @ Matrix.Translation((Lr * t, 0, -0.001)) @ Matrix.Rotation(side * math.radians(rnd.uniform(50, 70)), 4, "Z")
                    blade(parts["leaf"], Ml, Lr * sz, lambda u: 0.34 * math.sin(math.pi * min(1, u * 0.95 + 0.05)) ** 0.8 * (1 + 0.12 * math.sin(u * 28) * (1 - u)),
                          cup=0.35, droop=0.25, segs=12, across=6, uvt=uv_l)
            Mt = M @ Matrix.Translation((Lr * 0.82, 0, -0.002))
            blade(parts["leaf"], Mt, Lr * 0.55, lambda u: 0.36 * math.sin(math.pi * min(1, u * 0.95 + 0.05)) ** 0.8 * (1 + 0.12 * math.sin(u * 30) * (1 - u)),
                  cup=0.35, droop=0.25, segs=14, across=6, uvt=uv_l)
        elif kind == "biber":
            blade(parts["leaf"], M, 0.042 * scale, lambda u: 0.27 * math.sin(math.pi * min(1, u * 0.93 + 0.07)) ** 0.8 * (1 - 0.3 * u),
                  cup=0.25, droop=0.18, uvt=uv_l)
        elif kind == "patlican":
            blade(parts["leaf"], M, 0.038 * scale, lambda u: 0.4 * math.sin(math.pi * min(1, u * 0.93 + 0.07)) ** 0.7 * (1 - 0.25 * u) * (1 + 0.08 * math.sin(u * 16)),
                  cup=0.3, droop=0.22, uvt=uv_l)
        else:
            R = {"hiyar": 0.026, "karpuz": 0.024, "kavun": 0.024}[kind] * scale
            if kind == "hiyar":      # shallow five-pointed, heart base
                rf = lambda a: (0.86 + 0.14 * math.cos(5 * a)) * (1 - 0.45 * max(0.0, abs(a) - 2.55) / 0.6) * (1.0 + 0.2 * math.cos(a))
            elif kind == "karpuz":   # deeply cut, pinnately lobed
                rf = lambda a: (0.26 + 0.74 * abs(math.cos(2.5 * a)) ** 0.45 * (0.85 + 0.15 * math.cos(7.5 * a))) * (1 - 0.5 * max(0.0, abs(a) - 2.5) / 0.65) * (1.0 + 0.3 * math.cos(a))
            else:                    # kavun: round, kidney base, faint lobes
                rf = lambda a: (0.93 + 0.07 * math.cos(5 * a)) * (1 - 0.4 * max(0.0, abs(a) - 2.7) / 0.45) * (1.0 + 0.12 * math.cos(a))
            pet = M @ Vector((0.006, 0, 0.002))
            stem(parts["stem"], base, pet, 0.0012)
            Mp = Matrix.Translation(pet) @ Matrix.Rotation(a0 + s, 4, "Z") @ Matrix.Rotation(lift * 0.6, 4, "Y") @ Matrix.Translation((R * 0.75, 0, 0))
            palm(parts["leaf"], Mp, R, rf, cup=0.18, uvt=uv_l)

LEAF_COLOURS = {
    # cotyledon a, b; true leaf a, b; vein; sheen
    "domates":  ((0.07, 0.17, 0.03), (0.12, 0.25, 0.05), (0.03, 0.1, 0.018), (0.07, 0.17, 0.03), (0.35, 0.5, 0.22), 0.4),
    "biber":    ((0.06, 0.16, 0.03), (0.1, 0.22, 0.04), (0.02, 0.09, 0.015), (0.045, 0.14, 0.022), (0.3, 0.45, 0.18), 0.0),
    "patlican": ((0.06, 0.13, 0.04), (0.1, 0.19, 0.06), (0.04, 0.085, 0.035), (0.075, 0.13, 0.06), (0.16, 0.16, 0.13), 0.6),
    "hiyar":    ((0.08, 0.2, 0.04), (0.13, 0.28, 0.06), (0.035, 0.11, 0.02), (0.07, 0.17, 0.035), (0.4, 0.55, 0.25), 0.5),
    "karpuz":   ((0.07, 0.17, 0.035), (0.11, 0.24, 0.05), (0.03, 0.09, 0.02), (0.06, 0.14, 0.03), (0.42, 0.52, 0.3), 0.3),
    "kavun":    ((0.08, 0.19, 0.04), (0.12, 0.26, 0.055), (0.04, 0.11, 0.025), (0.08, 0.17, 0.04), (0.4, 0.55, 0.25), 0.5),
}

def seedling_sheet(kind, cell):
    """4 x 2 seedlings, each in a 2-cell square, on a peat-height shadow catcher."""
    rnd = random.Random(sum(map(ord, kind)))
    step = cell * 2
    parts = {k: bmesh.new() for k in ("cot", "leaf", "stem")}
    # per-vertex (along, across) for the vein shader; layer made before any vertex
    parts["uv_cot"] = parts["cot"].verts.layers.float_vector.new("uvt")
    parts["uv_leaf"] = parts["leaf"].verts.layers.float_vector.new("uvt")
    for i in range(4):
        for j in range(2):
            c = Vector(((i - 1.5) * step, (0.5 - j) * step, 0.0))
            seedling(kind, c, rnd, parts)
    ca, cb, la, lb, vein, sheen = LEAF_COLOURS[kind]
    mats = {"cot": leaf_mat(f"GD_Kot_{kind}", ca, cb, sheen * 0.5, vein), "leaf": leaf_mat(f"GD_Yap_{kind}", la, lb, sheen, vein),
            "stem": principled(f"GD_Gov_{kind}", (0.3, 0.12, 0.2) if kind == "patlican" else (0.14, 0.24, 0.07), 0.55, **{"Sheen Weight": 0.6})}
    for key in ("cot", "leaf", "stem"):
        bm = parts[key]
        me = bpy.data.meshes.new(f"GD_{key}_{kind}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(mats[key])
        for p in me.polygons:
            p.use_smooth = True
        o = bpy.data.objects.new(me.name, me)
        bpy.context.scene.collection.objects.link(o)
    # shadow catcher at peat height
    me = bpy.data.meshes.new("GD_Golge")
    me.from_pydata([(-3, -3, -0.0005), (3, -3, -0.0005), (3, 3, -0.0005), (-3, 3, -0.0005)], [], [(0, 1, 2, 3)])
    g = bpy.data.objects.new("GD_Golge", me)
    g.is_shadow_catcher = True
    bpy.context.scene.collection.objects.link(g)
    return 4 * step, 2 * step

def setup(w_m, h_m, samples):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for kind in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = kind
            prefs.get_devices()
            if any(d.type == kind for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == kind
                break
        except TypeError:
            continue
    sc.cycles.device = "GPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.render.resolution_x = round(w_m * PPM)
    sc.render.resolution_y = round(h_m * PPM)
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.view_settings.view_transform = "AgX"
    for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            sc.view_settings.look = look
            break
        except TypeError:
            pass
    sc.view_settings.exposure = -0.3
    cd = bpy.data.cameras.new("GD_Ust")
    cd.type = "ORTHO"
    cd.ortho_scale = max(w_m, h_m)
    cam = bpy.data.objects.new("GD_Ust", cd)
    sc.collection.objects.link(cam)
    cam.location = (0, 0, 1.0)
    sc.camera = cam
    # light: the greenhouse sun, from the upper left of the picture
    w = bpy.data.worlds.new("GD_W")
    sc.world = w
    bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = (0.9, 0.9, 0.86, 1)
    bg.inputs["Strength"].default_value = 0.55
    sun = bpy.data.lights.new("GD_G", "SUN")
    sun.energy = 4.2
    sun.angle = math.radians(9)
    sun.color = (1.0, 0.92, 0.8)
    so = bpy.data.objects.new("GD_G", sun)
    sc.collection.objects.link(so)
    d = Vector((-0.42, 0.48, 1.25)).normalized()
    so.rotation_euler = d.to_track_quat("Z", "Y").to_euler()

def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)

def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out = argv[0]
    samples = int(argv[1]) if len(argv) > 1 else 192
    only = argv[2].split(",") if len(argv) > 2 else None
    os.makedirs(out, exist_ok=True)
    meta = {"ppm": PPM, "pad": PAD, "trays": {}, "sheets": {}}
    for cells, (cols, rows, cell) in TRAYS.items():
        for peat in (False, True):
            name = f"viyol-{cells}-{'torf' if peat else 'bos'}"
            W, D = TRAYS[cells][0] * cell + 0.014, rows * cell + 0.014
            w_m, h_m = W + 2 * PAD, D + 2 * PAD
            meta["trays"][str(cells)] = {
                "w": round(w_m * PPM), "h": round(h_m * PPM), "cols": cols, "rows": rows,
                "cell": cell * PPM, "x0": (w_m / 2 - cols * cell / 2) * PPM, "y0": (h_m / 2 - rows * cell / 2) * PPM,
                "tray": [(w_m - W) / 2 * PPM, (h_m - D) / 2 * PPM, W * PPM, D * PPM],
            }
            if only and name not in only:
                continue
            bpy.ops.wm.read_factory_settings(use_empty=True)
            tray(cells, peat)
            # the bench under the tray catches its shadow
            me = bpy.data.meshes.new("GD_Zemin")
            me.from_pydata([(-3, -3, 0), (3, -3, 0), (3, 3, 0), (-3, 3, 0)], [], [(0, 1, 2, 3)])
            g = bpy.data.objects.new("GD_Zemin", me)
            g.is_shadow_catcher = True
            bpy.context.scene.collection.objects.link(g)
            setup(w_m, h_m, samples)
            render(os.path.join(out, name + ".png"))
    for kind, cells in KINDS.items():
        cell = TRAYS[cells][2]
        name = f"fide-{kind}"
        meta["sheets"][kind] = {"cells": cells, "step": cell * 2 * PPM, "cols": 4, "rows": 2}
        if only and name not in only:
            continue
        bpy.ops.wm.read_factory_settings(use_empty=True)
        w_m, h_m = seedling_sheet(kind, cell)
        setup(w_m, h_m, samples)
        render(os.path.join(out, name + ".png"))
    with open(os.path.join(out, "viyol-kare.json"), "w") as f:
        json.dump(meta, f, indent=1)

main()
