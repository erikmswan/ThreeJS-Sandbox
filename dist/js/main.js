


var world = document.getElementById('world');


// To make an apple pie from scratch, you must first invent the scene, camera, and renderer
// you also need to invent one or more objects and lights, respectively
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

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
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true,

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true
	});

  // FILL THAT SCREEN!
	renderer.setSize(WIDTH, HEIGHT);

	// SHADOWS? WHY NOT
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the
	// container we created in the HTML
	world.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);

}

function handleWindowResize() {
	// update HEIGHT and WIDTH of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}


// ILLUMINATE THE UNIVERSE!! ---------------------------------------- */
var hemisphereLight, shadowLight, ambientLight;

function createLights() {
	// A hemisphere light is a gradient colored light;
	// the first parameter is the sky color, the second parameter is the ground color,
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9);

	// A directional light shines from a specific direction.
	// It acts like the sun, that means that all the rays produced are parallel.
	shadowLight = new THREE.DirectionalLight(0xffffff, 1.5);

	// Set the direction of the light
	shadowLight.position.set(150, 450, 350);

	// Allow shadow casting
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better,
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}



// INVENT THE OBJECTS!! ------------------------------ */


/* THE MONOLITH */

var Monolith, monolith;

Monolith = function() {

	var geom = new THREE.BoxGeometry(30,80,5);

	var mat = new THREE.MeshStandardMaterial({
		color:0x242424,
	});

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
};

function createMonolith() {
  monolith = new Monolith();
  monolith.mesh.position.y = 100;
  scene.add(monolith.mesh);
}


/* STAR FIELD */

var stars = [];

function createStarfield() {

	// we're gonna move from z position -1000 (far away)
	// to 1000 (where the camera is) and add a random particle at every pos.
	for ( var zpos= -1000; zpos < 5000; zpos+=10 ) {

		var geometry = new THREE.SphereGeometry( 0.1, 30, 17 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var star = new THREE.Mesh(geometry, material);

		// give it a random x and y position between -500 and 500
		star.position.x = Math.random() * 2000 - 500;
		star.position.y = Math.random() * 2000 - 500;

		// set its z position
		star.position.z = zpos;

		// scale it up a bit
		star.scale.x = star.scale.y = 10;

		// add it to the scene
		scene.add( star );

		// and to the array of stars.
		stars.push(star);
	}
}



/* FRAME UPDATES!! ---------------------------------------------------- */


function updateStars() {
	// iterate through every particle
	for(var i=0; i<stars.length; i++) {

		star = stars[i];

		// and move it forward dependent on the mouseY position.
		star.position.z += 5;

		// if the star is too close move it to the back
		if(star.position.z>1000) star.position.z-=5000;

	}
}


// INTERACTIVITY!! --------------------------------------------------- */

var mousePos={x:0, y:0};


function handleMouseMove(event) {

	// here we are converting the mouse position value received
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:

	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula
	// because the 2D y-axis goes the opposite direction of the 3D y-axis

	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

	camera.position.x = event.clientX - WIDTH / 2;
	camera.position.y = event.clientY - HEIGHT / 2;
}



// ROUND AND ROUND --------------------------------------------------- */
function loop(){
	// Rotate the propeller, the sea and the sky
	monolith.mesh.rotation.y += 0.01;
  monolith.mesh.rotation.x += 0.01;

  // update the plane on each frame
	updateStars();

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

  //add the listener
	document.addEventListener('mousemove', handleMouseMove, false);

  renderer.render(scene, camera);

	// start a loop that will update the objects' positions
	// and render the scene on each frame
	loop();
}
