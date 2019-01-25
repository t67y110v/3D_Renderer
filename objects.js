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
	static multiply(vector, factor) {
		return new Vector(vector.x * factor, vector.y * factor, vector.z * factor);
	}
	static normalize(vector) { 
		let scale = 1 / vector.length;
		return Vector.multiply(vector, scale);
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
	multiply(factor) {
		this.x *= factor;
		this.y *= factor;
		this.z *= factor;
	}

	get length() {
		return Vector.length(this);
	}
	get normalized() {
		return Vector.normalize(this);
	}
	get copy() {
		return new Vector(this.x, this.y, this.z);
	}
}

class Mesh {
	constructor(polygons, normals) {
		if (polygons && normals) {
			this.polygons = polygons;
			this.normals = normals;
		}
		else {
			this.polygons = [];
			this.normals = [];
		}
	}

	static loadObject(path) {
		let file = loadFile(path);
		let data = file.split("\n");

		let vertices = [];

		let mesh = [];
		let min = new Vector();
		let max = new Vector();
		for (let i = 0; i < data.length; i++) {
			while (/.+\s+$/.test(data[i]))
				data[i] = data[i].slice(0, -1);
			let line = data[i].split(/\s+/);
			if (line[0] == "v") {
				if (line.length != 4) {
					alert("Invalid .obj file: vertices loading failed");
					return undefined;
				}
				vertices.push(new Vector(Number(line[1]), Number(line[2]), Number(line[3])));
			}
			else if (line[0] == "f") {
				if (line.length == 4) {
					mesh.push([vertices[Number(line[1].split('/')[0]) - 1], 
							   vertices[Number(line[2].split('/')[0]) - 1], 
							   vertices[Number(line[3].split('/')[0]) - 1]]);
				} else if (line.length == 5) {
					mesh.push([vertices[Number(line[1].split('/')[0]) - 1], 
							   vertices[Number(line[2].split('/')[0]) - 1], 
							   vertices[Number(line[3].split('/')[0]) - 1]]);
					mesh.push([vertices[Number(line[2].split('/')[0]) - 1], 
							   vertices[Number(line[3].split('/')[0]) - 1], 
							   vertices[Number(line[4].split('/')[0]) - 1]]);
				} else {
					alert("Invalid .obj file: vertices loading failed");
					return undefined;
				}
			}
		}
		return new Mesh(mesh, []);
	}

	static get cube() {
		return Mesh.loadObject("obj/cube.obj");
	}
	static get cat() {
		return Mesh.loadObject("obj/cat.obj");
	}
}

class Object3D {
	constructor() {
		this.position = new Vector();
		this.rotation = new Vector();
		this.scale = new Vector(1, 1, 1);
		this._mesh = Mesh.cube;	
		this.center = new Vector();
		this.recalculateCenter()
		objects.push(this);
	}

	recalculateCenter() {
		let max = this._mesh.polygons[0][0].copy;
		let min = this._mesh.polygons[0][0].copy;
		for (let i = 0; i < this._mesh.polygons.length; i++) {
			for (let j = 0; j < this._mesh.polygons[i].length; j++) {
				if (this._mesh.polygons[i][j].x > max.x)
					max.x = this._mesh.polygons[i][j].x;
				if (this._mesh.polygons[i][j].y > max.y)
					max.y = this._mesh.polygons[i][j].y;
				if (this._mesh.polygons[i][j].z > max.z)
					max.z = this._mesh.polygons[i][j].z;

				if (this._mesh.polygons[i][j].x < min.x)
					min.x = this._mesh.polygons[i][j].x;
				if (this._mesh.polygons[i][j].y < min.y)
					min.y = this._mesh.polygons[i][j].y;
				if (this._mesh.polygons[i][j].z < min.z)
					min.z = this._mesh.polygons[i][j].z;
			}
		}
		this.center = new Vector((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2);
	}
	
	set mesh(value) {
		this._mesh = value;
		this.recalculateCenter();
	}
	get mesh() {
		return this._mesh;
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
