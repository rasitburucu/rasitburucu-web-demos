"""Revak Okulları: procedural stone arcade renders (Blender 5.x, background mode).

Run with a fresh factory scene so nothing in an open Blender session is touched:

  blender -b --factory-startup --python scripts/revak-blender/revak_scene.py -- <mode> <out.png> [samples]

Modes
  face-am / face-pm  one arch face, orthographic, transparent background and hole.
                     Same module as the walk's SVG portal (180 x 192.7 u, 1 u = 2 cm).
  face-walled        the evening face with its opening bricked up (404 page).
  hero               the gallery seen from inside, morning sun through the arches (portrait).
  wide               the same gallery, landscape (campus band + Open Graph crop).
  court-am           from the garden back to the arcade, morning (campus band, campus page).
  court-pm           the garden at the end of the arcade, evening (the walk's open arch).
  court-wide         down the garden walk between cypresses and arcade (campus page).
  wall               a flat ashlar wall swatch, front lit, for the walk's stage.

Everything is modelled here: no downloaded textures, models or HDRIs. Trees are
procedural too: leaf sprays scattered by geometry nodes over lumpy clumps
(cypress, stone pine, oak/hornbeam crowns, shrubs, a wooded ridge).
Optional 4th argument: resolution percentage for quick test renders.
"""

import math
import random
import sys

import bpy
import bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
MODE = argv[0] if argv else "face-am"
OUT = argv[1] if len(argv) > 1 else "//revak.png"
SAMPLES = int(argv[2]) if len(argv) > 2 else 128
PCT = int(argv[3]) if len(argv) > 3 else 100  # resolution percentage (quick test renders)

U = 0.02  # metres per walk unit
W, H = 180 * U, 192.7 * U  # module box 3.6 x 3.854 m
R_IN = 50 * U  # hole radius 1.0
R_OUT = R_IN + 7 * U  # voussoir ring 1.14
SPRING = (192.7 - 76) * U  # springline height 2.334
PLINTH = (192.7 - 184) * U  # base course 0.174
DEPTH = 0.62

random.seed(7)

# ------------------------------------------------------------------ scene


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scn = bpy.context.scene
    try:
        scn.render.engine = "CYCLES"
    except TypeError:
        pass
    scn.cycles.samples = SAMPLES
    scn.cycles.use_denoising = True
    scn.cycles.max_bounces = 6
    # GPU if there is one, CPU otherwise
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for kind in ("OPTIX", "CUDA", "HIP", "ONEAPI"):
            try:
                prefs.compute_device_type = kind
                prefs.get_devices()
                if any(d.type == kind for d in prefs.devices):
                    for d in prefs.devices:
                        d.use = True
                    scn.cycles.device = "GPU"
                    break
            except Exception:
                continue
    except Exception:
        pass
    scn.view_settings.view_transform = "AgX" if "AgX" in [i.identifier for i in scn.view_settings.bl_rna.properties["view_transform"].enum_items] else "Filmic"
    try:
        scn.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass
    scn.view_settings.exposure = -0.75
    return scn


# ------------------------------------------------------------------ materials


