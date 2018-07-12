//tetris3d.js

// TODO: 
// 		shadow -- highlightFootprint()
// 		score/lives in keepScore()
//		menu/directions
//		clean up eventListeners -- moveTetromino()
//		add pile check to collision()




// setup lights
function init(){
	let lightAmb = new THREE.AmbientLight({color:0x404040, intensity:0.1});
	let lightDirAbv = new THREE.DirectionalLight(0xffffff,0.5);
	let lightDirKey = new THREE.DirectionalLight(0xffffff, 0.4);
	lightDirKey.position.set(-4,-10,10);
	scene.add(lightAmb);
	scene.add(lightDirAbv);
	scene.add(lightDirKey);

	let controls = new THREE.OrbitControls(camera);
	controls.enablePan = false;
	controls.maxAzimuthAngle = maxAzmiuth;
	controls.minAzimuthAngle = minAzimuth;
	controls.target.set(xmax/2,ymax/3,0);
	camera.position.set(xmax/2,40,35);
	controls.update();
}

// event listeners
window.addEventListener('keydown', event => {
	
	function rotateTetromino(axis){		
		if(!pause){
			let correction = null;
			activePiece.rotateOnWorldAxis(axis, Math.PI/2);		
				renderer.render(scene, camera);
				correction = collision();
				if(correction !== null){
					activePiece.position.x += correction.x;
					activePiece.position.z += correction.z;
					renderer.render(scene, camera);
				}
		}
	}


	function moveTetromino(){

	}

	switch(event.key){
		case "z":
			rotateTetromino(new THREE.Vector3(1,0,0));
			break;
		case "x":
			rotateTetromino(new THREE.Vector3(0,1,0));
			break;
		case ("c" || "C"):
			rotateTetromino(new THREE.Vector3(0,0,1));
			break;
		case "v":
			pause = !pause;
			break;
		case "Enter":
			decrementY();
			break;

		case "ArrowUp":  
			if(!pause){
				activePiece.position.z -= 1;
				renderer.render(scene, camera);
				correction = collision();
				if(collision()){
					//console.log("arrowupCollide!" + correction.x + correction.z)
					activePiece.position.z += correction.z;
					renderer.render(scene, camera);
				}			
			}  							
			break;
		case "ArrowDown": 
			if(!pause){
				activePiece.position.z += 1;
				renderer.render(scene, camera);
				correction = collision();
				if(correction !== null){			
					//console.log("arrowdownCollide!" + correction.x + correction.z)
					activePiece.position.z += correction.z;
					renderer.render(scene, camera);
				} 
			}
			break;
		case "ArrowLeft":	
			if(!pause){
				activePiece.position.x -= 1;
				renderer.render(scene, camera);
				correction = collision()
				if(correction !== null){
					//console.log("arrowleftCollide!" + correction.x + correction.z)
					activePiece.position.x += correction.x;
					renderer.render(scene, camera);
				}
			}					
			break;
		case "ArrowRight":			
			if(!pause){
							activePiece.position.x += 1; 			
				renderer.render(scene, camera);	
				correction = collision()		
				if(correction !== null){
					//console.log("arrowrightCollide!" + correction.x + correction.z)
					activePiece.position.x += correction.x;	
					renderer.render(scene, camera);
				}
			}			
			break;
	}
});


let collision = function collision(){	
	let xOverlap = 0;
	let zOverlap = 0;
	for(let i = 0; i < activePiece.children.length; i++){
		let ap = activePiece.children[i].getWorldPosition(new THREE.Vector3(0,0,0));
		ap.x = Math.round(ap.x);
		ap.y = Math.round(ap.y);
		ap.z = Math.round(ap.z);
		if(ap.x > xmax-1){
			xOverlap = xmax-1 - ap.x;
		} else if(ap.x < 0){
			xOverlap = 0 - ap.x;
		} 

		if(ap.z > zmax-1){
			zOverlap = zmax-1 - ap.z;
		} else if (ap.z < 0){
			zOverlap = 0 - ap.z;
		}
	}

	if(xOverlap !== 0 || zOverlap !== 0){
		return {x: xOverlap, 
				y: 0,
				z: zOverlap};
	} else{
		return null;
	}
}

