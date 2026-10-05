"""Sazbahçe: the four areas rendered as evening photographs (Blender 5.2, background mode).

Run in its own process, never in an open Blender session:

  blender -b --factory-startup -P sazbahce_scene.py -- <mode> <out.png> [samples] [pct]

Modes   cayir   Söğüt Çayırı: round tables round the dance floor, the lake and the sun behind
        cayir2  one table under a willow, close, the lake out of focus
        ambar   Ağ Ambarı: long tables in the old net barn, sun through the west door
        ambar2  the barn set for a presentation (theatre rows, screen), afternoon
        avlu    Ceviz Avlusu: tables round the walnut, lanterns in its branches, blue hour
        avlu2   a henna-night table under the walnut, tea glasses and candles, close
        iskele  rows of chairs on the shore, the aisle running onto the pier, sunset
        iskele2 the end of the pier: the ceremony table, two chairs, the lake

Layout follows the site plan (lib/sazbahce/plan.ts): lake to the west (-X), shore
along Y, the meadow east of it, the barn and the yard further east. 1 unit = 1 m.

Assets: CC0 models and textures from Poly Haven (assets/, fetched by ph_get.py).
Everything else (willows, reeds, cloths, barn, nets, walls, hills) is modelled here.
"""

import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
MODE = argv[0] if argv else "cayir"
OUT = argv[1] if len(argv) > 1 else os.path.join(os.path.dirname(__file__), "test", f"{MODE}.png")
SAMPLES = int(argv[2]) if len(argv) > 2 else 256
PCT = int(argv[3]) if len(argv) > 3 else 100

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
random.seed(11)

# ------------------------------------------------------------------ scene


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.samples = SAMPLES
    scn.cycles.use_adaptive_sampling = True
    scn.cycles.adaptive_threshold = 0.015
    scn.cycles.use_denoising = True
    try:
        scn.cycles.denoiser = "OPTIX"
    except TypeError:
        pass
    scn.cycles.max_bounces = 8
    scn.cycles.transparent_max_bounces = 24
    scn.cycles.caustics_reflective = False
    scn.cycles.caustics_refractive = False
    scn.cycles.blur_glossy = 1.0
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "OPTIX"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = d.type == "OPTIX"
        scn.cycles.device = "GPU"
    except Exception as e:  # CPU fallback
        print("GPU yok:", e)
    scn.view_settings.view_transform = "AgX"
    for look in ("AgX - Punchy", "AgX - Medium High Contrast", "AgX - Base Contrast"):
        try:
            scn.view_settings.look = look
            break
        except TypeError:
            continue
    scn.view_settings.exposure = -0.9
    return scn


def output(w, h):
    scn = bpy.context.scene
    scn.render.resolution_x = w
    scn.render.resolution_y = h
    scn.render.resolution_percentage = PCT
    scn.render.image_settings.file_format = "PNG"
    scn.render.image_settings.color_mode = "RGB"
    scn.render.image_settings.color_depth = "16"
    scn.render.filepath = OUT


def camera(loc, target, lens=35, fstop=None, focus=None):
    cd = bpy.data.cameras.new("Cam")
    cd.lens = lens
    cd.clip_end = 9000
    cd.sensor_width = 36
    ob = bpy.data.objects.new("Cam", cd)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    d = Vector(target) - Vector(loc)
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    if fstop:
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = fstop
        cd.dof.focus_distance = focus if focus else d.length
    bpy.context.scene.camera = ob
    return ob


def sky(elev, rot, strength=1.0, disc=True, sun_strength=1.0):
    """Physical sky. Sun direction (sin rot, cos rot): rot 270 = due west (-X)."""
    w = bpy.data.worlds.new("Gok")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    bg = next(x for x in nt.nodes if x.type == "BACKGROUND")
    s = nt.nodes.new("ShaderNodeTexSky")
    s.sky_type = "MULTIPLE_SCATTERING"
    s.sun_elevation = math.radians(elev)
    s.sun_rotation = math.radians(rot)
    s.sun_disc = disc
    s.sun_intensity = sun_strength
    try:
        s.air_density = 1.0
        s.aerosol_density = 1.2  # a hazy summer evening over a shallow lake
    except Exception:
        pass
    nt.links.new(s.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = strength
    return w


def sun_dir(elev, rot):
    e, r = math.radians(elev), math.radians(rot)
    return Vector((math.sin(r) * math.cos(e), math.cos(r) * math.cos(e), math.sin(e)))


def sun_lamp(elev, rot, energy, color, angle=0.6):
    ld = bpy.data.lights.new("Gunes", "SUN")
    ld.energy = energy
    ld.color = color
    ld.angle = math.radians(angle)
    ob = bpy.data.objects.new("Gunes", ld)
    bpy.context.collection.objects.link(ob)
    ob.rotation_euler = (-sun_dir(elev, rot)).to_track_quat("-Z", "Y").to_euler()
    return ob


def point(name, loc, energy, color=(1.0, 0.62, 0.32), radius=0.02):
    ld = bpy.data.lights.new(name, "POINT")
    ld.energy = energy
    ld.color = color
    ld.shadow_soft_size = radius
    ob = bpy.data.objects.new(name, ld)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    return ob


def area_light(name, loc, target, size, energy, color=(1, 1, 1), size_y=None):
    ld = bpy.data.lights.new(name, "AREA")
    ld.energy = energy
    ld.color = color
    ld.shape = "RECTANGLE"
    ld.size = size
    ld.size_y = size_y or size
    ob = bpy.data.objects.new(name, ld)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return ob


# ------------------------------------------------------------------ materials


def _bsdf(m):
    return next(x for x in m.node_tree.nodes if x.type == "BSDF_PRINCIPLED")


def _set(node, name, value):
    try:
        node.inputs[name].default_value = value
    except KeyError:
        pass


def flat(name, color, rough=0.6, metal=0.0, emit=0.0, emit_color=None):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        _set(b, "Emission Color", (*(emit_color or color), 1))
        _set(b, "Emission Strength", emit)
    return m


def glass(name="Cam", color=(0.95, 0.97, 0.96), rough=0.02):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    _set(b, "Transmission Weight", 1.0)
    _set(b, "IOR", 1.47)
    return m


def textured(name, tex, scale=1.0, tint=None, rough_mul=1.0, bump=0.6, hue=None, sat=1.0, val=1.0):
    """Poly Haven PBR set with box projection from object space (works on any mesh, no UVs)."""
    m = bpy.data.materials.get(name)
    if m:
        return m
    d = os.path.join(ASSETS, tex)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    b = _bsdf(m)
    tc = n.new("ShaderNodeTexCoord")
    mp = n.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / scale, 1 / scale, 1 / scale)
    l.new(tc.outputs["Object"], mp.inputs["Vector"])

    def img(file, non_color):
        t = n.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(os.path.join(d, file), check_existing=True)
        if non_color:
            t.image.colorspace_settings.name = "Non-Color"
        t.projection = "BOX"
        t.projection_blend = 0.25
        l.new(mp.outputs["Vector"], t.inputs["Vector"])
        return t

    diff = img("diff.jpg", False)
    col = diff.outputs["Color"]
    if hue is not None or sat != 1.0 or val != 1.0:
        hsv = n.new("ShaderNodeHueSaturation")
        hsv.inputs["Hue"].default_value = hue if hue is not None else 0.5
        hsv.inputs["Saturation"].default_value = sat
        hsv.inputs["Value"].default_value = val
        l.new(col, hsv.inputs["Color"])
        col = hsv.outputs["Color"]
    if tint:
        mix = n.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs["Factor"].default_value = 1.0
        l.new(col, mix.inputs["A"])
        mix.inputs["B"].default_value = (*tint, 1)
        col = mix.outputs["Result"]
    l.new(col, b.inputs["Base Color"])
    if os.path.exists(os.path.join(d, "rough.jpg")):
        r = img("rough.jpg", True)
        mul = n.new("ShaderNodeMath")
        mul.operation = "MULTIPLY"
        mul.inputs[1].default_value = rough_mul
        l.new(r.outputs["Color"], mul.inputs[0])
        l.new(mul.outputs[0], b.inputs["Roughness"])
    if os.path.exists(os.path.join(d, "nor_gl.jpg")) and bump:
        nm = n.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = bump
        t = img("nor_gl.jpg", True)
        l.new(t.outputs["Color"], nm.inputs["Color"])
        l.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


def linen():
    m = textured("Keten", "rough_linen", scale=0.35, tint=(1.0, 0.97, 0.9), bump=0.35, sat=0.15, val=1.25)
    b = _bsdf(m)
    _set(b, "Sheen Weight", 0.35)
    _set(b, "Sheen Tint", (1, 0.97, 0.92, 1))
    _set(b, "Subsurface Weight", 0.05)
    return m


def flame_mat():
    return flat("Alev", (1.0, 0.55, 0.2), 0.5, emit=60.0, emit_color=(1.0, 0.5, 0.17))


def bulb_mat(strength=9.0):
    return flat(f"Ampul{strength}", (1.0, 0.75, 0.45), 0.3, emit=strength, emit_color=(1.0, 0.63, 0.32))


def water_mat(color=(0.012, 0.03, 0.03)):
    m = bpy.data.materials.get("Su")
    if m:
        return m
    m = bpy.data.materials.new("Su")
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = 0.035
    _set(b, "IOR", 1.333)
    _set(b, "Specular IOR Level", 0.5)
    tc = n.new("ShaderNodeTexCoord")
    mp = n.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (0.35, 1.6, 1.0)  # ripples run across the light path
    l.new(tc.outputs["Object"], mp.inputs["Vector"])
    nz = n.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.4
    nz.inputs["Detail"].default_value = 6
    nz.inputs["Roughness"].default_value = 0.55
    l.new(mp.outputs["Vector"], nz.inputs["Vector"])
    # ripples fade with distance so the far lake is a calm mirror
    cam = n.new("ShaderNodeCameraData")
    fade = n.new("ShaderNodeMapRange")
    fade.inputs["From Min"].default_value = 15
    fade.inputs["From Max"].default_value = 400
    fade.inputs["To Min"].default_value = 0.22
    fade.inputs["To Max"].default_value = 0.015
    l.new(cam.outputs["View Distance"], fade.inputs["Value"])
    bp = n.new("ShaderNodeBump")
    l.new(fade.outputs["Result"], bp.inputs["Strength"])
    l.new(nz.outputs["Fac"], bp.inputs["Height"])
    bp.inputs["Distance"].default_value = 0.05
    l.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m


