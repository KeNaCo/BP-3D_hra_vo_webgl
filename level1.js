function Floor() {};
Floor.prototype = Object.create(Entity.prototype);

Floor.prototype.init = function(x, y, color, mass) {
	this.geometry 	= new THREE.PlaneGeometry(x, y);
	this.material 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	this.shape 		= new CANNON.Box(new CANNON.Vec3(x/2,0.01,y/2)); // 5 is half of plane geometry
	this.body 		= new CANNON.RigidBody(mass, this.shape); // mass of "0" indicates static object
	this.body.mesh = this.mesh; //save reference to 3D mesh
	
	this.mesh.rotation.x = -Math.PI/2;
//	this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
};

function Ball() {};
Ball.prototype = Object.create(Entity.prototype);

Ball.prototype.init = function(r, color, mass) {
	this.geometry 	= new THREE.SphereGeometry(r, 6, 6);
	this.material 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	this.shape 		= new CANNON.Sphere(r); //radius is 0.5
	this.body 		= new CANNON.RigidBody(mass, this.shape); //mass of 5
	this.body.mesh = this.mesh; //save reference to 3D mesh
};

Ball.prototype.move = function() {
	if (Key.isDown(Key.A))
		this.body.angularVelocity.z = 2;
	else
		this.body.angularVelocity.z = 0;

	if (Key.isDown(Key.D))
		this.body.angularVelocity.z = -2;

	if (Key.isDown(Key.W))
		this.body.angularVelocity.x = -2;
	else
		this.body.angularVelocity.x = 0;

	if (Key.isDown(Key.S))
		this.body.angularVelocity.x = 2;
	this.body.angularVelocity.y = 0; //stop the y axis rotation
};

function Cube() {};
Cube.prototype = Object.create(Entity.prototype);

Cube.prototype.init = function(x, y, z, color, mass) {
	this.geometry 	= new THREE.CubeGeometry(x,y,z);
	this.materal 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	this.shape 		= new CANNON.Box(new CANNON.Vec3(x/2,y/2,z/2));
	this.body 		= new CANNON.RigidBody(mass, this.shape);
	this.body.mesh = this.mesh; //save reference to 3D
};