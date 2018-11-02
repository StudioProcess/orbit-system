let globalTime = 0;
let offset = 0;

let running = true;
let lastStoppedTime = 0;
let pauseDuration = 0;

export function update(time) {
  globalTime = time;
  if (!running) {
    pauseDuration = globalTime - lastStoppedTime;
  }
}

export function start() {
  if (running) return;
  offset += pauseDuration;
  pauseDuration = 0;
  running = true;
}

export function stop() { 
  if (!running) return;
  lastStoppedTime = globalTime;
  running = false;
}

export function toggle() {
  if (running) { stop(); }
  else { start(); }
}

export function time() {
  return globalTime - offset - pauseDuration;
}

// aliases
export function play()  { start(); }
export function pause() { stop();  }