def hills_mat(base=(0.05, 0.07, 0.07), haze=(0.62, 0.44, 0.40), dist=2600):
    """Far shore: dark land fading into the evening haze with distance."""
    m = bpy.data.materials.get("Tepe")
    if m:
        return m
    m = bpy.data.materials.new("Tepe")
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    out = next(x for x in n if x.type == "OUTPUT_MATERIAL")
    b = _bsdf(m)
    b.inputs["Base Color"].default_value = (*base, 1)
    b.inputs["Roughness"].default_value = 0.95
    em = n.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*haze, 1)
    em.inputs["Strength"].default_value = 1.0
    cam = n.new("ShaderNodeCameraData")
    mr = n.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = 200
    mr.inputs["From Max"].default_value = dist
    mr.inputs["To Min"].default_value = 0.1
    mr.inputs["To Max"].default_value = 0.78
    l.new(cam.outputs["View Distance"], mr.inputs["Value"])
    mix = n.new("ShaderNodeMixShader")
    l.new(mr.outputs["Result"], mix.inputs["Fac"])
    l.new(b.outputs[0], mix.inputs[1])
    l.new(em.outputs[0], mix.inputs[2])
    l.new(mix.outputs[0], out.inputs["Surface"])
    return m


def leaf_mat(name, greens, translucent=0.3):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    out = next(x for x in n if x.type == "OUTPUT_MATERIAL")
    b = _bsdf(m)
    info = n.new("ShaderNodeObjectInfo")
    ramp = n.new("ShaderNodeValToRGB")
    els = ramp.color_ramp.elements
    els[0].position, els[0].color = 0.0, (*greens[0], 1)
    els[1].position, els[1].color = 1.0, (*greens[-1], 1)
    for i, g in enumerate(greens[1:-1], 1):
        els.new(i / (len(greens) - 1)).color = (*g, 1)
    l.new(info.outputs["Random"], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.5
    _set(b, "Specular IOR Level", 0.4)
    tr = n.new("ShaderNodeBsdfTranslucent")
    l.new(ramp.outputs["Color"], tr.inputs["Color"])
    mix = n.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = translucent
    l.new(b.outputs[0], mix.inputs[1])
    l.new(tr.outputs[0], mix.inputs[2])
    l.new(mix.outputs[0], out.inputs["Surface"])
    return m


def ghost_mat():
    """Willow strand cores: invisible, the leaves on their skin make the curtain."""
    m = bpy.data.materials.get("Hayalet")
    if m:
        return m
    m = bpy.data.materials.new("Hayalet")
    m.use_nodes = True
    nt = m.node_tree
    out = next(x for x in nt.nodes if x.type == "OUTPUT_MATERIAL")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    nt.links.new(tr.outputs[0], out.inputs["Surface"])
    return m


WILLOW = [(0.10, 0.16, 0.035), (0.16, 0.24, 0.05), (0.24, 0.30, 0.07), (0.30, 0.34, 0.09), (0.20, 0.27, 0.06)]
WALNUT = [(0.05, 0.09, 0.025), (0.08, 0.14, 0.035), (0.12, 0.19, 0.05), (0.17, 0.23, 0.07)]
REED = [(0.32, 0.25, 0.10), (0.42, 0.33, 0.14), (0.26, 0.26, 0.10), (0.18, 0.22, 0.08), (0.50, 0.40, 0.20)]

# ------------------------------------------------------------------ mesh helpers


def link(ob):
    bpy.context.collection.objects.link(ob)
    return ob


def mesh_ob(name, bm, mats, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    ob = bpy.data.objects.new(name, me)
    link(ob)
    for m in mats:
        ob.data.materials.append(m)
    return ob


def box(name, x0, x1, y0, y1, z0, z1, mat, bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 + (v.co.x + 0.5) * (x1 - x0)
        v.co.y = y0 + (v.co.y + 0.5) * (y1 - y0)
        v.co.z = z0 + (v.co.z + 0.5) * (z1 - z0)
    ob = mesh_ob(name, bm, [mat], smooth=False)
    if bevel:
        md = ob.modifiers.new("b", "BEVEL")
        md.width = bevel
        md.segments = 2
    return ob


def cyl(bm, p0, p1, r0, r1, seg=10, caps=False):
    d = Vector(p1) - Vector(p0)
    res = bmesh.ops.create_cone(bm, cap_ends=caps, segments=seg, radius1=r0, radius2=r1, depth=d.length)
    rot = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
    mid = (Vector(p0) + Vector(p1)) / 2
    for v in res["verts"]:
        v.co = rot @ v.co + mid


def blob(bm, c, r, s, sub=2, rnd=None):
    res = bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    for v in res["verts"]:
        j = 1.0 + (rnd.uniform(-0.15, 0.15) if rnd else 0)
        v.co = Vector((c[0] + v.co.x * r * s[0] * j, c[1] + v.co.y * r * s[1] * j, c[2] + v.co.z * r * s[2] * j))


def plane(name, x0, x1, y0, y1, z, mat, cuts=0):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=cuts + 1, y_segments=cuts + 1, size=0.5)
    for v in bm.verts:
        v.co.x = x0 + (v.co.x + 0.5) * (x1 - x0)
        v.co.y = y0 + (v.co.y + 0.5) * (y1 - y0)
        v.co.z = z
    return mesh_ob(name, bm, [mat], smooth=False)


# ------------------------------------------------------------------ assets

_PROTO = {}


def rush_mat():
    """Hasır: twisted rush woven in four triangles, golden straw."""
    m = bpy.data.materials.get("Hasir")
    if m:
        return m
    m = bpy.data.materials.new("Hasir")
    m.use_nodes = True
    nt = m.node_tree
    n, l = nt.nodes, nt.links
    b = _bsdf(m)
    tc = n.new("ShaderNodeTexCoord")
    wv = n.new("ShaderNodeTexWave")
    wv.wave_type = "RINGS"
    wv.rings_direction = "SPHERICAL"
    wv.inputs["Scale"].default_value = 3.2
    wv.inputs["Distortion"].default_value = 1.2
    wv.inputs["Detail"].default_value = 3
    l.new(tc.outputs["Object"], wv.inputs["Vector"])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.22, 0.14, 0.05, 1)
    ramp.color_ramp.elements[1].color = (0.62, 0.46, 0.2, 1)
    l.new(wv.outputs["Fac"], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.7
    bp = n.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = 0.6
    l.new(wv.outputs["Fac"], bp.inputs["Height"])
    l.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m


def make_chair():
    """Hasır sandalye: the village chair of every Turkish wedding garden. Front faces -Y."""
    col = bpy.data.collections.new("P_hasir")
    wood = textured("SandalyeAhsap", "old_wood_floor", scale=0.4, tint=(0.42, 0.26, 0.15), rough_mul=0.7, bump=0.3)
    bm = bmesh.new()
    W, D, SH, BH = 0.42, 0.40, 0.45, 0.92
    lg = 0.016
    for x in (-W / 2 + 0.02, W / 2 - 0.02):
        cyl(bm, (x, -D / 2 + 0.02, 0), (x, -D / 2 + 0.02, SH), lg, lg * 0.9, 8, True)  # front legs
        cyl(bm, (x, D / 2 - 0.02, 0), (x, D / 2 + 0.03, BH), lg, lg * 0.85, 8, True)  # back posts, a little raked
        cyl(bm, (x, -D / 2 + 0.02, 0.16), (x, D / 2 - 0.02, 0.16), 0.008, 0.008, 6, True)
    for y in (-D / 2 + 0.02, D / 2 - 0.02):
        cyl(bm, (-W / 2 + 0.02, y, 0.2), (W / 2 - 0.02, y, 0.2), 0.008, 0.008, 6, True)
    # seat frame and two curved back slats
    for (a, b_) in (((-W / 2, -D / 2), (W / 2, -D / 2)), ((-W / 2, D / 2), (W / 2, D / 2)), ((-W / 2, -D / 2), (-W / 2, D / 2)), ((W / 2, -D / 2), (W / 2, D / 2))):
        cyl(bm, (a[0], a[1], SH - 0.01), (b_[0], b_[1], SH - 0.01), 0.013, 0.013, 6, True)
    ob = mesh_ob("SandalyeCerceve", bm, [wood])
    sl = bmesh.new()
    for z in (0.66, 0.84):
        y = D / 2 - 0.02 + (z / BH) * 0.05
        verts = []
        for i in range(9):
            t = i / 8
            xx = -W / 2 + 0.02 + t * (W - 0.04)
            yy = y + 0.025 * math.sin(t * math.pi)
            verts.append((xx, yy))
        for i in range(8):
            (x0, y0), (x1, y1) = verts[i], verts[i + 1]
            q = [sl.verts.new(v) for v in ((x0, y0, z - 0.035), (x1, y1, z - 0.035), (x1, y1, z + 0.035), (x0, y0, z + 0.035))]
            q2 = [sl.verts.new((v.co.x, v.co.y + 0.012, v.co.z)) for v in q]
            sl.faces.new(q)
            sl.faces.new(list(reversed(q2)))
            sl.faces.new((q[2], q[3], q2[3], q2[2]))
            sl.faces.new((q[0], q[1], q2[1], q2[0]))
    slats = mesh_ob("SandalyeArkalik", sl, [wood], smooth=False)
    seat = box("SandalyeHasir", -W / 2 + 0.01, W / 2 - 0.01, -D / 2 + 0.01, D / 2 - 0.01, SH - 0.02, SH + 0.015, rush_mat(), 0.01)
    for o in (ob, slats, seat):
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
    return col


def proto(asset_id):
    """Import a Poly Haven glTF once into a hidden collection; return the collection."""
    if asset_id in _PROTO:
        return _PROTO[asset_id]
    if asset_id == "hasir":
        _PROTO[asset_id] = make_chair()
        return _PROTO[asset_id]
    path = os.path.join(ASSETS, asset_id, f"{asset_id}_1k.gltf")
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    col = bpy.data.collections.new(f"P_{asset_id}")
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
    _PROTO[asset_id] = col
    return col


def place(asset_id, loc, rot_z=0.0, scale=1.0, tilt=(0.0, 0.0)):
    col = proto(asset_id)
    e = bpy.data.objects.new(f"I_{asset_id}", None)
    e.instance_type = "COLLECTION"
    e.instance_collection = col
    e.location = loc
    e.rotation_euler = (tilt[0], tilt[1], rot_z)
    e.scale = (scale, scale, scale)
    link(e)
    return e


def proto_mesh(asset_id, name_part=None):
    col = proto(asset_id)
    for o in col.objects:
        if o.type == "MESH" and (name_part is None or name_part in o.name):
            return o
    return None


# ------------------------------------------------------------------ geometry nodes scatter


def _sock(sockets, name, kind):
    return next(s for s in sockets if s.name == name and s.type == kind)


def scatter(target, inst, density, scale=(0.8, 1.2), tilt=0.15, seed=0, keep=True, align_up=True, stretch=(1, 1, 1), select_attr=None, volume=False):
    """Instance `inst` (object or collection) over target's faces."""
    ng = bpy.data.node_groups.new(f"{target.name}_sc{seed}", "GeometryNodeTree")
    ng.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    n, l = ng.nodes, ng.links
    gi, go = n.new("NodeGroupInput"), n.new("NodeGroupOutput")
    if volume:
        mv = n.new("GeometryNodeMeshToVolume")
        _set(mv, "Voxel Size", 0.08)
        l.new(gi.outputs[0], mv.inputs["Mesh"])
        dist = n.new("GeometryNodeDistributePointsInVolume")
        dist.inputs["Density"].default_value = density
        dist.inputs["Seed"].default_value = seed
        l.new(mv.outputs["Volume"], dist.inputs["Volume"])
    else:
        dist = n.new("GeometryNodeDistributePointsOnFaces")
        dist.inputs["Density"].default_value = density
        dist.inputs["Seed"].default_value = seed
        l.new(gi.outputs[0], dist.inputs["Mesh"])
    if isinstance(inst, bpy.types.Collection):
        info = n.new("GeometryNodeCollectionInfo")
        info.inputs["Collection"].default_value = inst
        info.inputs["Separate Children"].default_value = True
        info.inputs["Reset Children"].default_value = True
        pick = True
    else:
        info = n.new("GeometryNodeObjectInfo")
        info.inputs["Object"].default_value = inst
        pick = False
    ip = n.new("GeometryNodeInstanceOnPoints")
    l.new(dist.outputs["Points"], ip.inputs["Points"])
    l.new(_sock(info.outputs, "Instances" if pick else "Geometry", "GEOMETRY"), ip.inputs["Instance"])
    if pick:
        ip.inputs["Pick Instance"].default_value = True
        rid = n.new("FunctionNodeRandomValue")
        rid.data_type = "INT"
        _sock(rid.inputs, "Min", "INT").default_value = 0
        _sock(rid.inputs, "Max", "INT").default_value = 99
        _sock(rid.inputs, "Seed", "INT").default_value = seed + 5
        l.new(_sock(rid.outputs, "Value", "INT"), ip.inputs["Instance Index"])
    rot = n.new("FunctionNodeRandomValue")
    rot.data_type = "FLOAT_VECTOR"
    _sock(rot.inputs, "Min", "VECTOR").default_value = (-tilt, -tilt, 0)
    _sock(rot.inputs, "Max", "VECTOR").default_value = (tilt, tilt, 6.283)
    _sock(rot.inputs, "Seed", "INT").default_value = seed + 1
    l.new(_sock(rot.outputs, "Value", "VECTOR"), ip.inputs["Rotation"])
    sc = n.new("FunctionNodeRandomValue")
    sc.data_type = "FLOAT"
    _sock(sc.inputs, "Min", "VALUE").default_value = scale[0]
    _sock(sc.inputs, "Max", "VALUE").default_value = scale[1]
    _sock(sc.inputs, "Seed", "INT").default_value = seed + 2
    vs = n.new("ShaderNodeVectorMath")
    vs.operation = "SCALE"
    vs.inputs[0].default_value = stretch
    l.new(_sock(sc.outputs, "Value", "VALUE"), vs.inputs["Scale"])
    l.new(vs.outputs["Vector"], ip.inputs["Scale"])
    join = n.new("GeometryNodeJoinGeometry")
    l.new(ip.outputs["Instances"], join.inputs[0])
    if keep:
        l.new(gi.outputs[0], join.inputs[0])
    l.new(join.outputs[0], go.inputs[0])
    md = target.modifiers.new("dagit", "NODES")
    md.node_group = ng
    return target


def leaf_proto(name, length, width, mat):
    """One leaf: a slightly cupped lens shape, pivot at its stalk end, hanging along -Z."""
    bm = bmesh.new()
    pts = []
    n = 6
    for i in range(n + 1):
        t = i / n
        w = math.sin(math.pi * t) * width / 2
        pts.append((t, w))
    vl = [bm.verts.new((0, 0, 0))]
    vr = [vl[0]]
    for t, w in pts[1:-1]:
        vl.append(bm.verts.new((-w, w * 0.25, -t * length)))
        vr.append(bm.verts.new((w, w * 0.25, -t * length)))
    tip = bm.verts.new((0, 0, -length))
    vl.append(tip)
    vr.append(tip)
    mid = [bm.verts.new((0, -width * 0.06, -t * length)) for t, _ in pts[1:-1]]
    chain = [vl[0]] + mid + [tip]
    for i in range(len(chain) - 1):
        a, b_ = chain[i], chain[i + 1]
        la, lb = vl[i], vl[i + 1]
        ra, rb = vr[i], vr[i + 1]
        if la is not a and lb is not b_:
            bm.faces.new((a, la, lb, b_)) if la is not lb else None
        elif la is a and lb is not b_:
            bm.faces.new((a, lb, b_))
        elif lb is b_ and la is not a:
            bm.faces.new((a, la, b_))
        if ra is not a and rb is not b_:
            bm.faces.new((a, b_, rb, ra))
        elif ra is a and rb is not b_:
            bm.faces.new((a, b_, rb))
        elif rb is b_ and ra is not a:
            bm.faces.new((a, b_, ra))
    ob = mesh_ob(name, bm, [mat])
    ob.hide_render = True
    ob.hide_viewport = True
    return ob


# ------------------------------------------------------------------ trees


def bark():
    return textured("Kabuk", "bark_brown_02", scale=0.32, tint=(0.55, 0.5, 0.45), bump=1.6)


def willow(name, x, y, h=11.0, spread=6.5, seed=0, density=2600, lean=(0.0, 0.0), strands=1300):
    """Weeping willow: a leaning trunk, limbs arching up and out, and a dome of fine hanging
    strands (thin ribbons that carry the leaves) falling almost to the ground."""
    rnd = random.Random(seed)
    wood = bmesh.new()
    base = Vector((x, y, -0.2))
    top = Vector((x + lean[0] * h, y + lean[1] * h, h * 0.34))
    cyl(wood, base, top, 0.42 * h / 11, 0.3 * h / 11, 12)
    limbs = rnd.randint(6, 8)
    for i in range(limbs):
        a = i / limbs * math.tau + rnd.uniform(-0.3, 0.3)
        reach = spread * rnd.uniform(0.4, 0.7)
        tip = top + Vector((math.cos(a) * reach, math.sin(a) * reach, h * rnd.uniform(0.38, 0.55)))
        mid = top + (tip - top) * 0.5 + Vector((0, 0, h * 0.05))
        cyl(wood, top, mid, 0.17 * h / 11, 0.11 * h / 11, 8)
        cyl(wood, mid, tip, 0.11 * h / 11, 0.03, 6)
    mesh_ob(name + "_govde", wood, [bark()])
    c = top + Vector((0, 0, h * 0.3))
    R, Rz = spread, h * 0.4
    lob = [rnd.uniform(0, math.tau) for _ in range(3)]
    rb = bmesh.new()
    for _ in range(strands):
        th = math.acos(1 - rnd.random() * 1.25)  # mostly the upper dome and its shoulders
        ph = rnd.uniform(0, math.tau)
        out = Vector((math.cos(ph), math.sin(ph), 0))
        bump_ = 1 + 0.12 * math.sin(ph * 3 + lob[0]) + 0.08 * math.sin(ph * 5 + lob[1]) + 0.1 * math.sin(th * 4 + lob[2])
        p = c + Vector((R * math.sin(th) * math.cos(ph), R * math.sin(th) * math.sin(ph), Rz * math.cos(th))) * rnd.uniform(0.88, 1.04) * bump_
        outer = math.sin(th)
        bottom = rnd.uniform(0.6, 2.0) if outer > 0.7 else rnd.uniform(p.z * 0.45, p.z * 0.9)
        L = max(0.6, p.z - bottom)
        seg = max(5, int(L / 0.35))
        drape = outer * rnd.uniform(0.5, 1.4)
        sway = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)) * 0.25
        side = Vector((-out.y, out.x, 0)) * 0.011
        prev = None
        for k in range(seg + 1):
            t = k / seg
            q = p + out * (drape * (1 - (1 - min(1, t * 2.2)) ** 2)) + sway * t * t - Vector((0, 0, L * t))
            va, vb = rb.verts.new(q - side), rb.verts.new(q + side)
            if prev:
                rb.faces.new((prev[0], prev[1], vb, va))
            prev = (va, vb)
    curtain = mesh_ob(name, rb, [ghost_mat()], smooth=False)
    leaf = bpy.data.objects.get("SogutYaprak") or leaf_proto("SogutYaprak", 0.15, 0.03, leaf_mat("SogutYaprakM", WILLOW, 0.45))
    scatter(curtain, leaf, density, (0.6, 1.4), tilt=0.75, seed=seed, keep=False)
    return curtain


