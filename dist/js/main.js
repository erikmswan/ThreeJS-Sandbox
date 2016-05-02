


var world = document.getElementById('world');


// To make an apple pie from scratch, you must first invent the scene, camera, and renderer
// you also need to invent one or more objects and lights, respectively

var Colors = {
	black: 0x000000,
	gray: 0x242424,
	medGray: 0x2c2c2c,
	lightGray: 0x87888d,
	darkRed: 0x3d0101,
	brightRed:0xe60000,
	brightYellow: 0xffe1a5
}

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer;


// MAKE A SCENE!! ---------------------------------------- */
function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // MAKE IT!
  scene = new THREE.Scene();

  // MAKE IT FOGGY AS HELL
  // scene.fog = new THREE.Fog(0x000000, 100, 1950);

  // WE NEED A CAMERA BOZO
  aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);

  // MAKE CAMERA LOOKY LOOK
  camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

  // RENDER THAT SHIT!
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

  // FILL THAT SCREEN!
	renderer.setSize(WIDTH, HEIGHT);

	// SHADOWS? WHY NOT
	renderer.shadowMap.enabled = true;

	// DOM IT UP
	world.appendChild(renderer.domElement);

	// DUMB USER RESIZE SCREEN ON WHIM AND PRAYER
	window.addEventListener('resize', handleWindowResize, false);

}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}


// ILLUMINATE THE UNIVERSE!! ---------------------------------------- */
var hemisphereLight, directionalLight, ambientLight;

function createLights() {
	// LIGHT OF HEMISPHERE
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9);

	// SUNS RAYS
	directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);

	// Set the direction of the light
	directionalLight.position.set(150, 450, 350);

	// // Allow shadow casting
	// directionalLight.castShadow = true;
	//
	// // define the visible area of the projected shadow
	// directionalLight.shadow.camera.left = -400;
	// directionalLight.shadow.camera.right = 400;
	// directionalLight.shadow.camera.top = 400;
	// directionalLight.shadow.camera.bottom = -400;
	// directionalLight.shadow.camera.near = 1;
	// directionalLight.shadow.camera.far = 1000;
	//
	// // define the resolution of the shadow; the higher the better,
	// // but also the more expensive and less performant
	// directionalLight.shadow.mapSize.width = 2048;
	// directionalLight.shadow.mapSize.height = 2048;

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);
	scene.add(directionalLight);
}



// INVENT THE OBJECTS!! ------------------------------ */


/* STAR FIELD */

var stars = [];

