"""Parametric model of the Singer BU7 belt motor, with an exploded-view render.

Run headless (no Blender window):
  /Applications/Blender.app/Contents/MacOS/Blender -b -P build_bu7.py -- \
      --explode 1.0 --out renders/bu7_exploded.png [--blend bu7.blend] [--no-labels]

--explode 0 renders the assembled motor; 1.0 is the standard exploded view.
Dimensions come from bu7_dimensions.json (inches; estimates until measured).
Shaft runs along X. -X is the brush/commutator end, +X the pulley end.
"""

import json
import math
import sys
from pathlib import Path

import bpy

HERE = Path(__file__).resolve().parent


def args() -> dict:
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out = {"explode": 1.0, "out": str(HERE / "renders" / "bu7_exploded.png"),
           "blend": None, "labels": True}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--explode":
            out["explode"] = float(argv[i + 1]); i += 1
        elif a == "--out":
            out["out"] = argv[i + 1]; i += 1
        elif a == "--blend":
            out["blend"] = argv[i + 1]; i += 1
        elif a == "--no-labels":
            out["labels"] = False
        i += 1
    return out


A = args()
F = A["explode"]
D = {k: v["value"] for k, v in json.loads((HERE / "bu7_dimensions.json").read_text()).items()
     if not k.startswith("_")}

# --- scene -----------------------------------------------------------------

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def material(name, rgb, metal=0.0, rough=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*rgb, 1)
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Roughness"].default_value = rough
    return m


MAT = {
    "enamel": material("black enamel", (0.03, 0.03, 0.035), 0.1, 0.25),
    "steel": material("laminated steel", (0.22, 0.22, 0.24), 0.8, 0.45),
    "copper": material("copper", (0.72, 0.36, 0.18), 1.0, 0.3),
    "coil": material("taped coil", (0.12, 0.08, 0.05), 0.0, 0.7),
    "brass": material("brass", (0.78, 0.6, 0.25), 1.0, 0.3),
    "carbon": material("carbon", (0.05, 0.05, 0.05), 0.0, 0.9),
    "nickel": material("nickel", (0.5, 0.5, 0.52), 1.0, 0.25),
    "cord": material("cloth cord", (0.18, 0.13, 0.09), 0.0, 0.95),
    "label": material("label text", (0.02, 0.02, 0.02), 0.0, 0.8),
}

PARTS: list = []


def add(obj, mat, name, offset=(0, 0, 0)):
    """Register a part; offset is its exploded displacement at F=1."""
    obj.name = name
    obj.data.materials.clear()  # boolean cuts leave an empty slot that renders white
    obj.data.materials.append(MAT[mat])
    for poly in getattr(obj.data, "polygons", []):
        poly.material_index = 0
    obj.location = tuple(l + o * F for l, o in zip(obj.location, offset))
    PARTS.append((obj, offset))
    return obj


def cyl(r, length, x=0.0, y=0.0, z=0.0, axis="X", verts=48):
    rot = {"X": (0, math.pi / 2, 0), "Y": (math.pi / 2, 0, 0), "Z": (0, 0, 0)}[axis]
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=length,
                                        location=(x, y, z), rotation=rot)
    o = bpy.context.object
    bpy.ops.object.shade_smooth()
    return o


