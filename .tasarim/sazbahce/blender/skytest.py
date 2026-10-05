import bpy, math, sys
argv = sys.argv[sys.argv.index("--")+1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene; s.render.engine="CYCLES"; s.cycles.samples=16; s.cycles.device="CPU"
w=bpy.data.worlds.new("w"); s.world=w; w.use_nodes=True
sky=w.node_tree.nodes.new("ShaderNodeTexSky"); sky.sky_type="MULTIPLE_SCATTERING"
sky.sun_elevation=math.radians(4); sky.sun_rotation=math.radians(float(argv[0])); sky.sun_disc=True
bg=next(n for n in w.node_tree.nodes if n.type=="BACKGROUND"); w.node_tree.links.new(sky.outputs[0],bg.inputs[0])
cd=bpy.data.cameras.new("c"); cd.lens=12; c=bpy.data.objects.new("c",cd); s.collection.objects.link(c); s.camera=c
c.rotation_euler=(math.radians(90),0,math.radians(90))  # look -X
s.render.resolution_x=400; s.render.resolution_y=200; s.render.filepath=argv[1]
s.view_settings.view_transform="AgX"
bpy.ops.render.render(write_still=True)
