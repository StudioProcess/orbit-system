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
let numberElements = 3000;
let elementSize = 0.2;
let radiusScale = 0.4;
let maxRadius = 8;
let yRange = 0.2;
let showOrbitLines = false;

let orbitSpeed = 1;
let rotationSpeedScale = 0.0010;
// let colors = [];
// let offset = 0.2;
// let t = 0.1;

var planetColors = [
    0x0885c2,
    // 0xfbb132,
    0x666666,
    // 0x1c8b3c,
    // 0xed334e
  ],
  planets = [];

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
  camera = new THREE.PerspectiveCamera( 75, W / H, 0.01, 1000 );
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

  createElements();
  // connectElements(1, 2);

  // colors = [0xFFFFFF];
  // for(let i = 0; i < numberElements; i++) {
  //   let mat = new THREE.MeshBasicMaterial({
  //     color: colors[i%colors.length],
  //     wireframe: false,
  //     transparent: true,
  //     opacity: 0.8,
  //     // blending: THREE.MultiplyBlending
  //   });
  //   let mesh = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 20, 20 ), mat );
  //   elements.push( mesh );
  //   scene.add( mesh );
  // }
  // console.log( elements );
}

export function createElements(){
  for (var p = 0, radii = 0; p < numberElements; p++) {
    var size = elementSize,// Math.random() * 2,
      type = Math.floor(Math.random() * planetColors.length),
      roughness = Math.random() > .6 ? 1 : 0,
      planetGeom = new THREE.Mesh(
        // new THREE.BoxGeometry( elementSize, roughness, roughness ),
        new THREE.SphereGeometry( Math.random() * elementSize, Math.random() * elementSize*3, Math.random() * elementSize ),
        // new THREE.RingBufferGeometry(
        //   Math.random() * elementSize,
        //   Math.random() * elementSize,
        //   Math.random() * elementSize
        // ),
        // new THREE.ConeBufferGeometry( Math.random() * elementSize, roughness),
        new THREE.MeshBasicMaterial({
          color: planetColors[type],
          // shading: THREE.FlatShading,
          wireframe: false,
          // transparent: true,
          // opacity: 0.8,
          blending: THREE.MultiplyBlending
        })
      ),
      planet = new THREE.Object3D();

    planet.add(planetGeom);

    // planet.orbitRadius = radiusScale;
    planet.orbitRadius = ( getRandomFloat(0, maxRadius) + radii );
    // if(p%2==0){ planet.orbitRadius += Math.random() + radii; }  //Math.random() * 2 + 2 + radii;
    planet.rotSpeed = getRandomInt(-5, 5) * rotationSpeedScale;
    // planet.rotSpeed *= Math.random() < .10 ? -1 : 1;
    planet.rot = Math.random();
    // planet.orbitSpeed = (0.02 - p * 0.0048) * 0.005;
    planet.orbitSpeed = Math.random() * (0.02 - 0.0048) * 0.009 * orbitSpeed;
    planet.orbit = Math.random() * Math.PI * 2;
    planet.position.set(planet.orbitRadius, 0, 0);

    radii = (planet.orbitRadius + size) * radiusScale;
    planets.push(planet);
    scene.add(planet);

    // orbit line
    if(showOrbitLines) {
      var orbit = new THREE.Line(
        new THREE.CircleGeometry(planet.orbitRadius, 90),
        new THREE.MeshBasicMaterial({
          color: planetColors[0],
          transparent: true,
          opacity: 1,
          side: THREE.BackSide
        })
      );
      orbit.geometry.vertices.shift();
      orbit.rotation.x = THREE.Math.degToRad(90);
      scene.add(orbit);
    }
  }

  ////

  //Objects
  var starColor = (function() {
    var colors = [0x0885c2, 0xfbb132, 0x666666, 0x1c8b3c, 0xed334e]; //[0xFFFF00, 0x559999, 0xFF6339, 0xFFFFFF];
    return colors[Math.floor(Math.random() * colors.length)];
  })();
  // star = new THREE.Mesh(
  //   // new THREE.IcosahedronGeometry(0.3, 1),
  //   new THREE.SphereGeometry( elementSize, 20, 20 ),
  //   new THREE.MeshBasicMaterial({
  //     color: 0x0885c2,
  //     wireframe: false,
  //     transparent: true,
  //     opacity: 1,
  //     // blending: THREE.MultiplyBlending
  //   })
  // );

// star.castShadow = false;
// scene.add(star);
}
////

export function connectElements(num1, num2) {
  let planet1 = new THREE.Object3D();
  let planet2 = new THREE.Object3D();

  // console.log( planets );

  planet1 = planets[num1];
  planet2 = planets[num2];

  // var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 20, 32 );
  // let material = new THREE.MeshBasicMaterial({
  //   color: '#ff0000',
  //   wireframe: false,
  //   blending: THREE.MultiplyBlending
  // });

  // var cylinder = new THREE.Mesh( geometry, material );
  var path = new THREE.Path();

  path.lineTo( planet1.position.x, planet1.position.y, planet1.position.z );
  // path.quadraticCurveTo( 0, 1, 0.2, 1 );
  path.lineTo( planet2.position.x, planet2.position.y, planet2.position.z );
  var points = path.getPoints();

  var geometry = new THREE.BufferGeometry().setFromPoints( points );
  var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  var line = new THREE.Line( geometry, material );
  scene.add( line );

  // console.log( planet1 );
  // if( planet1 && planet2 ){
  //   cylinder.position.set(planet1.position.x, planet1.position.y, planet1.position.z);
  //   cylinder.rotation.x = 1.5708;
  //   scene.add( cylinder );
  // }
}


export function setBackgroundColor(col) {
  renderer.setClearColor(col);
  //document.querySelector('canvas').style.backgroundColor = col;
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
  // console.log(time);

  camera.rotation.z = Math.sin(time * 0.0001) * 0.01;


  // for(let i = 0; i < numberElements; i++) {
  //   elements[i].position.x = Math.sin( (i+1)*time/20000 ) + offset ;
  //   elements[i].position.y = Math.cos( (i+1)*time/20000 ) + offset;
  //   elements[i].position.z = 0 ;//1-(i*0.5);
  // }

  ////
  for (var p in planets) {
    var planet = planets[p];
    planet.rot += planet.rotSpeed;
    planet.rotation.set(0, planet.rot, 0);
    planet.orbit += planet.orbitSpeed;
    planet.position.set(
      Math.cos(planet.orbit) * planet.orbitRadius,
      // Math.tan(planet.orbit) * planet.orbitRadius,
      Math.cos(params.yRanges[p] * time*0.01) * 0.1,
      //0,//Math.cos(planet.orbit) * planet.orbitRadius + Math.sin(planet.orbit),
      Math.sin(planet.orbit) * planet.orbitRadius);
  }

  console.log( params.yRanges[p] + Math.sin(time) * 0.1 );
  // connectElements(1, 2);

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
