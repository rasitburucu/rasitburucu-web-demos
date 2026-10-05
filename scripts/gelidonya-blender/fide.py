# Gelidonya: the seedling nursery (Blender 5.2, run inside Blender).
# Long galvanised benches under the same milky film, covered edge to edge with
# black 45-cell trays of young tomato seedlings (cotyledons + first true
# leaves) in perlite-flecked peat. Camera low over the nearest bench with a
# shallow focus. Output: render for the "Fidelik" page and home section.
import bpy, bmesh, math, random, sys, importlib
from mathutils import Vector, Matrix

HERE = r"D:/Yazılım Projeleri/rasitburucu-web-demos-wt/gelidonya/scripts/gelidonya-blender"
if HERE not in sys.path:
    sys.path.append(HERE)
import bitki, sera
importlib.reload(bitki)
importlib.reload(sera)

CELL = 0.059
COLS, ROWS = 9, 5
TRAY_W, TRAY_D, TRAY_H = COLS * CELL + 0.012, ROWS * CELL + 0.012, 0.055

def peat_material():
    m = bpy.data.materials.get("GD_Torf") or bpy.data.materials.new("GD_Torf")
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.95
    tc = nt.nodes.new("ShaderNodeTexCoord")
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 260
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.85, 0.84, 0.8, 1)   # perlite grains
    ramp.color_ramp.elements[1].position = 0.12
    ramp.color_ramp.elements[1].color = (0.075, 0.045, 0.025, 1)
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 90
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.6
    nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    nt.links.new(nz.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m

def seedling(bm_leaf, bm_stem, c, rnd):
    """A 3-4 week tomato seedling at point c (top of the peat)."""
    h = rnd.uniform(0.035, 0.05)
    lean = Vector((rnd.uniform(-0.006, 0.006), rnd.uniform(-0.006, 0.006), 0))
    top = c + Vector((0, 0, h)) + lean
    bitki.tube(bm_stem, [c, c + Vector((0, 0, h * 0.5)) + lean * 0.4, top], 0.0016)
    a0 = rnd.uniform(0, math.tau)
    # cotyledons
    for s in (0, math.pi):
        M = Matrix.Translation(c + Vector((0, 0, h * 0.62)) + lean * 0.6) @ Matrix.Rotation(a0 + s, 4, "Z") @ Matrix.Rotation(math.radians(-12), 4, "Y")
        fs = bitki.leaflet(bm_leaf, 0.026, 0.0045, M, serr=0.0, droop=0.15, segs=8)
        bitki.set_tone(bm_leaf, fs, rnd.uniform(0.62, 0.74))
    # first true leaves (small compound leaves)
    for k, s in enumerate((math.pi / 2, -math.pi / 2)):
        M = Matrix.Translation(top) @ Matrix.Rotation(a0 + s + rnd.uniform(-0.4, 0.4), 4, "Z") @ Matrix.Rotation(math.radians(-rnd.uniform(25, 45)), 4, "Y")
        bitki.compound_leaf(bm_leaf, rnd.uniform(0.055, 0.075) * (1 if k == 0 else 0.8), M, rnd)

def tray(seed):
    rnd = random.Random(seed)
    bm_tray, bm_peat, bm_leaf, bm_stem = bmesh.new(), bmesh.new(), bmesh.new(), bmesh.new()
    bitki.tone_layer(bm_leaf)
    # rim and cell walls
    # rim: a frame round the edge (a solid slab here would cover the peat)
    for sx in (-1, 1):
        sera.box(bm_tray, (sx * (TRAY_W / 2), 0, TRAY_H - 0.002), (0.012, TRAY_D + 0.01, 0.004))
    for sy in (-1, 1):
        sera.box(bm_tray, (0, sy * (TRAY_D / 2), TRAY_H - 0.002), (TRAY_W + 0.01, 0.012, 0.004))
    for i in range(COLS + 1):
        x = -COLS * CELL / 2 + i * CELL
        sera.box(bm_tray, (x, 0, TRAY_H / 2), (0.0035, ROWS * CELL, TRAY_H))
    for j in range(ROWS + 1):
        y = -ROWS * CELL / 2 + j * CELL
        sera.box(bm_tray, (0, y, TRAY_H / 2), (COLS * CELL, 0.0035, TRAY_H))
    sera.box(bm_tray, (0, 0, 0.004), (TRAY_W, TRAY_D, 0.008))
    for i in range(COLS):
        for j in range(ROWS):
            cx = -COLS * CELL / 2 + (i + 0.5) * CELL
            cy = -ROWS * CELL / 2 + (j + 0.5) * CELL
            z = TRAY_H - 0.008
            bmesh.ops.create_grid(bm_peat, x_segments=3, y_segments=3, size=CELL / 2 - 0.002,
                                  matrix=Matrix.Translation((cx, cy, z)))
            seedling(bm_leaf, bm_stem, Vector((cx, cy, z)), rnd)
    mats = [bitki.principled("GD_Viyol", (0.006, 0.006, 0.007), 0.55), peat_material(), bitki.leaf_material(),
            bitki.stem_material()]
    big = bmesh.new()
    tones = []
    for idx, bm in enumerate((bm_tray, bm_peat, bm_leaf, bm_stem)):
        lay = bm.faces.layers.float.get("ton")
        for f in bm.faces:
            tones.append(f[lay] if lay else 0.5)
            f.material_index = idx
            f.smooth = idx >= 2
        tmp = bpy.data.meshes.new("_t")
        bm.to_mesh(tmp)
        big.from_mesh(tmp)
        bpy.data.meshes.remove(tmp)
        bm.free()
    me = bpy.data.meshes.new(f"GD_ViyolDolu_{seed}")
    big.to_mesh(me)
    big.free()
    at = me.attributes.new("ton", "FLOAT", "FACE")
    if len(tones) == len(me.polygons):
        at.data.foreach_set("value", tones)
    for m in mats:
        me.materials.append(m)
    return bpy.data.objects.new(f"GD_ViyolDolu_{seed}", me)

def build():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o)
    tc = bitki.coll("GD_Viyoller")
    for s in range(3):
        o = tray(100 + s)
        tc.objects.link(o)
        o.location = (s, 0, -50)
    lc = bpy.context.view_layer.layer_collection.children.get("GD_Viyoller")
    if lc:
        lc.exclude = True
    mats = sera.materials()
    sera.LENGTH = 60.0
    sera.structure(mats)
    sera.lights_world()
    sera.haze(0.01)
    # benches: 1.7 m wide, 0.75 m high, 0.6 m aisles
    c = bitki.coll("GD_Tezgahlar")
    bm = bmesh.new()
    pts = []
    rnd = random.Random(5)
    x = sera.X0 + 1.0
    while x < sera.X0 + sera.SPAN * sera.SPANS - 2:
        sera.box(bm, (x, 30, 0.74), (1.72, 54, 0.03))
        for yy in range(4, 58, 3):
            sera.box(bm, (x - 0.7, yy, 0.37), (0.05, 0.05, 0.74))
            sera.box(bm, (x + 0.7, yy, 0.37), (0.05, 0.05, 0.74))
        for k in range(3):
            tx = x - 0.56 + k * 0.56
            y = 3.2
            while y < 56.8:
                pts.append((Vector((tx + rnd.uniform(-0.006, 0.006), y, 0.755)), rnd.uniform(-0.02, 0.02) + (math.pi if rnd.random() < 0.5 else 0)))
                y += TRAY_D + 0.004
        x += 2.35
    o = sera.mesh_obj("GD_Tezgah", bm, bitki.principled("GD_TezgahGalv", (0.42, 0.43, 0.42), 0.45, **{"Metallic": 1.0}), c)
    # floor: the greenhouse ground cover from sera.structure (a second coplanar
    # floor here shadowed itself black in Cycles)
    # instance trays (rotation around Z stored per point)
    import ova
    importlib.reload(ova)
    ova.gn_points("GD_ViyolNoktalari", pts, tc, 7, (1.0, 1.0))
    # camera low over the nearest bench
    sc = bpy.context.scene
    cd = bpy.data.cameras.get("GD_FideKamera") or bpy.data.cameras.new("GD_FideKamera")
    cd.lens = 32
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 2.4
    cd.dof.focus_distance = 1.0
    cam = bpy.data.objects.new("GD_FideKamera", cd)
    sc.collection.objects.link(cam)
    bx = sera.X0 + 1.0 + 2.35 * 7
    cam.location = (bx + 0.75, 2.0, 1.16)
    target = Vector((bx - 0.25, 6.5, 0.35))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    # visitor's view down the benches (İletişim page)
    vd = bpy.data.cameras.new("GD_ZiyaretKamera")
    vd.lens = 26
    vd.dof.use_dof = True
    vd.dof.aperture_fstop = 4.0
    vd.dof.focus_distance = 6.0
    vc = bpy.data.objects.new("GD_ZiyaretKamera", vd)
    sc.collection.objects.link(vc)
    vc.location = (bx + 1.175, 0.4, 2.6)
    vt = Vector((bx + 0.575, 16.0, 0.6))
    vc.rotation_euler = (vt - vc.location).to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam
    sera.render_settings(2400, 1500, 256)
    print("trays", len(pts))

if __name__ == "__main__":
    build()
