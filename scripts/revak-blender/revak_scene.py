"""Revak Okulları: procedural stone arcade renders (Blender 5.x, background mode).

Run with a fresh factory scene so nothing in an open Blender session is touched:

  blender -b --factory-startup --python scripts/revak-blender/revak_scene.py -- <mode> <out.png> [samples]

Modes
  face-am / face-pm  one arch face, orthographic, transparent background and hole.
                     Same module as the walk's SVG portal (180 x 192.7 u, 1 u = 2 cm).
  hero               the gallery seen from inside, morning sun through the arches (portrait).
  wide               the same gallery, landscape (campus band + Open Graph crop).
  wall               a flat ashlar wall swatch, front lit, for the walk's stage.

Everything is modelled here: no downloaded textures, models or HDRIs.
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
    l.new(grime.outputs["Result"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = rough

    fine = n.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 26 / scale
    fine.inputs["Detail"].default_value = 12.0
    l.new(tc.outputs["Object"], fine.inputs["Vector"])
    bmp = n.new("ShaderNodeBump")
    bmp.inputs["Strength"].default_value = bump
    bmp.inputs["Distance"].default_value = 0.01
    hmix = n.new("ShaderNodeMath")
    hmix.operation = "ADD"
    l.new(fine.outputs["Fac"], hmix.inputs[0])
    l.new(pit.outputs["Result"], hmix.inputs[1])
    l.new(hmix.outputs[0], bmp.inputs["Height"])
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
    scn.render.resolution_percentage = 100
    scn.render.film_transparent = transparent
    scn.render.image_settings.file_format = "PNG"
    scn.render.image_settings.color_mode = "RGBA" if transparent else "RGB"
    scn.render.filepath = OUT


# ------------------------------------------------------------------ modes

LIME = (0.92, 0.82, 0.64)
LIME_LO = (0.70, 0.60, 0.45)
LIME_D = (0.80, 0.72, 0.58)
LIME_D_LO = (0.58, 0.50, 0.39)


def build_face(evening):
    stone = stone_material("Tas", LIME, LIME_LO)
    stone_d = stone_material("TasKoyu", LIME_D, LIME_D_LO, bump=0.48)
    joint = flat_material("Derz", (0.36, 0.33, 0.29), 0.95)
    arch_module("m_", stone, stone_d, 0.0)
    course_lines("m_", 0.0, joint)
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


def cypress(name, x, y, h):
    """Italian cypress: a lumpy spindle, not a cone (subdivided, cloud-displaced, darker inside)."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1.0, location=(x, y, h * 0.5))
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = (0.62, 0.62, h * 0.5)
    for v in ob.data.vertices:  # widest a fifth of the way up, pointed at the top
        t = (v.co.z + 1) / 2
        rad = math.hypot(v.co.x, v.co.y)
        if rad < 1e-6:
            continue
        r = max(0.03, min(1.0, t / 0.2) ** 0.5 * (1.0 - t) ** 0.8 * 1.2)
        v.co.x *= r / rad
        v.co.y *= r / rad
    tex = bpy.data.textures.new(name + "t", "CLOUDS")
    tex.noise_scale = 0.18
    mod = ob.modifiers.new("d", "DISPLACE")
    mod.texture = tex
    mod.strength = 0.22
    mod.texture_coords = "GLOBAL"
    sub = ob.modifiers.new("s", "SUBSURF")
    sub.levels = 1
    sub.render_levels = 2
    ob.modifiers.move(1, 0)
    for poly in ob.data.polygons:
        poly.use_smooth = True
    m = bpy.data.materials.get("Selvi") or stone_material("Selvi", (0.07, 0.13, 0.06), (0.025, 0.05, 0.025), rough=0.95, bump=1.0, scale=0.08)
    ob.data.materials.append(m)
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
    gravel = flat_material("Avlu", (0.62, 0.58, 0.50), 0.95)
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
    # cypresses in the courtyard
    for k, (cx, cy) in enumerate(CYPRESSES):
        cypress(f"selvi{k}", cx, cy, 6.2 + (k % 3) * 0.7)
    # the forest edge beyond the campus (Zekeriyaköy), so no view ends on an empty horizon
    rnd = random.Random(11)
    leaf = bpy.data.materials.get("Selvi") or stone_material("Selvi", (0.07, 0.13, 0.06), (0.025, 0.05, 0.025), rough=0.95, bump=1.0, scale=0.08)
    spots = [(rnd.uniform(-48, 22), rnd.uniform(46, 62)) for _ in range(34)] + [(rnd.uniform(-60, -32), rnd.uniform(-20, 46)) for _ in range(22)] + [(rnd.uniform(9, 24), rnd.uniform(-20, 46)) for _ in range(22)]
    for k, (tx, ty) in enumerate(spots):
        r = rnd.uniform(2.6, 4.4)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=r, location=(tx, ty, r * 0.9))
        t = bpy.context.active_object
        t.scale.z = rnd.uniform(1.1, 1.6)
        tex = bpy.data.textures.new(f"tr{k}", "CLOUDS")
        tex.noise_scale = 1.2
        d = t.modifiers.new("d", "DISPLACE")
        d.texture = tex
        d.strength = 0.9
        t.data.materials.append(leaf)
        for poly in t.data.polygons:
            poly.use_smooth = True
    # end of the gallery: open to the garden (the world beyond the arcade)
    if view == "court-pm":
        sun("Gunes", (69, 0, -96), 12.0, (1.0, 0.40, 0.14), 1.4)  # evening: low and orange, still from the courtyard
        sky_world(3, 290, 0.4)
        bpy.context.scene.view_settings.exposure = -1.0
    else:
        sun("Gunes", (50, 0, -118), 11.0, (1.0, 0.86, 0.66), 0.6)  # low morning sun from the courtyard side
        sky_world(40, 300, 0.2)
    if view == "court-am":
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
elif MODE == "wall":
    build_wall()
elif MODE in ("hero", "wide", "court-am", "court-pm"):
    build_gallery(MODE)
bpy.ops.render.render(write_still=True)
print("RENDERED", MODE, OUT)
