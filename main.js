var width = 600;
var height = 600;

var sidecount = 9;

var tip = seen.P(0,2,0)
var bottom = [];
for (var i = 0; i < sidecount; i++) {
	var angle = i * Math.PI * 2.0 / sidecount;
	bottom.push(seen.P(Math.cos(angle), 0, Math.sin(angle)));
}
var sides = []
for (var i = 0; i < sidecount; i++) {
	sides.push(new seen.Surface([bottom[(i + 1) % sidecount], bottom[i], tip]));
}
sides.push(new seen.Surface(bottom));

var shape = new seen.Shape("terejaistuge", sides).scale(height * 0.2);
//var unitcube = seen.Shapes.unitcube().scale(height * 0.2);

//seen.Colors.randomSurfaces2(shape);

var scene = new seen.Scene({
	model: seen.Models.default().add(shape),//.add(unitcube),
	viewport: seen.Viewports.center(width, height),
	shader: seen.Shaders.diffuse()
});

var context = seen.Context("seen-canvas", scene).render();

var dragger = new seen.Drag("seen-canvas", {
	inertia: true
});

dragger.on("drag.rotate", function(e) {
	var ref;
	var xform = (ref = seen.Quaternion).xyToTransform.apply(ref, e.offsetRelative);
	shape.transform(xform);
	//unitcube.transform(xform);
	return context.render();
});
