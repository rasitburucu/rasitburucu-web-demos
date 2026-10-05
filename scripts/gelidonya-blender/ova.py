# Gelidonya: the plain of greenhouses (Blender 5.2).
# A coastal plain of the Kumluca kind on a hazy morning, seen from 36 m up on
# the edge of the plain: thousands of plastic greenhouse blocks of different
# ages (new clear film, old dusty film, whitewashed roofs, side vents rolled
# up), green crops showing through the film, farm roads and an asphalt road,
# water tanks and open pools, cypress windbreaks, citrus groves, packhouses;
# limestone-and-pine mountains on the left falling to the sea, the sea with a
# glitter path under the low sun. Everything is procedural; no real map,
# photograph, texture or model is used. Output: render for "Seralarımız".
#
#   blender -b --factory-startup -P ova.py -- <save.blend>
import bpy, bmesh, math, random, sys
from mathutils import Vector, Matrix, noise

def coll(name):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(c)
    return c

def mat(name):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    m.node_tree.nodes.clear()
    return m, m.node_tree

def out_of(node, kind):
    return next(s for s in node.outputs if s.enabled and s.type == kind)

def mixrgb(nt, fac, a, b, blend="MIX"):
    m_ = nt.nodes.new("ShaderNodeMix")
    m_.data_type = "RGBA"
    m_.blend_type = blend
    if isinstance(fac, (int, float)):
        m_.inputs["Factor"].default_value = fac
    else:
        nt.links.new(fac, m_.inputs["Factor"])
    for sock, v in ((m_.inputs[6], a), (m_.inputs[7], b)):
        if isinstance(v, tuple):
            sock.default_value = (*v, 1) if len(v) == 3 else v
        else:
            nt.links.new(v, sock)
    return out_of(m_, "RGBA")

def math_node(nt, op, a, b=None, c=None, clamp=False):
    n = nt.nodes.new("ShaderNodeMath")
    n.operation = op
    n.use_clamp = clamp
    for sock, v in ((n.inputs[0], a), (n.inputs[1], b), (n.inputs[2], c)):
        if v is None:
            continue
        if isinstance(v, (int, float)):
            sock.default_value = v
        else:
            nt.links.new(v, sock)
    return n.outputs[0]

def ramp(nt, fac, stops):
    r = nt.nodes.new("ShaderNodeValToRGB")
    e = r.color_ramp.elements
    e[0].position, e[0].color = stops[0][0], (*stops[0][1], 1)
    e[1].position, e[1].color = stops[-1][0], (*stops[-1][1], 1)
    for pos, c in stops[1:-1]:
        x = e.new(pos)
        x.color = (*c, 1)
    nt.links.new(fac, r.inputs["Fac"])
    return r.outputs["Color"]

def tex_noise(nt, vec, scale, detail=6, rough=0.55):
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    n.inputs["Roughness"].default_value = rough
    nt.links.new(vec, n.inputs["Vector"])
    return n

# ---------------------------------------------------------------- landform

def coast_y(x):
    """The shore: a wide bay, curving out toward the cape on the left."""
    return 2700 + 240 * math.sin(x / 1500.0) - (0.00012 * (-1200 - x) ** 2 if x < -1200 else 0)

def mountain(x, y):
    """Height of the Taurus foothills (left and far back); 0 on the plain."""
    # warped edge, so the foot of the mountain is not a straight line
    wx = x + 420 * noise.noise(Vector((x / 2600.0, y / 2600.0, 7.1)))
    wy = y + 420 * noise.noise(Vector((x / 2600.0, y / 2600.0, 2.3)))
    left = max(0.0, (-1700 - wx) / 2300.0)
    back = max(0.0, (-4200 - wy) / 1800.0)
    right = max(0.0, (wx - 9000) / 2500.0) * max(0.0, min(1.0, (wy - 5500) / 2000.0))
    m = max(left, back, right)
    if m <= 0:
        return 0.0
    s = m * m * (3 - 2 * m) if m < 1 else 1 + 0.18 * (m - 1)
    p = Vector((wx / 2400.0, wy / 2400.0, 0.37))
    ridged = noise.ridged_multi_fractal(p, 1.0, 2.0, 8, 1.0, 2.0) / 1.9   # 0..1, crests
    broad = 0.5 + 0.5 * noise.fractal(Vector((wx / 5200.0, wy / 5200.0, 3.3)), 1.0, 2.0, 4)
    soft = 0.5 + 0.5 * noise.fractal(Vector((wx / 1500.0, wy / 1500.0, 5.1)), 0.9, 2.0, 6)
    # incised valleys between rounded, forested ridges
    h = s * (380 + 1250 * broad) * (0.45 + 0.33 * ridged ** 1.2 + 0.22 * soft)
    return h

def height(x, y):
    h = 5 + 6 * noise.noise(Vector((x / 2600.0, y / 2600.0, 4.0)))
    h += mountain(x, y)
    cy = coast_y(x)
    if y > cy:
        h -= min(60.0, (y - cy) * 0.06) + 3
    return h

def grid_mesh(name, X0, X1, Y0, Y1, step, skip=None):
    NX, NY = int((X1 - X0) / step), int((Y1 - Y0) / step)
    bm = bmesh.new()
    verts = []
    for j in range(NY + 1):
        y = Y0 + (Y1 - Y0) * j / NY
        verts.append([bm.verts.new((X0 + (X1 - X0) * i / NX, y, 0)) for i in range(NX + 1)])
    for row in verts:
        for v in row:
            v.co.z = height(v.co.x, v.co.y)
    for j in range(NY):
        for i in range(NX):
            if skip:
                cx = X0 + (X1 - X0) * (i + 0.5) / NX
                cyy = Y0 + (Y1 - Y0) * (j + 0.5) / NY
                if skip(cx, cyy):
                    continue
            bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me

