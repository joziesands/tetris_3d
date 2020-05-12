//tetris3d.js

// TODO: 
//		improve menu/directions
//		add pile check to collision()

// 		maybe.. 
//		shadow -- highlightFootprint()
//		3D pieces

 
/* 
	WATCH OUT: pile indexing is weird... pile[y][x][z]			
*/

window.addEventListener('keydown', event => {

	switch(event.key){
		case "a":
			rotateTetromino(new THREE.Vector3(1,0,0));
			break;
		case "s":
			rotateTetromino(new THREE.Vector3(0,1,0));
			break;
		case ("d"):
			rotateTetromino(new THREE.Vector3(0,0,1));
			break;
		case "f":
			pause = !pause;
			if(pause){
				modalText.innerText = "PAUSE";
				modalElement.style.display = "block";
				controls.enabled = false;
			} else {
				modalElement.style.display = "none";
				controls.enabled = true;

			}
			break;
		case "Enter":
			decrementY();
			break;

		case "ArrowUp":  
			moveTetromino([0,0,-1]);				
			break;
		case "ArrowDown": 
			moveTetromino([0,0,1]);
			break;
		case "ArrowLeft":	
			moveTetromino([-1,0,0]);	
			break;
		case "ArrowRight":			
			moveTetromino([1,0,0]);	
			break;
	}
});

window.addEventListener('resize', 
	function(){
		gameWidth = window.innerWidth*.75;
		gameHeight = window.innerHeight;

		renderer.setSize(gameWidth, gameHeight);
		camera.aspect = gameWidth/gameHeight;
		camera.updateProjectionMatrix();

}, false);





let init = function init(){
	let lightAmb = new THREE.AmbientLight({color:0x404040, intensity:0.1});
	let lightDirAbv = new THREE.DirectionalLight(0xffffff,0.5);
	let lightDirKey = new THREE.DirectionalLight(0xffffff, 0.4);
	lightDirKey.position.set(-4,-10,10);
	scene.add(lightAmb);
	scene.add(lightDirAbv);
	scene.add(lightDirKey);
	
	controls = new THREE.OrbitControls(camera)
	controls.enablePan = false;
	controls.maxAzimuthAngle = maxAzmiuth;
	controls.minAzimuthAngle = minAzimuth;
	controls.target.set(xmax/2,ymax/5,0);
	camera.position.set(xmax/2,40,35);
	controls.update();
}

let rotateTetromino = function rotateTetromino(axis){		
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


let moveTetromino = function moveTetromino(axis){	// [x,y,z]
	if(!pause){
		activePiece.position.x += axis[0];
		activePiece.position.y += axis[1];
		activePiece.position.z += axis[2];
		renderer.render(scene, camera);
		correction = collision();
		if(collision()){
			activePiece.position.x += correction.x;
			activePiece.position.y += correction.y;
			activePiece.position.z += correction.z;
			renderer.render(scene, camera);
		}			
	}  				
}


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
              color: '#002200'};
  } else if(type === 1){	// J
	  return { block: [[-1,0,0],
				[0,0,-1],
            	[0,0,0],
            	[0,1,0],
            	[0,2,0]],
              color: '#003906'};
  } else if(type === 2){	// L
      return { block: [[0,0,0],
              	[0,1,0],
              	[0,2,0],
              	[1,0,0]],
              	color: '#00521e'};
  } else if (type === 3){	// O
      return {block:[[0,0,0],
              [0,1,0],
              [1,0,0],
              [1,1,0]],
              color: '#006c35'};  
  } else if(type === 4){	// S
      return {block:[[0,0,0],
              [0,1,0],
              [1,1,0],
              [-1,0,0]],
              color: '#0b874e'};
  } else if(type === 5){	// T
       return {block: [[0,0,0],
               [1,0,0],
               [0,1,0],
               [-1,0,0]],
               color: '#37a266'};
  } else if(type === 6){	//Z
      return {block:[[0,0,0],
              		[1,0,0],
					[0,1,0],
					[0,1,1],
              		[-1,1,1]],
              		color: '#55bd7f'};
  }
}