def walnut(name, x, y, h=10.0, seed=3, density=1500):
    """Walnut: short thick trunk, wide low limbs, a broad round crown of clumps."""
    rnd = random.Random(seed)
    wood = bmesh.new()
    top = Vector((x + 0.2, y, h * 0.3))
    cyl(wood, (x, y, -0.2), top, 0.45 * h / 10, 0.36 * h / 10, 14)
    cores = bmesh.new()
    cr = h * 0.5
    for i in range(7):
        a = i / 7 * math.tau + rnd.uniform(-0.25, 0.25)
        tip = top + Vector((math.cos(a) * cr * 0.75, math.sin(a) * cr * 0.75, h * rnd.uniform(0.25, 0.5)))
        mid = top + (tip - top) * 0.45 + Vector((0, 0, 0.6))
        cyl(wood, top, mid, 0.2 * h / 10, 0.13 * h / 10, 8)
        cyl(wood, mid, tip, 0.13 * h / 10, 0.04, 6)
        # side branches with leaf clumps, leaving gaps the sky shows through
        for _k in range(rnd.randint(4, 6)):
            c = tip + Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-0.4, 0.7))) * cr * 0.42
            cyl(wood, mid + (tip - mid) * rnd.uniform(0.3, 0.9), c, 0.05 * h / 10, 0.015, 5)
            blob(cores, c, cr * rnd.uniform(0.16, 0.26), (1, 1, 0.7), 2, rnd)
    for _k in range(6):
        a = rnd.uniform(0, math.tau)
        blob(cores, top + Vector((math.cos(a) * cr * 0.3, math.sin(a) * cr * 0.3, h * rnd.uniform(0.5, 0.65))), cr * 0.24, (1, 1, 0.65), 2, rnd)
    crown = mesh_ob(name, cores, [ghost_mat()])
    mesh_ob(name + "_govde", wood, [bark()])
    leaf = bpy.data.objects.get("CevizYaprak") or leaf_proto("CevizYaprak", 0.24, 0.09, leaf_mat("CevizYaprakM", WALNUT, 0.35))
    scatter(crown, leaf, density, (0.7, 1.3), tilt=3.14, seed=seed + 9, keep=False, volume=True)
    return crown


