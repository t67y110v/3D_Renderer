let camera = new Camera();
camera.position.y = 10;
let plane = new Object3D();
plane.scale = new Vector(7, 0.1, 7);
let cube = new Object3D();
cube.position.y = 1.5;

for (let i = 0; i < 2; i++) {
	for (let j = 0; j < 2; j++) {
		(new Object3D()).position = new Vector(i * 6 - 3, 0.5, j * 6 - 3);
	}
}

let amp = 5;
let speed = 0.2;

let angle = 0;
function update() {
	camera.position.y = Math.sin(angle * speed) * amp + amp;
	camera.look(Vector.substract(plane.position, camera.position));
	cube.rotation.move(new Vector(3 * speed, 3 * speed));

	angle += Math.PI / 180;
	render(camera);
}
