var global_geometry = undefined;
var global_material = undefined;
var global_json = undefined;

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
		this.camera.position.z = 5;
		this.camera.position.y = 3;		
		//set the look on ball
		this.camera.lookAt(new THREE.Vector3(0,0,0));
	
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
			entitie.update();
			
			if (i == 0) {
//				camTarget = entitie.mesh.position;
				//rotation on target
//				this.camera.lookAt( camTarget );
				//simple movement of camera with object
				this.camera.position.x = entitie.mesh.position.x;
				this.camera.position.y = entitie.mesh.position.y +3;
				this.camera.position.z = entitie.mesh.position.z +3;
			}
			
			if ( entitie.mesh.position.y < -10 ) { entitie.reset(0,1,0); }
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
		

		
		//light
		var light = new THREE.PointLight(0xF8D898);
		// set its position
		light.position.x = 2;
		light.position.y = 4;
		light.position.z = 6;
		// add to the scene
		this.scene.add(light);
	},
	
	//metoda registruje Entitu do SceneManageru, ktorý ju vloží do scény a sveta
	register: function(entity, bScene=true, bWorld=true, bMovable=true) {
		console.log("Register entity scene:", bScene, " world:", bWorld, " movable:", bMovable);
		if ( bScene ) this.scene.add(entity.mesh);
		if ( bWorld ) this.world.add(entity.body);
		if ( bMovable ) this.movableEntities.push(entity);
	},
};

function Entity() {};

Entity.prototype = {
	//graphics
	geometry : undefined,
	material : undefined,
	mesh : undefined,
	//physics
	shape : undefined,
	body : undefined,
	
	init : function(url, material, mass) {
	//TODO odstrániť if
		if ( url ) this.load(url);
		if ( material ) this.material = material;
		this.mesh 		= new THREE.Mesh(this.geometry, this.material);
		
		this.body = new CANNON.RigidBody(mass, this.shape);
		this.body.mesh = this.mesh; //save reference to 3D
	},
	
	load_physics: function() {
		var json = global_json;
		
		function isBitSet( value, position ) {
			return value & ( 1 << position );
		}
	
		var scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

		//uv
	
		var j, offset = 0, vertices = [], faces = [],
		type,
		isQuad,
		hasMaterial,
		hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor;
	
		while ( offset < json.vertices.length ) {
			vertex = new CANNON.Vec3();
			vertex.x = json.vertices[ offset ++ ] * scale ;
			vertex.y = json.vertices[ offset ++ ] * scale ; //*2;
			vertex.z = json.vertices[ offset ++ ] * scale ;
		
			
			vertices.push(vertex);
		}
	
		offset = 0;
	
		while ( offset < json.faces.length ) {
			type = json.faces[ offset ++ ];

			isQuad              = isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	    = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );
		
//			console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);
		
			if ( isQuad ) {
				var v = json.faces[offset ++];
				var v1 = json.faces[offset ++];
				var v2 = json.faces[offset ++];
				var v3 = json.faces[offset ++];
			
//				console.log("Face1: ", v, v1, v3);
//				console.log("Face2: ", v1, v2, v3);
			
				faces.push([v, v1, v3]);
				faces.push([v1, v2, v3]);
			
				if ( hasMaterial ) { offset ++ }
				
				//fi = geometry.faces.length;
			
				if ( hasFaceVertexUv ) {
					for ( j=0; j < 4; j++ ) offset ++;
				}
			
				if ( hasFaceNormal ) { offset ++ }
			
				if ( hasFaceVertexNormal ) {
					for ( j=0; j < 4; j++ ) offset ++;
				}
			
				if ( hasFaceColor ) { offset ++ }
			
				if ( hasFaceVertexColor ) {
					for ( j=0; j < 4; j++ ) offset ++;
				}
			
			} else {
				var v = json.faces[offset ++];
				var v1 = json.faces[offset ++];
				var v2 = json.faces[offset ++];
			
				faces.push([v1, v2, v3]);
			
//				console.log("Face: ", v, v1, v2);
			
				if ( hasMaterial ) { offset ++ }
				//fi = geometry.faces.length;
				if ( hasFaceVertexUv ) {
					for ( j=0; j < 3; j++ ) offset ++;
				}
				if ( hasFaceNormal ) { offset ++ }
				if ( hasFaceVertexNormal ) {
					for ( j=0; j < 3; j++ ) offset ++;
				}
				if ( hasFaceColor ) { offset ++ }
				if ( hasFaceVertexColor ) {
					for ( j=0; j < 3; j++ ) offset ++;
				}
			}
		}
	
		this.shape = new CANNON.ConvexPolyhedron(vertices, faces);
	},
	
	load: function( url ) {
		var loader = new JSONLoader()
		loader.load( url, function(geometry, material) {
				global_geometry = geometry;
				global_material = material;
			});
		this.geometry = global_geometry;
		this.material = global_material;
//		console.log("Geometria v load(): ", this.geometry);
		
		this.load_physics();
	},
	
	add : function( scene, world ) {
		if ( this.mesh != undefined )
			scene.add(this.mesh);
		if ( this.body != undefined )
			world.add(this.body);
	},
	
	update : function() {}, //function for moving objects
	
	animate: function() {}, //function for animated objects
	
	set_position: function(x, y, z) {
		if (this.mesh != undefined && this.body != undefined) {
			this.mesh.position.set(x, y, z);
			this.body.position.set(x, y, z);
		}
	},
	
	reset : function() {},
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
	context.onLoadComplete();this.body.position.set(x, y, z);
};*/