def reeds(name, x0, x1, y0, y1, density=40, seed=0, shore=None):
    """Reed bed: stalks with feathery heads, standing in the water."""
    m_stalk = leaf_mat("Saz", REED, 0.3)
    m_head = flat("SazBas", (0.36, 0.26, 0.17), 0.85)
    bm = bmesh.new()
    cyl(bm, (0, 0, -0.3), (0, 0, 2.2), 0.012, 0.004, 5)
    blob(bm, (0.02, 0, 2.38), 0.1, (0.6, 0.6, 2.4), 1)
    # two long blades
    for a in (0.6, 3.6):
        cyl(bm, (0, 0, 0.6), (math.cos(a) * 0.5, math.sin(a) * 0.5, 1.6), 0.018, 0.002, 3)
    ob = mesh_ob("SazProto", bm, [m_stalk, m_head])
    for p in ob.data.polygons:
        p.material_index = 1 if p.center.z > 2.2 else 0
    ob.hide_render = True
    ob.hide_viewport = True
    bed = bmesh.new()
    bmesh.ops.create_grid(bed, x_segments=40, y_segments=40, size=0.5)
    for v in bed.verts:
        v.co.y = y0 + (v.co.y + 0.5) * (y1 - y0)
        sx = shore(v.co.y) if shore else 0
        v.co.x = sx + x0 + (v.co.x + 0.5) * (x1 - x0)
        v.co.z = 0.0
    tgt = mesh_ob(name, bed, [ghost_mat()])
    scatter(tgt, ob, density, (0.7, 1.15), tilt=0.12, seed=seed, keep=False)
    return tgt


# ------------------------------------------------------------------ the shore


def shore_x(y):
    """Shoreline (x of the water's edge) along y; gentle bays like the plan."""
    return -2.0 + 2.8 * math.sin(y / 9.5) + 1.6 * math.sin(y / 3.7 + 1.3)


def lake(size=6000):
    plane("Gol", -size, 60, -size, size, -0.05, water_mat())


def far_shore(x=-2300, width=9000, height=140, seed=2):
    rnd = random.Random(seed)
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=240, y_segments=12, size=0.5)
    ph = [rnd.uniform(0, 10) for _ in range(4)]
    for v in bm.verts:
        u = v.co.x + 0.5  # along the shore
        k = v.co.y + 0.5  # 0 = water's edge, 1 = ridge
        y = -width / 2 + u * width
        ridge = height * (0.55 + 0.25 * math.sin(u * 9 + ph[0]) + 0.15 * math.sin(u * 27 + ph[1]) + 0.08 * math.sin(u * 71 + ph[2]))
        v.co = Vector((x - k * 900, y, ridge * (k ** 0.6) - 2))
    mesh_ob("KarsiKiyi", bm, [hills_mat()])
    # a low island off the far shore (Uluabat has several)
    isl = bmesh.new()
    blob(isl, (x + 900, 260, -6), 1.0, (160, 90, 22), 3, random.Random(4))
    mesh_ob("Ada", isl, [hills_mat()])


def ground(x0, x1, y0, y1, grass_density=0.0, tex="leafy_grass", cuts=60, seed=0):
    """Meadow from the shore eastwards: a slope at the water, then flat."""
    m = textured("Cimen", tex, scale=1.6, tint=(0.66, 0.78, 0.4), bump=0.8, sat=1.0, val=0.95)
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=cuts, y_segments=cuts, size=0.5)
    for v in bm.verts:
        y = y0 + (v.co.y + 0.5) * (y1 - y0)
        x = x0 + (v.co.x + 0.5) * (x1 - x0)
        sx = shore_x(y)
        z = 0.42 * min(1.0, max(0.0, (x - sx) / 3.0)) - 0.25 * max(0.0, (sx - x) / 2.0)
        v.co = Vector((x, y, z))
    ob = mesh_ob("Cayir", bm, [m])
    # wet mud band at the waterline
    band = bmesh.new()
    bmesh.ops.create_grid(band, x_segments=4, y_segments=cuts, size=0.5)
    for v in band.verts:
        y = y0 + (v.co.y + 0.5) * (y1 - y0)
        t = v.co.x + 0.5
        sx = shore_x(y)
        v.co = Vector((sx - 1.0 + t * 1.8, y, -0.12 + t * 0.2))
    mesh_ob("Kiyi", band, [textured("Camur", "brown_mud_02", scale=1.2, tint=(0.6, 0.55, 0.48), bump=0.7, rough_mul=0.6)])
    if grass_density:
        tufts = proto("grass_medium_02")
        g = ob.copy()
        g.data = ob.data.copy()
        g.name = "CimenDagit"
        link(g)
        # only near the camera band: grass where it can be seen at eye level
        scatter(g, tufts, grass_density, (0.6, 1.1), tilt=0.1, seed=seed, keep=False)
    return ob


def grass_patch(x0, x1, y0, y1, z, density, seed=5):
    """Tufts of real grass where the camera is close to the ground."""
    tgt = plane("CimenTutam", x0, x1, y0, y1, z, ghost_mat(), cuts=8)
    scatter(tgt, proto("grass_medium_01"), density, (0.3, 0.55), tilt=0.08, seed=seed, keep=False)
    fine = plane("CimenInce", x0, x1, y0, y1, z, ghost_mat(), cuts=8)
    scatter(fine, proto("grass_medium_02"), density * 3, (0.35, 0.6), tilt=0.1, seed=seed + 3, keep=False)
    return tgt


# ------------------------------------------------------------------ furniture


def chair_ring(cx, cy, n, r, asset="hasir", z=0.0, skip=()):
    for i in range(n):
        if i in skip:
            continue
        a = i / n * math.tau + 0.15
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        # chairs face the table: their front is -Y in the asset
        place(asset, (x, y, z), rot_z=a - math.pi / 2 + random.uniform(-0.06, 0.06))


def round_table(cx, cy, z=0.0, r=0.85, chairs=10, candles=3, lights=True, seed=0, asset="hasir"):
    rnd = random.Random(seed)
    bm = bmesh.new()
    # draped cloth: top disc and a skirt flaring slightly to the floor
    res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=48, radius1=r + 0.06, radius2=r, depth=0.76)
    for v in res["verts"]:
        v.co.z += 0.38
        # soft folds on the skirt
        if v.co.z < 0.7:
            ang = math.atan2(v.co.y, v.co.x)
            f = 1 + 0.018 * math.sin(ang * 16 + seed) * (0.76 - v.co.z)
            v.co.x *= f
            v.co.y *= f
    for v in bm.verts:
        v.co += Vector((cx, cy, z))
    ob = mesh_ob("Masa", bm, [linen()])
    md = ob.modifiers.new("b", "BEVEL")
    md.width = 0.025
    md.segments = 3
    md.limit_method = "ANGLE"
    # plates, glasses, centrepiece
    plate = flat("Tabak", (0.9, 0.89, 0.85), 0.18)
    gl = glass()
    bm = bmesh.new()
    gbm = bmesh.new()
    for i in range(chairs):
        a = i / chairs * math.tau + 0.15
        px, py = cx + math.cos(a) * (r - 0.2), cy + math.sin(a) * (r - 0.2)
        res = bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=0.135, radius2=0.14, depth=0.02)
        for v in res["verts"]:
            v.co += Vector((px, py, z + 0.77))
        gx, gy = cx + math.cos(a + 0.22) * (r - 0.38), cy + math.sin(a + 0.22) * (r - 0.38)
        res = bmesh.ops.create_cone(gbm, cap_ends=True, segments=16, radius1=0.032, radius2=0.04, depth=0.12)
        for v in res["verts"]:
            v.co += Vector((gx, gy, z + 0.82))
    mesh_ob("Tabaklar", bm, [plate])
    mesh_ob("Bardaklar", gbm, [gl])
    # low greenery and white flowers in the middle
    cbm = bmesh.new()
    for _ in range(9):
        a = rnd.uniform(0, math.tau)
        d = rnd.uniform(0, 0.22)
        blob(cbm, (cx + math.cos(a) * d, cy + math.sin(a) * d, z + 0.84), rnd.uniform(0.06, 0.1), (1, 1, 0.7), 2, rnd)
    green = mesh_ob("Orta", cbm, [ghost_mat()])
    leaf = bpy.data.objects.get("OrtaYaprak") or leaf_proto("OrtaYaprak", 0.06, 0.03, leaf_mat("OrtaYaprakM", [(0.05, 0.09, 0.04), (0.09, 0.14, 0.05), (0.13, 0.17, 0.08)], 0.25))
    scatter(green, leaf, 900, (0.7, 1.2), tilt=3.14, seed=seed + 20, keep=False)
    fbm = bmesh.new()
    for _ in range(7):
        a = rnd.uniform(0, math.tau)
        d = rnd.uniform(0, 0.2)
        blob(fbm, (cx + math.cos(a) * d, cy + math.sin(a) * d, z + 0.9 + rnd.uniform(0, 0.05)), 0.035, (1, 1, 0.8), 3, rnd)
    mesh_ob("Cicek", fbm, [flat("Cicek", (0.92, 0.9, 0.84), 0.6)])
    for k in range(candles):
        a = k / candles * math.tau + 0.5
        candle((cx + math.cos(a) * 0.3, cy + math.sin(a) * 0.3, z + 0.76), light=lights)
    chair_ring(cx, cy, chairs, r + 0.42, asset, z)
    return ob


