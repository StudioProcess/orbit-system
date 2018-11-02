import { params, setBackgroundColor } from './main.js';


export function create() {
  let gui = new dat.GUI();

  gui.addColor(params, 'bgColor').onChange(a => {
    setBackgroundColor(a);
  });
}

// function setColors() {
//   mat_gradient.uniforms.colors.value = getColorsUniform(params.shading.colors);
// }
