# Gelidonya: greenhouse interior scene (Blender 5.2, run inside Blender).
# A high plastic greenhouse of the Kumluca kind: gothic-arch spans covered in
# milky polyethylene film, galvanised columns and arches, white ground cover,
# coir grow bags with drip lines, heating rail pipes in every aisle and long
# double rows of high-wire tomatoes (instanced from bitki.py variants).
# Camera stands in an aisle looking down the rows. Output: hero render.
import bpy, bmesh, math, random, sys, importlib
from mathutils import Vector, Matrix

HERE = r"D:/Yazılım Projeleri/rasitburucu-web-demos-wt/gelidonya/scripts/gelidonya-blender"
if HERE not in sys.path:
    sys.path.append(HERE)
import bitki
importlib.reload(bitki)

SPAN = 9.6          # span width (m)
SPANS = 4
LENGTH = 84.0       # greenhouse length along +Y
GUTTER = 5.0        # gutter height
RIDGE = 6.8         # ridge height
ROW = 1.6           # double-row pitch
LINE = 0.25         # half distance between the two lines of a double row
PITCH = 0.5         # plant spacing along a line
WIRE = 4.25
X0 = -SPAN * 1.5    # left wall x

def coll(name):
    return bitki.coll(name)

def clear_scene():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)

def link(obj, c):
    c.objects.link(obj)
    return obj

def mesh_obj(name, bm, mat, c):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    if mat:
        me.materials.append(mat)
    return link(o, c)

def box(bm, center, size):
    bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation(center) @ Matrix.Diagonal((*size, 1)))

def pipe(bm, a, b, r, seg=8):
    a, b = Vector(a), Vector(b)
    d = b - a
    L = d.length
    rot = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=seg, radius1=r, radius2=r, depth=L,
                          matrix=Matrix.Translation((a + b) / 2) @ rot)