def candle(p, light=True, h=0.1):
    bm = bmesh.new()
    cyl(bm, p, (p[0], p[1], p[2] + h), 0.022, 0.022, 14, caps=True)
    mesh_ob("Mum", bm, [flat("MumGovde", (0.92, 0.88, 0.78), 0.4)])
    gb = bmesh.new()
    cyl(gb, p, (p[0], p[1], p[2] + h * 0.7), 0.042, 0.045, 18, caps=False)
    mesh_ob("MumCam", gb, [glass("CamAmber", (1.0, 0.9, 0.75), 0.05)])
    fb = bmesh.new()
    blob(fb, (p[0], p[1], p[2] + h + 0.022), 0.009, (1, 1, 2.4), 2)
    mesh_ob("Alev", fb, [flame_mat()])
    if light:
        point("MumIsik", (p[0], p[1], p[2] + h + 0.03), 1.6, radius=0.006)


def lantern_post(x, y, z=0.0, energy=14.0, h=1.15):
    bm = bmesh.new()
    cyl(bm, (x, y, z - 0.2), (x, y, z + h), 0.045, 0.04, 8, caps=True)
    mesh_ob("Direk", bm, [textured("DirekAhsap", "raw_plank_wall", scale=0.5, tint=(0.5, 0.42, 0.35))])
    place("wooden_lantern_01", (x, y, z + h), random.uniform(0, 6.28), 0.85)
    fb = bmesh.new()
    blob(fb, (x, y, z + h + 0.17), 0.03, (1, 1, 1.6), 1)
    mesh_ob("FenerAlev", fb, [flame_mat()])
    point("Fener", (x, y, z + h + 0.2), energy, radius=0.04)


def dance_floor(x, y, w, d, z=0.0):
    box("Pist", x - w / 2, x + w / 2, y - d / 2, y + d / 2, z, z + 0.08, textured("PistAhsap", "old_wood_floor", scale=1.2, tint=(1.0, 0.92, 0.8)), 0.01)


# ------------------------------------------------------------------ scenes

SUN_ROT = 282  # a June sunset sits a little north of west


def scene_cayir(close=False):
    elev = 1.8 if not close else 1.4
    sky(elev, SUN_ROT, 1.0, close, 1.0)  # wide view: no sun disc (it read as a lamp on the horizon)
    bpy.context.scene.view_settings.exposure = -0.3
    if not close:
        # the bright western sky bounces back onto the meadow: a soft warm fill from behind the camera
        area_light("Gokyuzu", (shore_x(2) + 30, -8, 7), (shore_x(2) + 8, 2, 0), 14, 2600, (1.0, 0.82, 0.66))
    lake()
    far_shore()
    ground(-12, 60, -45, 45)
    grass_patch(shore_x(2) + 6, shore_x(2) + 30, -16, 10, 0.42, 90)
    reeds("Sazlik1", -4.5, -0.6, 12, 34, 22, 1, shore_x)
    reeds("Sazlik2", -4.0, -0.6, -40, -16, 22, 2, shore_x)
    willow("Sogut1", shore_x(19) + 3.5, 19, 10, 8.5, 1, lean=(-0.05, 0.0))
    willow("Sogut2", shore_x(-12) + 3.0, -12, 9.5, 8.0, 2, lean=(-0.06, 0.01))
    willow("Sogut3", 24, 22, 9, 7.5, 3)
    willow("Sogut4", 34, -22, 9.5, 8.0, 4)
    # dance floor near the water, tables in arcs to the east (as on the plan)
    px, py = shore_x(2) + 5.5, 2.0
    dance_floor(px, py, 7.5, 6.0, 0.42)
    k = 0
    for ring, R in enumerate((7.2, 10.4, 13.6)):
        n = 7 + ring * 2
        for i in range(n):
            a = math.radians(-78 + i * 156 / (n - 1))  # fan opening east, away from the water
            x, y = px + R * math.cos(a), py + R * math.sin(a)
            round_table(x, y, 0.42, chairs=10, candles=3, lights=True, seed=k)
            k += 1
    # lanterns along the gravel walk to the east and down to the shore
    for i, y in enumerate(range(-22, 26, 6)):
        lantern_post(px + 18.5, y, 0.42)
    for x in (px + 4, px + 9, px + 14):
        lantern_post(x, -14, 0.42)
    if close:
        a = math.radians(-26)
        t = (px + 7.2 * math.cos(a), py + 7.2 * math.sin(a))
        camera((t[0] + 2.1, t[1] - 0.9, 1.72), (t[0] - 3.5, t[1] + 1.2, 1.15), lens=45, fstop=2.0, focus=2.2)
    else:
        camera((px + 18.5, py - 7.0, 1.8), (px - 10, py + 3.5, 1.45), lens=30, fstop=5.6, focus=9)
    output(1800, 1200)


def scene_iskele(close=False):
    sky(2.2 if not close else 1.4, SUN_ROT - 6, 1.0, True, 1.0)
    bpy.context.scene.view_settings.exposure = -0.4
    lake()
    far_shore()
    ground(-12, 60, -45, 45)
    reeds("Sazlik1", -4.5, -0.6, 7, 30, 26, 1, shore_x)
    reeds("Sazlik2", -4.5, -0.6, -34, -6, 26, 2, shore_x)
    willow("Sogut1", shore_x(10) + 3.0, 10.5, 12, 7.0, 1, lean=(-0.08, 0.0))
    willow("Sogut2", shore_x(-9) + 3.0, -9.5, 11, 6.5, 2, lean=(-0.07, 0.0))
    # the pier: 2.2 m wide, 26 m into the lake, a platform at its end
    sx = shore_x(0) + 0.6
    deck = textured("Iskele", "old_wood_floor", scale=1.5, tint=(0.9, 0.82, 0.7))
    x_end = sx - 17
    box("IskeleYol", x_end, sx + 1.5, -1.1, 1.1, 0.35, 0.45, deck)
    box("IskeleUc", x_end - 5, x_end, -3.0, 3.0, 0.35, 0.45, deck)
    posts = bmesh.new()
    for x in [x_end - 5 + i * 2.5 for i in range(14)]:
        for y in ((-1.1, 1.1) if x > x_end else (-3.0, 3.0)):
            cyl(posts, (x, y, -1.0), (x, y, 0.62 if x > x_end else 1.0), 0.07, 0.065, 8, caps=True)
    mesh_ob("Kazik", posts, [textured("KazikAhsap", "raw_plank_wall", scale=0.5, tint=(0.45, 0.4, 0.35))])
    # rope rail with lanterns along the pier
    for x in [x_end + 2 + i * 5 for i in range(5)]:
        for y in (-1.1, 1.1):
            place("Lantern_01", (x, y, 0.62), random.uniform(0, 6.28), 0.9)
            point("IskeleFener", (x, y, 0.75), 3.0, radius=0.02)
    # the ceremony table on the platform, and two chairs facing the lake
    tx = x_end - 3.2
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=12, y_segments=40, size=0.5)
    # a cloth over a 0.8 x 1.6 table: flat top, sides falling in soft folds to the deck
    tob = None
    top_bm = bmesh.new()
    bmesh.ops.create_cube(top_bm, size=1.0)
    for v in top_bm.verts:
        v.co = Vector((tx + v.co.x * 0.84, v.co.y * 1.66, 0.45 + 0.72 + (v.co.z + 0.5) * 0.05))
    tob = mesh_ob("NikahMasa", top_bm, [linen()])
    md = tob.modifiers.new("b", "BEVEL")
    md.width = 0.02
    md.segments = 3
    sk = bmesh.new()
    perim = []
    for i in range(160):
        t = i / 160 * 4
        if t < 1: px_, py_ = -0.42 + 0.84 * t, -0.83
        elif t < 2: px_, py_ = 0.42, -0.83 + 1.66 * (t - 1)
        elif t < 3: px_, py_ = 0.42 - 0.84 * (t - 2), 0.83
        else: px_, py_ = -0.42, 0.83 - 1.66 * (t - 3)
        perim.append((px_, py_, i))
    rows = []
    for k in range(9):
        zz = 0.45 + 0.77 - k * (0.76 / 8)
        row = []
        for px_, py_, i in perim:
            f = 1 + (k / 8) * 0.06 + 0.035 * (k / 8) * math.sin(i * 0.9)
            row.append(sk.verts.new((tx + px_ * f, py_ * f, zz)))
        rows.append(row)
    for k in range(8):
        for i in range(160):
            a, b_ = rows[k][i], rows[k][(i + 1) % 160]
            c_, d_ = rows[k + 1][(i + 1) % 160], rows[k + 1][i]
            sk.faces.new((a, b_, c_, d_))
    mesh_ob("NikahOrtu", sk, [linen()])
    cbm = bmesh.new()
    for i in range(10):
        blob(cbm, (tx + random.uniform(-0.1, 0.1), random.uniform(-0.6, 0.6), 1.25), random.uniform(0.07, 0.12), (1, 1, 0.8), 2)
    g = mesh_ob("NikahCicek", cbm, [ghost_mat()])
    scatter(g, leaf_proto("NikahYaprak", 0.06, 0.03, leaf_mat("NikahYaprakM", [(0.06, 0.1, 0.04), (0.12, 0.16, 0.07)], 0.25)), 900, (0.7, 1.2), 3.14, 31, keep=False)
    fb = bmesh.new()
    for i in range(14):
        blob(fb, (tx + random.uniform(-0.12, 0.12), random.uniform(-0.6, 0.6), 1.3 + random.uniform(0, 0.08)), 0.04, (1, 1, 0.85), 3)
    mesh_ob("NikahBeyaz", fb, [flat("Cicek", (0.92, 0.9, 0.84), 0.6)])
    for y in (-0.5, 0.5):
        place("hasir", (tx - 0.8, y, 0.45), rot_z=math.pi / 2)
    for y in (-1.35, 1.35):
        place("wooden_lantern_01", (tx + 0.55, y, 0.45), 0.3, 1.3)
        fb = bmesh.new()
        blob(fb, (tx + 0.55, y, 0.69), 0.03, (1, 1, 1.6), 2)
        mesh_ob("FenerAlev", fb, [flame_mat()])
        point("PlatformFener", (tx + 0.55, y, 0.72), 10.0, radius=0.03)
    for y in (-0.4, 0.4):
        candle((tx - 0.15, y * 1.5, 1.21))
    # guests' chairs on the shore, rows facing the pier, an aisle in the middle
    for r in range(8):
        x = sx + 4.5 + r * 1.05
        for side in (-1, 1):
            for c in range(5):
                y = side * (1.15 + c * 0.58)
                place("hasir", (x, y, 0.42), rot_z=-math.pi / 2 + random.uniform(-0.03, 0.03))
    # a linen runner down the aisle onto the pier
    jute = textured("Jut", "rough_linen", scale=0.25, tint=(0.62, 0.5, 0.36), bump=0.6, sat=0.4, val=0.9)
    plane("Yolluk", sx - 0.5, sx + 13.5, -0.42, 0.42, 0.435, jute)
    plane("Yolluk2", x_end, sx + 1.5, -0.42, 0.42, 0.455, jute)
    for x in (sx + 3.5, sx + 13.2):
        for y in (-3.8, 3.8):
            lantern_post(x, y, 0.42, energy=10)
    if close:
        # warm bounce from the lanterns behind the camera, so the cloth reads as linen, not a box
        area_light("Dolgu", (tx + 4.5, -3.0, 2.2), (tx, 0, 0.9), 2.5, 140, (1.0, 0.72, 0.48))
        camera((tx + 2.9, -2.6, 1.3), (tx - 2.6, 1.2, 1.0), lens=34, fstop=2.8, focus=3.6)
    else:
        camera((sx + 15.5, 0.0, 1.55), (x_end - 8, 0.4, 0.9), lens=35, fstop=8.0, focus=16)
    output(1800, 1200)


