function getNSidedPyramid(sidecount) {
	var tip = seen.P(0,1,0);
	var bottom = [];
	for (var i = 0; i < sidecount; i++) {
		var angle = i * Math.PI * 2.0 / sidecount;
		bottom.push(seen.P(Math.cos(angle), -0.5, Math.sin(angle)));
	}
	var sides = [];
	for (var i = 0; i < sidecount; i++) {
		sides.push(new seen.Surface([bottom[(i + 1) % sidecount], bottom[i], tip]));
	}
	sides.push(new seen.Surface(bottom));
	return sides;
}

function updatePyramid(sidecount) {
	shape = new seen.Shape("terejaistuge", getNSidedPyramid(parseInt(sidecount))).scale(height * 0.3);
	scene.model.children[0] = shape;
	context.render()
}

var ratio = (function() {
	var seencontext = document.getElementById("seen-canvas").getContext("2d");
	var devicePixelRatio = window.devicePixelRatio || 1;
	var backingStoreRatio = seencontext.webkitBackingStorePixelRatio || seencontext.mozBackingStorePixelRatio || seencontext.msBackingStorePixelRatio || seencontext.oBackingStorePixelRatio || seencontext.backingStorePixelRatio || 1;
	return devicePixelRatio / backingStoreRatio;
})();
var width = document.getElementById("seen-canvas").clientWidth * ratio;
var height = document.getElementById("seen-canvas").clientHeight * ratio;
document.getElementById("seen-canvas").width = width;
document.getElementById("seen-canvas").height = height;

var overlaysurface = new seen.Surface([seen.P(0,1,0),seen.P(1,-0.5,0),seen.P(0,-0.5,0)]).stroke(new seen.Color(192, 57, 43, 255));
overlaysurface.fillMaterial = null;
overlaysurface["stroke-width"] = 4;

var shape = new seen.Shape("terejaistuge", getNSidedPyramid(7)).scale(height * 0.3);
var overlayshape = new seen.Shape("pealminek", [overlaysurface]).scale(height * 0.3);
//var unitcube = seen.Shapes.unitcube().scale(height * 0.2);

//seen.Colors.randomSurfaces2(shape);

var overlayscene = new seen.Scene({
	model: seen.Models.default().add(overlayshape),
	viewport: seen.Viewports.center(width, height),
	shader: seen.Shaders.flat(),
	cullBackfaces: false
});

var scene = new seen.Scene({
	model: seen.Models.default().add(shape),//.add(unitcube),
	viewport: seen.Viewports.center(width, height),
	shader: seen.Shaders.diffuse()
});

var context = seen.Context("seen-canvas");
context.sceneLayer(scene);
context.sceneLayer(overlayscene);
context.ctx.lineCap = "round";
context.ctx.lineJoin = "round";
context.render();

var dragger = new seen.Drag("seen-canvas", {
	inertia: true
});

dragger.on("drag.rotate", function(e) {
	var ref;
	var xform = (ref = seen.Quaternion).xyToTransform.apply(ref, e.offsetRelative);
	scene.model.transform(xform);
	overlayscene.model.transform(xform);
	//unitcube.transform(xform);
	return context.render();
});
