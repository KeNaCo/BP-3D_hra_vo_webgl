function level1(mSceneManager) {
stoneMaterial = new THREE.MeshLambertMaterial(0xa2a3a4);

ball = new Ball();
ball.init(0.5, 0x55B663, 10);
ball.set_position(0,0.76,0);
ball.mesh.castShadow = true;
mSceneManager.register(ball, true, true, true);

block1 = new Entity();
block1.init("models/1_5x4.js", stoneMaterial, 0);
block1.set_position(0,0,-1.5);
block1.mesh.receiveShadow = true;
mSceneManager.register(block1, true, true, true);

block2 = new Entity();
block2.init("models/1_5x3.js", stoneMaterial, 0);
block2.set_position(-3.75,0,-2.75);
mSceneManager.register(block2, true, true, true);

block3 = new Entity();
block3.init("models/1_5x1_5.js", stoneMaterial, 0);
block3.set_position(-5.25,2,-2.75);
mSceneManager.register(block3);

block4 = new Entity();
block4.init("models/0_5x5.js", stoneMaterial, 0);
block4.set_position(-4.5,2,-3.5);
mSceneManager.register(block4);

block5 = new Entity;
block5.init("models/1_5x1_5.js", stoneMaterial, 0);
block5.set_position(-5.25,2,-9.25);
mSceneManager.register(block5);

ambient = new THREE.AmbientLight( 0x404040 );
mSceneManager.register_light(ambient);

spot = new THREE.SpotLight()
spot.shadowCameraNear = 1;
spot.shadowCameraFar = 10;
spot.shadowCameraVisible = true;
spot.castShadow = true;
spot.position.set(0,5,0);
spot.animate = function() { this.target = ball.mesh; };
mSceneManager.register_light(spot);
mSceneManager.animateE.push(spot);

spot1 = new THREE.SpotLight()
spot1.shadowCameraNear = 1;
spot1.shadowCameraFar = 10;
spot1.shadowCameraVisible = true;
spot1.castShadow = true;
spot1.position.set(-7,4,-3);
spot1.animate = function() { this.target = ball.mesh; };
mSceneManager.register_light(spot1);
mSceneManager.animateE.push(spot1);

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

Ball.prototype.update = function() {
/*	var MAXV = 6;
	var ACC = 1;
	
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
*/

if (Key.isDown(Key.A)) this.body.angularVelocity.z = 2;
else this.body.angularVelocity.z = 0;
if (Key.isDown(Key.D)) this.body.angularVelocity.z = -2;
if (Key.isDown(Key.W)) this.body.angularVelocity.x = -2;
else this.body.angularVelocity.x = 0;
if (Key.isDown(Key.S)) this.body.angularVelocity.x = 2;
this.body.angularVelocity.y = 0;
};

Ball.prototype.reset = function(x, y, z) {
//	this.body.angularVelocity.set(0,0,0);
	this.set_position(x, y, z);
	}



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
