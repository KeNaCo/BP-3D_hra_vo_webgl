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
	this.geometry 	= new THREE.SphereGeometry(r, 16, 16);
	this.material 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	this.shape 		= new CANNON.Sphere(r); //radius is 0.5
	this.body 		= new CANNON.RigidBody(mass, this.shape); //mass of 5
	this.body.mesh = this.mesh; //save reference to 3D mesh
/*	
	this.velocityX = 0;
	this.velocityXMax = 15;
	this.velocityZ = 0;
	this.velocityZMax = 15;
*/
};

Ball.prototype.move = function() {
/*	function get_acceleration(value, maxValue, raise = false) {
		var ret, neg=false;
		if (value < 0) {
			value = -value;
			neg = true;
		}
		
		if (raise) ret = (value == maxValue) ? maxValue : ++value;
		else ret = (value == 0) ? 0 : --value;

		if (neg) return -ret;
		else return ret;
	}*/
	MAXV = 6;
	ACC = 0.7;
	
	if (Key.isDown(Key.A))
		this.body.angularVelocity.z = (this.body.angularVelocity.z == MAXV) ? MAXV : this.body.angularVelocity.z + ACC;
	else if (this.body.angularVelocity.z >= 0 )
		this.body.angularVelocity.z = (this.body.angularVelocity.z == 0) ? 0 : this.body.angularVelocity.z - ACC;
	
	if (Key.isDown(Key.D))
		this.body.angularVelocity.z = (this.body.angularVelocity.z == -MAXV) ? -MAXV : this.body.angularVelocity.z - ACC;
	else if (this.body.angularVelocity.z < 0 )
		this.body.angularVelocity.z = (this.body.angularVelocity.z == 0) ? 0 : this.body.angularVelocity.z + ACC;

	if (Key.isDown(Key.W))
		this.body.angularVelocity.x = (this.body.angularVelocity.x == -MAXV) ? -MAXV : this.body.angularVelocity.x - ACC;
	else if (this.body.angularVelocity.x <= 0 )
		this.body.angularVelocity.x = (this.body.angularVelocity.x == 0) ? 0 : this.body.angularVelocity.x + ACC;
	
	if (Key.isDown(Key.S))
		this.body.angularVelocity.x = (this.body.angularVelocity.x == MAXV) ? MAXV : this.body.angularVelocity.x + ACC;
	else if (this.body.angularVelocity.x > 0 )
		this.body.angularVelocity.x = (this.body.angularVelocity.x == 0) ? 0 : this.body.angularVelocity.x - ACC;

	this.body.angularVelocity.y = 0; //stop the y axis rotation
	
	if ((this.body.angularVelocity.z < 0.25) && 	(this.body.angularVelocity.z > -0.25)) this.body.angularVelocity.z = 0;
	if ((this.body.angularVelocity.x < 0.25) && 	(this.body.angularVelocity.x > -0.25)) this.body.angularVelocity.x = 0;
//	console.log("Velocity: [", this.body.angularVelocity.x, ",", this.body.angularVelocity.z, "]");
};

Ball.prototype.fall = function() {
//	this.body.angularVelocity.set(0,0,0);
	this.set_position(0, 3, 0);
	}

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



function Rampa() { /*Entity.call(this, "sikmina.js"); */ };
Rampa.prototype = Object.create(Entity.prototype);

Rampa.prototype.init = function(color, mass) {
	this.material 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	
	this.body = new CANNON.RigidBody(mass, this.shape);
	this.body.mesh = this.mesh; //save reference to 3D
};

function Chodnik() {};
Chodnik.prototype = Object.create(Entity.prototype);

Chodnik.prototype.init = function(mass) {
	this.material 	= new THREE.MeshLambertMaterial({color: 0x55B665});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	
	this.body = new CANNON.RigidBody(mass, this.shape);
	this.body.mesh = this.mesh; //save reference to 3D
}

function Zliab() {};
Zliab.prototype = Object.create(Entity.prototype);

Zliab.prototype.init = function(color, mass) {
	this.material 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	
	this.body = new CANNON.RigidBody(mass, this.shape);
	this.body.mesh = this.mesh; //save reference to 3D
}

function Ball2() {};
Ball2.prototype = Object.create(Entity.prototype);

Ball2.prototype.init = function(color, mass) {
	this.material 	= new THREE.MeshLambertMaterial({color: color});
	this.mesh 		= new THREE.Mesh(this.geometry, this.material);
	
	this.body = new CANNON.RigidBody(mass, this.shape);
	this.body.mesh = this.mesh; //save reference to 3D
}

Ball2.prototype.move = function() {
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


/*
	Class inherited from THREE.JSONLoader, difference is in synchronicity of this class
*/
function JSONLoader( showStatus ) {
	THREE.JSONLoader.call(this, showStatus);
};

JSONLoader.prototype = Object.create(THREE.JSONLoader.prototype);

JSONLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress ) {
	//TODO presunúť import jQuery sem..
	var data = $.ajax({ url: url, async: false, dataType: 'json' }).responseText;
	if (data) {
		var json = global_json = JSON.parse(data);
		var result = context.parse( json, texturePath );
		callback( result.geometry, result.materials );
	} else {
		console.warn( "THREE.JSONLoader: [" + url + "] seems to be unreachable or file there is 	empty" );
	}
	context.onLoadComplete();
};
