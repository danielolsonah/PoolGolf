import store from './store/storeIndex.js';
import { impulse } from './actions/actionIndex.js';
import { xtransform } from './actions/actionIndex.js';
import { ytransform } from './actions/actionIndex.js';
import { xpush } from './actions/actionIndex.js';
import { ypush } from './actions/actionIndex.js';
import { slowDown } from './actions/actionIndex.js'


//Grab reference to root DOM node
const canvas = document.getElementById('app');
//Create engine to run on our DOM node
const engine = new BABYLON.Engine(canvas);
//Create view for engine to render
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
//Create point of view with respect to center of scene
const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -10), scene);
//Create light, pointed at origin from position set by vector
const light = new BABYLON.PointLight('light', new BABYLON.Vector3(5, 0, -4), scene);
//Save reference to inital state
const initialState = store.getState();
//Create sphere, centered at origin
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);
const sphereMaterial = new BABYLON.StandardMaterial('material', scene);
//sphereMaterial.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);
sphereMaterial.ambientTexture = new BABYLON.Texture('Tom.jpg', scene);
sphere.material = sphereMaterial;
sphere.position.x = initialState.targetBall.position.x;
sphere.position.y = initialState.targetBall.position.y;
sphere.position.z = initialState.targetBall.position.z;
//Create cue ball
const cue = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);
cue.position.x = initialState.cue.position.x;
cue.position.y = initialState.cue.position.y;
cue.position.z = initialState.cue.position.z;
//Create floor
const plane = BABYLON.MeshBuilder.CreatePlane('plane', {height: 10, width: 10}, scene);
const planeMaterial = new BABYLON.StandardMaterial('material', scene);
//planeMaterial.ambientTexture = new BABYLON.Texture('grass.jpg', scene);
planeMaterial.diffuseColor = new BABYLON.Color3(0, 0.58, 0.2);
plane.material = planeMaterial;
//Create Boxes
initialState.walls.forEach(wall => {
	let box = BABYLON.MeshBuilder.CreateBox("box", {height: wall.height, width: wall.width, depth: 2}, scene);
	let boxMaterial = new BABYLON.StandardMaterial('material', scene);
	boxMaterial.diffuseColor = new BABYLON.Color3(0, 0.58, 0.86);
	// boxMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	box.material = boxMaterial;
	box.position.x = wall.position[0];
	box.position.y = wall.position[1];
})
//Listen for arrow keys, dispatch appropriate actions
document.addEventListener('keydown', (e) => {
	const state = store.getState();
	const code = e.keyCode;
	switch (code) {
		case 40 : 
			store.dispatch(ytransform(-1));
			break;
		case 39 :
			store.dispatch(xtransform(1));
			break;
		case 38 : 
			store.dispatch(ytransform(1));
			break;
		case 37 : 
			store.dispatch(xtransform(-1));
			break;
		// case 81 :
		// 	myz = -0.1;
		// 	break;
		// case 87 : 
		// 	myz = 0.1
	}
})
document.addEventListener('keyup', (e) => {
	const code = e.keyCode;
	switch (code) {
		case 40 : 
			store.dispatch(ytransform(0));
			break;
		case 39 :
			store.dispatch(xtransform(0));;
			break;
		case 38 : 
			store.dispatch(ytransform(0));
			break;
		case 37 : 
			store.dispatch(xtransform(0));
			break;
		// case 81 :
		// 	myz = 0;
		// 	break;
		// case 87 : 
		// 	myz = 0
	}
})
//Define loop that renders view over and over and over
const renderLoop = () => {
	scene.render();
	let state = store.getState();
	//Update target ball position
	sphere.position.x += state.targetBall.velocity.x * (state.targetBall.velocity.speed);
	sphere.position.y += state.targetBall.velocity.y * (state.targetBall.velocity.speed);
	sphere.position.z += state.targetBall.velocity.z * (state.targetBall.velocity.speed);
	sphere.rotation.y -= state.targetBall.velocity.x * (state.targetBall.velocity.speed);
	sphere.rotation.x -= state.targetBall.velocity.y * (state.targetBall.velocity.speed);
	// sphere.rotation.z += state.targetBall.velocity.z * (state.targetBall.velocity.speed);
	//Apply friction to target ball
	if (state.targetBall.velocity.speed > 0) {
		store.dispatch(slowDown(0.0005));
	}
	//Check for wall collisions
	initialState.walls.forEach(wall => {
		if (sphere.position.x > wall.position[0] && sphere.position.x - 0.5 <= wall.position[0] + wall.width/2 && sphere.position.y > wall.position[1] - wall.height/2 && sphere.position.y < wall.position[1] + wall.height/2) {
			store.dispatch(impulse(state.targetBall.velocity.speed, {x: 1,y: state.targetBall.velocity.y,z: state.targetBall.velocity.z}));
		} else if (sphere.position.x < wall.position[0] && sphere.position.x + 0.5 >= wall.position[0] - wall.width/2 && sphere.position.y > wall.position[1] - wall.height/2 && sphere.position.y < wall.position[1] + wall.height/2) {
			store.dispatch(impulse(state.targetBall.velocity.speed, {x: -1,y: state.targetBall.velocity.y,z: state.targetBall.velocity.z}));
		} else if (sphere.position.y > wall.position[1] && sphere.position.y - 0.5 <= wall.position[1] + wall.height/2 && sphere.position.x > wall.position[0] - wall.width/2 && sphere.position.x < wall.position[0] + wall.width/2) {
			store.dispatch(impulse(state.targetBall.velocity.speed, {x: state.targetBall.velocity.x,y: 1,z: state.targetBall.velocity.z}));
		} else if (sphere.position.y < wall.position[1] && sphere.position.y + 0.5 >= wall.position[1] - wall.height/2 && sphere.position.x > wall.position[0] - wall.width/2 && sphere.position.x < wall.position[0] + wall.width/2) {
			store.dispatch(impulse(state.targetBall.velocity.speed, {x: state.targetBall.velocity.x,y: -1,z: state.targetBall.velocity.z}));
		}
	});
	//Update cue ball position
	cue.position.x += state.cue.velocity.x * state.cue.velocity.speed;
	cue.position.y += state.cue.velocity.y * state.cue.velocity.speed;
	cue.position.z += state.cue.velocity.z * state.cue.velocity.speed;
	//Calculate distance between balls
	let dx = cue.position.x - sphere.position.x;
	let dy = cue.position.y - sphere.position.y;
	let distance = Math.sqrt((dx * dx) + (dy * dy));
	if (distance < 1) {
		store.dispatch(impulse(0.1, {x: -dx, y: -dy, z: 0}));
	}
}
//Start loop
engine.runRenderLoop(renderLoop);
