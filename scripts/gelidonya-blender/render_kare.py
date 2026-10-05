# Render one still with Cycles on the GPU, in a background Blender:
#   blender -b <file.blend> -P render_kare.py -- <out.png> [width height samples camera]
import bpy, sys

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out = argv[0]
sc = bpy.context.scene
if len(argv) >= 3:
    sc.render.resolution_x = int(argv[1])
    sc.render.resolution_y = int(argv[2])
if len(argv) >= 4:
    sc.cycles.samples = int(argv[3])
if len(argv) >= 5:
    sc.camera = bpy.data.objects[argv[4]]
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
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_depth = "8"
sc.render.filepath = out
print("RENDER", out, sc.render.resolution_x, sc.render.resolution_y, sc.cycles.samples, prefs.compute_device_type)
bpy.ops.render.render(write_still=True)
print("DONE", out)
