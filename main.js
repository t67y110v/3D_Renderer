let camera = new Camera();
let cat = new Object3D();
cat.mesh = Mesh.cat;
cat.scale = new Vector(0.01, 0.01, 0.01);

let amp = 10;
let speed = 1;

let angle = 0;
function update() {
	camera.position = new Vector(Math.sin(angle * speed) * amp, 0, Math.cos(angle * speed) * amp);
	camera.look(Vector.substract(cat.position, camera.position));

	angle += Math.PI / 180;
	render(camera);
}