FINE = (-9500.0, -1250.0, -3800.0, 9500.0)   # x0, x1, y0, y1 of the detailed mountain mesh

def terrain_material():
    m, nt = mat("GD_AraziMat")
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    p = N.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.95
    p.inputs["Specular IOR Level"].default_value = 0.08
    geo = N.new("ShaderNodeNewGeometry")
    pos = geo.outputs["Position"]
    sep = N.new("ShaderNodeSeparateXYZ"); L.new(pos, sep.inputs[0])
    sepn = N.new("ShaderNodeSeparateXYZ"); L.new(geo.outputs["Normal"], sepn.inputs[0])
    Z = sep.outputs["Z"]
    # plain: worked soil, dry grass and weeds between the greenhouses
    soil = ramp(nt, tex_noise(nt, pos, 0.02, 8).outputs["Fac"],
                [(0.3, (0.09, 0.055, 0.032)), (0.55, (0.14, 0.09, 0.055)), (0.7, (0.19, 0.14, 0.085))])
    weeds = ramp(nt, tex_noise(nt, pos, 0.006, 4).outputs["Fac"], [(0.45, (0.0, 0.0, 0.0)), (0.62, (1.0, 1.0, 1.0))])
    plain = mixrgb(nt, math_node(nt, "MULTIPLY", weeds, 0.55), soil, (0.06, 0.075, 0.03))
    # beach: low ground near sea level
    beach = N.new("ShaderNodeMapRange")
    beach.inputs["From Min"].default_value = 3.5
    beach.inputs["From Max"].default_value = 1.0
    L.new(Z, beach.inputs["Value"])
    plain = mixrgb(nt, beach.outputs["Result"], plain, (0.36, 0.32, 0.25))
    # Taurus slopes: red pine canopy (speckled) on soil pockets, grey
    # limestone on steep faces and crests, scree in gullies
    vor = N.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 0.09
    L.new(pos, vor.inputs["Vector"])
    pine = ramp(nt, vor.outputs["Distance"], [(0.0, (0.006, 0.014, 0.006)), (0.45, (0.012, 0.028, 0.01)),
                                               (0.75, (0.03, 0.045, 0.018)), (1.0, (0.12, 0.11, 0.08))])
    # clearings of maquis and bare soil between pine stands (100-300 m)
    patch = ramp(nt, tex_noise(nt, pos, 0.006, 8, 0.62).outputs["Fac"], [(0.52, (0.0, 0.0, 0.0)), (0.64, (1.0, 1.0, 1.0))])
    pine = mixrgb(nt, math_node(nt, "MULTIPLY", patch, 0.6), pine, (0.07, 0.065, 0.04))
    # gully lines down the slopes: darker, shaded streaks
    gully = N.new("ShaderNodeTexVoronoi")
    gully.feature = "DISTANCE_TO_EDGE"
    gully.inputs["Scale"].default_value = 0.0035
    gm = N.new("ShaderNodeMapping")
    gm.inputs["Scale"].default_value = (1.0, 1.0, 0.25)
    L.new(pos, gm.inputs["Vector"])
    L.new(gm.outputs["Vector"], gully.inputs["Vector"])
    gl_ = ramp(nt, gully.outputs["Distance"], [(0.0, (0.45, 0.45, 0.45)), (0.06, (1.0, 1.0, 1.0))])
    pine = mixrgb(nt, 1.0, pine, gl_, "MULTIPLY")
    strata = N.new("ShaderNodeTexWave")
    strata.wave_type = "BANDS"
    strata.bands_direction = "Z"
    strata.inputs["Scale"].default_value = 0.02
    strata.inputs["Distortion"].default_value = 6
    strata.inputs["Detail"].default_value = 4
    L.new(pos, strata.inputs["Vector"])
    rockn = tex_noise(nt, pos, 0.05, 12, 0.7)
    rockf = math_node(nt, "MULTIPLY_ADD", rockn.outputs["Fac"], 0.7, strata.outputs["Fac"])
    rock = ramp(nt, math_node(nt, "MULTIPLY", rockf, 0.6), [(0.0, (0.07, 0.066, 0.058)), (0.45, (0.17, 0.16, 0.145)),
                                                         (0.75, (0.22, 0.215, 0.2)), (1.0, (0.27, 0.265, 0.25))])
    steep = math_node(nt, "SUBTRACT", 1.0, sepn.outputs["Z"])
    jit = math_node(nt, "MULTIPLY_ADD", tex_noise(nt, pos, 0.008, 6).outputs["Fac"], 0.42, steep)
    hi = N.new("ShaderNodeMapRange")
    hi.inputs["From Min"].default_value = 3000
    hi.inputs["From Max"].default_value = 4000
    L.new(Z, hi.inputs["Value"])
    rockfac = math_node(nt, "ADD", jit, hi.outputs["Result"], clamp=True)
    edge = N.new("ShaderNodeMapRange")
    edge.inputs["From Min"].default_value = 0.52
    edge.inputs["From Max"].default_value = 0.58
    L.new(rockfac, edge.inputs["Value"])
    mtn = mixrgb(nt, edge.outputs["Result"], pine, rock)
    hmap = N.new("ShaderNodeMapRange")
    hmap.inputs["From Min"].default_value = 16
    hmap.inputs["From Max"].default_value = 60
    L.new(Z, hmap.inputs["Value"])
    L.new(mixrgb(nt, hmap.outputs["Result"], plain, mtn), p.inputs["Base Color"])
    # gullies and tree clumps at shading level
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.9
    bump.inputs["Distance"].default_value = 4.0
    L.new(math_node(nt, "ADD", math_node(nt, "ADD", tex_noise(nt, pos, 0.03, 14, 0.68).outputs["Fac"],
                    math_node(nt, "MULTIPLY", vor.outputs["Distance"], 0.6)),
                    math_node(nt, "MULTIPLY", gully.outputs["Distance"], 3.0)), bump.inputs["Height"])
    L.new(bump.outputs["Normal"], p.inputs["Normal"])
    L.new(p.outputs[0], out.inputs["Surface"])
    return m

