var objects = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Array.prototype.clone = function() {
	return this.slice(0);
};

Object.getPrototypeOf(context).point=function(x, y) {
	this.fillRect(x, y, 1, 1);
};

function loadFile(filePath) {
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.status==200) {
	result = xmlhttp.responseText;
	}
	return result;
}
