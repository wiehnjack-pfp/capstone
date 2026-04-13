let activeKey = null;
let activeView = 'profile';

/* CONNECTOR TOGGLE */
function toggleConnector(){
  const panel = document.getElementById("connectorPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

/* BASE URL */
function baseUrl(){
  const ip = document.getElementById('ip').value.trim();

  if(!ip){
    alert('Enter PC IP');
    return null;
  }

  return `http://${ip}:8080`;
}

/* STATUS INDICATOR */
function setStatus(ok){
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');

  if(ok){
    dot.style.background = 'var(--good)';
    text.textContent = 'CONNECTED';
  } else {
    dot.style.background = 'var(--bad)';
    text.textContent = 'OFFLINE';
  }
}

/* VIEW SWITCHING */
function setView(view){
  const views = ['profile','feed','activity'];

  views.forEach(v => {
    const el = document.getElementById('view_' + v);
    if(el) el.classList.remove('active');
  });

  activeView = view;

  const activeEl = document.getElementById('view_' + view);
  if(activeEl) activeEl.classList.add('active');

  // Send to backend
  send('view/' + view);
}

/* PERSONA SELECTION */
function setActive(key){
  const ids = ['alpha','genz','mill','genx','boom'];

  ids.forEach(k=>{
    const el = document.getElementById('btn_' + k);
    if(el) el.classList.remove('activeRing');
  });

  activeKey = key;

  if(key){
    const el = document.getElementById('btn_' + key);
    if(el) el.classList.add('activeRing');

    // Reset to profile view when persona changes
    setView('profile');
  }

  runAlgorithm(key);
}

/* ALGORITHM ANIMATION */
function runAlgorithm(key){
  const indicator = document.getElementById("algoIndicator");

  indicator.classList.add("active");

  setTimeout(()=>{
    indicator.classList.remove("active");
    updateRouteIndicator(key);
  }, 900);
}

/* ROUTE LABEL */
function updateRouteIndicator(key){
  const value = document.getElementById("routeValue");

  value.className = "routeValue";

  if(!key){
    value.innerText = "NONE";
    return;
  }

  const labels = {
    alpha:"AIDEN",
    genz:"MAYA",
    mill:"MILLENNIAL",
    genx:"GEN X",
    boom:"BOOMER"
  };

  value.innerText = labels[key];

  value.classList.add("route-" + key);
}

/* PING CONNECTION */
async function ping(){
  const url = baseUrl();
  if(!url) return;

  try{
    const res = await fetch(url + '/ping', { cache:'no-store' });
    setStatus(res.ok);
  } catch(e){
    setStatus(false);
  }
}

/* SEND COMMAND */
async function send(path){
  const url = baseUrl();
  if(!url) return;

  try{
    const res = await fetch(url + '/' + path, { cache:'no-store' });
    setStatus(res.ok);
  } catch(e){
    setStatus(false);
  }
}
function goHome(){
  activeKey = null;

  const ids = ['alpha','genz','mill','genx','boom'];
  ids.forEach(k=>{
    const el = document.getElementById('btn_' + k);
    if(el) el.classList.remove('activeRing');
  });

  const views = ['profile','feed','activity'];
  views.forEach(v => {
    const el = document.getElementById('view_' + v);
    if(el) el.classList.remove('active');
  });

  activeView = 'profile';
  const profileBtn = document.getElementById('view_profile');
  if(profileBtn) profileBtn.classList.add('active');

  updateRouteIndicator(null);
  send('home');
}