def terrain():
    c = coll("GD_Ova")
    m = terrain_material()
    x0, x1, y0, y1 = FINE
    inside = lambda x, y: x0 < x < x1 and y0 < y < y1
    coarse = grid_mesh("GD_Arazi", -12000.0, 14000.0, -6000.0, 16000.0, 40.0, skip=inside)
    fine = grid_mesh("GD_AraziDag", x0, x1, y0, y1, 11.0)
    for me in (coarse, fine):
        me.materials.append(m)
        o = bpy.data.objects.new(me.name, me)
        c.objects.link(o)

def sea():
    c = coll("GD_Ova")
    me = bpy.data.meshes.new("GD_Deniz")
    me.from_pydata([(-14000, 0, 0), (16000, 0, 0), (16000, 24000, 0), (-14000, 24000, 0)], [], [(0, 1, 2, 3)])
    o = bpy.data.objects.new("GD_Deniz", me)
    o.location.z = -0.6
    c.objects.link(o)
    m, nt = mat("GD_DenizMat")
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    p = N.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.06
    p.inputs["IOR"].default_value = 1.33
    geo = N.new("ShaderNodeNewGeometry")
    sep = N.new("ShaderNodeSeparateXYZ"); L.new(geo.outputs["Position"], sep.inputs[0])
    # shallow water near the shore is greener and lighter
    shore = N.new("ShaderNodeMapRange")
    shore.inputs["From Min"].default_value = 2700
    shore.inputs["From Max"].default_value = 3600
    L.new(sep.outputs["Y"], shore.inputs["Value"])
    L.new(mixrgb(nt, shore.outputs["Result"], (0.012, 0.06, 0.07), (0.004, 0.022, 0.045)), p.inputs["Base Color"])
    tc = N.new("ShaderNodeTexCoord")
    # wind waves: noise stretched across the wind (crests), plus fine chop;
    # the facets catch the low sun as a glitter path
    sw = N.new("ShaderNodeMapping")
    sw.inputs["Scale"].default_value = (0.25, 1.0, 1.0)
    L.new(tc.outputs["Object"], sw.inputs["Vector"])
    swell = tex_noise(nt, sw.outputs["Vector"], 0.09, 6, 0.55)
    chop = tex_noise(nt, tc.outputs["Object"], 0.5, 10, 0.6)
    h = math_node(nt, "MULTIPLY_ADD", chop.outputs["Fac"], 0.35, swell.outputs["Fac"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.8
    bump.inputs["Distance"].default_value = 0.5
    L.new(h, bump.inputs["Height"])
    L.new(bump.outputs["Normal"], p.inputs["Normal"])
    L.new(p.outputs[0], out.inputs["Surface"])
    me.materials.append(m)

# ---------------------------------------------------------------- greenhouses

def film_material():
    """Polyethylene film, one look per greenhouse instance (Object Info Random):
    opacity 60-85 % (the crop shows through as green shade), new film clean and
    cool, old film dusty and yellowed, about one roof in six whitewashed
    against the summer sun; the arches show through as faint bands."""
    m, nt = mat("GD_SeraFilmi")
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    oi = N.new("ShaderNodeObjectInfo")
    r = oi.outputs["Random"]
    frac = lambda v, k: math_node(nt, "FRACT", math_node(nt, "MULTIPLY", v, k))
    age = frac(r, 7.31)
    wash = math_node(nt, "LESS_THAN", frac(r, 3.17), 0.17)
    opacity = math_node(nt, "MULTIPLY_ADD", frac(r, 13.7), 0.25, 0.6)
    opacity = math_node(nt, "MAXIMUM", opacity, math_node(nt, "MULTIPLY", wash, 0.92))
    tc = N.new("ShaderNodeTexCoord")
    geo = N.new("ShaderNodeNewGeometry")
    sep = N.new("ShaderNodeSeparateXYZ"); L.new(tc.outputs["Object"], sep.inputs[0])
    film = mixrgb(nt, math_node(nt, "POWER", age, 1.6), (0.82, 0.85, 0.86), (0.55, 0.52, 0.43))
    film = mixrgb(nt, wash, film, (0.93, 0.93, 0.91))
    # dust and rain streaks: darker down the slopes and along the gutters
    dust = tex_noise(nt, tc.outputs["Object"], 0.11, 8, 0.6)
    dfac = math_node(nt, "MULTIPLY", dust.outputs["Fac"], math_node(nt, "MULTIPLY_ADD", age, 0.45, 0.12))
    film = mixrgb(nt, dfac, film, (0.36, 0.33, 0.27), "MULTIPLY")
    # arches every 2 m along the block show through the film
    band = math_node(nt, "POWER", math_node(nt, "ABSOLUTE", math_node(nt, "SINE", math_node(nt, "MULTIPLY", sep.outputs["Y"], math.pi / 2.0))), 40.0)
    film = mixrgb(nt, math_node(nt, "MULTIPLY", band, 0.14), film, (0.25, 0.26, 0.25), "MULTIPLY")
    # sheets laid along the block: long wrinkles and slightly different batches
    vec = N.new("ShaderNodeMapping")
    vec.inputs["Scale"].default_value = (1.0, 0.06, 1.0)
    L.new(tc.outputs["Object"], vec.inputs["Vector"])
    wr = tex_noise(nt, vec.outputs["Vector"], 1.6, 4, 0.5)
    film = mixrgb(nt, math_node(nt, "MULTIPLY", wr.outputs["Fac"], 0.25), film, (0.6, 0.6, 0.58), "MULTIPLY")
    # the crop under the film: clean film over a full crop reads green-grey
    green = math_node(nt, "MULTIPLY", math_node(nt, "SUBTRACT", 1.0, opacity), math_node(nt, "GREATER_THAN", frac(r, 5.71), 0.18))
    film = mixrgb(nt, math_node(nt, "MULTIPLY", green, 2.2), film, (0.32, 0.42, 0.24), "MULTIPLY")
    # Polyethylene scatters most light *through* itself: seen from above,
    # clean film is a dim translucent skin over the crop (green shade), dusty
    # film scatters more back (lighter, browner), whitewash is a white wall.
    diffuse = N.new("ShaderNodeBsdfDiffuse")
    L.new(film, diffuse.inputs["Color"])
    tl = N.new("ShaderNodeBsdfTranslucent")
    L.new(mixrgb(nt, 1.0, film, (1.0, 0.97, 0.9), "MULTIPLY"), tl.inputs["Color"])
    back = math_node(nt, "MAXIMUM", math_node(nt, "MULTIPLY_ADD", age, 0.45, 0.2), wash)
    back = math_node(nt, "MAXIMUM", back, math_node(nt, "MULTIPLY", dfac, 1.2))
    body = N.new("ShaderNodeMixShader")
    L.new(back, body.inputs["Fac"])
    L.new(tl.outputs[0], body.inputs[1])
    L.new(diffuse.outputs[0], body.inputs[2])
    tr = N.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (0.92, 0.94, 0.9, 1)
    mixs = N.new("ShaderNodeMixShader")
    L.new(opacity, mixs.inputs["Fac"])
    L.new(tr.outputs[0], mixs.inputs[1])
    L.new(body.outputs[0], mixs.inputs[2])
    # the plastic sheen: a soft specular layer, stronger on new film
    gl = N.new("ShaderNodeBsdfGlossy")
    gl.inputs["Roughness"].default_value = 0.3
    fr = N.new("ShaderNodeLayerWeight")
    fr.inputs["Blend"].default_value = 0.2
    spec = math_node(nt, "MULTIPLY", fr.outputs["Fresnel"], math_node(nt, "MULTIPLY_ADD", age, -0.3, 0.45))
    top = N.new("ShaderNodeMixShader")
    L.new(spec, top.inputs["Fac"])
    L.new(mixs.outputs[0], top.inputs[1])
    L.new(gl.outputs[0], top.inputs[2])
    L.new(top.outputs[0], out.inputs["Surface"])
    return m

def crop_material():
    m, nt = mat("GD_IcBitki")
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    p = N.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.7
    oi = N.new("ShaderNodeObjectInfo")
    tc = N.new("ShaderNodeTexCoord")
    nz = tex_noise(nt, tc.outputs["Object"], 1.8, 6, 0.65)
    c = ramp(nt, nz.outputs["Fac"], [(0.3, (0.02, 0.06, 0.01)), (0.7, (0.07, 0.16, 0.025))])
    c = mixrgb(nt, math_node(nt, "MULTIPLY", oi.outputs["Random"], 0.5), c, (0.09, 0.1, 0.03))
    L.new(c, p.inputs["Base Color"])
    L.new(p.outputs[0], out.inputs["Surface"])
    return m

def simple(name, color, rough=0.6, metal=0.0):
    m, nt = mat(name)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m

def quad(bm, a, b, c, d):
    try:
        return bm.faces.new((a, b, c, d))
    except ValueError:
        return None

def block(name, n, length, w, gut, ridge, gothic, vent, crop_h, cover, mats):
    """One greenhouse block of n arched spans, origin at the centre of its
    footprint. Film sags a little between the arches; side film rolled up on
    venting blocks; rows of crop inside; galvanised gutters between spans."""
    bm = bmesh.new()
    def tag(f, k):
        if f is not None:
            f.material_index = k
    W = n * w
    seg = 12
    ny = max(2, int(length / 1.0))
    def prof(t):
        if gothic:
            return 1 - abs(2 * t - 1) ** 1.55
        return math.sin(math.pi * t) ** 0.75
    for k in range(n):
        x0 = -W / 2 + k * w
        rows = []
        for j in range(ny + 1):
            y = -length / 2 + length * j / ny
            sag = 0.05 * abs(math.sin(math.pi * y / 2.0))
            row = []
            for i in range(seg + 1):
                t = i / seg
                z = gut + (ridge - gut) * prof(t) - sag * math.sin(math.pi * t)
                row.append(bm.verts.new((x0 + w * t, y, z)))
            rows.append(row)
        for j in range(ny):
            for i in range(seg):
                tag(quad(bm, rows[j][i], rows[j][i + 1], rows[j + 1][i + 1], rows[j + 1][i]), 0)
        # gables, both ends
        for j, s in ((0, -1), (ny, 1)):
            top = rows[j]
            g = [bm.verts.new((v.co.x, v.co.y, 0)) for v in top]
            for i in range(seg):
                tag(quad(bm, g[i], g[i + 1], top[i + 1], top[i]), 0)
        # gutter between spans
        if k > 0:
            ret = bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((x0, 0, gut - 0.08)) @ Matrix.Diagonal((0.28, length + 0.3, 0.18, 1)))
            for v in ret["verts"]:
                for f in v.link_faces:
                    f.material_index = 1
        # crop rows inside: four double rows per span
        if crop_h > 0:
            for r_ in range(4):
                xr = x0 + w * (r_ + 0.5) / 4
                ret = bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((xr, 0, crop_h / 2)) @ Matrix.Diagonal((0.7, length - 3, crop_h, 1)))
                for v in ret["verts"]:
                    for f in v.link_faces:
                        f.material_index = 2
    bm.faces.ensure_lookup_table()
    # side walls: film, or rolled up (open band) on venting blocks
    for x in (-W / 2, W / 2):
        lo = 0.0
        if vent:
            a = [bm.verts.new(p) for p in ((x, -length / 2, 0), (x, length / 2, 0), (x, length / 2, 0.85), (x, -length / 2, 0.85))]
            tag(quad(bm, *a), 0)
            b = [bm.verts.new(p) for p in ((x, -length / 2, gut - 0.35), (x, length / 2, gut - 0.35), (x, length / 2, gut), (x, -length / 2, gut))]
            tag(quad(bm, *b), 0)
            # the rolled film on its pipe
            ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.09, radius2=0.09, depth=length,
                                        matrix=Matrix.Translation((x, 0, 0.92)) @ Matrix.Rotation(math.pi / 2, 4, "X"))
            for v in ret["verts"]:
                for f in v.link_faces:
                    f.material_index = 1
        else:
            a = [bm.verts.new(p) for p in ((x, -length / 2, 0), (x, length / 2, 0), (x, length / 2, gut), (x, -length / 2, gut))]
            tag(quad(bm, *a), 0)
    # floor inside: white ground cover or bare soil
    if cover:
        f = bm.faces.new([bm.verts.new(p) for p in ((-W / 2, -length / 2, 0.05), (W / 2, -length / 2, 0.05), (W / 2, length / 2, 0.05), (-W / 2, length / 2, 0.05))])
        f.material_index = 3
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m_ in mats:
        me.materials.append(m_)
    return bpy.data.objects.new(name, me)

