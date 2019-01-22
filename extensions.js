function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Array.prototype.clone = function() {
	return this.slice(0);
};

Object.getPrototypeOf(context).point=function(x, y) {
	this.fillRect(x, y, 1, 1);
};
