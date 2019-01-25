function render(camera) {
	screenSize = (new Vector(canvas.width, canvas.height)).length;
	context.clearRect(0, 0, canvas.width, canvas.height);
	let horizontal = new Vector(1, 0, 0);
	let vertical = new Vector(0, 1, 0);
	let forward = new Vector(0, 0, 1);

	let x = 0; let y = 1; let z = 2;
	function rotate(vector, axis, angle) {
		if (axis == x) {
			let initial_vector = new Vector(0, vector.y, vector.z);
			let initial_length = initial_vector.length;
			let initial_angle = Math.acos(initial_vector.normalized.z);
			if (Math.asin(initial_vector.normalized.y) < 0)
				initial_angle += 2 * (Math.PI - initial_angle)
			return new Vector(vector.x, 
							  Math.sin(initial_angle + (angle * Math.PI / 180)) * initial_length, 
							  Math.cos(initial_angle + (angle * Math.PI / 180)) * initial_length);
		} else if (axis == y) {
			initial_vector = new Vector(vector.x, 0, vector.z);
			initial_length = initial_vector.length;
			initial_angle = Math.acos(initial_vector.normalized.x);
			if (Math.asin(initial_vector.normalized.z) < 0)
				initial_angle += 2 * (Math.PI - initial_angle)
			return new Vector(Math.cos(initial_angle + (angle * Math.PI / 180)) * initial_length, 
							  vector.y,
							  Math.sin(initial_angle + (angle * Math.PI / 180)) * initial_length);
		} else if (axis == z) {
			initial_vector = new Vector(vector.x, vector.y, 0);
			initial_length = initial_vector.length;
			initial_angle = Math.acos(initial_vector.normalized.x);
			if (Math.asin(initial_vector.normalized.y) < 0)
				initial_angle += 2 * (Math.PI - initial_angle)
			return new Vector(Math.cos(initial_angle + (angle * Math.PI / 180)) * initial_length, 
							  Math.sin(initial_angle + (angle * Math.PI / 180)) * initial_length,
							  vector.z);
		}
	}
	
	vertical = rotate(vertical, x, camera.rotation.x);
	vertical = rotate(vertical, y, camera.rotation.y);
	vertical = rotate(vertical, z, camera.rotation.z);
	horizontal = rotate(horizontal, x, camera.rotation.x);
	horizontal = rotate(horizontal, y, camera.rotation.y);
	horizontal = rotate(horizontal, z, camera.rotation.z);
	forward = rotate(forward, x, camera.rotation.x);
	forward = rotate(forward, y, camera.rotation.y);
	forward = rotate(forward, z, camera.rotation.z);

	for (let object = 0; object < objects.length; object++) {
		let polygons = [];
		for (let poly = 0; poly < objects[object].mesh.polygons.length; poly++) {
			polygons.push([]);
			for (let i = 0; i < 3; i++)
				polygons[poly].push(Object.assign({}, objects[object].mesh.polygons[poly][i]));
		}
		for (let poly = 0; poly < polygons.length; poly++) {
			let points = [];
			let inView = 0;
			for (let i = 0; i < 3; i++) {
				polygons[poly][i] = Vector.substract(polygons[poly][i], objects[object].center);
				polygons[poly][i] = rotate(polygons[poly][i], x, objects[object].rotation.x);
				polygons[poly][i] = rotate(polygons[poly][i], y, objects[object].rotation.y);
				polygons[poly][i] = rotate(polygons[poly][i], z, objects[object].rotation.z);

				let vertex = new Vector(polygons[poly][i].x * objects[object].scale.x + objects[object].position.x, 
										polygons[poly][i].y * objects[object].scale.y + objects[object].position.y, 
										polygons[poly][i].z * objects[object].scale.z + objects[object].position.z); // vertex pos in space
				let vertex2cam = new Vector(vertex.x - camera.position.x, vertex.y - camera.position.y, vertex.z - camera.position.z); // vertex pos in camera space
				let angle = Vector.angle(vertex2cam, forward); // angle btw camera's view vector and vector from camera to vertex pos
				let cam2plane = new Vector(forward.x * Math.cos(angle) * vertex2cam.length, 
										   forward.y * Math.cos(angle) * vertex2cam.length, 
										   forward.z * Math.cos(angle) * vertex2cam.length); // vector from camera to plane's origin
				let vertex2plane = new Vector(vertex2cam.x - cam2plane.x, 
											  vertex2cam.y - cam2plane.y,
											  vertex2cam.z - cam2plane.z); // vector from plane's origin to vertex
				let horizontal_angle = Vector.angle(horizontal, vertex2plane);
				let vertical_angle = Vector.angle(vertical, vertex2plane);
				let plane_angle = horizontal_angle;
				if (vertical_angle > Math.PI / 2)
					plane_angle += 2 * (Math.PI - plane_angle);
				let plane_vector = (new Vector(Math.cos(plane_angle), -Math.sin(plane_angle))).normalized;
				if (angle <= (camera.viewAngle * Math.PI / 180) / 2) 
					inView = 1;
				x = plane_vector.x * (angle / ((camera.viewAngle * Math.PI / 180) / 2)) * (screenSize / 2);
				y = plane_vector.y * (angle / ((camera.viewAngle * Math.PI / 180) / 2)) * (screenSize / 2);
				points.push(new Vector(x + canvas.width / 2, y + canvas.height / 2));
			}
			if (inView) {
				context.beginPath();
				context.moveTo(points[0].x, points[0].y);
				context.lineTo(points[1].x, points[1].y);
				context.lineTo(points[2].x, points[2].y);
				context.lineTo(points[0].x, points[0].y);
				context.stroke(); 
				context.closePath();
			}
		}
	}

}
function triangle(p1, p2, p3){
	function triangle_top() {
		context.strokeStyle = "#000000";
		let k1 = (p1.y - p2.y)/ (p1.x - p2.x);
		let k2 = (p2.y - p3.y ) / ( p2.x - p3.x);
		m1 = p1.y - k1* p1.x;
		m2 = p2.y - k2* p2.x ;
		for (let x = 0; x < getWindowSize().width; x++) {
			let y1 = x * k1+m1;
			let y2 = x*k2+m2;
			for ( let y = 0 ; y < getWindowSize().height; y ++){
				if ( k1 > 0 && k2 < 0){
					if (y < y1 && y < y2){
						if (y > p1.y && y > p3.y)
							context.point(x,y)
					}
				}
				else if (k1 >0 && k2 > 0){
					if (y < y1 && y > y2){
						if (y > p1.y && y > p3.y)
							context.point(x,y)
					}
				}
				else if (k1 <0 && k2 < 0){
					if (y > y1 && y < y2){
						if (y > p1.y && y > p3.y)
							context.point(x,y)
					}
				}
			}
		}
	}
	function triangle_bottom() {
		console.log("drawing bottom");
	}

	if ( p1.y == p3.y && p1.y < p2.y)
		triangle_top();
	else 
		triangle_bottom();
}

triangle((new Vector(100, 300)), new Vector(200, 500), new Vector(300, 300));