def blocks():
    c = coll("GD_Bloklar")
    mats = [film_material(), simple("GD_Galv", (0.5, 0.51, 0.5), 0.4, 1.0), crop_material(),
            simple("GD_ZeminOrtusu", (0.7, 0.71, 0.68), 0.6)]
    # n spans, length, span width, gutter, ridge, gothic, vent, crop height, white cover
    specs = [
        (8, 62, 8.0, 3.2, 5.2, True, False, 2.3, True),
        (7, 60, 8.0, 3.0, 4.9, True, True, 2.1, True),
        (8, 64, 9.6, 4.2, 6.6, True, False, 2.6, True),   # new high block
        (6, 56, 8.0, 2.4, 4.0, False, True, 1.4, False),  # old low tunnel block, young crop
        (8, 58, 8.0, 2.6, 4.3, False, False, 0.5, False), # just planted
        (7, 62, 9.6, 4.0, 6.3, True, True, 2.5, True),
        (5, 54, 8.0, 2.5, 4.1, False, False, 1.8, False),
        (8, 60, 8.0, 3.0, 5.0, True, False, 0.0, True),   # empty, between crops
    ]
    out = []
    for i, s in enumerate(specs):
        o = block(f"GD_Blok_{i}", *s, mats)
        c.objects.link(o)
        o.location = (i * 150, 0, -800)
        out.append(o)
    return c

