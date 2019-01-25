let camera = new Camera();
let cat = new Object3D();
cat.mesh = Mesh.cat;
cat.scale = new Vector(0.01, 0.01, 0.01);
function generate_grid(width, height, bleed_x, bleed_y, cell_size, variance, rand_fn) {

  var points = [];
  for (var i = -bleed_x; i < w; i += cell_size) {
    for (var j = -bleed_y; j < h; j += cell_size) {
      var x = (i + half_cell_size) + (rand_fn() * double_v + negative_v);
      var y = (j + half_cell_size) + (rand_fn() * double_v + negative_v);
      points.push([Math.floor(x), Math.floor(y)]);
    }
  }

  return points;
}

module.exports = generate_grid;