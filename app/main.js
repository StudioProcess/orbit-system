import '../lib/loadThree.js';
import '../node_modules/three/examples/js/controls/OrbitControls.js';
import * as util from './util.js';
import * as clock from './clock.js';
import * as gui from './gui.js';

const W = 1280;
const H = 800;

let renderer, scene, camera;
let controls; // eslint-disable-line no-unused-vars
// let elements = [];
let numberElements = 5;
let elementSize = 0.2;
let radiusScale = 0.4;
let maxRadius = 8;
let yRange = 0.2;
let showOrbitLines = false;

let orbitSpeed = 2;
let rotationSpeedScale = 0.0010;
let light;
// let colors = [];
// let offset = 0.2;
// let t = 0.1;

let radius1 = 1;
let radius2 = 2;
let radius3 = 3;

let elementsLayer1 = 2;
let elementsLayer2 = 2;
let elementsLayer3 = 2;

let layer1 = [];
let layer2 = [];
let layer3 = [];

//
let r = 1;
let theta = 0;
let dTheta = 2 * Math.PI / 1000;

var layerColors = [
    0x0885c2,
    0xfbb132,
    0x666666,
    0x1c8b3c,
    0xed334e
  ];

export let params = {
  bgColor: '#606060',
  colors: ['#ed1c24', '#c83e81', '#701655', '#8781bd'],
  yRanges: []
};

(function main() {

  setup(); // set up scene
  loop(); // start game loop

})();


function setup() {

  for(var i = 0; i < numberElements; i++){
    params.yRanges[i] = Math.random() * yRange;
  }

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize( W, H );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor( 0xFFFFFF ); //0x003699
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();
  // camera = new THREE.PerspectiveCamera( 75, W / H, 0.01, 1000 );
  var aspect = W / H;
  var d = 3; // camera distance
  camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 10000 );
  camera.position.set( 2000, 2000, 2000 ); // all components equal
  // camera.position.z = 600;
  camera.rotation.x = 0;// = ( 0, 0, 0);
  camera.rotation.y = 0;
  camera.rotation.z = 0;
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  // gui.create();

  addLights();

  createElements();
}

function addLights(){
  // light = new THREE.DirectionalLight( 0xFFFFFF );
  // var helper = new THREE.DirectionalLightHelper( light, 1, 0xff0000 );

  light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
  light.position.set( 0, 0, 0 );
  // light.angle = 0.04;
  light.distance = 2;
  scene.add( light );
}

export function createElements(){

  for(let i=0; i < elementsLayer1; i++) {
    let planetGeom = new THREE.Mesh(
      new THREE.SphereBufferGeometry( Math.random() * elementSize, elementSize*3, elementSize*3 ),
      new THREE.MeshPhongMaterial({
        color: layerColors[0],
        wireframe: false,
        specular: 0xff0000,
        shininess: 100,
        blending: THREE.MultiplyBlending
      })
    );
    layer1.push( planetGeom );
    scene.add( planetGeom );
  }

  for(let i=0; i < elementsLayer2; i++) {
    let planetGeom = new THREE.Mesh(
      new THREE.SphereBufferGeometry( Math.random() * elementSize, elementSize*3, elementSize*3 ),
      new THREE.MeshPhongMaterial({
        color: layerColors[1],
        wireframe: false,
        specular: 0xff0000,
        shininess: 100,
        blending: THREE.MultiplyBlending
      })
    );
    layer2.push( planetGeom );
    scene.add( planetGeom );
  }

  for(let i=0; i < elementsLayer3; i++) {
    let planetGeom = new THREE.Mesh(
      new THREE.SphereBufferGeometry( Math.random() * elementSize, elementSize*3, elementSize*3 ),
      new THREE.MeshPhongMaterial({
        color: layerColors[2],
        wireframe: false,
        specular: 0xff0000,
        shininess: 100,
        blending: THREE.MultiplyBlending
      })
    );
    layer3.push( planetGeom );
    scene.add( planetGeom );
  }

}


export function setBackgroundColor(col) {
  renderer.setClearColor(col);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function loop(time) { // eslint-disable-line no-unused-vars
  clock.update(time);
  time = clock.time();
  theta += dTheta;

  // camera.rotation.z = Math.sin(time * 0.0001) * 0.01;

  for (var p in layer1) {
    var planet = layer1[p];
    planet.position.set(
      radius1 * Math.cos(theta * (2/(p+1))),
      0,
      radius1 * Math.sin(theta * (2/(p+1)))
    );
  }

  for (var i in layer2) {
    var planet2 = layer2[i];
    planet2.position.set(
      radius2 * Math.cos(theta * (2/(i+1))),
      0,
      radius2 * Math.sin(theta * (2/(i+1)))
    );
  }

  for (var u in layer3) {
    var planet3 = layer3[u];
    planet3.position.set(
      radius3 * Math.cos(theta * (2/(u+1))),
      0,
      radius3 * Math.sin(theta * (2/(u+1)))
    );
  }


  //Increment theta, and update moon x and y
  //position based off new theta value
  light.position.x = r * Math.cos(theta);
  light.position.y = 0;
  light.position.z = r * Math.sin(theta);

  requestAnimationFrame( loop );
  renderer.render( scene, camera );
}

document.querySelector('.close').addEventListener('click', () => {
  let box = document.querySelector('#help');
  box.style.opacity = 0;
  box.style.pointerEvents = 'none';
});


document.addEventListener('keydown', e => {
  // console.log(e.key, e.keyCode, e);

  if (e.key == 'f') { // f .. fullscreen
    util.toggleFullscreen();
  }

  else if (e.key == 's') { // s .. save frame
    util.saveCanvas();
  }

  else if (e.key == ' ') { // SPACE .. play/pause
    // clock.toggle();
    e.preventDefault();
  }

  else if (e.key == 'h') { // h .. toggle help
    let box = document.querySelector('#help');
    if (box.style.opacity > 0 || box.style.opacity === '') {
      box.style.opacity = 0;
      box.style.pointerEvents = 'none';
    }
    else {
      box.style.opacity = 1.0;
      box.style.pointerEvents = 'all';
    }
  }

});