let spawn = function spawn(){

	this.shape = getShape(Math.floor(Math.random()*7));

	let geometry = new THREE.BoxBufferGeometry(.96,.96,.96);
	let material = new THREE.MeshStandardMaterial({color: this.shape.color});
	let cube = new THREE.Mesh(geometry, material);
	let tetromino = new THREE.Group();

	for(let i = 0; i < this.shape.block.length; i += 1){
		let cube = new THREE.Mesh(geometry, material);
		cube.position.set(this.shape.block[i][0],this.shape.block[i][1],this.shape.block[i][2]);
		tetromino.add(cube);
		tetromino.position.set(Math.round(xmax/2),ymax-3,Math.round(zmax/2));
		
	}	
	return tetromino;
}

playerLose = function playerLose(){
	//console.log("you died.");

	for(let layersIndex = 0; layersIndex < ymax; layersIndex++){
		for(let xIndex = 0; xIndex < xmax; xIndex++){
			for(let zIndex = 0; zIndex < zmax; zIndex++){
				scene.remove(scene.getObjectById(pile[layersIndex][xIndex][zIndex].sceneId));
				
			}
		}
	}

	pile = createPlayfield(xmax, ymax+5, zmax);
	createFloor();
	modalText.innerText = "YOU LOST";
	modalButton.innerText = "CLOSE";
	modalElement.style.display = "block";
	pause = true;
}

let merge = function merge(){
	let ap = new THREE.Vector3();
	let death = 0;
	for(let i = 0; i < activePiece.children.length; i++){
		activePiece.children[i].getWorldPosition(ap);
		if(ap.y > ymax-4){
			death = 1;
			break;
		}
		//console.log('merge: update pile');
	}

	if(death === 0){
		for(let i = 0; i < activePiece.children.length; i++){
			activePiece.children[i].getWorldPosition(ap);
			pile[Math.round(ap.y)][Math.round(ap.x)][Math.round(ap.z)] = { sceneId: activePiece.id, groupId:activePiece.children[i].id};
			//console.log('merge: update pile');
		}
	} else {
		scene.remove(activePiece);
		playerLose();
	}
	clearLayer();
	activePiece = new spawn();
	scene.add(activePiece);
}



