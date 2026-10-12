# Gelidonya v2.1: relights the nursery and the plain renders with warm sun.
# The v2 scenes were washed in a white-grey haze (high sun through milky film,
# a white world, thick volume haze). This opens a copy of a scene, sets the
# sun, sky, haze and a few materials to absolute values (safe to run again on
# the same copy), saves it and can render a still.
#
#   blender -b <scene.blend> -P gunes.py -- <fidelik|ova> [--save <out.blend>]
#       [--render <out.png> <width> <height> <samples>] [--set key=value ...]
#
# Sun direction is given relative to the camera: az 0 = straight ahead,
# +90 = from the right, 180 = from behind; el = height above the horizon.
import bpy, math, sys, argparse
from mathutils import Vector

# nursery: the sun low ahead, along the spans (so it crosses one roof film,
# not seven), backlighting the seedlings; shadows of posts run toward the camera
FIDELIK = dict(el=22.0, az=15.0, sun=24.0, sun_col=(1.0, 0.8, 0.58), sun_ang=1.5,
               sky=0.14, film_fac=0.22, haze=0.002, haze_col=(1.0, 0.93, 0.8), haze_aniso=0.7,
               leaf_spec=0.12, leaf_rough=0.6, leaf_sat=1.3, floor=(0.74, 0.72, 0.67), exposure=-0.5)
# plain: clear afternoon, sun low behind-right, so Beydağları face it
OVA = dict(el=18.0, az=125.0, sun=10.0, sun_col=(1.0, 0.8, 0.6), sun_ang=0.6,
           sky=0.32, aerosol=0.3, air=0.9, ozone=3.0, haze=1.2e-5, falloff=800.0, haze_col=(0.9, 0.92, 0.96),
           haze_aniso=0.4, sea_deep=(0.005, 0.03, 0.075), sea_shore=(0.015, 0.08, 0.09), sea_rough=0.12,
           exposure=0.0,
           rock_warm=1.0)

def args():
    a = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("scene", choices=("fidelik", "ova"))
    p.add_argument("--save")
    p.add_argument("--render", nargs=4)
    p.add_argument("--set", nargs="*", default=[])
    return p.parse_args(a)

def sun_vector(el, az):
    """Unit vector towards the sun, az measured from the camera's view."""
    cam = bpy.context.scene.camera
    f = cam.matrix_world.to_quaternion() @ Vector((0, 0, -1))
    f.z = 0
    f.normalize()
    r = Vector((f.y, -f.x, 0))          # camera right on the ground plane
    a, e = math.radians(az), math.radians(el)
    h = f * math.cos(a) + r * math.sin(a)
    return Vector((h.x * math.cos(e), h.y * math.cos(e), math.sin(e)))

def set_sun(name, P):
    o = bpy.data.objects[name]
    s = sun_vector(P["el"], P["az"])
    o.rotation_euler = s.to_track_quat("Z", "Y").to_euler()   # light shines along -Z
    o.data.energy = P["sun"]
    o.data.color = P["sun_col"]
    o.data.angle = math.radians(P["sun_ang"])
    return s

def sky_world(P, s, world_name):
    """Sky texture lit by the same sun (no disc: the light object is the sun)."""
    sc = bpy.context.scene
    w = bpy.data.worlds.get(world_name) or bpy.data.worlds.new(world_name)
    sc.world = w
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_disc = False
    sky.sun_elevation = math.asin(max(-1.0, min(1.0, s.z)))
    # sky texture: rotation 0 puts the sun on -Y... measured clockwise from +Y in
    # ova.py's convention (sun_rotation = -azimuth, azimuth = atan2(x, y))
    sky.sun_rotation = -math.atan2(s.x, s.y)
    sky.altitude = P.get("altitude", 40.0)
    for k, v in (("aerosol_density", P.get("aerosol", 1.0)), ("air_density", P.get("air", 1.0)),
                 ("ozone_density", P.get("ozone", 1.0))):
        try:
            setattr(sky, k, v)
        except Exception:
            pass
    bg.inputs["Strength"].default_value = P["sky"]
    nt.links.new(sky.outputs[0], bg.inputs[0])
    nt.links.new(bg.outputs[0], out.inputs[0])

def volume_node(mat_name):
    m = bpy.data.materials[mat_name]
    return m, next(n for n in m.node_tree.nodes if n.type == "PRINCIPLED_VOLUME")

