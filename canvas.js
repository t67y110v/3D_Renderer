function getWindowSize() {
	return {width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight};
}

function setSize(canvas, size) {
	canvas.width = size.width - canvas.getBoundingClientRect().left * 2 - 10;
	canvas.height = size.height - canvas.getBoundingClientRect().top * 2 - 10;
}

var size = getWindowSize();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
setSize(canvas, size);