# ---- the barn


def truss(y, x0, x1, wall_h, ridge_h, mat):
    w = 0.22
    mid = (x0 + x1) / 2
    bm = bmesh.new()
    cyl(bm, (x0, y, wall_h), (mid, y, ridge_h), w * 0.6, w * 0.6, 4, True)
    cyl(bm, (x1, y, wall_h), (mid, y, ridge_h), w * 0.6, w * 0.6, 4, True)
    cyl(bm, (x0, y, wall_h + 0.1), (x1, y, wall_h + 0.1), w * 0.55, w * 0.55, 4, True)
    cyl(bm, (mid, y, wall_h + 0.1), (mid, y, ridge_h), w * 0.45, w * 0.45, 4, True)
    for s in (-1, 1):
        cyl(bm, (mid, y, wall_h + 0.9), (mid + s * (x1 - x0) * 0.26, y, wall_h + 0.1 + (ridge_h - wall_h) * 0.48), w * 0.38, w * 0.38, 4, True)
    mesh_ob("Makas", bm, [mat], smooth=False)


def net(name, x, y0, y1, z0, z1, sag=0.5, seed=0):
    """A fishing net hung on the wall in loose swags, with cork floats along the top rope."""
    rnd = random.Random(seed)
    bm = bmesh.new()
    nx, nz = int((y1 - y0) / 0.09), int((z1 - z0) / 0.09)
    bmesh.ops.create_grid(bm, x_segments=nx, y_segments=nz, size=0.5)
    for v in bm.verts:
        u, k = v.co.x + 0.5, v.co.y + 0.5
        y = y0 + u * (y1 - y0)
        z = z1 - k * (z1 - z0) * (1 - 0.25 * math.sin(u * math.pi * 3) ** 2) - sag * math.sin(u * math.pi * 3) ** 2 * (1 - k)
        v.co = Vector((x + 0.04 + 0.05 * k * k, y, z))
    ob = mesh_ob(name, bm, [flat("Ag", (0.30, 0.22, 0.14), 0.8)], smooth=False)
    md = ob.modifiers.new("w", "WIREFRAME")
    md.thickness = 0.004
    md.use_replace = True
    fl = bmesh.new()
    for i in range(16):
        u = (i + 0.5) / 16
        y = y0 + u * (y1 - y0)
        z = z1 - sag * math.sin(u * math.pi * 3) ** 2
        cyl(fl, (x + 0.08, y, z - 0.05), (x + 0.08, y, z + 0.05), 0.045, 0.045, 10, True)
    mesh_ob(name + "_mantar", fl, [flat("Mantar", (0.55, 0.33, 0.16), 0.75)])


def wall_y(name, x0, x1, y0, y1, h, openings, mat, frame_mat):
    """A wall running along Y with rectangular openings (ya, yb, za, zb) and timber lintels."""
    ops = sorted(openings)
    y = y0
    for (a, b_, za, zb) in ops:
        if a > y:
            box(name, x0, x1, y, a, 0, h, mat)
        if za > 0:
            box(name + "Alt", x0, x1, a, b_, 0, za, mat)
        box(name + "Lento", x0 - 0.02, x1 + 0.02, a - 0.15, b_ + 0.15, zb, zb + 0.22, frame_mat)
        if zb + 0.22 < h:
            box(name + "Ust", x0, x1, a, b_, zb + 0.22, h, mat)
        y = b_
    if y < y1:
        box(name, x0, x1, y, y1, 0, h, mat)


def barn(evening=True):
    """Ağ Ambarı: 12 x 26 m, stone walls 4.2 m, timber roof to 8 m. West door 4 m wide to the meadow."""
    X0, X1, Y0, Y1, WH, RH = 0.0, 12.0, 0.0, 26.0, 4.2, 8.0
    stone = textured("AmbarTas", "plastered_stone_wall", scale=2.2, tint=(1.0, 0.94, 0.86), bump=0.9)
    wood = textured("Ahsap", "raw_plank_wall", scale=1.4, tint=(0.62, 0.5, 0.4))
    floor = textured("AmbarZemin", "old_wood_floor", scale=1.6, tint=(0.95, 0.85, 0.74))
    roofm = textured("Cati", "roof_planks", scale=1.8, tint=(0.7, 0.58, 0.46))
    plane("Zemin", X0, X1, Y0, Y1, 0.0, floor)
    T = 0.5
    door = (9.0, 13.0)  # west door y span
    wins = [(2.6, 4.0), (5.6, 7.0), (15.4, 16.8), (18.6, 20.0), (21.8, 23.2)]
    west = [(door[0], door[1], 0.0, 3.4)] + [(a, b_, 1.0, 3.0) for a, b_ in wins]
    east = [(a, b_, 1.0, 3.0) for a, b_ in wins] + [(10.2, 11.8, 1.0, 3.0)]
    wall_y("DuvarBati", X0 - T, X0, Y0 - T, Y1 + T, WH, west, stone, wood)
    wall_y("DuvarDogu", X1, X1 + T, Y0 - T, Y1 + T, WH, east, stone, wood)
    box("DuvarKuzey", X0 - T, X1 + T, Y1, Y1 + T, 0, WH, stone)
    box("DuvarGuney", X0 - T, X1 + T, Y0 - T, Y0, 0, WH, stone)
    # gables
    for y, yy in ((Y0 - T, Y0), (Y1, Y1 + T)):
        bm = bmesh.new()
        vs = [bm.verts.new(p) for p in ((X0 - T, y, WH), (X1 + T, y, WH), ((X0 + X1) / 2, y, RH + 0.3))]
        vs2 = [bm.verts.new((p.co.x, yy, p.co.z)) for p in vs]
        bm.faces.new(vs)
        bm.faces.new(list(reversed(vs2)))
        for i in range(3):
            bm.faces.new((vs[i], vs[(i + 1) % 3], vs2[(i + 1) % 3], vs2[i]))
        mesh_ob("Alin", bm, [stone], smooth=False)
    # roof: two sloping slabs
    mid = (X0 + X1) / 2
    for s in (-1, 1):
        bm = bmesh.new()
        ex = X0 - T - 0.6 if s < 0 else X1 + T + 0.6
        quad = [(ex, Y0 - T - 0.4, WH - 0.35), (mid, Y0 - T - 0.4, RH + 0.3), (mid, Y1 + T + 0.4, RH + 0.3), (ex, Y1 + T + 0.4, WH - 0.35)]
        a = [bm.verts.new(p) for p in quad]
        b = [bm.verts.new((p[0], p[1], p[2] + 0.18)) for p in quad]
        bm.faces.new(a if s < 0 else list(reversed(a)))
        bm.faces.new(list(reversed(b)) if s < 0 else b)
        for i in range(4):
            bm.faces.new((a[i], a[(i + 1) % 4], b[(i + 1) % 4], b[i]))
        mesh_ob("Cati", bm, [roofm], smooth=False)
    for y in [Y0 + 1.5 + i * 3.2 for i in range(8)]:
        truss(y, X0, X1, WH, RH, wood)
    box("Mertek", mid - 0.12, mid + 0.12, Y0, Y1, RH - 0.1, RH + 0.12, wood)
    for s in (0.3, 0.62):
        for side in (-1, 1):
            x = mid + side * (X1 - X0) / 2 * (1 - s)
            z = WH + (RH - WH) * s
            box("Asik", x - 0.09, x + 0.09, Y0, Y1, z - 0.1, z + 0.08, wood)
    # nets on the east wall and the north gable
    net("Ag1", X1 - 0.08 - 0.12, 2.0, 11.0, 1.6, 3.9, 0.55, 1)
    net("Ag2", X1 - 0.08 - 0.12, 14.5, 24.0, 1.4, 3.9, 0.6, 2)
    return X0, X1, Y0, Y1, WH, RH, door


