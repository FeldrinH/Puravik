var canvaswidth, canvasheight;
var shape;

window.onresize = function(event) {
	rescaleCanvas();
	updatePyramid();
}

function rescaleCanvas() {
	canvaswidth = document.getElementById("seen-canvas").clientWidth * ratio;
	canvasheight = document.getElementById("seen-canvas").clientHeight * ratio;
	document.getElementById("seen-canvas").width = canvaswidth;
	document.getElementById("seen-canvas").height = canvasheight;

	scene.viewport = seen.Viewports.center(canvaswidth, canvasheight);
}

function getNSidedPyramid(n, h, R) {
	var tip = seen.P(0, 2 * h / 3, 0);
	var bottom = [];
	for (var i = 0; i < n; i++) {
		var angle = i * Math.PI * 2.0 / n;
		bottom.push(seen.P(Math.cos(angle) * R, -h / 3, Math.sin(angle) * R));
	}
	var sides = [];
	for (var i = 0; i < n; i++) {
		sides.push(new seen.Surface([bottom[(i + 1) % n], bottom[i], tip]));
	}
	sides.push(new seen.Surface(bottom));
	return sides;
}

function calculateSpoke(r, n) {
	var angle = Math.PI / n;
	return r / Math.cos(angle);
}

function calculateBaseedge(r, n) {
	var angle = Math.PI / n;
	return Math.tan(angle) * r * 2;
}

function calculateApothem(r, h) {
	return Math.sqrt(r * r + h * h);
}

function recalculatePyramid(){
	spoke = calculateSpoke(baseapothem, sidecount);
	apothem = calculateApothem(baseapothem, height);
	baseedge = calculateBaseedge(baseapothem, sidecount);
	//console.log(baseedge, baseapothem, spoke);

	var basearea = baseedge * baseapothem * sidecount / 2; 
	var sidearea = baseedge * apothem * sidecount / 2;
	area = basearea + sidearea;
	volume = basearea * height / 3;

	document.getElementById("area").value = +area.toFixed(10);
	document.getElementById("volume").value = +volume.toFixed(10);
}

function updatePyramid() {
	recalculatePyramid();

	shape = new seen.Shape("terejaistuge", getNSidedPyramid(sidecount, height, spoke)).scale(canvasheight * 0.3 / Math.max(spoke, height / 2));
	scene.model.children[0] = shape;
	context.render();
}

var sidecount = 7;
var height = 1.5;
var baseapothem = 1;
var spoke, apothem, baseedge;
var area, volume;
recalculatePyramid();

var overlayscene = new seen.Scene({
	model: seen.Models.default(),//.add(overlayshape),
	shader: seen.Shaders.flat(),
	cullBackfaces: false
});

var scene = new seen.Scene({
	model: seen.Models.default(),//.add(unitcube),
	shader: seen.Shaders.diffuse()
});

var ratio = (function() {
	var seencontext = document.getElementById("seen-canvas").getContext("2d");
	var devicePixelRatio = window.devicePixelRatio || 1;
	var backingStoreRatio = seencontext.webkitBackingStorePixelRatio
						|| seencontext.mozBackingStorePixelRatio
						|| seencontext.msBackingStorePixelRatio
						|| seencontext.oBackingStorePixelRatio
						|| seencontext.backingStorePixelRatio
						|| 1;
	return devicePixelRatio / backingStoreRatio;
})();
rescaleCanvas();

//var overlaysurface = new seen.Surface([seen.P(0,1,0),seen.P(1,-0.5,0),seen.P(0,-0.5,0)]).stroke(new seen.Color(192, 57, 43, 255));
//overlaysurface.fillMaterial = null;
//overlaysurface["stroke-width"] = 4;

//var overlayshape = new seen.Shape("pealminek", [overlaysurface]).scale(canvasheight * 0.3);

//seen.Colors.randomSurfaces2(shape);

var context = seen.Context("seen-canvas");
context.sceneLayer(scene);
context.sceneLayer(overlayscene);
context.ctx.lineCap = "round";
context.ctx.lineJoin = "round";

updatePyramid()

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
