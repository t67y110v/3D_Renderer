let cube = new Object3D();
let camera = new Camera();
(new Object3D()).position = new Vector(1, 1, 1);
camera.viewAngle = 90;

function update() {
	cube.rotation.x += 1;
	render(camera);
}
