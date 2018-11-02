// Load three.js as a module but also put it into global scope

import * as THREE from '../node_modules/three/build/three.module.js';

// window.THREE = THREE; // Causes: OrbitControls.js:16 Uncaught TypeError: Cannot add property OrbitControls, object is not extensible
window.THREE = Object.assign({}, THREE); // Makes sure window.THREE is extensible

// Re-Export the module
// Import with `import * as THREE from './loadTree.js';`
// or just `import './loadTree.js';`
export default THREE;
