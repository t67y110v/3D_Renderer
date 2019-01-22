class Vector {
	constructor(x, y, z) {
		if (x)
			this.x = x;
		else
			this.x = 0;
		if (y)
			this.y = y;
		else
			this.y = 0;
		if (z)
			this.z = z;
		else
			this.z = 0;
	}

	move(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}

	static distance(pos1, pos2) {
		return Math.sqrt(Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y), 2) + Math.pow((pos2.z - pos1.z), 2));
	}
	static length(vector) {
		return Vector.distance(new Vector(), vector);
	}
	static angle(vector1, vector2) {
		return Math.acos(Math.min(Math.max((vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z) / (Vector.length(vector1) * Vector.length(vector2)), -1), 1));
	}
	static normalize(vector) { 
		let scale = 1 / vector.length;
		return new Vector(vector.x * scale, vector.y * scale, vector.z * scale);
	}
	static add(vector1, vector2) {
		return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
	}
	static substract(vector1, vector2) {
		return new Vector(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
	}

	distance(pos2) {
		return Vector.distance(this, pos2);
	}
	angle(vector2) {
		return Vector.angle(this, vector2);
	}
	cross(vector2) {
		return Vector.cross(this, vector2);
	}

	get length() {
		return Vector.length(this);
	}
	get normalized() {
		return Vector.normalize(this);
	}
}

class Mesh {
	static get cube() {
		return [
			// bottom
			[
				new Vector(-0.5, -0.5, -0.5),
				new Vector(-0.5, -0.5, 0.5),
				new Vector(0.5, -0.5, -0.5)
			],
			[
				new Vector(0.5, -0.5, 0.5),
				new Vector(-0.5, -0.5, 0.5),
				new Vector(0.5, -0.5, -0.5)
			],
			// top
			[
				new Vector(0.5, 0.5, 0.5),
				new Vector(-0.5, 0.5, 0.5),
				new Vector(0.5, 0.5, -0.5)
			],
			[
				new Vector(0.5, 0.5, 0.5),
				new Vector(-0.5, 0.5, 0.5),
				new Vector(0.5, 0.5, -0.5)
			],
			// left
			[
				new Vector(-0.5, -0.5, -0.5),
				new Vector(-0.5, -0.5, 0.5),
				new Vector(-0.5, 0.5, -0.5)
			],
			[
				new Vector(-0.5, 0.5, 0.5),
				new Vector(-0.5, -0.5, 0.5),
				new Vector(-0.5, 0.5, -0.5)
			],
			// right
			[
				new Vector(0.5, -0.5, -0.5),
				new Vector(0.5, -0.5, 0.5),
				new Vector(0.5, 0.5, -0.5)
			],
			[
				new Vector(0.5, 0.5, 0.5),
				new Vector(0.5, -0.5, 0.5),
				new Vector(0.5, 0.5, -0.5)
			],
			// back
			[
				new Vector(-0.5, -0.5, -0.5),
				new Vector(0.5, -0.5, -0.5),
				new Vector(-0.5, 0.5, -0.5)
			],
			[
				new Vector(0.5, 0.5, -0.5),
				new Vector(0.5, -0.5, -0.5),
				new Vector(-0.5, 0.5, -0.5)
			],
			// forward
			[
				new Vector(-0.5, -0.5, 0.5),
				new Vector(0.5, -0.5, 0.5),
				new Vector(-0.5, 0.5, 0.5)
			],
			[
				new Vector(0.5, 0.5, 0.5),
				new Vector(0.5, -0.5, 0.5),
				new Vector(-0.5, 0.5, 0.5)
			]
		];
	}
}

class Object3D {
	constructor() {
		this.position = new Vector();
		this.rotation = new Vector();
		this.scale = new Vector(1, 1, 1);
		this.mesh = Mesh.cube;	
		objects.push(this);
	}
}

class Camera {
	constructor() {
		this.position = new Vector(0, 0, -10);
		this.rotation = new Vector(0, 0, 0);
		this.viewAngle = 90;
	}

	look(vector) {
		let y = Math.acos(vector.z / (new Vector(vector.x, 0, vector.z)).length);
		if (Math.acos(vector.x / (new Vector(vector.x, 0, vector.z)).length) < Math.PI / 2)
			y += 2 * (Math.PI - y);
		this.rotation = new Vector(vector.y / vector.length / Math.PI * 180, y / Math.PI * 180);
	}
}

class Properties {
	constructor() {
		this.framerate = 60;
	}
}

var properties = new Properties();