function createStarfield() {

	for ( var zpos= -1000; zpos < 5000; zpos+=10 ) {

		var geometry = new THREE.SphereGeometry( 0.1, 30, 17 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var star = new THREE.Mesh(geometry, material);

		// give it a random x and y position
		star.position.x = Math.random() * 2000 - 500;
		star.position.y = Math.random() * 2000 - 500;

		// set its z position
		star.position.z = zpos;

		// scale it up a bit
		star.scale.x = star.scale.y = 10;

		// add it to the scene
		scene.add(star);

		// and to the array of stars.
		stars.push(star);
	}
}


/* THE MONOLITH */

var Monolith, monolith;

Monolith = function() {

	var geom = new THREE.BoxGeometry( 30, 80, 5 );

	var mat = new THREE.MeshStandardMaterial({
		color:Colors.gray,
	});

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
};

function createMonolith() {
  monolith = new Monolith();
  monolith.mesh.position.y = 100;
	monolith.mesh.position.z = -5000;
  scene.add(monolith.mesh);
}


/* HAL-9000 */

var Hal, hal;

Hal = function() {
	this.mesh = new THREE.Object3D();
	var that = this;

	// Create Hal's base
	var geomBase = new THREE.BoxGeometry(20,40,3,1,1,1);
	var matBase = new THREE.MeshPhongMaterial({color:Colors.medGray, shading:THREE.FlatShading});
	var base = new THREE.Mesh(geomBase, matBase);
	this.mesh.add(base);

	// Create Hal's eyeliner
	var geomEyeLiner = new THREE.RingGeometry(7,8,30);
	var matEyeLiner = new THREE.MeshPhongMaterial({color:Colors.lightGray, shading:THREE.FlatShading});
	var eyeLiner = new THREE.Mesh(geomEyeLiner, matEyeLiner);
	eyeLiner.position.z = 3;
	this.mesh.add(eyeLiner);

	// Create actual eye
	var geomEye = new THREE.CircleGeometry(7,40);
	var eyeTexture = new THREE.TextureLoader().load("textures/hal-eye.png");
	var matEye = new THREE.MeshPhongMaterial({map: eyeTexture, shading:THREE.FlatShading});
	var eye = new THREE.Mesh(geomEye, matEye);
	eye.position.z = 3;
	this.mesh.add(eye);

	// Create the text
	var fontLoader = new THREE.FontLoader();
	// load the custom font
	fontLoader.load('fonts/droid/droid_sans_regular.typeface.js', function(font) {
		var geomText = new THREE.TextGeometry("I can't do that, Dave.", {
			font:font,
			size: 5,
			height:1
		});
		var matText = new THREE.MeshPhongMaterial({color:0xffffff, shading:THREE.FlatShading});
		var text = new THREE.Mesh(geomText, matText);
		text.position.set(-30, -30, 1);
		text.material.transparent = true;
		text.material.opacity = 0;
		that.mesh.add(text);
	});

	// tailPlane.position.set(-35,25,0);
	// this.mesh.add(tailPlane);
};

function createHal() {
	hal = new Hal();
	hal.mesh.position.x = 50;
	hal.mesh.position.y = 100;
	scene.add(hal.mesh);
}


/* FRAME UPDATES!! ---------------------------------------------------- */

function updateMonolith() {
	monolith.mesh.rotation.y += 0.01;
  monolith.mesh.rotation.x += 0.01;
	if (monolith.mesh.position.z <= 99 ) {
		monolith.mesh.position.z += 5;
	}
}

function updateStars() {

	// iterate through every star
	for(var i=0; i<stars.length; i++) {

		star = stars[i];

		star.position.z += 5;

		// if the star is too close move it to the back
		if(star.position.z>1000) star.position.z-=5000;

	}
}


var mousePos={x:0, y:0};
// now handle the mousemove event

function updateHal(){

	var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	var targetY = normalize(mousePos.y, -1, 1, 25, 175);

	hal.mesh.position.y = targetY;
	hal.mesh.position.x = targetX;
	hal.mesh.rotation.y += 0.05;
}

function normalize(v,vmin,vmax,tmin, tmax){

	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}


var toggle = false;
var timer = 0;
var interval;
function updateText() {

	// check that the text exists
	if(hal.mesh.children[3] !== undefined) {

		// reset text metrics
		hal.mesh.children[3].position.y = -40;
		hal.mesh.children[3].material.opacity = 0;
		toggle = false;
		timer = 0;
		clearInterval(interval);

		interval = setInterval(function(){

			// appear & translate upwards
			if (hal.mesh.children[3].material.opacity < 1 && !toggle) {
				hal.mesh.children[3].material.opacity += 0.04;
				hal.mesh.children[3].position.y += 0.4;

			// pause a bit once the text is in
			} else if (hal.mesh.children[3].material.opacity >= 1 && timer < 40 && !toggle) {
				timer++;
			} else if (hal.mesh.children[3].material.opacity >= 1 && !toggle) {
				toggle = true;

			// fade-out and translate upwards
			} else if (hal.mesh.children[3].material.opacity > 0 && toggle) {
				hal.mesh.children[3].material.opacity -= 0.04;
				hal.mesh.children[3].position.y += 0.4;
			}
		}, 1000/60);
	}
}


// INTERACTIVITY!! --------------------------------------------------- */

function handleCameraMove(event) {
	camera.position.x = event.clientX - WIDTH / 2;
	camera.position.y = (event.clientY - HEIGHT / 2) * -1;
}


function handleHalMove(event) {

	// here we are converting the mouse position value received
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:

	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula
	// because the 2D y-axis goes the opposite direction of the 3D y-axis

	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}



// ROUND AND ROUND --------------------------------------------------- */

function loop(){
	// Rotate the propeller, the sea and the sky
	updateMonolith();

  // update the plane on each frame
	updateStars();

	updateHal();

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}


// INVENT THE UNIVERSE!! ------------------------------ */



window.addEventListener('load', init, false);

function init(event) {
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// add the objects
  createMonolith();
	createStarfield();
	createHal();

  //add the listener
	// document.addEventListener('mousemove', handleCameraMove, false);
	document.addEventListener('mousemove', handleHalMove, false);
	document.addEventListener('click', updateText, false);

  renderer.render(scene, camera);

	// start a loop that will update the objects' positions
	// and render the scene on each frame
	loop();
}
