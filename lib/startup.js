function appendScript(attrs) {
  let script = document.createElement('script');
  Object.assign(script, attrs);
  let body = document.querySelector('body');
  body.appendChild(script);
}

function isLocal() {
  return location.hostname == 'localhost' || location.hostname == '127.0.0.1';
}

function getEnv(envList, ...desiredEnvs) {
  for (let env of desiredEnvs) {
    if (envList[env]) { return envList[env]; }
  }
  return undefined;
}

export default function startup(opts) {
  let env_local = getEnv(opts, 'local', 'dev');
  let env_default = getEnv(opts, 'default', 'online', 'prod', 'else');
  
  if (isLocal() && env_local) {
    appendScript(env_local);
  } else {
    appendScript(env_default);
  }
}