def string_lights(points, sag, n, strength=9.0, watts=0.0):
    bm = bmesh.new()
    wire = bmesh.new()
    for (a, b) in zip(points[:-1], points[1:]):
        a, b = Vector(a), Vector(b)
        prev = a
        for i in range(1, n + 1):
            t = i / n
            p = a.lerp(b, t) - Vector((0, 0, sag * math.sin(math.pi * t)))
            cyl(wire, prev, p, 0.004, 0.004, 4)
            prev = p
            if i < n:
                blob(bm, p - Vector((0, 0, 0.06)), 0.035, (1, 1, 1.25), 1)
                if watts:
                    point("Ampul", p - Vector((0, 0, 0.1)), watts, (1.0, 0.66, 0.36), 0.03)
    mesh_ob("Kablo", wire, [flat("Kablo", (0.02, 0.02, 0.02), 0.5)])
    mesh_ob("Ampuller", bm, [bulb_mat(strength)])


def long_table(x, y0, y1, z=0.0, chairs_each=8, asset="dining_chair_02", candles=True, seed=0):
    rnd = random.Random(seed)
    wood = textured("MasaAhsap", "old_wood_floor", scale=1.0, tint=(0.75, 0.6, 0.48), rough_mul=0.8)
    box("UzunMasa", x - 0.5, x + 0.5, y0, y1, z + 0.72, z + 0.77, wood, 0.01)
    lg = bmesh.new()
    for yy in (y0 + 0.2, y1 - 0.2):
        for xx in (x - 0.4, x + 0.4):
            cyl(lg, (xx, yy, z), (xx, yy, z + 0.72), 0.035, 0.035, 8, True)
    mesh_ob("Ayak", lg, [wood])
    plane("Runner", x - 0.22, x + 0.22, y0 - 0.02, y1 + 0.02, z + 0.772, linen())
    plate = flat("Tabak", (0.9, 0.89, 0.85), 0.18)
    pb = bmesh.new()
    gb = bmesh.new()
    L = y1 - y0
    for i in range(chairs_each):
        y = y0 + (i + 0.5) / chairs_each * L
        for side in (-1, 1):
            res = bmesh.ops.create_cone(pb, cap_ends=True, segments=24, radius1=0.13, radius2=0.135, depth=0.02)
            for v in res["verts"]:
                v.co += Vector((x + side * 0.3, y, z + 0.785))
            res = bmesh.ops.create_cone(gb, cap_ends=True, segments=16, radius1=0.03, radius2=0.038, depth=0.12)
            for v in res["verts"]:
                v.co += Vector((x + side * 0.16, y + 0.2, z + 0.835))
            place(asset, (x + side * 0.82, y + rnd.uniform(-0.04, 0.04), z), rot_z=(math.pi / 2 if side < 0 else -math.pi / 2) + rnd.uniform(-0.05, 0.05))
    mesh_ob("Tabaklar", pb, [plate])
    mesh_ob("Bardaklar", gb, [glass()])
    if candles:
        for i in range(int(L / 1.4)):
            y = y0 + 0.7 + i * 1.4
            candle((x + rnd.uniform(-0.05, 0.05), y, z + 0.775), light=True, h=rnd.choice((0.08, 0.12, 0.16)))
        cb = bmesh.new()
        for i in range(int(L / 0.35)):
            y = y0 + 0.2 + i * 0.35
            blob(cb, (x + rnd.uniform(-0.06, 0.06), y, z + 0.8), rnd.uniform(0.05, 0.08), (1, 1.4, 0.55), 2, rnd)
        g = mesh_ob("Sarmasik", cb, [ghost_mat()])
        leaf = bpy.data.objects.get("OrtaYaprak") or leaf_proto("OrtaYaprak", 0.06, 0.03, leaf_mat("OrtaYaprakM", [(0.05, 0.09, 0.04), (0.09, 0.14, 0.05), (0.13, 0.17, 0.08)], 0.25))
        scatter(g, leaf, 700, (0.7, 1.2), tilt=3.14, seed=seed + 40, keep=False)


def screen_image(cx, y, w, h, z0):
    """Projection screen showing the Gölyazı photograph (our own site image, Pexels licence)."""
    raw = os.path.join(HERE, "..", "..", "..", "..", "rasitburucu-web-demos-wt", "sazbahce", "scripts", ".raw", "sazbahce", "36520717.jpg")
    m = bpy.data.materials.new("Perde")
    m.use_nodes = True
    nt = m.node_tree
    out = next(x for x in nt.nodes if x.type == "OUTPUT_MATERIAL")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Strength"].default_value = 0.9
    if os.path.exists(raw):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(raw)
        uv = nt.nodes.new("ShaderNodeTexCoord")
        nt.links.new(uv.outputs["UV"], t.inputs["Vector"])
        nt.links.new(t.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs[0], out.inputs["Surface"])
    bpy.ops.mesh.primitive_plane_add(size=1)
    ob = bpy.context.active_object
    ob.name = "Perde"
    ob.scale = (w, h, 1)
    ob.rotation_euler = (math.radians(90), 0, math.pi)
    ob.location = (cx, y - 0.02, z0 + h / 2)
    ob.data.materials.append(m)
    box("PerdeKasa", cx - w / 2 - 0.08, cx + w / 2 + 0.08, y - 0.01, y + 0.02, z0 - 0.08, z0 + h + 0.08, flat("Kasa", (0.05, 0.05, 0.05), 0.5))


def scene_ambar(theatre=False, rounds=False):
    elev, rot = (2.0, SUN_ROT) if not theatre else (16.0, 245)
    sky(elev, rot, 1.0, True, 1.0)
    bpy.context.scene.view_settings.exposure = 0.9 if not theatre else 1.0
    X0, X1, Y0, Y1, WH, RH, door = barn()
    lake()
    far_shore()
    ground(-60, -0.5, -40, 60)
    willow("SogutKapi", -14, 16, 11, 6.5, 7)
    willow("SogutKapi2", -10, 2, 10, 6.0, 8)
    mid = (X0 + X1) / 2
    if rounds:
        # wedding in the barn: round tables of ten, dance floor in front of the north wall
        dance_floor(mid, Y1 - 4.2, 5.5, 4.5, 0.0)
        k = 0
        for y in (4.0, 7.6, 11.2, 14.8, 18.4):
            for x in (2.4, 6.0 if y < 17 else None, 9.6):
                if x is None:
                    continue
                round_table(x, y, 0.0, r=0.8, chairs=10, candles=3, seed=70 + k)
                k += 1
        for y in [Y0 + 1.5 + i * 3.2 for i in range(8)]:
            string_lights([(X0 + 0.4, y, WH + 0.15), (mid, y, WH + 1.6), (X1 - 0.4, y, WH + 0.15)], 0.35, 9, 14.0, 5.0)
        area_light("Dolgu", (mid, Y1 / 2, RH - 0.6), (mid, Y1 / 2, 0), 9, 2600, (1.0, 0.68, 0.42), 22)
        camera((X1 - 1.4, 0.8, 2.3), (mid - 1.2, 15, 0.9), lens=24, fstop=5.6, focus=8)
    elif not theatre:
        for x in (3.3, 8.7):
            long_table(x, 2.5, 23.5, 0, chairs_each=14, seed=int(x))
        for y in [Y0 + 1.5 + i * 3.2 for i in range(8)]:
            string_lights([(X0 + 0.4, y, WH + 0.15), (mid, y, WH + 1.6), (X1 - 0.4, y, WH + 0.15)], 0.35, 9, 14.0, 5.0)
        # the warm bounce of a room full of small lights
        area_light("Dolgu", (mid, Y1 / 2, RH - 0.6), (mid, Y1 / 2, 0), 9, 2600, (1.0, 0.68, 0.42), 22)
        for y in (6.3, 12.7, 19.1):
            place("caged_hanging_light", (mid, y, WH + 1.2), 0, 1.0)
            point("Avize", (mid, y, WH + 0.75), 25.0, radius=0.08)
        camera((mid + 2.6, 0.9, 1.65), (mid - 1.5, 18, 1.35), lens=24, fstop=5.6, focus=7.5)
    else:
        # presentation: screen on the north gable, theatre rows, daylight through the door
        screen_image(mid, Y1 - 0.2, 4.8, 2.7, 1.3)
        box("Kursu", mid - 3.6, mid - 3.0, Y1 - 2.0, Y1 - 1.6, 0, 1.15, textured("KursuAhsap", "old_wood_floor", 0.6, (0.7, 0.55, 0.42)), 0.01)
        for r in range(11):
            y = Y1 - 4.2 - r * 1.0
            for side in (-1, 1):
                for c in range(6):
                    x = mid + side * (0.9 + c * 0.6)
                    place("dining_chair_02", (x, y, 0), rot_z=math.pi)
        for y in [Y0 + 1.5 + i * 3.2 for i in range(8)]:
            string_lights([(X0 + 0.4, y, WH + 0.15), (mid, y, WH + 1.6), (X1 - 0.4, y, WH + 0.15)], 0.35, 9, 4.0)
        area_light("Dolgu", (mid, Y1 / 2, RH - 0.6), (mid, Y1 / 2, 0), 9, 2200, (1.0, 0.93, 0.85), 22)
        camera((X1 - 1.3, 2.0, 2.0), (mid - 1.0, Y1 - 3, 1.5), lens=24, fstop=8, focus=12)
    output(1800, 1200)


# ---- the yard