def materials():
    P = bitki.principled
    mats = {
        "galv": P("GD_Galvaniz", (0.62, 0.63, 0.62), 0.38, **{"Metallic": 1.0}),
        "zemin": P("GD_ZeminOrtusu", (0.78, 0.79, 0.77), 0.55),
        "torba": P("GD_Torba", (0.86, 0.86, 0.84), 0.45),
        "boru": P("GD_IsitmaBorusu", (0.7, 0.71, 0.7), 0.3, **{"Metallic": 0.85}),
        "damla": P("GD_Damla", (0.02, 0.02, 0.02), 0.4),
        "beton": P("GD_Beton", (0.45, 0.44, 0.41), 0.8),
    }
    # polyethylene film: part clear, part diffusing, slightly milky
    m = bpy.data.materials.get("GD_Film") or bpy.data.materials.new("GD_Film")
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    tl = nt.nodes.new("ShaderNodeBsdfTranslucent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    tr.inputs["Color"].default_value = (0.93, 0.95, 0.92, 1)
    tl.inputs["Color"].default_value = (0.95, 0.96, 0.93, 1)
    mix.inputs["Fac"].default_value = 0.5
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(tl.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    mats["film"] = m
    return mats

def structure(mats):
    c = coll("GD_Sera")
    galv = bmesh.new()
    film = bmesh.new()
    W = SPAN * SPANS
    # columns at every gutter line, every 5 m
    for k in range(SPANS + 1):
        x = X0 + k * SPAN
        y = 0.0
        while y <= LENGTH + 0.01:
            box(galv, (x, y, GUTTER / 2), (0.08, 0.08, GUTTER))
            y += 5.0
        # gutter
        box(galv, (x, LENGTH / 2, GUTTER + 0.06), (0.3, LENGTH, 0.12))
    # arches every 2.5 m and the film above each span (gothic arch)
    def arch(t):
        # t in 0..1 across a span, returns (dx, z)
        s = abs(2 * t - 1)
        return t * SPAN, GUTTER + (RIDGE - GUTTER) * (1 - s ** 1.35)
    for k in range(SPANS):
        x0 = X0 + k * SPAN
        y = 0.0
        while y <= LENGTH + 0.01:
            pts = [arch(i / 16) for i in range(17)]
            for (ax, az), (bx, bz) in zip(pts, pts[1:]):
                pipe(galv, (x0 + ax, y, az), (x0 + bx, y, bz), 0.024, 6)
            # tie beam
            pipe(galv, (x0, y, GUTTER - 0.15), (x0 + SPAN, y, GUTTER - 0.15), 0.02, 6)
            y += 2.5
        # film surface
        rows = []
        for i in range(25):
            ax, az = arch(i / 24)
            rows.append(ax)
        verts = []
        for j, y in enumerate([0.0, LENGTH]):
            ring = []
            for i in range(25):
                ax, az = arch(i / 24)
                ring.append(film.verts.new((x0 + ax, y, az)))
            verts.append(ring)
        for i in range(24):
            film.faces.new((verts[0][i], verts[0][i + 1], verts[1][i + 1], verts[1][i]))
        # ridge purlin
        pipe(galv, (x0 + SPAN / 2, 0, RIDGE - 0.05), (x0 + SPAN / 2, LENGTH, RIDGE - 0.05), 0.03, 6)
    # end walls and side walls in film
    for y in (0.0, LENGTH):
        for k in range(SPANS):
            x0 = X0 + k * SPAN
            ring = [film.verts.new((x0 + arch(i / 24)[0], y, arch(i / 24)[1])) for i in range(25)]
            base = [film.verts.new((x0 + arch(i / 24)[0], y, 0)) for i in range(25)]
            for i in range(24):
                film.faces.new((base[i], base[i + 1], ring[i + 1], ring[i]))
    for x in (X0, X0 + W):
        a = [film.verts.new((x, 0, 0)), film.verts.new((x, LENGTH, 0)), film.verts.new((x, LENGTH, GUTTER)), film.verts.new((x, 0, GUTTER))]
        film.faces.new(a)
    mesh_obj("GD_Iskelet", galv, mats["galv"], c)
    mesh_obj("GD_Ortu", film, mats["film"], c)
    # floor
    fl = bmesh.new()
    box(fl, (X0 + W / 2, LENGTH / 2, -0.01), (W, LENGTH, 0.02))
    mesh_obj("GD_Zemin", fl, mats["zemin"], c)

def row_centres():
    xs = []
    for k in range(SPANS):
        x0 = X0 + k * SPAN
        n = int(SPAN // ROW)
        start = x0 + (SPAN - (n - 1) * ROW) / 2
        xs += [start + i * ROW for i in range(n)]
    return xs

def rows(mats):
    c = coll("GD_Siralar")
    bags = bmesh.new()
    drip = bmesh.new()
    pipes = bmesh.new()
    pts = []
    rnd = random.Random(4)
    y0, y1 = 3.0, LENGTH - 2.0
    for xc in row_centres():
        for side in (-1, 1):
            x = xc + side * LINE
            box(bags, (x, (y0 + y1) / 2, 0.06), (0.2, y1 - y0, 0.11))
            pipe(drip, (x, y0, 0.125), (x, y1, 0.125), 0.008, 5)
            y = y0 + (0.25 if side > 0 else 0.0)
            while y < y1:
                pts.append(Vector((x + rnd.uniform(-0.03, 0.03), y + rnd.uniform(-0.05, 0.05), 0.11)))
                y += PITCH
        # heating rail in the aisle next to this double row
        for dx in (0.55, 0.85):
            pipe(pipes, (xc + dx, y0, 0.13), (xc + dx, y1, 0.13), 0.026, 10)
        # crop wires
        for side in (-1, 1):
            pipe(pipes, (xc + side * LINE * 0.3, y0, WIRE), (xc + side * LINE * 0.3, y1, WIRE), 0.004, 4)
    mesh_obj("GD_Torbalar", bags, mats["torba"], c)
    mesh_obj("GD_DamlaHatlari", drip, mats["damla"], c)
    mesh_obj("GD_RayBorulari", pipes, mats["boru"], c)
    # instance points
    me = bpy.data.meshes.new("GD_BitkiNoktalari")
    me.from_pydata([tuple(p) for p in pts], [], [])
    o = link(bpy.data.objects.new("GD_BitkiNoktalari", me), c)
    gn_instance(o)
    return len(pts)

def gn_instance(obj):
    ng = bpy.data.node_groups.get("GD_Dagit") or bpy.data.node_groups.new("GD_Dagit", "GeometryNodeTree")
    ng.nodes.clear()
    for it in list(ng.interface.items_tree):
        ng.interface.remove(it)
    ng.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    N = ng.nodes
    gi = N.new("NodeGroupInput")
    go = N.new("NodeGroupOutput")
    ci = N.new("GeometryNodeCollectionInfo")
    ci.inputs["Collection"].default_value = bpy.data.collections["GD_Bitkiler"]
    ci.inputs["Separate Children"].default_value = True
    ci.inputs["Reset Children"].default_value = True
    iop = N.new("GeometryNodeInstanceOnPoints")
    iop.inputs["Pick Instance"].default_value = True
    ri = N.new("FunctionNodeRandomValue"); ri.data_type = "INT"
    ri.inputs["Min"].default_value = 0; ri.inputs["Max"].default_value = len(bpy.data.collections["GD_Bitkiler"].objects) - 1
    rr = N.new("FunctionNodeRandomValue"); rr.data_type = "FLOAT_VECTOR"
    rr.inputs["Min"].default_value = (-0.04, -0.04, -0.35)
    rr.inputs["Max"].default_value = (0.04, 0.04, 0.35)
    rr.inputs["Seed"].default_value = 3
    rs = N.new("FunctionNodeRandomValue"); rs.data_type = "FLOAT"
    rs.inputs["Min"].default_value = 0.88; rs.inputs["Max"].default_value = 1.1
    rs.inputs["Seed"].default_value = 9
    L = ng.links
    L.new(gi.outputs[0], iop.inputs["Points"])
    L.new(ci.outputs[0], iop.inputs["Instance"])
    def out_of(node, kind):
        return next(s for s in node.outputs if s.enabled and s.type == kind)
    L.new(out_of(ri, "INT"), iop.inputs["Instance Index"])
    L.new(out_of(rr, "VECTOR"), iop.inputs["Rotation"])
    L.new(out_of(rs, "VALUE"), iop.inputs["Scale"])
    L.new(iop.outputs[0], go.inputs[0])
    mod = obj.modifiers.get("GD_Dagit") or obj.modifiers.new("GD_Dagit", "NODES")
    mod.node_group = ng

def lights_world():
    sc = bpy.context.scene
    w = sc.world or bpy.data.worlds.new("GD_Dunya")
    sc.world = w
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Color"].default_value = (0.9, 0.9, 0.86, 1)
    bg.inputs["Strength"].default_value = 0.48
    nt.links.new(bg.outputs[0], out.inputs[0])
    sun = bpy.data.lights.get("GD_Gunes") or bpy.data.lights.new("GD_Gunes", "SUN")
    sun.energy = 17.0
    sun.angle = math.radians(1.2)
    sun.color = (1.0, 0.9, 0.76)
    so = bpy.data.objects.get("GD_Gunes") or bpy.data.objects.new("GD_Gunes", sun)
    if so.name not in sc.collection.objects:
        sc.collection.objects.link(so)
    d = Vector((-0.12, -0.6, -0.79)).normalized()
    so.rotation_euler = (-d).to_track_quat("Z", "Y").to_euler()

def haze(density=0.03):
    c = coll("GD_Sera")
    bm = bmesh.new()
    W = SPAN * SPANS
    box(bm, (X0 + W / 2, LENGTH / 2, RIDGE / 2), (W - 0.1, LENGTH - 0.1, RIDGE - 0.05))
    m = bpy.data.materials.get("GD_Pus") or bpy.data.materials.new("GD_Pus")
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    v = nt.nodes.new("ShaderNodeVolumePrincipled")
    v.inputs["Density"].default_value = density
    v.inputs["Color"].default_value = (0.97, 0.96, 0.9, 1)
    v.inputs["Anisotropy"].default_value = 0.55
    nt.links.new(v.outputs[0], out.inputs["Volume"])
    o = mesh_obj("GD_Pus", bm, m, c)
    o.visible_shadow = False
    return o

def camera():
    sc = bpy.context.scene
    cd = bpy.data.cameras.get("GD_Kamera") or bpy.data.cameras.new("GD_Kamera")
    cd.lens = 20
    cd.shift_x = -0.18
    # vanishing point at ~66 % across and ~44 % down: the order tray sits on
    # the aisle floor below it in the first screen, not over it
    cd.shift_y = -0.06
    cd.dof.use_dof = True
    cd.dof.focus_distance = 3.4
    cd.dof.aperture_fstop = 5.6
    co = bpy.data.objects.get("GD_Kamera") or bpy.data.objects.new("GD_Kamera", cd)
    if co.name not in sc.collection.objects:
        sc.collection.objects.link(co)
    xs = row_centres()
    xc = xs[len(xs) // 2]
    co.location = (xc + 0.8, 0.4, 1.15)
    co.rotation_euler = (math.radians(97), 0, math.radians(-1.5))
    sc.camera = co

def camera_salkim():
    """Close look at the ripe trusses of the left row (Ürünlerimiz page)."""
    sc = bpy.context.scene
    cd = bpy.data.cameras.get("GD_SalkimKamera") or bpy.data.cameras.new("GD_SalkimKamera")
    cd.lens = 42
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 2.8
    cd.dof.focus_distance = 1.25
    co = bpy.data.objects.get("GD_SalkimKamera") or bpy.data.objects.new("GD_SalkimKamera", cd)
    if co.name not in sc.collection.objects:
        sc.collection.objects.link(co)
    xs = row_centres()
    xc = xs[len(xs) // 2]
    co.location = (xc + 1.05, 4.0, 0.95)
    t = Vector((xc + 0.2, 6.2, 0.62))
    co.rotation_euler = (t - co.location).to_track_quat("-Z", "Y").to_euler()

def render_settings(w=2400, h=1500, samples=384):
    sc = bpy.context.scene
    try:
        sc.render.engine = "CYCLES"
    except TypeError as e:
        print(e)
    sc.cycles.device = "GPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.volume_step_rate = 2.0
    sc.render.resolution_x = w
    sc.render.resolution_y = h
    sc.render.resolution_percentage = 100
    sc.view_settings.view_transform = "AgX"
    for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            sc.view_settings.look = look
            break
        except TypeError as e:
            print(e)
    # -0.5 EV against the previous -0.2: the film overhead no longer blows out
    sc.view_settings.exposure = -0.7

def build():
    clear_scene()
    bitki.build_variants(9)
    lc = bpy.context.view_layer.layer_collection.children.get("GD_Bitkiler")
    if lc:
        lc.exclude = True
    mats = materials()
    structure(mats)
    n = rows(mats)
    lights_world()
    haze()
    camera_salkim()
    camera()
    render_settings()
    print("plants", n)

if __name__ == "__main__":
    build()