let getShape = function getShape(type){         // [x, y, z] 
  if(type === 0){			// I
      return {block: [[0,0,0],
              [0,1,0],
              [0,2,0],
              [0,-1,0]],
              color: '#ffffff'};
  } else if(type === 1){	// J
      return { block: [[-1,0,0],
              [0,0,0],
              [0,1,0],
              [0,2,0]],
              color: '#c6ecc6'};
  } else if(type === 2){	// L
      return { block: [[0,0,0],
              		[0,1,0],
              		[0,2,0],
              		[1,0,0]],
              	color: '#8cd98c'};
  } else if (type === 3){	// O
      return {block:[[0,0,0],
              [0,1,0],
              [1,0,0],
              [1,1,0]],
              color: '#53c653'};  
  } else if(type === 4){	// S
      return {block:[[0,0,0],
              [0,1,0],
              [1,1,0],
              [-1,0,0]],
              color: '#339933'};
  } else if(type === 5){	// T
       return {block: [[0,0,0],
               [1,0,0],
               [0,1,0],
               [-1,0,0]],
               color: '#267326'};
  } else if(type === 6){	//Z
      return {block:[[0,0,0],
              [1,0,0],
              [0,1,0],
              [-1,1,0]],
              color: '#194d19'};
  }
}


/*,[[0,0,0],
              [1,0,0],
              [1,0,1],
              [0,0,1]
              [2,0,0],
              [2,0,1],
              [2,0,2],
              [1,0,2],
              [0,0,2],
              [3,0,0],
              [3,0,1],
              [3,0,2],
              [3,0,3],
              [2,0,3],
              [1,0,3],
              [0,0,3],
              [4,0,0],
              [4,0,1],
              [4,0,2],
              [4,0,3],
              [4,0,4],
              [3,0,4],
              [2,0,4],
              [1,0,4],
              [0,0,4]*/

let createTetromino = function createTetromino(){

	this.shape = getShape(Math.floor(Math.random()*7));

	let geometry = new THREE.BoxBufferGeometry(.96,.96,.96);
	let material = new THREE.MeshStandardMaterial({color: this.shape.color});
	let cube = new THREE.Mesh(geometry, material);
	let tetromino = new THREE.Group();

	for(let i = 0; i < this.shape.block.length; i += 1){
		let cube = new THREE.Mesh(geometry, material);
		cube.position.set(this.shape.block[i][0],this.shape.block[i][1],this.shape.block[i][2]);
		tetromino.add(cube);
		tetromino.position.set(Math.round(xmax/2),ymax,Math.round(zmax/2));
		
	}	
	return tetromino;
}

function merge(){
	let ap = new THREE.Vector3();
	for(let i = 0; i < activePiece.children.length; i++){
		activePiece.children[i].getWorldPosition(ap);
		pile[Math.round(ap.y)][Math.round(ap.x)][Math.round(ap.z)] = { sceneId: activePiece.id, groupId:activePiece.children[i].id};
		//console.log('merge: update pile');
	}
	clearLayer();
	activePiece = new createTetromino();
	scene.add(activePiece);
}

function createPile(w,h,d){							// TODO: get these in the right order
	let playfield = [];
	let zmatrix = [];
	let submatrix = [];

	for(let i = 0; i < h; i++){
		submatrix = [];
		for(let j = 0; j < d; j++){
			zmatrix = [];
			for(let k = 0; k < d; k++){
				zmatrix.push({sceneId: 0, groupId: 0});
			}
			submatrix.push(zmatrix);
		}
			playfield.push(submatrix);
	}
	return playfield;
}

let createFloor = function createFloor(){
	for(let i = 0; i < xmax; i++){
		for(let j = 0; j < zmax; j++){
			pile[0][i][j].groupId = 1;
			pile[0][i][j].sceneId = 1;
		}
	}
}