def house(x0, x1, y0, y1, h, stone):
    """Two-storey stone house on the yard's north side: hipped tile roof, eaves, framed lit windows, a door."""
    box("Ev", x0, x1, y0, y1, 0, h, stone)
    tiles = textured("Kiremit", "clay_roof_tiles_02", scale=1.6, tint=(0.85, 0.62, 0.5), bump=0.9)
    o = 0.55
    bm = bmesh.new()
    ridge_z = h + 2.2
    cx = (x0 + x1) / 2
    yc = (y0 + y1) / 2
    eaves = [(x0 - o, y0 - o, h), (x1 + o, y0 - o, h), (x1 + o, y1 + o, h), (x0 - o, y1 + o, h)]
    r1, r2 = (x0 + 2.2, yc, ridge_z), (x1 - 2.2, yc, ridge_z)
    v = [bm.verts.new(p) for p in eaves]
    rv = [bm.verts.new(r1), bm.verts.new(r2)]
    bm.faces.new((v[0], v[1], rv[1], rv[0]))
    bm.faces.new((v[1], v[2], rv[1]))
    bm.faces.new((v[2], v[3], rv[0], rv[1]))
    bm.faces.new((v[3], v[0], rv[0]))
    roof = mesh_ob("Cati", bm, [tiles], smooth=False)
    sol = roof.modifiers.new("k", "SOLIDIFY")
    sol.thickness = 0.12
    box("Sacak", x0 - o, x1 + o, y0 - o, y0 - o + 0.06, h - 0.18, h, textured("SacakAhsap", "raw_plank_wall", 0.6, (0.45, 0.33, 0.24)))
    frame = textured("Cerceve", "raw_plank_wall", scale=0.5, tint=(0.5, 0.36, 0.25))
    lit = flat("Pencere", (1.0, 0.7, 0.4), 0.4, emit=4.0, emit_color=(1.0, 0.6, 0.28))
    shut = textured("Kepenk", "raw_plank_wall", scale=0.6, tint=(0.32, 0.42, 0.4))
    for wx in (x0 + 1.6, (x0 + x1) / 2, x1 - 1.6):
        for wz, wh in ((1.0, 1.5), (4.0, 1.4)):
            if wz < 2 and abs(wx - (x0 + x1) / 2) < 0.1:
                continue  # the door goes here
            box("Pencere", wx - 0.45, wx + 0.45, y0 - 0.03, y0 + 0.05, wz, wz + wh, lit)
            box("PencereCerceve", wx - 0.55, wx + 0.55, y0 - 0.08, y0, wz - 0.1, wz - 0.02, frame)
            box("PencereCerceve", wx - 0.55, wx + 0.55, y0 - 0.08, y0, wz + wh, wz + wh + 0.1, frame)
            box("Kayit", wx - 0.03, wx + 0.03, y0 - 0.06, y0, wz, wz + wh, frame)
            box("Kayit", wx - 0.45, wx + 0.45, y0 - 0.06, y0, wz + wh * 0.62, wz + wh * 0.62 + 0.05, frame)
            for side in (-1, 1):
                box("Kepenk", wx + side * 0.47 + (0 if side > 0 else -0.42), wx + side * 0.47 + (0.42 if side > 0 else 0), y0 - 0.14, y0 - 0.1, wz, wz + wh, shut)
    dx = (x0 + x1) / 2
    box("Kapi", dx - 0.6, dx + 0.6, y0 - 0.05, y0 + 0.05, 0, 2.3, textured("KapiAhsap", "raw_plank_wall", 0.8, (0.42, 0.28, 0.18)))
    box("KapiLento", dx - 0.8, dx + 0.8, y0 - 0.12, y0, 2.3, 2.5, frame)
    point("KapiLamba", (dx, y0 - 0.35, 2.75), 18.0, radius=0.05)
    place("Lantern_01", (dx + 0.9, y0 - 0.2, 2.2), 0, 1.4)


def scene_avlu(close=False):
    sky(-1.2, SUN_ROT, 1.4, False, 1.0)  # the last light: sun just under the horizon
    bpy.context.scene.view_settings.exposure = 1.6
    stone = textured("AvluTas", "stone_wall_04", scale=2.4, tint=(0.95, 0.9, 0.82), bump=1.0)
    floor = textured("AvluZemin", "gravel_ground_01", scale=1.4, tint=(0.85, 0.8, 0.72))
    S = 15.6
    plane("AvluZemin", -2, S + 2, -2, S + 2, 0, floor)
    # outside the walls: the meadow sloping down to the lake, willows on the shore
    plane("Dis", -40, 60, -40, 60, -0.02, textured("Cimen", "leafy_grass", scale=1.6, tint=(0.66, 0.78, 0.4), bump=0.8, sat=1.0, val=0.95))
    lake()
    far_shore()
    willow("AvluSogut", -16, 8, 10, 7.0, 21)
    willow("AvluSogut2", -12, -6, 9, 6.5, 22)
    T, H = 0.6, 3.0
    box("AvluDuvarK", -T, S + T, S, S + T, 0, H, stone)
    box("AvluDuvarD", S, S + T, -T, S, 0, H, stone)
    box("AvluDuvarB1", -T, 0, -T, 6.0, 0, H, stone)
    box("AvluDuvarB2", -T, 0, 9.6, S, 0, H, stone)
    box("AvluDuvarG", -T, S + T, -T, 0, 0, H, stone)
    # wall coping
    cop = textured("Harpusta", "stone_wall_04", scale=1.0, tint=(0.8, 0.76, 0.7))
    for b in ((-T - 0.1, S + T + 0.1, S - 0.1, S + T + 0.1), (S - 0.1, S + T + 0.1, -T, S)):
        box("Harpusta", b[0], b[1], b[2], b[3], H, H + 0.14, cop)
    # an old stone house along the north wall, warm windows
    house(2.0, 11.0, S + T, S + T + 7, 6.6, stone)
    walnut("Ceviz", S / 2, S / 2, 10.5, 3, 330)
    # warm uplights at the foot of the walnut, as a venue would light it
    for a in (0.4, 2.5, 4.6):
        sp = bpy.data.lights.new("Yukari", "SPOT")
        sp.energy = 260
        sp.color = (1.0, 0.72, 0.45)
        sp.spot_size = math.radians(70)
        sp.shadow_soft_size = 0.1
        so = bpy.data.objects.new("Yukari", sp)
        link(so)
        so.location = (S / 2 + math.cos(a) * 1.2, S / 2 + math.sin(a) * 1.2, 0.15)
        so.rotation_euler = (Vector((S / 2, S / 2, 6)) - Vector(so.location)).to_track_quat("-Z", "Y").to_euler()
    # festoon lines from the walls to the tree
    for (wx, wy) in ((0.3, 2.0), (0.3, 13.5), (S - 0.3, 2.0), (S - 0.3, 13.5), (S / 2, 0.3)):
        string_lights([(wx, wy, 2.9), (S / 2, S / 2, 4.6)], 0.5, 10, 12.0, 2.5)
    # tables round the walnut
    k = 0
    for R, n in ((4.4, 6), (6.4, 9)):
        for i in range(n):
            a = i / n * math.tau + (0.3 if R > 5 else 0)
            x, y = S / 2 + math.cos(a) * R, S / 2 + math.sin(a) * R
            if not (1.3 < x < S - 1.3 and 1.3 < y < S - 1.3):
                continue
            round_table(x, y, 0.0, r=0.75, chairs=8, candles=3, seed=50 + k)
            k += 1
    # lanterns hanging from the walnut's lower limbs
    rnd = random.Random(8)
    for i in range(14):
        a = i / 14 * math.tau + rnd.uniform(-0.2, 0.2)
        d = rnd.uniform(2.0, 4.6)
        x, y, z = S / 2 + math.cos(a) * d, S / 2 + math.sin(a) * d, rnd.uniform(2.6, 3.4)
        bm = bmesh.new()
        cyl(bm, (x, y, z + 0.5), (x, y, z + 2.6), 0.004, 0.004, 4)
        mesh_ob("Ip", bm, [flat("Kablo", (0.02, 0.02, 0.02), 0.5)])
        place("Lantern_01", (x, y, z), rnd.uniform(0, 6.28), 1.6)
        point("CevizFener", (x, y, z + 0.18), 14.0, radius=0.03)
    if close:
        cx, cy = S / 2 + 4.4, S / 2
        # a henna table: tea glasses, a brass tray of candles
        place("tea_set_01", (cx - 0.2, cy - 0.32, 0.775), 2.2, 0.7)
        # the henna tray: a brass tray ringed with small candles
        tx_, ty_ = cx + 0.22, cy - 0.2
        tb = bmesh.new()
        res = bmesh.ops.create_cone(tb, cap_ends=True, segments=48, radius1=0.19, radius2=0.205, depth=0.025)
        for v in res["verts"]:
            v.co += Vector((tx_, ty_, 0.79))
        mesh_ob("Tepsi", tb, [flat("Pirinc", (0.78, 0.55, 0.25), 0.28, metal=1.0)])
        for k2 in range(8):
            a2 = k2 / 8 * math.tau
            candle((tx_ + 0.13 * math.cos(a2), ty_ + 0.13 * math.sin(a2), 0.803), h=0.045)
        camera((cx + 1.55, cy - 1.35, 1.25), (cx - 0.1, cy + 0.05, 0.86), lens=40, fstop=1.8, focus=1.95)
    else:
        camera((S - 0.8, 0.9, 1.75), (S / 2 - 1.5, S / 2 + 1.5, 2.6), lens=22, fstop=8, focus=9)
    output(1800, 1200)


SCENES = {
    "cayir": lambda: scene_cayir(False),
    "cayir2": lambda: scene_cayir(True),
    "ambar": lambda: scene_ambar(False),
    "ambar2": lambda: scene_ambar(True),
    "ambar3": lambda: scene_ambar(False, True),
    "avlu": lambda: scene_avlu(False),
    "avlu2": lambda: scene_avlu(True),
    "iskele": lambda: scene_iskele(False),
    "iskele2": lambda: scene_iskele(True),
}

if __name__ == "__main__":
    reset()
    SCENES[MODE]()
    if os.environ.get("SB_SAVE_BLEND"):
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, f"{MODE}.blend"), compress=True)
    bpy.ops.render.render(write_still=True)
    print("RENDERED", OUT)