# ---------------------------------------------------------------- trees, tanks, houses

def blob(bm, center, rx, rz, rnd, subdiv=2, rough=0.22, mat_index=0):
    ret = bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=1.0)
    s = rnd.random() * 100
    for v in ret["verts"]:
        d = v.co.copy()
        n = 1 + rough * noise.noise(d * 2.2 + Vector((s, 0, 0)))
        v.co = Vector((d.x * rx * n, d.y * rx * n, d.z * rz * n)) + center
        for f in v.link_faces:
            f.material_index = mat_index

def foliage_material(name, a, b):
    m, nt = mat(name)
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    p = N.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.85
    tc = N.new("ShaderNodeTexCoord")
    oi = N.new("ShaderNodeObjectInfo")
    nz = tex_noise(nt, tc.outputs["Object"], 2.5, 8, 0.7)
    col = ramp(nt, nz.outputs["Fac"], [(0.35, a), (0.7, b)])
    col = mixrgb(nt, math_node(nt, "MULTIPLY", oi.outputs["Random"], 0.35), col, (0.06, 0.06, 0.03))
    L.new(col, p.inputs["Base Color"])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.8
    L.new(nz.outputs["Fac"], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], p.inputs["Normal"])
    L.new(p.outputs[0], out.inputs["Surface"])
    return m