function clearLayer(){
	let full = [];
	let isfull = true;
	
	for(let i = 1; i < ymax; i++){
		isfull = true;
		// check each layer
		for(let j = 0; j < xmax; j++){
			for(let k = 0; k < zmax; k++){
				if(pile[i][j][k].groupId === 0)	{
					isfull = false;
					//console.log(i + " " + j + " " + k);
					break;
				}			
			}
			if(isfull === false){
				break;
			}
		}
		if(isfull === true){
			full.push(i);	// remove it here?
		}
	}
	//console.log(full);
	// remove layer from scene and move the others down
	for(let i = 0; i < full.length; i++){
		// remove children on layer i from scene
		for(let j = 0; j < xmax; j++){
			for(let k = 0; k < zmax; k++){
				//	
				scene.getObjectById(pile[full[i]][j][k].sceneId).remove(scene.getObjectById(pile[full[i]][j][k].sceneId).getObjectById(pile[full[i]][j][k].groupId))
				renderer.render(scene, camera);
				for(let m = 1; m < ymax-i; m++){
					if(pile[full[i]+m][j][k].sceneId > 0){
						// move the thing
						let cubeMesh = scene.getObjectById(pile[full[i]+m][j][k].sceneId).getObjectById(pile[full[i] + m][j][k].groupId);
						let sceneOrigin = scene.getWorldPosition();
						let cubeInWorld = cubeMesh.localToWorld(sceneOrigin);
						cubeInWorld.y--;
							
						let deltaPos = cubeMesh.worldToLocal(cubeInWorld)

						cubeMesh.position.x += deltaPos.x;
						cubeMesh.position.y += deltaPos.y;
						cubeMesh.position.z += deltaPos.z;

						//scene.getObjectById(pile[full[i]+m][j][k].sceneId).getObjectById(pile[full[i] + m][j][k].groupId).position.y--;	// TODO: needs a transform
					}
					pile[full[i]+m-1][j][k].sceneId = pile[full[i]+m][j][k].sceneId;
					pile[full[i]+m-1][j][k].groupId = pile[full[i]+m][j][k].groupId;
				}
				

			}
		}

	}
	// CHECK: make sure all empty squares get set back to zero
	//console.log(full);
}

function highlightFootprint(){
	// cast ray in -y direction and highlight the face that it hits
}

//set up scene and camera
let scene = new THREE.Scene();
let scene2 = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();

document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth,window.innerHeight);

let pause = false;
const xmax = 10;
const ymax = 20;
const zmax = 10;
const maxAzmiuth = 0.8;
const minAzimuth = -0.8;

// for testing

function showPos(piece){
	let apPos = new THREE.Vector3();
	for(let i = 0; i < piece.children.length; i++){
		piece.children[i].getWorldPosition(apPos);
		console.log(apPos);
	}
	return apPos;
}

function decrementY(){
	if(!pause){
		let ap = new THREE.Vector3(0,0,0);
		for(let i = 0; i < activePiece.children.length; i++){
			activePiece.children[i].getWorldPosition(ap);
			//console.log(pile[Math.round(ap.y-1)][Math.round(ap.z)][Math.round(ap.x)])
			if(pile[Math.round(ap.y-1)][Math.round(ap.x)][Math.round(ap.z)].groupId > 0){
				merge();
				break;
			}
		}
		activePiece.position.y--;
	
		renderer.render(scene, camera);
	}
}

function testRemove(cubeMesh){
	let sceneOrigin = scene.getWorldPosition();
	let cubeInWorld = cubeMesh.localToWorld(sceneOrigin);
	cubeInWorld.y++;
		
	let deltaPos = cubeMesh.worldToLocal(cubeInWorld)

	cubeMesh.position.x += deltaPos.x;
	cubeMesh.position.y += deltaPos.y;
	cubeMesh.position.z += deltaPos.z;
}


/* ************* GAME ************* */


init();

// build playField standard is 10x10 base w/ 20||24 height
let playField = new THREE.Mesh(new THREE.BoxBufferGeometry(xmax,2.5,zmax), new THREE.MeshStandardMaterial({
		color: 0xffffff,
		opacity:0.15,
		transparent:true,
	}));
	playField.position.set(Math.round(xmax/2)-.5,-.75,Math.round(zmax/2)-.5);
	scene.add(playField);


let pile = createPile(xmax, ymax+5, zmax);  // pile[y][z][x]
createFloor()
let activePiece;
activePiece = new createTetromino();
scene.add(activePiece);

let dropCounter = 0;
let dropInterval = 1000;
let timePrev = 0;



function animate(time = 0){
	const deltaTime = time - timePrev;
	timePrev = time;

	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		decrementY();
		dropCounter = 0;		
	}

	requestAnimationFrame(animate);
	//let height = window.innerWidth*aspectRatio;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);

}

animate();
