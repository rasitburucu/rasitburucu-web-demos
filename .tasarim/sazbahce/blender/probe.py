import bpy, os, glob
from mathutils import Vector
A = os.path.join(os.path.dirname(bpy.data.filepath) if bpy.data.filepath else r"D:/Yazılım Projeleri/rasitburucu-web-demos/.tasarim/sazbahce/blender", "assets")
bpy.ops.wm.read_factory_settings(use_empty=True)
n = bpy.data.node_groups
t = bpy.data.worlds.new("w"); t.use_nodes=True
sky = t.node_tree.nodes.new("ShaderNodeTexSky")
print("SKY", [i.identifier for i in sky.bl_rna.properties["sky_type"].enum_items], [p.identifier for p in sky.bl_rna.properties if not p.is_readonly][:40])
p = bpy.context.preferences.addons["cycles"].preferences
for k in ("OPTIX","CUDA"):
    try:
        p.compute_device_type=k; p.get_devices(); print("DEV",k,[ (d.name,d.type) for d in p.devices])
    except Exception as e: print(k,e)
for f in sorted(glob.glob(os.path.join(A, "*", "*.gltf"))):
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=f)
    new=[o for o in bpy.data.objects if o not in before]
    mn=Vector((1e9,)*3); mx=Vector((-1e9,)*3)
    for o in new:
        if o.type=='MESH':
            for c in o.bound_box:
                w=o.matrix_world@Vector(c); mn=Vector(map(min,mn,w)); mx=Vector(map(max,mx,w))
    print("M", os.path.basename(f), len(new), [o.name for o in new][:5], "min", tuple(round(x,2) for x in mn), "max", tuple(round(x,2) for x in mx), sum(len(o.data.polygons) for o in new if o.type=='MESH'))
    for o in new: bpy.data.objects.remove(o)