def windbreak_trees():
    """Cypress and casuarina for the windbreak lines."""
    c = coll("GD_Rüzgarkiran")
    m = foliage_material("GD_Servi", (0.008, 0.022, 0.01), (0.03, 0.055, 0.022))
    rnd = random.Random(11)
    for k in range(5):
        bm = bmesh.new()
        h = rnd.uniform(9, 14)
        if k < 3:   # cypress: narrow flame
            blob(bm, Vector((0, 0, h * 0.5)), rnd.uniform(1.1, 1.6), h * 0.5, rnd, 4, 0.3)
        else:       # casuarina: taller, looser, two masses
            blob(bm, Vector((0, 0, h * 0.62)), 2.2, h * 0.36, rnd, 2, 0.32)
            blob(bm, Vector((0.6, 0.3, h * 0.35)), 1.9, h * 0.22, rnd, 2, 0.32)
        me = bpy.data.meshes.new(f"GD_Agac_{k}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(m)
        o = bpy.data.objects.new(me.name, me)
        c.objects.link(o)
        o.location = (k * 40, 400, -800)
    return c

def orchard_trees():
    c = coll("GD_Bahce")
    m = foliage_material("GD_Narenciye", (0.012, 0.035, 0.01), (0.04, 0.075, 0.02))
    rnd = random.Random(2)
    for k in range(2):
        bm = bmesh.new()
        for i in range(12):
            for j in range(11):
                blob(bm, Vector((i * 5.2 - 28.6 + rnd.uniform(-0.3, 0.3), j * 5.5 - 27.5, 2.0)), 2.1 + rnd.uniform(-0.4, 0.4), 1.8, rnd, 2, 0.35)
        me = bpy.data.meshes.new(f"GD_Bahce_{k}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(m)
        o = bpy.data.objects.new(me.name, me)
        c.objects.link(o)
        o.location = (k * 100, 800, -800)
    return c

def tanks_houses():
    """Water tanks, open irrigation pools and packhouses: one cell each."""
    c = coll("GD_Yapilar")
    beton = simple("GD_Beton", (0.42, 0.41, 0.38), 0.85)
    su = simple("GD_Su", (0.01, 0.03, 0.03), 0.05)
    duvar = simple("GD_Duvar", (0.62, 0.6, 0.55), 0.8)
    cati = simple("GD_Cati", (0.38, 0.39, 0.4), 0.5, 0.6)
    rnd = random.Random(5)
    objs = []
    # round tanks
    for k, r in enumerate((7.5, 10.0)):
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, segments=40, radius1=r, radius2=r, depth=3.2, matrix=Matrix.Translation((0, 0, 1.6)))
        bmesh.ops.create_circle(bm, cap_ends=True, segments=40, radius=r - 0.35, matrix=Matrix.Translation((0, 0, 2.8)))
        bm.faces.ensure_lookup_table()
        bm.faces[-1].material_index = 1
        objs.append((f"GD_Depo_{k}", bm))
    # open pool, lined
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((0, 0, 0.6)) @ Matrix.Diagonal((26, 38, 1.2, 1)))
    bm.verts.ensure_lookup_table()
    f = bm.faces.new([bm.verts.new(p) for p in ((-12.5, -18.5, 1.22), (12.5, -18.5, 1.22), (12.5, 18.5, 1.22), (-12.5, 18.5, 1.22))])
    f.material_index = 1
    objs.append(("GD_Havuz", bm))
    # packhouse / farmhouse: plain box, flat or low roof, rooftop tank
    for k in range(3):
        bm = bmesh.new()
        w, d, h = rnd.uniform(10, 16), rnd.uniform(12, 22), rnd.uniform(4.5, 7)
        ret = bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((0, 0, h / 2)) @ Matrix.Diagonal((w, d, h, 1)))
        for v in ret["verts"]:
            for f in v.link_faces:
                f.material_index = 2
        ret = bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((0, 0, h + 0.15)) @ Matrix.Diagonal((w + 0.4, d + 0.4, 0.3, 1)))
        for v in ret["verts"]:
            for f in v.link_faces:
                f.material_index = 3
        bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.7, radius2=0.7, depth=1.4,
                              matrix=Matrix.Translation((w * 0.25, d * 0.2, h + 1.0)))
        objs.append((f"GD_Ev_{k}", bm))
    out = {}
    for i, (name, bm) in enumerate(objs):
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        bm.free()
        for m_ in (beton, su, duvar, cati):
            me.materials.append(m_)
        o = bpy.data.objects.new(name, me)
        c.objects.link(o)
        o.location = (i * 60, 1200, -800)
        out[name] = o
    return c

# ---------------------------------------------------------------- roads and layout

# the coast road runs along the plain; farm roads run down to the shore
MAIN_ROAD = [(8000, 1950), (6000, 1880), (4200, 1760), (2700, 1640), (1300, 1560), (0, 1460), (-1100, 1300), (-1900, 1150)]
CROSS_ROADS = [
    [(3700, 1720), (3720, 2300), (3760, 2900)],
    [(1900, 1600), (1880, 2250), (1850, 2850)],
    [(300, 1490), (280, 2100), (240, 2720)],
    [(-1000, 1320), (-1050, 1900), (-1100, 2350)],
    [(7000, 600), (5000, 520), (3000, 420), (1000, 330), (-900, 250), (-1700, 200)],
    [(5200, -1200), (5100, 0), (4980, 1800)],
    [(2400, -1500), (2350, 0), (2300, 1650)],
]