def fidelik(P):
    s = set_sun("GD_Gunes", P)
    sky_world(P, s, "GD_Dunya")
    # film: more of the sheet passes the sun straight through (hard shadows of
    # benches and posts), the rest still diffuses
    nt = bpy.data.materials["GD_Film"].node_tree
    for n in nt.nodes:
        if n.type == "MIX_SHADER":
            n.inputs["Fac"].default_value = P["film_fac"]
        elif n.type == "BSDF_TRANSPARENT":
            n.inputs["Color"].default_value = (0.97, 0.96, 0.92, 1)
        elif n.type == "BSDF_TRANSLUCENT":
            n.inputs["Color"].default_value = (0.97, 0.95, 0.9, 1)
    # haze: thin and warm, forward scattering (light shafts toward the sun)
    _, v = volume_node("GD_Pus")
    v.inputs["Density"].default_value = P["haze"]
    v.inputs["Color"].default_value = (*P["haze_col"], 1)
    v.inputs["Anisotropy"].default_value = P["haze_aniso"]
    # seedlings: less white sheen, a little more colour
    nt = bpy.data.materials["GD_Yaprak"].node_tree
    p = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    p.inputs["Specular IOR Level"].default_value = P["leaf_spec"]
    p.inputs["Roughness"].default_value = P["leaf_rough"]
    for n in nt.nodes:
        if n.type == "HUE_SAT" and n.inputs["Hue"].is_linked:
            n.inputs["Saturation"].default_value = P["leaf_sat"]
    # ground cover: off-white, so the shadows read
    zp = next(n for n in bpy.data.materials["GD_ZeminOrtusu"].node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    zp.inputs["Base Color"].default_value = (*P["floor"], 1)

def ova(P):
    s = set_sun("GD_OvaGunes", P)
    sky_world(P, s, "GD_OvaDunya")
    m, v = volume_node("GD_HavaMat")
    v.inputs["Color"].default_value = (*P["haze_col"], 1)
    v.inputs["Anisotropy"].default_value = P["haze_aniso"]
    for n in m.node_tree.nodes:
        if n.type == "MATH" and n.operation == "MULTIPLY":
            if n.inputs[1].default_value < 0 and not n.inputs[1].is_linked:
                n.inputs[1].default_value = -1.0 / P["falloff"]
            elif 0 < n.inputs[1].default_value < 1e-3 and not n.inputs[1].is_linked:
                n.inputs[1].default_value = P["haze"]
    # Beydağları limestone: from neutral grey to the warm beige it shows in
    # afternoon sun (the four-stop rock ramp of GD_AraziMat)
    if P.get("rock_warm", 1.0) > 0:
        rock = [(0.08, 0.066, 0.05), (0.2, 0.17, 0.13), (0.27, 0.235, 0.185), (0.32, 0.285, 0.23)]
        for n in bpy.data.materials["GD_AraziMat"].node_tree.nodes:
            el = getattr(n, "color_ramp", None)
            if el and len(el.elements) == 4 and abs(el.elements[0].color[0] - 0.07) < 0.003 \
                    and abs(el.elements[0].color[1] - 0.066) < 0.003 or (el and n.get("gd_kaya")):
                n["gd_kaya"] = 1
                print("KAYA", n.name)
                for e, c in zip(el.elements, rock):
                    e.color = (*c, 1)
    # sea: a bluer body under the sky reflection
    nt = bpy.data.materials["GD_DenizMat"].node_tree
    sp = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    sp.inputs["Roughness"].default_value = P["sea_rough"]
    for n in nt.nodes:
        if n.type == "MIX" and getattr(n, "data_type", "") == "RGBA" and n.inputs["Factor"].is_linked:
            a, b = n.inputs[6], n.inputs[7]
            if not a.is_linked and not b.is_linked:
                a.default_value = (*P["sea_shore"], 1)
                b.default_value = (*P["sea_deep"], 1)

def main():
    A = args()
    P = dict(FIDELIK if A.scene == "fidelik" else OVA)
    for kv in A.set:
        k, v = kv.split("=", 1)
        P[k] = tuple(float(x) for x in v.split(",")) if "," in v else float(v)
    (fidelik if A.scene == "fidelik" else ova)(P)
    sc = bpy.context.scene
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.exposure = P["exposure"]
    print("GUNES", A.scene, {k: P[k] for k in sorted(P)})
    if A.save:
        bpy.ops.wm.save_as_mainfile(filepath=A.save, copy=False)
        print("SAVED", A.save)
    if A.render:
        out, w, h, n = A.render
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
        sc.render.resolution_x, sc.render.resolution_y = int(w), int(h)
        sc.render.resolution_percentage = 100
        sc.cycles.samples = int(n)
        sc.render.image_settings.file_format = "PNG"
        sc.render.image_settings.color_depth = "8"
        sc.render.filepath = out
        bpy.ops.render.render(write_still=True)
        print("DONE", out)

main()
