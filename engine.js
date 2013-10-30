var global_geometry = undefined;

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) break;
	}
};

function sleep2(milliseconds) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + milliseconds);
};

function Engine() {};

Engine.prototype = {
	mSceneManager : undefined,
	mRenderer : undefined,
	camera : undefined,
	
	init : function() {
		this.mSceneManager = new SceneManager();;
		this.mSceneManager.init();
	
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
		this.camera.position.z = 8;
		this.camera.position.y = 2;
	
		this.mRenderer = new THREE.WebGLRenderer(); 
		this.mRenderer.setSize(window.innerWidth, window.innerHeight); 
		document.body.appendChild(this.mRenderer.domElement);
	},
	
	run : function () {
		//Rendering WebGL scene
		this.mRenderer.render(this.mSceneManager.scene, this.camera);

		//Game logic
		//Delta time
		var delta, time_last_run;
		var now = new Date().getTime();
		if ( time_last_run ) {
			delta = ( now - time_last_run ) / 1000;
		} else {
			delta = 1 / 60;
		}
		time_last_run = now; 
    	
    	this.mSceneManager.world.step( delta * 2 ); // double the speed of the simulation
    	for (var i=0; i < this.mSceneManager.movableEntities.length; i++) {
			var entitie = this.mSceneManager.movableEntities[i];
			entitie.body.position.copy(entitie.body.mesh.position);
			entitie.body.quaternion.copy(entitie.body.mesh.quaternion);
			entitie.move();
		}
	},
};


/*
	Scenemanager cares about creation graphic scene and physics world, then load entities and care about lists of static entities and moving entities
*/
function SceneManager() {}; //constructor

SceneManager.prototype = {
	scene : undefined,
	world : undefined,
	entities : undefined,
	movableEntities: undefined,
	cube : undefined,
	ball : undefined,
	
	init: function()  {
		this.scene = new THREE.Scene();
		this.entities = new Array(),
		this.movableEntities = new Array(),
		
		//init physics
		this.world = new CANNON.World();
		this.world.gravity.set(0, -10, 0);
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.world.solver.iterations = 10; // Use 10 iterations each time the simulation is run
		
		//creation of plane floor
		var floor = new Floor();
		floor.init(10,10, 0x863bb2, 0);
		this.entities.push(floor);
		floor.add(this.scene, this.world);
	
		//ball
		var ball = new Ball();
		ball.init(0.5, 0x55B663, 10);
		ball.set_position(0, 3, 0);
		ball.add(this.scene, this.world);
		this.entities.push(ball);
		this.movableEntities.push(ball);
			
		//static cube
		var cube = new Cube();
		cube.init(1, 1, 1, 0x55B665, 0);
		cube.set_position(2,0.5,1);
		cube.add(this.scene, this.world);
		this.entities.push(cube);
		
		var cube3 = new Cube();
		cube3.init(0.5, 0.5, 0.5, 0xAB12CD, 1);
		cube3.set_position(-1,1,3);
		cube3.add(this.scene, this.world);
		this.entities.push(cube3);
		this.movableEntities.push(cube3);
	
		var sikma = new Rampa();
		sikma.load("sikmina.js");
		sikma.init(0xAB1212, 0);
		sikma.mesh.position.set(0,1,0);
		sikma.mesh.rotation.y = -Math.PI/2;
		sikma.add(this.scene, this.world);
		this.entities.push(sikma);
		
	
		
		//light
		var light = new THREE.PointLight(0xF8D898);
		// set its position
		light.position.x = 0;
		light.position.y = 5;
		light.position.z = 0;
		// add to the scene
		this.scene.add(light);
	},
};

function Entity(file) {
/*	if (file == undefined) return;
		
	var loader = new THREE.JSONLoader();
	loader.load(file, function(geometry) {	
			global_geometry = geometry;
		});
				
	document.body.appendChild(loader.addStatusElement());
	
	while(global_geometry == undefined) { 
		//sleep2(1000);
	}
	
	this.geometry = global_geometry;*/
};

Entity.prototype = {
	//graphics
	geometry : undefined,
	material : undefined,
	mesh : undefined,
	//physics
	shape : undefined,
	body : undefined,
	
	init : function() {},
	
	load: function( url ) {
		var loader = new JSONLoader()
		loader.load( url, function(geometry, material) {
				global_geometry = geometry;
			});
		this.geometry = global_geometry;
//		console.log("Geometria v load(): ", this.geometry);
	},
	
	add : function( scene, world ) {
		if ( this.mesh != undefined )
			scene.add(this.mesh);
		if ( this.body != undefined )
			world.add(this.body);
	},
	
	move : function() {}, //function for moving objects
	
	animate: function() {}, //function for animated objects
	
	set_position: function(x, y, z) {
		if (this.mesh != undefined && this.body != undefined) {
			this.mesh.position.set(x, y, z);
			this.body.position.set(x, y, z);
		}
	},
};

/*
	Class inherited from THREE.JSONLoader, difference is in synchronicity of this class
*//*
function JSONLoader( showStatus ) {
	THREE.JSONLoader.call(this, showStatus);
};

JSONLoader.prototype = Object.create(THREE.JSONLoader.prototype);

JSONLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress ) {
	//TODO presunúť import jQuery sem..
	var data = $.ajax({ url: url, async: false, dataType: 'json' }).responseText;
	if (data) {
		var json = JSON.parse(data);
		var result = context.parse( json, texturePath );
		callback( result.geometry, result.materials );
	} else {
		console.warn( "THREE.JSONLoader: [" + url + "] seems to be unreachable or file there is 	empty" );
	}
	context.onLoadComplete();
};*/