def seg_dist(p, a, b):
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    t = max(0.0, min(1.0, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy)

def road_dist(p, road):
    return min(seg_dist(p, a, b) for a, b in zip(road, road[1:]))

def road_mesh(name, road, width, matl):
    bm = bmesh.new()
    pts = []
    for a, b in zip(road, road[1:]):
        L_ = math.hypot(b[0] - a[0], b[1] - a[1])
        n = max(1, int(L_ / 12))
        for i in range(n):
            t = i / n
            pts.append(Vector((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0)))
    pts.append(Vector((*road[-1], 0)))
    prev = None
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        nrm = Vector((-d.y, d.x, 0)) * width / 2
        a = p + nrm
        b = p - nrm
        a.z = height(a.x, a.y) + 0.25
        b.z = height(b.x, b.y) + 0.25
        va, vb = bm.verts.new(a), bm.verts.new(b)
        if prev:
            bm.faces.new((prev[0], prev[1], vb, va))
        prev = (va, vb)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(matl)
    o = bpy.data.objects.new(name, me)
    coll("GD_Ova").objects.link(o)

def roads():
    asphalt, _ = mat("GD_Asfalt")
    nt = asphalt.node_tree
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Roughness"].default_value = 0.75
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(ramp(nt, tex_noise(nt, tc.outputs["Object"], 0.3, 6).outputs["Fac"],
                      [(0.3, (0.05, 0.05, 0.05)), (0.7, (0.09, 0.088, 0.085))]), p.inputs["Base Color"])
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    gravel = simple("GD_Stabilize", (0.24, 0.21, 0.17), 0.95)
    road_mesh("GD_AnaYol", MAIN_ROAD, 9.0, asphalt)
    for i, r in enumerate(CROSS_ROADS):
        road_mesh(f"GD_TarlaYolu_{i}", r, 5.5, gravel)

def scatter():
    """Field districts laid out as slightly rotated grids, blocks edge to edge
    with narrow farm tracks between them; windbreak lines, orchards, tanks,
    pools, packhouses and bare fields in between."""
    rnd = random.Random(7)
    out = {"blok": [], "agac": [], "bahce": [], "depo": [], "ev": []}
    taken = {}
    all_roads = [MAIN_ROAD] + CROSS_ROADS
    def free(p, dmin):
        key = (int(p.x // 80), int(p.y // 80))
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for q in taken.get((key[0] + dx, key[1] + dy), []):
                    if (p - q).length < dmin:
                        return False
        return True
    def take(p):
        taken.setdefault((int(p.x // 80), int(p.y // 80)), []).append(p.copy())
    for d in range(420):
        cx = rnd.uniform(-1900, 8000)
        cy = rnd.uniform(-3200, 2900)
        base = math.radians(rnd.choice([14, 17, 20, 23, 26, 105, 108]))
        R = Matrix.Rotation(base, 3, "Z")
        rad = rnd.uniform(300, 750)
        windrows = {rnd.randint(-8, 8) for _ in range(rnd.randint(0, 2))}
        for i in range(-15, 16):
            for j in range(-15, 16):
                local = Vector((i * 70 + rnd.uniform(-1.5, 1.5), j * 69 + rnd.uniform(-1.5, 1.5), 0))
                if local.length > rad * (0.85 + 0.15 * noise.noise(local / 300.0 + Vector((d, 0, 0)))):
                    continue
                p = Vector((cx, cy, 0)) + R @ local
                if mountain(p.x, p.y) > 1 or p.y > coast_y(p.x) - 60:
                    continue
                if min(road_dist((p.x, p.y), r) for r in all_roads) < 39:
                    continue
                if not free(p, 64):
                    continue
                take(p)
                p.z = height(p.x, p.y) - 0.2
                ang = base + rnd.uniform(-0.008, 0.008)
                if j in windrows:
                    # a windbreak line instead of a block row
                    for t in range(-8, 9):
                        q = p + R @ Vector((t * 4.1 + rnd.uniform(-0.5, 0.5), -33 + rnd.uniform(-0.4, 0.4), 0))
                        q.z = height(q.x, q.y) - 0.3
                        out["agac"].append((q, rnd.uniform(0, 6.28)))
                    continue
                r = rnd.random()
                if r < 0.86:
                    out["blok"].append((p, ang))
                elif r < 0.91:
                    out["bahce"].append((p, ang))
                elif r < 0.935:
                    out["depo"].append((p, ang))
                elif r < 0.95:
                    out["ev"].append((p, ang))
                # else: bare field between crops
    # windbreaks along the farm roads, broken where gateways are
    for road in CROSS_ROADS:
        for a, b in zip(road, road[1:]):
            L_ = math.hypot(b[0] - a[0], b[1] - a[1])
            n = int(L_ / 4.3)
            dvec = Vector((b[0] - a[0], b[1] - a[1], 0)).normalized()
            side = Vector((-dvec.y, dvec.x, 0)) * 8
            for k in range(n):
                if noise.noise(Vector((a[0] / 300 + k * 0.03, a[1] / 300, 1.3))) < -0.05:
                    continue
                q = Vector((a[0], a[1], 0)) + dvec * (k * 4.3) + side
                if mountain(q.x, q.y) > 1 or q.y > coast_y(q.x) - 40:
                    continue
                q.z = height(q.x, q.y) - 0.3
                out["agac"].append((q, rnd.uniform(0, 6.28)))
    # packhouses along the main road
    for k in range(70):
        t = rnd.random()
        segs = list(zip(MAIN_ROAD, MAIN_ROAD[1:]))
        a, b = segs[min(len(segs) - 1, int(t * len(segs)))]
        u = rnd.random()
        q = Vector((a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 0))
        dvec = Vector((b[0] - a[0], b[1] - a[1], 0)).normalized()
        q += Vector((-dvec.y, dvec.x, 0)) * rnd.choice([-1, 1]) * rnd.uniform(16, 26)
        if not free(q, 20):
            continue
        take(q)
        q.z = height(q.x, q.y)
        out["ev"].append((q, math.atan2(dvec.y, dvec.x) - math.pi / 2))
    return out

def gn_points(name, pts, collection, seed, scale=(0.85, 1.15)):
    c = coll("GD_Ova")
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(p) for p, a in pts], [], [])
    attr = me.attributes.new("aci", "FLOAT", "POINT")
    attr.data.foreach_set("value", [a for p, a in pts])
    o = bpy.data.objects.new(name, me)
    c.objects.link(o)
    ng = bpy.data.node_groups.new(name + "_GN", "GeometryNodeTree")
    ng.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    N, L = ng.nodes, ng.links
    gi, go = N.new("NodeGroupInput"), N.new("NodeGroupOutput")
    ci = N.new("GeometryNodeCollectionInfo")
    ci.inputs["Collection"].default_value = collection
    ci.inputs["Separate Children"].default_value = True
    ci.inputs["Reset Children"].default_value = True
    iop = N.new("GeometryNodeInstanceOnPoints")
    iop.inputs["Pick Instance"].default_value = True
    ri = N.new("FunctionNodeRandomValue"); ri.data_type = "INT"
    ri.inputs["Min"].default_value = 0; ri.inputs["Max"].default_value = len(collection.objects) - 1
    ri.inputs["Seed"].default_value = seed
    na = N.new("GeometryNodeInputNamedAttribute"); na.data_type = "FLOAT"
    na.inputs["Name"].default_value = "aci"
    cmb = N.new("ShaderNodeCombineXYZ")
    rs = N.new("FunctionNodeRandomValue"); rs.data_type = "FLOAT_VECTOR"
    rs.inputs["Min"].default_value = (scale[0], scale[0], scale[0])
    rs.inputs["Max"].default_value = (scale[1], scale[1], scale[1])
    rs.inputs["Seed"].default_value = seed + 1
    L.new(gi.outputs[0], iop.inputs["Points"])
    L.new(ci.outputs[0], iop.inputs["Instance"])
    L.new(out_of(ri, "INT"), iop.inputs["Instance Index"])
    L.new(out_of(na, "VALUE"), cmb.inputs["Z"])
    L.new(cmb.outputs[0], iop.inputs["Rotation"])
    L.new(out_of(rs, "VECTOR"), iop.inputs["Scale"])
    L.new(iop.outputs[0], go.inputs[0])
    mod = o.modifiers.new("GN", "NODES")
    mod.node_group = ng
    return o

# ---------------------------------------------------------------- light, air, camera

SUN_EL, SUN_AZ = 11.0, -54.0  # morning sun, low, ahead and to the right (over the sea)

def world_and_sun():
    sc = bpy.context.scene
    w = bpy.data.worlds.new("GD_OvaDunya")
    sc.world = w
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_disc = False
    sky.sun_elevation = math.radians(SUN_EL)
    # sky texture azimuth is measured the other way round from ours
    sky.sun_rotation = math.radians(-SUN_AZ)
    sky.altitude = 40
    try:
        sky.aerosol_density = 3.0
        sky.air_density = 1.2
    except Exception:
        pass
    bg.inputs["Strength"].default_value = 0.22
    nt.links.new(sky.outputs[0], bg.inputs[0])
    nt.links.new(bg.outputs[0], out.inputs[0])
    sun = bpy.data.lights.new("GD_OvaGunes", "SUN")
    sun.energy = 5.2
    sun.angle = math.radians(0.8)
    sun.color = (1.0, 0.83, 0.64)
    so = bpy.data.objects.new("GD_OvaGunes", sun)
    sc.collection.objects.link(so)
    el, az = math.radians(SUN_EL), math.radians(SUN_AZ)
    d = Vector((math.cos(el) * math.sin(az), math.cos(el) * math.cos(az), math.sin(el)))
    so.rotation_euler = d.to_track_quat("Z", "Y").to_euler()

def haze(density=3.2e-5, falloff=650.0):
    """Morning haze, thick at the ground and thinning with height: the
    mountains fade back in layers (atmospheric perspective)."""
    c = coll("GD_Ova")
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((1000, 5000, 1490)) @ Matrix.Diagonal((25000, 22000, 3000, 1)))
    me = bpy.data.meshes.new("GD_Hava")
    bm.to_mesh(me)
    bm.free()
    m, nt = mat("GD_HavaMat")
    N, L = nt.nodes, nt.links
    out = N.new("ShaderNodeOutputMaterial")
    v = N.new("ShaderNodeVolumePrincipled")
    geo = N.new("ShaderNodeNewGeometry")
    sep = N.new("ShaderNodeSeparateXYZ"); L.new(geo.outputs["Position"], sep.inputs[0])
    dens = math_node(nt, "MULTIPLY", math_node(nt, "EXPONENT", math_node(nt, "MULTIPLY", math_node(nt, "MAXIMUM", sep.outputs["Z"], 0.0), -1.0 / falloff)), density)
    L.new(dens, v.inputs["Density"])
    v.inputs["Color"].default_value = (0.9, 0.9, 0.92, 1)
    v.inputs["Anisotropy"].default_value = 0.5
    L.new(v.outputs[0], out.inputs["Volume"])
    me.materials.append(m)
    o = bpy.data.objects.new("GD_Hava", me)
    c.objects.link(o)
    o.visible_shadow = False

CAM = (2650.0, 2480.0)   # ~450 m from the shore, looking west along the coast

def camera(yaw=74.0, pitch=5.5, up=36.0):
    sc = bpy.context.scene
    cd = bpy.data.cameras.new("GD_OvaKamera")
    cd.lens = 35
    cd.sensor_width = 36
    cd.clip_start = 1
    cd.clip_end = 40000
    co = bpy.data.objects.new("GD_OvaKamera", cd)
    sc.collection.objects.link(co)
    x, y = CAM
    co.location = (x, y, height(x, y) + up)
    co.rotation_euler = (math.radians(90 - pitch), 0, math.radians(yaw))
    sc.camera = co

def build():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)
    terrain()
    sea()
    roads()
    bc = blocks()
    wt = windbreak_trees()
    ot = orchard_trees()
    th = tanks_houses()
    for name in ("GD_Bloklar", "GD_Rüzgarkiran", "GD_Bahce", "GD_Yapilar"):
        lc = bpy.context.view_layer.layer_collection.children.get(name)
        if lc:
            lc.exclude = True
    pts = scatter()
    gn_points("GD_BlokNoktalari", pts["blok"], bc, 3, (0.97, 1.03))
    gn_points("GD_AgacNoktalari", pts["agac"], wt, 5, (0.8, 1.2))
    gn_points("GD_BahceNoktalari", pts["bahce"], ot, 9, (0.95, 1.05))
    # tanks/pools and houses share a collection; split by name
    dep = bpy.data.collections.new("GD_Depolar")
    evs = bpy.data.collections.new("GD_Evler")
    for o in th.objects:
        (evs if o.name.startswith("GD_Ev") else dep).objects.link(o)
    gn_points("GD_DepoNoktalari", pts["depo"], dep, 13, (1.0, 1.0))
    gn_points("GD_EvNoktalari", pts["ev"], evs, 17, (0.9, 1.15))
    world_and_sun()
    haze()
    camera()
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "GPU"
    sc.cycles.samples = 256
    sc.cycles.use_denoising = True
    sc.cycles.volume_step_rate = 4.0
    sc.cycles.max_bounces = 8
    sc.cycles.transparent_max_bounces = 16
    sc.render.resolution_x = 2400
    sc.render.resolution_y = 1350
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.exposure = -0.3
    for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            sc.view_settings.look = look
            break
        except TypeError:
            pass
    print("blocks", len(pts["blok"]), "trees", len(pts["agac"]), "orchards", len(pts["bahce"]),
          "tanks", len(pts["depo"]), "houses", len(pts["ev"]))

if __name__ == "__main__":
    build()
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if argv:
        bpy.ops.wm.save_as_mainfile(filepath=argv[0])