def stone_material(name, base_a, base_b, rough=0.86, bump=0.4, scale=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    n = nt.nodes
    l = nt.links
    bsdf = next(x for x in n if x.type == "BSDF_PRINCIPLED")
    tc = n.new("ShaderNodeTexCoord")
    info = n.new("ShaderNodeObjectInfo")

    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 1.6 / scale
    noise.inputs["Detail"].default_value = 9.0
    noise.inputs["Roughness"].default_value = 0.62
    l.new(tc.outputs["Object"], noise.inputs["Vector"])

    # per-block tone shift, so ashlar reads as separate stones
    blk = n.new("ShaderNodeMath")
    blk.operation = "MULTIPLY_ADD"
    blk.inputs[1].default_value = 0.55
    blk.inputs[2].default_value = -0.18
    l.new(info.outputs["Random"], blk.inputs[0])
    mix_f = n.new("ShaderNodeMath")
    mix_f.operation = "ADD"
    l.new(noise.outputs["Fac"], mix_f.inputs[0])
    l.new(blk.outputs[0], mix_f.inputs[1])

    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.40
    ramp.color_ramp.elements[0].color = (*base_b, 1)
    ramp.color_ramp.elements[1].position = 0.66
    ramp.color_ramp.elements[1].color = (*base_a, 1)
    l.new(mix_f.outputs[0], ramp.inputs["Fac"])

    # fine pitting of limestone
    vor = n.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 70 / scale
    l.new(tc.outputs["Object"], vor.inputs["Vector"])
    pit = n.new("ShaderNodeMapRange")
    pit.inputs["From Min"].default_value = 0.0
    pit.inputs["From Max"].default_value = 0.08
    l.new(vor.outputs["Distance"], pit.inputs["Value"])

    darken = n.new("ShaderNodeMix")
    darken.data_type = "RGBA"
    darken.blend_type = "MULTIPLY"
    darken.inputs["Factor"].default_value = 0.18
    l.new(ramp.outputs["Color"], darken.inputs["A"])
    l.new(pit.outputs["Result"], darken.inputs["B"])
    sep = n.new("ShaderNodeSeparateXYZ")
    geo = n.new("ShaderNodeNewGeometry")
    l.new(geo.outputs["Position"], sep.inputs["Vector"])
    gr = n.new("ShaderNodeMapRange")
    gr.inputs["From Min"].default_value = 0.0
    gr.inputs["From Max"].default_value = 1.2
    gr.inputs["To Min"].default_value = 0.72
    gr.inputs["To Max"].default_value = 1.0
    l.new(sep.outputs["Z"], gr.inputs["Value"])
    grime = n.new("ShaderNodeMix")
    grime.data_type = "RGBA"
    grime.blend_type = "MULTIPLY"
    grime.inputs["Factor"].default_value = 1.0
    stain = n.new("ShaderNodeTexNoise")
    stain.inputs["Scale"].default_value = 0.45 / scale
    stain.inputs["Detail"].default_value = 4.0
    l.new(tc.outputs["Object"], stain.inputs["Vector"])
    st_r = n.new("ShaderNodeMapRange")
    st_r.inputs["From Min"].default_value = 0.45
    st_r.inputs["From Max"].default_value = 0.7
    st_r.inputs["To Min"].default_value = 1.0
    st_r.inputs["To Max"].default_value = 0.8
    l.new(stain.outputs["Fac"], st_r.inputs["Value"])
    stained = n.new("ShaderNodeMix")
    stained.data_type = "RGBA"
    stained.blend_type = "MULTIPLY"
    stained.inputs["Factor"].default_value = 1.0
    l.new(darken.outputs["Result"], stained.inputs["A"])
    l.new(st_r.outputs["Result"], stained.inputs["B"])
    l.new(stained.outputs["Result"], grime.inputs["A"])
    l.new(gr.outputs["Result"], grime.inputs["B"])
    # rain streaks: long vertical noise, a little darker where water runs down the face
    stretch = n.new("ShaderNodeMapping")
    stretch.inputs["Scale"].default_value = (1.0, 1.0, 0.12)
    l.new(tc.outputs["Object"], stretch.inputs["Vector"])
    streak = n.new("ShaderNodeTexNoise")
    streak.inputs["Scale"].default_value = 3.0 / scale
    streak.inputs["Detail"].default_value = 3.0
    l.new(stretch.outputs["Vector"], streak.inputs["Vector"])
    st_k = n.new("ShaderNodeMapRange")
    st_k.inputs["From Min"].default_value = 0.5
    st_k.inputs["From Max"].default_value = 0.72
    st_k.inputs["To Min"].default_value = 1.0
    st_k.inputs["To Max"].default_value = 0.88
    l.new(streak.outputs["Fac"], st_k.inputs["Value"])
    streaked = n.new("ShaderNodeMix")
    streaked.data_type = "RGBA"
    streaked.blend_type = "MULTIPLY"
    streaked.inputs["Factor"].default_value = 1.0
    l.new(grime.outputs["Result"], streaked.inputs["A"])
    l.new(st_k.outputs["Result"], streaked.inputs["B"])
    l.new(streaked.outputs["Result"], bsdf.inputs["Base Color"])
    # every block dressed a little differently: some honed, some rough-tooled
    rr = n.new("ShaderNodeMapRange")
    rr.inputs["To Min"].default_value = rough - 0.12
    rr.inputs["To Max"].default_value = min(1.0, rough + 0.08)
    l.new(info.outputs["Random"], rr.inputs["Value"])
    l.new(rr.outputs["Result"], bsdf.inputs["Roughness"])

    fine = n.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 26 / scale
    fine.inputs["Detail"].default_value = 12.0
    l.new(tc.outputs["Object"], fine.inputs["Vector"])
    # medium undulation of a hand-dressed face, stronger on the rougher blocks
    mid = n.new("ShaderNodeTexNoise")
    mid.inputs["Scale"].default_value = 5.0 / scale
    mid.inputs["Detail"].default_value = 4.0
    l.new(tc.outputs["Object"], mid.inputs["Vector"])
    mid_k = n.new("ShaderNodeMath")
    mid_k.operation = "MULTIPLY"
    l.new(mid.outputs["Fac"], mid_k.inputs[0])
    l.new(rr.outputs["Result"], mid_k.inputs[1])
    mid_w = n.new("ShaderNodeMath")
    mid_w.operation = "MULTIPLY"
    mid_w.inputs[1].default_value = 2.2
    l.new(mid_k.outputs[0], mid_w.inputs[0])
    bmp = n.new("ShaderNodeBump")
    bmp.inputs["Strength"].default_value = bump
    bmp.inputs["Distance"].default_value = 0.01
    hmix = n.new("ShaderNodeMath")
    hmix.operation = "ADD"
    l.new(fine.outputs["Fac"], hmix.inputs[0])
    l.new(pit.outputs["Result"], hmix.inputs[1])
    hmix2 = n.new("ShaderNodeMath")
    hmix2.operation = "ADD"
    l.new(hmix.outputs[0], hmix2.inputs[0])
    l.new(mid_w.outputs[0], hmix2.inputs[1])
    l.new(hmix2.outputs[0], bmp.inputs["Height"])
    l.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def flat_material(name, color, rough=0.6, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(x for x in m.node_tree.nodes if x.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*color, 1)
        b.inputs["Emission Strength"].default_value = emit
    return m


def floor_material():
    m = bpy.data.materials.new("Zemin")
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    bsdf = next(x for x in n if x.type == "BSDF_PRINCIPLED")
    tc = n.new("ShaderNodeTexCoord")
    brick = n.new("ShaderNodeTexBrick")
    brick.offset = 0.5
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = 0.006
    brick.inputs["Brick Width"].default_value = 0.62
    brick.inputs["Row Height"].default_value = 0.42
    brick.inputs["Color1"].default_value = (0.60, 0.52, 0.42, 1)
    brick.inputs["Color2"].default_value = (0.47, 0.41, 0.34, 1)
    brick.inputs["Mortar"].default_value = (0.26, 0.23, 0.19, 1)
    l.new(tc.outputs["Object"], brick.inputs["Vector"])
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 2.0
    noise.inputs["Detail"].default_value = 8.0
    l.new(tc.outputs["Object"], noise.inputs["Vector"])
    mix = n.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "OVERLAY"
    mix.inputs["Factor"].default_value = 0.35
    l.new(brick.outputs["Color"], mix.inputs["A"])
    l.new(noise.outputs["Fac"], mix.inputs["B"])
    l.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    # worn slabs: smoother in the walking line
    rr = n.new("ShaderNodeMapRange")
    rr.inputs["To Min"].default_value = 0.32
    rr.inputs["To Max"].default_value = 0.62
    l.new(noise.outputs["Fac"], rr.inputs["Value"])
    l.new(rr.outputs["Result"], bsdf.inputs["Roughness"])
    bmp = n.new("ShaderNodeBump")
    bmp.inputs["Strength"].default_value = 0.35
    bmp.inputs["Distance"].default_value = 0.004
    l.new(brick.outputs["Fac"], bmp.inputs["Height"])
    l.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def gravel_material():
    """Courtyard gravel: pea stones (voronoi cells) with patches worn to packed earth."""
    m = bpy.data.materials.new("Avlu")
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    bsdf = next(x for x in n if x.type == "BSDF_PRINCIPLED")
    tc = n.new("ShaderNodeTexCoord")
    vor = n.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 55.0
    l.new(tc.outputs["Object"], vor.inputs["Vector"])
    patch = n.new("ShaderNodeTexNoise")
    patch.inputs["Scale"].default_value = 0.35
    patch.inputs["Detail"].default_value = 6.0
    l.new(tc.outputs["Object"], patch.inputs["Vector"])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.40, 0.36, 0.30, 1)
    ramp.color_ramp.elements[1].color = (0.70, 0.66, 0.58, 1)
    mixf = n.new("ShaderNodeMath")
    mixf.operation = "MULTIPLY_ADD"
    mixf.inputs[1].default_value = 0.5
    l.new(vor.outputs["Color"], mixf.inputs[0])
    l.new(patch.outputs["Fac"], mixf.inputs[2])
    l.new(mixf.outputs[0], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.93
    bmp = n.new("ShaderNodeBump")
    bmp.inputs["Strength"].default_value = 0.7
    bmp.inputs["Distance"].default_value = 0.01
    inv = n.new("ShaderNodeMath")
    inv.operation = "SUBTRACT"
    inv.inputs[0].default_value = 1.0
    l.new(vor.outputs["Distance"], inv.inputs[1])
    l.new(inv.outputs[0], bmp.inputs["Height"])
    l.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
    return m


# ------------------------------------------------------------------ geometry helpers


def box(name, x0, x1, y0, y1, z0, z1, mat, bevel=0.012):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 + (v.co.x + 0.5) * (x1 - x0)
        v.co.y = y0 + (v.co.y + 0.5) * (y1 - y0)
        v.co.z = z0 + (v.co.z + 0.5) * (z1 - z0)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    if bevel:
        ob.location.y += random.uniform(-0.006, 0.004)  # stones never sit perfectly flush
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = bevel * random.uniform(0.8, 1.6)
        mod.segments = 2
        mod.limit_method = "ANGLE"
    return ob


def wedge(name, r0, r1, a0, a1, y0, y1, cz, mat, bevel=0.01, steps=4):
    """Annular wedge in the XZ plane (arch voussoir), extruded along Y."""
    bm = bmesh.new()
    pts = []
    for i in range(steps + 1):
        a = a0 + (a1 - a0) * i / steps
        pts.append((r1 * math.cos(a), r1 * math.sin(a)))
    for i in range(steps, -1, -1):
        a = a0 + (a1 - a0) * i / steps
        pts.append((r0 * math.cos(a), r0 * math.sin(a)))
    front = [bm.verts.new((x, y0, cz + z)) for x, z in pts]
    back = [bm.verts.new((x, y1, cz + z)) for x, z in pts]
    bm.faces.new(front[::-1])
    bm.faces.new(back)
    n = len(pts)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((front[i], front[j], back[j], back[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    if bevel:
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        mod.limit_method = "ANGLE"
    return ob


def spandrel(name, side, y0, y1, mat):
    """Wall between the voussoir ring and the module edge, above the springline."""
    bm = bmesh.new()
    steps = 24
    x_edge = side * W / 2
    pts = [(x_edge, SPRING), (x_edge, H)]
    if side > 0:
        pts.append((0.0, H))
        for i in range(steps + 1):
            a = math.pi / 2 - (math.pi / 2) * i / steps
            pts.append((R_OUT * math.cos(a), SPRING + R_OUT * math.sin(a)))
    else:
        pts.append((0.0, H))
        for i in range(steps + 1):
            a = math.pi / 2 + (math.pi / 2) * i / steps
            pts.append((R_OUT * math.cos(a), SPRING + R_OUT * math.sin(a)))
    front = [bm.verts.new((x, y0, z)) for x, z in pts]
    back = [bm.verts.new((x, y1, z)) for x, z in pts]
    bm.faces.new(front)
    bm.faces.new(back[::-1])
    n = len(pts)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((front[i], front[j], back[j], back[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    return ob


def arch_module(prefix, stone, stone_dark, y0=0.0, depth=DEPTH):
    """One bay: plinth, coursed piers, imposts, voussoir ring with keystone, spandrels.
    Built in the XZ plane, front face at y0, depth along +Y. Hole centred on x=0."""
    parts = []
    y1 = y0 + depth
    gap = 0.004
    # plinth
    for s in (-1, 1):
        x0, x1 = sorted((s * R_IN, s * W / 2))
        parts.append(box(f"{prefix}plinth{s}", x0, x1, y0 - 0.03, y1 + 0.03, 0, PLINTH, stone_dark, 0.01))
    # coursed piers: 7 courses between plinth and impost
    imp0, imp1 = SPRING - 0.07, SPRING + 0.03
    courses = 7
    ch = (imp0 - PLINTH) / courses
    for s in (-1, 1):
        x0, x1 = sorted((s * R_IN, s * W / 2))
        for c in range(courses):
            z0 = PLINTH + c * ch + gap
            z1 = PLINTH + (c + 1) * ch - gap
            # alternate long and short blocks across the pier face
            if c % 2 == 0:
                parts.append(box(f"{prefix}p{s}{c}", x0 + gap, x1 - gap, y0, y1, z0, z1, stone))
            else:
                xm = x0 + (x1 - x0) * (0.42 if s < 0 else 0.58)
                parts.append(box(f"{prefix}p{s}{c}a", x0 + gap, xm - gap, y0, y1, z0, z1, stone))
                parts.append(box(f"{prefix}p{s}{c}b", xm + gap, x1 - gap, y0, y1, z0, z1, stone))
        # impost moulding (projects 4 cm)
        parts.append(box(f"{prefix}imp{s}", x0 - (0.04 if s > 0 else 0), x1 + (0.04 if s < 0 else 0), y0 - 0.04, y1 + 0.04, imp0, imp1, stone_dark, 0.008))
    # voussoirs: 13 stones, keystone proud by 2.5 cm
    n = 13
    for i in range(n):
        a0 = math.pi * i / n + 0.004
        a1 = math.pi * (i + 1) / n - 0.004
        key = i == n // 2
        r1 = R_OUT + (0.06 if key else 0.0)
        yy0 = y0 - (0.025 if key else 0.008)
        parts.append(wedge(f"{prefix}v{i}", R_IN, r1, a0, a1, yy0, y1, SPRING, stone_dark if key else stone))
    # spandrels
    for s in (-1, 1):
        parts.append(spandrel(f"{prefix}sp{s}", s, y0 + 0.012, y1, stone))
    # mortar backing: fills the joints, never the opening
    mortar = flat_material("Harc", (0.33, 0.29, 0.24), 0.95)
    for s in (-1, 1):
        x0, x1 = sorted((s * R_IN, s * W / 2))
        parts.append(box(f"{prefix}bk{s}", x0, x1, y0 + 0.03, y1 - 0.03, 0, SPRING, mortar, 0))
        parts.append(spandrel(f"{prefix}bks{s}", s, y0 + 0.03, y1 - 0.03, mortar))
    parts.append(wedge(f"{prefix}bkr", R_IN + 0.01, R_OUT + 0.05, 0.0, math.pi, y0 + 0.03, y1 - 0.03, SPRING, mortar, 0, 32))
    # cornice along the top
    parts.append(box(f"{prefix}cor", -W / 2 - 0.001, W / 2 + 0.001, y0 - 0.05, y1 + 0.05, H - 0.16, H, stone_dark, 0.01))
    return parts


def course_lines(prefix, y0, mat_line):
    """Shallow horizontal joints across the spandrels (match the pier coursing)."""
    out = []
    z = SPRING + 0.27
    while z < H - 0.2:
        for s in (-1, 1):
            # stop the joint at the voussoir ring
            dz = z - SPRING
            if dz < R_OUT:
                xr = math.sqrt(max(0.0, R_OUT**2 - dz**2))
            else:
                xr = 0.0
            x0, x1 = sorted((s * (xr + 0.01), s * W / 2))
            if x1 - x0 > 0.05:
                out.append(box(f"{prefix}j{s}{z:.2f}", x0, x1, y0 + 0.006, y0 + 0.014, z - 0.004, z + 0.004, mat_line, 0))
        z += 0.27
    return out


# ------------------------------------------------------------------ lights / camera


def sun(name, rot_deg, energy, color, angle=0.6):
    ld = bpy.data.lights.new(name, "SUN")
    ld.energy = energy
    ld.color = color
    ld.angle = math.radians(angle)
    ob = bpy.data.objects.new(name, ld)
    bpy.context.collection.objects.link(ob)
    ob.rotation_euler = [math.radians(a) for a in rot_deg]
    return ob


def world(color, strength):
    w = bpy.data.worlds.new("W")
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = next(x for x in w.node_tree.nodes if x.type == "BACKGROUND")
    bg.inputs["Color"].default_value = (*color, 1)
    bg.inputs["Strength"].default_value = strength
    return w


def sky_world(sun_elev, sun_rot, strength=0.9):
    w = bpy.data.worlds.new("Sky")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    bg = next(x for x in nt.nodes if x.type == "BACKGROUND")
    try:
        sky = nt.nodes.new("ShaderNodeTexSky")
        types = [i.identifier for i in sky.bl_rna.properties["sky_type"].enum_items]
        for t in ("NISHITA", "MULTIPLE_SCATTERING", "SINGLE_SCATTERING", "HOSEK_WILKIE"):
            if t in types:
                sky.sky_type = t
                break
        try:
            sky.sun_elevation = math.radians(sun_elev)
            sky.sun_rotation = math.radians(sun_rot)
            sky.sun_disc = False
        except Exception:
            pass
        nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    except Exception:
        bg.inputs["Color"].default_value = (0.55, 0.68, 0.85, 1)
    bg.inputs["Strength"].default_value = strength
    return w


def camera(loc, rot_deg, lens=24, ortho=None):
    cd = bpy.data.cameras.new("Cam")
    cd.clip_end = 600.0  # the forest ridge stands ~90 m away
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    else:
        cd.lens = lens
    ob = bpy.data.objects.new("Cam", cd)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot_deg]
    bpy.context.scene.camera = ob
    return ob


def out(res_x, res_y, transparent=False):
    scn = bpy.context.scene
    scn.render.resolution_x = res_x
    scn.render.resolution_y = res_y
    scn.render.resolution_percentage = PCT
    scn.render.film_transparent = transparent
    scn.render.image_settings.file_format = "PNG"
    scn.render.image_settings.color_mode = "RGBA" if transparent else "RGB"
    scn.render.filepath = OUT


# ------------------------------------------------------------------ modes

LIME = (0.92, 0.82, 0.64)
LIME_LO = (0.70, 0.60, 0.45)
LIME_D = (0.80, 0.72, 0.58)
LIME_D_LO = (0.58, 0.50, 0.39)


def wall_up(stone, mortar):
    """Brick the opening up with rougher, recessed rubble ashlar (the 404 page): irregular
    block lengths in staggered courses, clipped to the arch, set 9 cm back from the face."""
    rnd = random.Random(404)
    y0, y1 = 0.09, 0.4
    box("infill_back", -R_IN, R_IN, y0 + 0.03, y1, 0, SPRING + R_IN, mortar, 0)
    z = PLINTH * 0.5
    row = 0
    while z < SPRING + R_IN:
        ch = rnd.uniform(0.19, 0.27)
        zc = z + ch / 2
        dz = zc - SPRING
        half = R_IN if dz <= 0 else math.sqrt(max(0.0, R_IN**2 - min(dz + ch / 2, R_IN) ** 2))
        x = -R_IN - (rnd.uniform(0.1, 0.3) if row % 2 else 0)
        while x < R_IN:
            wdt = rnd.uniform(0.28, 0.52)
            x0, x1 = max(x, -half), min(x + wdt, half)
            if x1 - x0 > 0.06:
                ob = box(f"inf{row}_{x:.2f}", x0 + 0.008, x1 - 0.008, y0 + rnd.uniform(-0.01, 0.015), y1 - 0.05, z + 0.008, z + ch - 0.008, stone, 0.02)
                ob.rotation_euler[1] = rnd.uniform(-0.01, 0.01)
            x += wdt
        z += ch
        row += 1


def build_face(evening, walled=False):
    stone = stone_material("Tas", LIME, LIME_LO)
    stone_d = stone_material("TasKoyu", LIME_D, LIME_D_LO, bump=0.48)
    joint = flat_material("Derz", (0.36, 0.33, 0.29), 0.95)
    arch_module("m_", stone, stone_d, 0.0)
    course_lines("m_", 0.0, joint)
    if walled:
        wall_up(stone_material("TasKaba", LIME_D_LO, (0.45, 0.39, 0.31), rough=0.95, bump=0.9), flat_material("HarcIc", (0.28, 0.25, 0.21), 0.95))
    if evening:
        sun("Gunes", (74, 0, 70), 4.4, (1.0, 0.68, 0.42), 1.0)  # low, from the right
        world((0.42, 0.32, 0.26), 0.55)
    else:
        sun("Gunes", (60, 0, -67), 4.8, (1.0, 0.95, 0.88), 0.8)  # higher, from the left
        world((0.55, 0.62, 0.72), 0.6)
    camera((0, -12, H / 2), (90, 0, 0), ortho=W)
    out(1440, round(1440 * H / W), transparent=True)


def build_wall():
    stone = stone_material("Tas", LIME, LIME_LO, bump=0.22)
    gap = 0.005
    rows = 8
    ch = 0.29
    for r in range(rows):
        z0 = r * ch
        x = -0.6 * (r % 2)
        while x < 4.0:
            wdt = random.choice((0.58, 0.72, 0.86, 0.64))
            box(f"w{r}{x:.2f}", x + gap, x + wdt - gap, 0, 0.3, z0 + gap, z0 + ch - gap, stone, 0.006)
            x += wdt
    joint = flat_material("Derz", (0.42, 0.39, 0.35), 0.95)
    box("back", -1, 5, 0.08, 0.3, -0.2, rows * ch + 0.2, joint, 0)
    sun("Gunes", (70, 0, 35), 3.2, (1.0, 0.97, 0.92), 2.0)
    world((0.62, 0.64, 0.68), 0.7)
    # square tile: 2.32 m wide (4 courses offset pattern repeats every 2 rows)
    camera((1.16 + 0.4, -10, 1.16), (90, 0, 0), ortho=2.32)
    out(1024, 1024)


CYPRESSES = ((-11.0, 11.0), (-10.2, 18.5), (-11.0, 26.0), (-11.4, 3.8), (-10.6, -3.0))


# ------------------------------------------------------------------ vegetation
# Real foliage reads through its silhouette: thousands of small leaf sprays
# instanced over lumpy clumps (geometry nodes), each spray a slightly different
# green, light passing through the thin ones. No cones, no single blobs.


def _sock(sockets, name, kind):
    return next(s for s in sockets if s.name == name and s.type == kind)


def leaf_nodes(name, density, size, stretch, tilt, flat, mat, seed):
    """Geometry nodes: keep the clump mesh, scatter leaf sprays over it."""
    ng = bpy.data.node_groups.new(name, "GeometryNodeTree")
    ng.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    n, l = ng.nodes, ng.links
    gi = n.new("NodeGroupInput")
    go = n.new("NodeGroupOutput")
    dist = n.new("GeometryNodeDistributePointsOnFaces")
    dist.inputs["Density"].default_value = density
    dist.inputs["Seed"].default_value = seed
    l.new(gi.outputs[0], dist.inputs["Mesh"])
    leaf = n.new("GeometryNodeMeshIcoSphere")
    leaf.inputs["Radius"].default_value = size
    leaf.inputs["Subdivisions"].default_value = 1
    inst = n.new("GeometryNodeInstanceOnPoints")
    l.new(dist.outputs["Points"], inst.inputs["Points"])
    l.new(leaf.outputs["Mesh"], inst.inputs["Instance"])
    rot = n.new("FunctionNodeRandomValue")
    rot.data_type = "FLOAT_VECTOR"
    _sock(rot.inputs, "Min", "VECTOR").default_value = (-tilt, -tilt, 0.0)
    _sock(rot.inputs, "Max", "VECTOR").default_value = (tilt, tilt, 6.283)
    _sock(rot.inputs, "Seed", "INT").default_value = seed + 1
    l.new(_sock(rot.outputs, "Value", "VECTOR"), inst.inputs["Rotation"])
    scl = n.new("FunctionNodeRandomValue")
    scl.data_type = "FLOAT_VECTOR"
    _sock(scl.inputs, "Min", "VECTOR").default_value = (0.55, 0.55 * flat, 0.55 * stretch)
    _sock(scl.inputs, "Max", "VECTOR").default_value = (1.25, 1.25 * flat, 1.3 * stretch)
    _sock(scl.inputs, "Seed", "INT").default_value = seed + 2
    l.new(_sock(scl.outputs, "Value", "VECTOR"), inst.inputs["Scale"])
    setm = n.new("GeometryNodeSetMaterial")
    setm.inputs["Material"].default_value = mat
    l.new(inst.outputs["Instances"], setm.inputs["Geometry"])
    join = n.new("GeometryNodeJoinGeometry")
    l.new(setm.outputs[0], join.inputs[0])
    l.new(gi.outputs[0], join.inputs[0])
    l.new(join.outputs[0], go.inputs[0])
    return ng


def leaf_material(name, greens, translucent=0.22):
    """Per-spray colour from Object Info > Random (each instance differs), sun through thin leaves."""
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    out = next(x for x in n if x.type == "OUTPUT_MATERIAL")
    bsdf = next(x for x in n if x.type == "BSDF_PRINCIPLED")
    info = n.new("ShaderNodeObjectInfo")
    tc = n.new("ShaderNodeTexCoord")
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 0.6
    l.new(tc.outputs["Object"], noise.inputs["Vector"])
    mixv = n.new("ShaderNodeMath")
    mixv.operation = "MULTIPLY_ADD"
    mixv.inputs[1].default_value = 0.7
    l.new(info.outputs["Random"], mixv.inputs[0])
    nscl = n.new("ShaderNodeMath")
    nscl.operation = "MULTIPLY"
    nscl.inputs[1].default_value = 0.45
    l.new(noise.outputs["Fac"], nscl.inputs[0])
    l.new(nscl.outputs[0], mixv.inputs[2])
    ramp = n.new("ShaderNodeValToRGB")
    els = ramp.color_ramp.elements
    els[0].position, els[0].color = 0.0, (*greens[0], 1)
    els[1].position, els[1].color = 1.0, (*greens[-1], 1)
    for i, g in enumerate(greens[1:-1], 1):
        e = els.new(i / (len(greens) - 1))
        e.color = (*g, 1)
    l.new(mixv.outputs[0], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.62
    try:
        bsdf.inputs["Specular IOR Level"].default_value = 0.35
    except KeyError:
        pass
    bmp = n.new("ShaderNodeBump")
    vor = n.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 60.0
    l.new(tc.outputs["Object"], vor.inputs["Vector"])
    l.new(vor.outputs["Distance"], bmp.inputs["Height"])
    bmp.inputs["Strength"].default_value = 0.5
    l.new(bmp.outputs["Normal"], bsdf.inputs["Normal"])
    trn = n.new("ShaderNodeBsdfTranslucent")
    l.new(ramp.outputs["Color"], trn.inputs["Color"])
    mix = n.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = translucent
    l.new(bsdf.outputs[0], mix.inputs[1])
    l.new(trn.outputs[0], mix.inputs[2])
    l.new(mix.outputs[0], out.inputs["Surface"])
    return m


CYPRESS_GREENS = [(0.020, 0.040, 0.018), (0.035, 0.065, 0.026), (0.055, 0.085, 0.032), (0.080, 0.105, 0.040), (0.105, 0.118, 0.050)]
BROAD_GREENS = [(0.035, 0.060, 0.020), (0.060, 0.100, 0.030), (0.095, 0.135, 0.040), (0.140, 0.165, 0.055), (0.120, 0.120, 0.045)]
FAR_GREENS = [(0.045, 0.075, 0.050), (0.070, 0.100, 0.065), (0.095, 0.125, 0.080), (0.120, 0.145, 0.095)]
PINE_GREENS = [(0.030, 0.050, 0.025), (0.050, 0.075, 0.035), (0.075, 0.095, 0.045), (0.095, 0.105, 0.055)]


def _mesh_object(name, bm, mats):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    for m in mats:
        ob.data.materials.append(m)
    return ob


def _blob(bm, center, radius, scale, seg=2, rnd=None):
    """One lumpy ellipsoid clump added to bm."""
    res = bmesh.ops.create_icosphere(bm, subdivisions=seg, radius=1.0)
    for v in res["verts"]:
        j = 1.0 + (rnd.uniform(-0.18, 0.18) if rnd else 0.0)
        v.co.x = center[0] + v.co.x * radius * scale[0] * j
        v.co.y = center[1] + v.co.y * radius * scale[1] * j
        v.co.z = center[2] + v.co.z * radius * scale[2] * j


def _branch(bm, p0, p1, r0, r1, seg=7):
    """Tapered limb from p0 to p1."""
    d = Vector(p1) - Vector(p0)
    length = d.length
    res = bmesh.ops.create_cone(bm, cap_ends=False, segments=seg, radius1=r0, radius2=r1, depth=length)
    rot = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
    mid = (Vector(p0) + Vector(p1)) / 2
    for v in res["verts"]:
        v.co = rot @ v.co + mid


def bark_material():
    m = bpy.data.materials.get("Kabuk")
    if m:
        return m
    return stone_material("Kabuk", (0.20, 0.15, 0.11), (0.09, 0.07, 0.05), rough=0.95, bump=1.2, scale=0.12)


def inner_material():
    """The dark heart of a crown: what you see through the gaps between sprays."""
    return bpy.data.materials.get("YaprakIc") or flat_material("YaprakIc", (0.012, 0.022, 0.010), 0.9)


def add_leaves(ob, kind, density, size, seed):
    if kind == "cypress":
        mat, stretch, tilt, flat = leaf_material("SelviYaprak", CYPRESS_GREENS, 0.18), 2.6, 0.35, 0.55
    elif kind == "far":  # aerial perspective: the distant ridge is bluer and paler
        mat, stretch, tilt, flat = leaf_material("UzakYaprak", FAR_GREENS, 0.2), 0.4, 3.14, 1.0
    elif kind == "pine":
        mat, stretch, tilt, flat = leaf_material("CamYaprak", PINE_GREENS, 0.14), 0.45, 0.5, 1.0
    else:
        mat, stretch, tilt, flat = leaf_material("Yaprak", BROAD_GREENS, 0.28), 0.32, 3.14, 1.0
    ng = leaf_nodes(f"{ob.name}_gn", density, size, stretch, tilt, flat, mat, seed)
    mod = ob.modifiers.new("yaprak", "NODES")
    mod.node_group = ng
    return ob


def cypress(name, x, y, h, seed=0, density=420):
    """Italian cypress: a column of vertical spray clumps on a short trunk; wavy edge, pointed, uneven tip."""
    rnd = random.Random(seed)
    bm = bmesh.new()
    rmax = 0.62 + rnd.uniform(-0.08, 0.1)
    n = int(h * 26)
    for _ in range(n):
        t = rnd.random() ** 0.92
        z = 0.45 + t * (h - 0.45)
        env = min(1.0, t / 0.16) ** 0.45 * (1.0 - t) ** 0.72 * 1.12
        env *= 1.0 + 0.12 * math.sin(t * 23 + seed)  # the slight waist and bulges of a real one
        r = rmax * env
        a = rnd.uniform(0, math.tau)
        d = r * rnd.uniform(0.25, 0.85)
        rc = max(0.08, r * rnd.uniform(0.32, 0.55))
        _blob(bm, (x + d * math.cos(a), y + d * math.sin(a), z), rc, (1.0, 1.0, rnd.uniform(1.6, 2.6)), 2, rnd)
    # a few sprays sticking out: the silhouette never closes into a smooth spindle
    for _ in range(int(h * 3)):
        t = rnd.uniform(0.12, 0.85)
        r = rmax * min(1.0, t / 0.16) ** 0.45 * (1.0 - t) ** 0.72 * 1.12
        a = rnd.uniform(0, math.tau)
        _blob(bm, (x + r * 1.05 * math.cos(a), y + r * 1.05 * math.sin(a), 0.45 + t * h), 0.12, (1, 1, 2.4), 1, rnd)
    crown = _mesh_object(name, bm, [inner_material()])
    add_leaves(crown, "cypress", density, 0.055, seed)
    wood = bmesh.new()
    _branch(wood, (x, y, -0.05), (x + rnd.uniform(-0.03, 0.03), y, h * 0.55), 0.13, 0.05)
    _mesh_object(name + "_govde", wood, [bark_material()])
    return crown


def broadleaf(name, x, y, h, seed=0, density=60, size=0.12):
    """Round deciduous crown (oak, hornbeam of the forest edge): trunk, limbs, clumps with gaps."""
    rnd = random.Random(seed)
    wood = bmesh.new()
    base = Vector((x, y, -0.1))
    top = Vector((x + rnd.uniform(-0.4, 0.4), y + rnd.uniform(-0.4, 0.4), h * 0.45))
    _branch(wood, base, top, 0.28 * h / 10, 0.16 * h / 10)
    crown_c = Vector((top.x, top.y, h * 0.66))
    cr = h * rnd.uniform(0.3, 0.38)
    bm = bmesh.new()
    limbs = rnd.randint(5, 8)
    for i in range(limbs):
        a = i / limbs * math.tau + rnd.uniform(-0.3, 0.3)
        el = rnd.uniform(0.2, 0.9)
        tip = crown_c + Vector((math.cos(a) * cr * 0.8, math.sin(a) * cr * 0.8, el * cr * 0.6))
        _branch(wood, top, tip, 0.1 * h / 10, 0.03 * h / 10, 5)
        for _k in range(rnd.randint(2, 4)):
            c = tip + Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-0.4, 0.6))) * cr * 0.35
            _blob(bm, c, cr * rnd.uniform(0.28, 0.42), (1, 1, rnd.uniform(0.75, 1.0)), 2, rnd)
    _blob(bm, crown_c + Vector((0, 0, cr * 0.3)), cr * 0.45, (1, 1, 0.9), 2, rnd)
    crown = _mesh_object(name, bm, [inner_material()])
    add_leaves(crown, "broad", density, size, seed)
    _mesh_object(name + "_govde", wood, [bark_material()])
    return crown


def stone_pine(name, x, y, h, seed=0, density=50, size=0.14):
    """Fistik cami (stone pine): bare leaning trunk, flat umbrella crown made of tufts."""
    rnd = random.Random(seed)
    wood = bmesh.new()
    lean = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)).normalized() * h * 0.08
    top = Vector((x, y, h * 0.72)) + lean
    _branch(wood, (x, y, -0.1), top, 0.3 * h / 12, 0.17 * h / 12)
    bm = bmesh.new()
    cr = h * rnd.uniform(0.34, 0.42)
    for _ in range(int(16 + h)):
        a = rnd.uniform(0, math.tau)
        d = cr * math.sqrt(rnd.random()) * 0.9
        z = top.z + h * 0.08 + (1 - d / cr) * h * 0.08 + rnd.uniform(-0.3, 0.3)
        c = Vector((top.x + d * math.cos(a), top.y + d * math.sin(a), z))
        _branch(wood, top, c - Vector((0, 0, 0.4)), 0.06 * h / 12, 0.02 * h / 12, 5)
        _blob(bm, c, cr * rnd.uniform(0.22, 0.34), (1, 1, 0.42), 2, rnd)
    crown = _mesh_object(name, bm, [inner_material()])
    add_leaves(crown, "pine", density, size, seed)
    _mesh_object(name + "_govde", wood, [bark_material()])
    return crown


def shrub(name, x, y, r, seed=0, density=260, size=0.045):
    """Low clipped shrub (box, rosemary) at a tree foot or along a path."""
    rnd = random.Random(seed)
    bm = bmesh.new()
    for _ in range(rnd.randint(4, 7)):
        c = (x + rnd.uniform(-r, r) * 0.6, y + rnd.uniform(-r, r) * 0.6, r * rnd.uniform(0.35, 0.6))
        _blob(bm, c, r * rnd.uniform(0.45, 0.7), (1, 1, 0.75), 2, rnd)
    ob = _mesh_object(name, bm, [inner_material()])
    add_leaves(ob, "broad", density, size, seed)
    return ob


def build_gallery(view):
    wide = view == "wide"
    stone = stone_material("Tas", LIME, LIME_LO)
    stone_d = stone_material("TasKoyu", LIME_D, LIME_D_LO, bump=0.34)
    joint = flat_material("Derz", (0.36, 0.33, 0.29), 0.95)
    bays = 9
    corridor = 4.2  # interior width
    # arcade along +Y on the left: rotate each module so its face looks to -X (courtyard)
    for b in range(-3 if view.startswith("court") else 0, bays):
        parts = arch_module(f"b{b}_", stone, stone_d, 0.0, DEPTH) + course_lines(f"b{b}_", 0.0, joint)
        for p in parts:
            p.rotation_euler[2] = math.radians(-90)
            p.location = Vector((-corridor / 2 - DEPTH, b * W, 0))
    # back wall (right) with deep arched niches holding classroom doors
    door_mat = flat_material("Kapi", (0.16, 0.10, 0.07), 0.7)
    seal = flat_material("Muhur", (0.50, 0.075, 0.05), 0.5)
    for b in range(-3 if view.startswith("court") else 0, bays):
        y = b * W
        box(f"bw{b}", corridor / 2, corridor / 2 + 0.5, y - W / 2, y + W / 2, 0, H, stone, 0)
        if b % 2 == 1:
            # a door in a shallow niche
            box(f"door{b}", corridor / 2 - 0.02, corridor / 2 + 0.01, y - 0.55, y + 0.55, PLINTH, 2.3, seal if b == 5 else door_mat, 0.004)
            box(f"lint{b}", corridor / 2 - 0.05, corridor / 2 + 0.01, y - 0.68, y + 0.68, 2.3, 2.42, stone_d, 0.008)
    # transverse arches across the corridor at every pier
    for b in range(bays + 1):
        y = b * W - W / 2
        rib_r_out = corridor / 2
        rib_r_in = corridor / 2 - 0.22
        for i in range(9):
            a0 = math.pi * i / 9 + 0.003
            a1 = math.pi * (i + 1) / 9 - 0.003
            ob = wedge(f"rib{b}_{i}", rib_r_in, rib_r_out, a0, a1, y - 0.2, y + 0.2, 0.0, stone_d)
            ob.location.z = H - 0.05
    # vault between ribs: barrel, plastered limewash
    plaster = flat_material("Badana", (0.86, 0.84, 0.80), 0.9)
    vault = wedge("vault", corridor / 2 - 0.001, corridor / 2 + 0.25, 0.0, math.pi, -W, bays * W + 2, H, plaster, 0, 40)
    for poly in vault.data.polygons:
        poly.use_smooth = True
    # walls above arcade/back to the vault spring
    box("upperL", -corridor / 2 - DEPTH, -corridor / 2, -W * 4, bays * W + 2, H, H + 0.6, stone, 0)
    box("upperR", corridor / 2, corridor / 2 + 0.5, -W, bays * W + 2, H, H + 0.6, stone, 0)
    # floor
    fl = box("floor", -corridor / 2 - DEPTH - 6, corridor / 2 + 0.5, -W * 1.5, bays * W + 8, -0.2, 0, floor_material(), 0)
    # courtyard: gravel and a low hedge line, then sky
    gravel = gravel_material()
    box("court", -40, -corridor / 2 - DEPTH - 0.4, -20, 60, -0.25, -0.03, gravel, 0)
    # the far side of the courtyard: the opposite wing of the same arcade
    far_x = -15.0
    for b in range(-2, bays + 3):
        parts = arch_module(f"f{b}_", stone, stone_d, 0.0, DEPTH)
        for p in parts:
            p.rotation_euler[2] = math.radians(90)
            p.location = Vector((far_x, b * W, 0))
    box("farBack", far_x - 3.0, far_x - 2.6, -12, 50, 0, H + 0.6, stone, 0)
    box("farTop", far_x - 3.0, far_x + DEPTH, -12, 50, H, H + 0.6, stone, 0)
    # cypresses in the courtyard, a shrub at each foot
    for k, (cx, cy) in enumerate(CYPRESSES):
        cypress(f"selvi{k}", cx, cy, 7.0 + (k % 3) * 0.9, seed=31 + k)
        shrub(f"cali{k}", cx + 0.7, cy - 0.5, 0.55, seed=61 + k)
    # the forest edge beyond the campus (Zekeriyakoy): oak/hornbeam crowns and stone pines
    rnd = random.Random(11)
    spots = [(rnd.uniform(-48, 22), rnd.uniform(46, 62)) for _ in range(30)] + [(rnd.uniform(-60, -32), rnd.uniform(-20, 46)) for _ in range(18)] + [(rnd.uniform(9, 24), rnd.uniform(-20, 46)) for _ in range(18)]
    for k, (tx, ty) in enumerate(spots):
        h = rnd.uniform(9.0, 14.0)
        if k % 3 == 0:
            stone_pine(f"cam{k}", tx, ty, h * 1.1, seed=100 + k, density=55, size=0.15)
        else:
            broadleaf(f"agac{k}", tx, ty, h, seed=200 + k, density=55, size=0.16)
    # the forest beyond: a rolling canopy on the ridge behind the campus closes the horizon
    ridge = bmesh.new()
    bmesh.ops.create_grid(ridge, x_segments=90, y_segments=14, size=1.0)
    for v in ridge.verts:
        gx, gy = v.co.x, v.co.y  # -1..1
        x = -40 + gx * 90
        y = 84 + gy * 14
        h = 7 + 2.5 * math.sin(x * 0.11) + 2 * math.sin(x * 0.37 + 1.3) + 1.5 * math.sin(y * 0.5 + x * 0.2) + (gy + 1) * 3
        f = min(1.0, (gy + 1) / 0.3)  # the front rows come down to the ground: a wooded slope, not a floating ribbon
        v.co.x, v.co.y, v.co.z = x, y, -0.5 + f * (max(2.0, h) + 0.5)
    canopy = _mesh_object("sirt", ridge, [flat_material("SirtIc", (0.030, 0.048, 0.036), 0.9)])
    disp = canopy.modifiers.new("d", "DISPLACE")
    ctex = bpy.data.textures.new("sirt_t", "CLOUDS")
    ctex.noise_scale = 2.2
    disp.texture = ctex
    disp.strength = 1.6
    sub = canopy.modifiers.new("s", "SUBSURF")
    sub.levels = sub.render_levels = 1
    canopy.modifiers.move(1, 0)
    add_leaves(canopy, "far", 22, 0.26, 9)
    # understory along the forest edge, so no view ends on a bare horizon
    for k in range(46):
        if k < 26:
            ux, uy = rnd.uniform(-50, 24), rnd.uniform(43, 60)
        elif k < 36:
            ux, uy = rnd.uniform(-58, -30), rnd.uniform(-18, 44)
        else:
            ux, uy = rnd.uniform(10, 24), rnd.uniform(-18, 44)
        shrub(f"orman{k}", ux, uy, rnd.uniform(1.4, 2.4), seed=300 + k, density=70, size=0.12)
    # end of the gallery: open to the garden (the world beyond the arcade)
    if view == "court-pm":
        sun("Gunes", (69, 0, -96), 12.0, (1.0, 0.40, 0.14), 1.4)  # evening: low and orange, still from the courtyard
        sky_world(3, 290, 0.4)
        bpy.context.scene.view_settings.exposure = -1.0
    else:
        sun("Gunes", (50, 0, -118), 11.0, (1.0, 0.86, 0.66), 0.6)  # low morning sun from the courtyard side
        sky_world(40, 300, 0.2)
    if view == "court-wide":
        # down the garden walk between the cypress row and the arcade, to the forest
        camera((-6.6, -7.5, 1.55), (88.5, 0, -4), lens=20)
        out(1600, 900)
    elif view == "court-am":
        # from the garden, looking back at the arcade
        camera((-8.4, -4.0, 1.6), (88, 0, -32), lens=24)
        out(1600, 900)
    elif view == "court-pm":
        camera((-8.0, -3.0, 1.5), (88, 0, -6), lens=28)
        out(900, 1500)
    elif wide:
        camera((1.15, -0.4, 1.2), (90, 0, 17), lens=22)
        out(1600, 900)
    else:
        camera((0.9, -2.2, 1.15), (91, 0, 14), lens=24)
        out(1200, 1500)


scn = reset()
if MODE == "face-am":
    build_face(False)
elif MODE == "face-pm":
    build_face(True)
elif MODE == "face-walled":
    build_face(True, walled=True)
elif MODE == "wall":
    build_wall()
elif MODE in ("hero", "wide", "court-am", "court-pm", "court-wide"):
    build_gallery(MODE)
bpy.ops.render.render(write_still=True)
print("RENDERED", MODE, OUT)