def box(sx, sy, sz, x=0.0, y=0.0, z=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    o = bpy.context.object
    o.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    return o


def subtract(target, cutter):
    mod = target.modifiers.new("cut", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def bevel(obj, width=0.08):
    m = obj.modifiers.new("bevel", "BEVEL")
    m.width = width
    m.segments = 3


# --- parts -----------------------------------------------------------------

L, W, H = D["body_length"], D["body_width"], D["body_height"]
EH_R, EH_L = D["end_housing_dia"] / 2, D["end_housing_len"]
x_brush_end = -L / 2 - EH_L / 2
x_drive_end = L / 2 + EH_L / 2

# Field core: laminated block with a bore for the armature.
core = box(L, W, H)
rnd = core.modifiers.new("round", "BEVEL")  # laminations have rounded corners
rnd.width, rnd.segments = 0.45, 4
rnd.limit_method = "ANGLE"
bpy.context.view_layer.objects.active = core
bpy.ops.object.modifier_apply(modifier=rnd.name)
subtract(core, cyl(D["armature_dia"] / 2 + 0.06, L + 0.2))
add(core, "steel", "field core")

# Field coil: taped winding on one side pole.
coil = box(L * 0.85, 0.42, H * 0.7, y=W / 2 + 0.21)
bevel(coil, 0.12)
add(coil, "coil", "field coil", (0, 0.9, 0))

# Armature: core, end-turn windings, commutator, shaft.
arm_drop = (0, 0, -3.6)
add(cyl(D["armature_dia"] / 2, D["armature_len"]), "steel", "armature core", arm_drop)
for sx in (-1, 1):
    add(cyl(D["armature_dia"] / 2 - 0.08, 0.22, x=sx * (D["armature_len"] / 2 + 0.11)),
        "copper", f"armature windings {'brush' if sx < 0 else 'drive'} side", arm_drop)
add(cyl(D["commutator_dia"] / 2, D["commutator_len"],
        x=-(D["armature_len"] / 2 + 0.22 + D["commutator_len"] / 2 + 0.05)),
    "copper", "commutator", arm_drop)
add(cyl(D["shaft_dia"] / 2, D["shaft_len"], x=0.35), "nickel", "shaft", arm_drop)

# Brush-end housing with two brush tubes (one each side, along Y).
bh = cyl(EH_R, EH_L, x=x_brush_end)
bevel(bh, 0.15)
add(bh, "enamel", "brush-end housing", (-2.2, 0, 0))
for side in (-1, 1):
    tag = "front" if side < 0 else "back"
    ty = side * (EH_R + 0.18)
    add(cyl(D["brush_tube_dia"] / 2 - 0.06, 0.45, x=x_brush_end - 0.1, y=ty, axis="Y"),
        "enamel", f"brush tube ({tag})", (-2.2, 0, 0))
    bx, by, bl = D["brush_size"]
    add(box(bx, bl, by, x=x_brush_end - 0.1, y=side * (EH_R - 0.1)),
        "carbon", f"carbon brush ({tag})", (-2.2, side * 2.0, 0))
    spring = cyl(0.08, 0.5, x=x_brush_end - 0.1, y=side * (EH_R + 0.3), axis="Y", verts=12)
    add(spring, "nickel", f"brush spring ({tag})", (-2.2, side * 2.7, 0))
    cap = cyl(D["brush_tube_dia"] / 2, 0.16, x=x_brush_end - 0.1, y=side * (EH_R + 0.48), axis="Y")
    add(cap, "enamel", f"brush cap ({tag})", (-2.2, side * 3.4, 0))
    add(cyl(0.09, 0.03, x=x_brush_end - 0.1, y=side * (EH_R + 0.57), axis="Y"),
        "brass", f"brush cap insert ({tag})", (-2.2, side * 3.4, 0))

# Drive-end housing, bearing boss, grease tube, pulley.
dh = cyl(EH_R, EH_L, x=x_drive_end)
bevel(dh, 0.15)
add(dh, "enamel", "drive-end housing", (2.2, 0, 0))
add(cyl(0.38, 0.4, x=x_drive_end + EH_L / 2 + 0.2), "enamel", "bearing boss", (2.2, 0, 0))
add(cyl(0.07, 0.45, x=x_drive_end + 0.1, z=EH_R + 0.15, axis="Z", verts=16),
    "brass", "grease tube", (2.2, 0, 0))
px = x_drive_end + EH_L / 2 + 0.4 + D["pulley_len"] / 2 + 0.05
pulley = cyl(D["pulley_dia"] / 2, D["pulley_len"], x=px)
bpy.ops.mesh.primitive_torus_add(major_radius=D["pulley_dia"] / 2 + 0.02, minor_radius=0.07,
                                 location=(px, 0, 0), rotation=(0, math.pi / 2, 0))
subtract(pulley, bpy.context.object)
add(pulley, "brass", "pulley", (3.4, 0, 0))

# Mounting arm (stamped "10") rising from the drive-end housing.
arm = box(0.45, 0.16, D["arm_length"], x=x_drive_end, y=-0.6, z=EH_R + D["arm_length"] / 2 - 0.3)
subtract(arm, box(0.22, 0.4, 0.5, x=x_drive_end, y=-0.6, z=EH_R + D["arm_length"] - 0.65))
bevel(arm, 0.03)
add(arm, "enamel", "mounting arm", (2.2, 0, 0))

# Curved sheet-metal cover with the data plate, over the top of the field.
cr = D["cover_radius"]
cover = cyl(cr, L + 0.3, verts=64)
subtract(cover, cyl(cr - 0.05, L + 0.6, verts=64))
subtract(cover, box(L + 1, cr * 2.4, cr + 1.0, z=(0.5 - cr - 0.5) / 2))  # keep only the top arc
add(cover, "enamel", "motor cover", (0, 0, 2.6))
plate = box(1.3, 0.8, 0.02, z=cr + 0.01)
add(plate, "nickel", "data plate (B.U.7)", (0, 0, 2.6))

# Old cloth lead (two-wire) leaving the body on the coil side.
curve = bpy.data.curves.new("lead", "CURVE")
curve.dimensions = "3D"
curve.bevel_depth = 0.06
sp = curve.splines.new("BEZIER")
sp.bezier_points.add(2)
for p, co in zip(sp.bezier_points, [(0.4, W / 2 + 0.45, 0.6), (1.2, W / 2 + 1.6, 1.0), (2.6, W / 2 + 2.2, 0.4)]):
    p.co = co
    p.handle_left_type = p.handle_right_type = "AUTO"
lead = bpy.data.objects.new("old motor lead", curve)
scene.collection.objects.link(lead)
lead.data.materials.append(MAT["cord"])
lead.location = (0, 0.9 * F, 0)

# --- camera, framed on the parts' bounding box ----------------------------

from mathutils import Euler, Vector  # noqa: E402  (Blender-only module)
from bpy_extras.object_utils import world_to_camera_view  # noqa: E402

cam_rot = Euler((math.radians(62), 0, math.radians(32)))
bpy.context.view_layer.update()
pts = [o.matrix_world @ Vector(c) for o, _ in PARTS for c in o.bound_box]
lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
center = (lo + hi) / 2
view_dir = Vector((0, 0, -1))
view_dir.rotate(cam_rot)

bpy.ops.object.camera_add(location=center - view_dir * 30, rotation=cam_rot)
cam = bpy.context.object
cam.data.type = "ORTHO"
cam.data.clip_end = 100
scene.camera = cam
scene.render.resolution_x, scene.render.resolution_y = 1600, 1100
# Fit: widest projected extent plus room for callouts in the margins.
cam.data.ortho_scale = 1.0
bpy.context.view_layer.update()
proj = [world_to_camera_view(scene, cam, p) for p in pts]
span_x = max(p.x for p in proj) - min(p.x for p in proj)
span_y = max(p.y for p in proj) - min(p.y for p in proj)  # normalized; ortho fits both
cam.data.ortho_scale = max(span_x, span_y) * (1.45 if A["labels"] and F > 0 else 1.15)

# --- label anchors for annotate.py (2D callouts drawn after render) --------

LABELS = ["brush-end housing", "carbon brush (front)", "brush spring (front)", "brush cap (front)",
          "commutator", "armature core", "shaft", "field core", "field coil", "motor cover",
          "data plate (B.U.7)", "drive-end housing", "mounting arm", "grease tube", "pulley"]
bpy.context.view_layer.update()
anchors = []
by_name = {o.name: o for o, _ in PARTS}
for name in LABELS:
    o = by_name.get(name)
    if not o:
        continue
    c = sum((o.matrix_world @ Vector(v) for v in o.bound_box), Vector()) / 8
    p = world_to_camera_view(scene, cam, c)
    anchors.append({"name": name, "x": p.x, "y": 1 - p.y})

bpy.ops.object.light_add(type="AREA", location=(4, -6, 10))
bpy.context.object.data.energy = 2500
bpy.context.object.data.size = 8
bpy.ops.object.light_add(type="AREA", location=(-8, 4, 6))
bpy.context.object.data.energy = 900
bpy.context.object.data.size = 6

world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.95, 0.95, 0.93, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.9

try:
    scene.render.engine = "BLENDER_EEVEE"
except TypeError:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.film_transparent = False
scene.view_settings.view_transform = "Standard"

out = Path(A["out"])
out.parent.mkdir(parents=True, exist_ok=True)
scene.render.filepath = str(out)
bpy.ops.render.render(write_still=True)
print("RENDERED", out)
if A["labels"] and F > 0:
    out.with_suffix(".labels.json").write_text(json.dumps(anchors, indent=1))
if A["blend"]:
    bpy.ops.wm.save_as_mainfile(filepath=str(Path(A["blend"]).resolve()))
    print("SAVED", A["blend"])