let createPlayfield = function createPlayfield(w,h,d){		
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

let clearLayer = function clearLayer(){
	let full = [];
	let isfull = true;
	
	for(let i = 1; i < ymax; i++){
		isfull = true;
		// check each layer
		for(let j = 0; j < xmax; j++){
			for(let k = 0; k < zmax; k++){
				if(pile[i][j][k].groupId === 0)	{
					isfull = false;
					break;
				}			
			}
			if(isfull === false){
				break;
			}
		}
		if(isfull === true){
			full.push(i);
		}
	}
	score += full.length * 100;
	scoreElement.innerText = "SCORE: " + score;
	// remove and shift everything down
	let layersDeleted = 0;
	for(let layerIndex = 0; layerIndex < full.length; layerIndex++){
		for(let xIndex = 0; xIndex < xmax; xIndex++){
			for(let zIndex = 0; zIndex < zmax; zIndex++){
				//	
				
				scene.getObjectById(pile[full[layerIndex-layersDeleted]][xIndex][zIndex].sceneId).remove(scene.getObjectById(pile[full[layerIndex-layersDeleted]][xIndex][zIndex].sceneId).getObjectById(pile[full[layerIndex-layersDeleted]][xIndex][zIndex].groupId))
				
				for(let m = 1; m < ymax-layerIndex-layersDeleted; m++){
					if(pile[full[layerIndex-layersDeleted]+m][xIndex][zIndex].sceneId > 0){
						let cubeMesh = scene.getObjectById(pile[full[layerIndex-layersDeleted]+m][xIndex][zIndex].sceneId).getObjectById(pile[full[layerIndex-layersDeleted] + m][xIndex][zIndex].groupId);
						let sceneOrigin = scene.getWorldPosition();
						let cubeInWorld = cubeMesh.localToWorld(sceneOrigin);
						cubeInWorld.y--;
							
						let deltaPos = cubeMesh.worldToLocal(cubeInWorld)

						cubeMesh.position.x += deltaPos.x;
						cubeMesh.position.y += deltaPos.y;
						cubeMesh.position.z += deltaPos.z;
					}
					pile[full[layerIndex-layersDeleted]+m-1][xIndex][zIndex].sceneId = pile[full[layerIndex-layersDeleted]+m][xIndex][zIndex].sceneId;
					pile[full[layerIndex-layersDeleted]+m-1][xIndex][zIndex].groupId = pile[full[layerIndex-layersDeleted]+m][xIndex][zIndex].groupId;
				}
			}

		}
		layersDeleted++;
		console.log(layersDeleted)
	}
}



let decrementY = function decrementY(){
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

let animate = function animate(time = 0){
	const deltaTime = time - timePrev;
	timePrev = time;

	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		decrementY();
		dropCounter = 0;		
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);

}

let highlightFootprint = function highlightFootprint(){
	// cast ray in -y direction and highlight the face that it hits
}

// start building things
let score = 0;
let pause = false;
const xmax = 10;
const ymax = 24;
const zmax = 10;
const maxAzmiuth = 0.8;
const minAzimuth = -0.8;
let gameWidth = 100;
let gameHeight = 100;


/* ************* LAYOUT ************* */
/*
 __ __ __ __ __ __ __ __ __ _ 
|WRAPPER 				     |
|  __ __ __ __	  ___ __ __  |
| |GAME		  |  |SIDE     | |
| |			  |	 |	__ __  | |
| |			  |  | |SCORE| | |
| |      	  |  | |	 | | |
| |			  |  | |__ __| | |
| |			  |  |  __ __  | | 
| |			  |  | |HELP | | |
| |			  |  | |	 | | |
| |			  |  | |	 | | |
| |           |	 | |__ __| | |
| |__ __ __ __|	 |___ __ __| |
|__ __ __ __ __ __ __ __ __ _|

*/


let wrapperElement = document.createElement("div");
wrapperElement.className = "wrapper";
document.body.appendChild(wrapperElement);


let gameElement = document.createElement("div");
gameElement.className = "game";
wrapperElement.appendChild(gameElement);

let sideElement = document.createElement("div");
sideElement.className = "side";
wrapperElement.appendChild(sideElement);

let scoreElement = document.createElement("div"); 
scoreElement.className = "score";
let scoreText = document.createTextNode("");
scoreElement.appendChild(scoreText);
sideElement.appendChild(scoreElement);
scoreElement.innerText = "SCORE: " + score;

let helpElement = document.createElement("div");
helpElement.className = "help";
let helpText = document.createTextNode("CONTROLS");
let helpBody = document.createElement("p")
helpBody.innerText = " f: pause \n return: fall faster \n\n ROTATE: \n a: about x-axis \n s: about y-axis \n d: about z-axis \n\nMOVE: \n arrow keys \n\n VIEW: \n pan: click and drag mouse \n zoom: scroll up/down";
helpElement.appendChild(helpText);
sideElement.appendChild(helpElement);
helpElement.appendChild(helpBody);

let coordFrame = document.createElement("div");
let coordImg = document.createElement("img");
coordImg.src = "http://www.codinglabs.net/public/contents/article_world_view_projection_matrix/images/coords_rh.png"
coordImg.width = 100;
coordFrame.className = "info";
coordFrame.appendChild(coordImg);
helpElement.appendChild(coordFrame);

// pop up graphics 

let modalElement = document.createElement("div");
modalElement.className = "modal";
wrapperElement.appendChild(modalElement);


let modalText = document.createElement("p");
let modalButton = document.createElement("span");
modalElement.appendChild(modalText);
modalElement.appendChild(modalButton);

modalButton.onclick = function(){
	modalElement.style.display = "none";
	pause = false;
}

// THREE.js scene setup

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth*.75/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias: true});
let controls;

gameElement.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth*.75,gameElement.clientHeight); // want to set this to the size of the game div
renderer.setClearColor(0xffffff,1);


/* ************* GAME ************* */


init();

// build playField standard is 10x10 base w/ 20||24 height
let playField = new THREE.Mesh(new THREE.BoxBufferGeometry(xmax,0.5,zmax), new THREE.MeshStandardMaterial({
		color: 0x000,
		opacity:0.5,
		transparent:true,
	}));
	playField.position.set(Math.round(xmax/2)-.5,0.25,Math.round(zmax/2)-.5);
	scene.add(playField);


let pile = createPlayfield(xmax, ymax+5, zmax);  // pile[y][x][z]
createFloor();
let activePiece;
activePiece = new spawn();
scene.add(activePiece);

let dropCounter = 0;
let dropInterval = 1000;
let timePrev = 0;

animate();
