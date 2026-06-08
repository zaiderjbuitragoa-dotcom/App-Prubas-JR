<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>J.R. Carrozas · Centro de Control GPS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
:root {
  --bg:      #f5f6f8;
  --surface: #ffffff;
  --border:  #e2e5ea;
  --accent:  #e63946;
  --accent2: #c1121f;
  --green:   #0b9e8e;
  --yellow:  #d4930a;
  --text:    #1a1d23;
  --muted:   #6b7280;
  --card:    #ffffff;
  --pulse:   rgba(230,57,70,.25);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);height:100dvh;display:flex;flex-direction:column;overflow:hidden}

/* HEADER */
header{display:flex;align-items:center;gap:16px;padding:12px 20px;background:var(--surface);border-bottom:1px solid var(--border);z-index:1000;flex-shrink:0}
.logo-block{display:flex;flex-direction:column;line-height:1}
.logo-brand{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.5px}
.logo-brand span{color:var(--accent)}
.logo-sub{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-top:3px}
.header-spacer{flex:1}
.live-badge{display:flex;align-items:center;gap:6px;background:rgba(11,158,142,.1);border:1px solid rgba(11,158,142,.35);border-radius:20px;padding:5px 12px;font-family:'DM Mono',monospace;font-size:11px;color:var(--green);font-weight:500}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:blink 1.2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.stat-chips{display:flex;gap:8px}
.stat-chip{padding:5px 12px;border-radius:20px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;border:1px solid var(--border);background:var(--card)}
.stat-chip.active{border-color:rgba(230,57,70,.4);color:var(--accent2)}
.stat-chip.idle{color:var(--muted)}
.demo-badge{background:rgba(212,147,10,.12);border:1px solid rgba(212,147,10,.35);border-radius:20px;padding:5px 12px;font-family:'DM Mono',monospace;font-size:10px;color:var(--yellow);display:none}
.demo-badge.visible{display:flex;align-items:center;gap:5px}

/* LAYOUT */
.app-body{display:flex;flex:1;overflow:hidden}

/* SIDEBAR */
aside{width:300px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}
.sidebar-header{padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.sidebar-title{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.refresh-btn{background:none;border:1px solid var(--border);color:var(--muted);border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;font-family:'DM Mono',monospace;transition:all .2s}
.refresh-btn:hover{border-color:var(--accent);color:var(--accent)}
.refresh-btn.spinning{animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.vehicle-list{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.vehicle-list::-webkit-scrollbar{width:4px}
.vehicle-list::-webkit-scrollbar-track{background:transparent}
.vehicle-list::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* VEHICLE CARD */
.vcard{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.vcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);border-radius:3px 0 0 3px;opacity:0;transition:opacity .2s}
.vcard:hover,.vcard.selected{border-color:rgba(230,57,70,.4);background:#fff8f8}
.vcard:hover::before,.vcard.selected::before{opacity:1}
.vcard-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
.vcard-plate{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px}
.status-pill{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px}
.status-pill.en-ruta{background:rgba(230,57,70,.15);border:1px solid rgba(230,57,70,.35);color:var(--accent2)}
.status-pill.offline{background:rgba(107,114,128,.1);border:1px solid rgba(107,114,128,.2);color:var(--muted)}
.vcard-driver{font-size:12px;color:var(--muted);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vcard-service{font-size:11px;color:var(--text);opacity:.8;margin-bottom:10px}
.vcard-coords{font-family:'DM Mono',monospace;font-size:10px;color:var(--green);background:rgba(11,158,142,.07);padding:5px 8px;border-radius:5px;margin-bottom:8px;display:flex;gap:8px;align-items:center}
.coord-dot{width:5px;height:5px;background:var(--green);border-radius:50%;flex-shrink:0}
.vcard-meta{display:flex;justify-content:space-between;align-items:center}
.vcard-time{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted)}
.vcard-precision{font-family:'DM Mono',monospace;font-size:9px;color:var(--yellow)}
.center-btn{font-family:'DM Mono',monospace;font-size:9px;background:rgba(230,57,70,.1);border:1px solid rgba(230,57,70,.25);color:var(--accent2);padding:4px 10px;border-radius:5px;cursor:pointer;transition:all .2s;letter-spacing:.5px;text-transform:uppercase}
.center-btn:hover{background:rgba(230,57,70,.2)}

/* COUNTDOWN */
.countdown-bar{padding:10px 16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)}
.countdown-track{flex:1;height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.countdown-fill{height:100%;background:var(--green);border-radius:2px;transition:width 1s linear}

/* MAP */
#map{flex:1;background:#0d1117}
.leaflet-control-zoom a{background:var(--surface)!important;color:var(--text)!important;border-color:var(--border)!important}
.leaflet-control-zoom a:hover{background:var(--bg)!important}
.leaflet-control-attribution{display:none!important}

/* POPUP */
.leaflet-popup-content-wrapper{background:var(--surface)!important;border:1px solid var(--border)!important;border-radius:10px!important;color:var(--text)!important;box-shadow:0 8px 32px rgba(0,0,0,.12)!important}
.leaflet-popup-tip{background:var(--surface)!important}
.leaflet-popup-content{margin:14px 16px!important;min-width:200px}
.popup-plate{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:4px}
.popup-driver{font-size:12px;color:var(--muted);margin-bottom:8px}
.popup-row{display:flex;justify-content:space-between;margin-bottom:4px}
.popup-label{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)}
.popup-val{font-family:'DM Mono',monospace;font-size:10px;color:var(--green)}
.popup-divider{border:none;border-top:1px solid var(--border);margin:8px 0}

/* TOAST */
#toast-container{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:9999}
.toast{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--green);padding:10px 16px;border-radius:8px;font-size:12px;max-width:260px;animation:slideIn .3s ease;box-shadow:0 4px 20px rgba(0,0,0,.1)}
.toast.warn{border-left-color:var(--yellow)}
.toast.error{border-left-color:var(--accent)}
@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}

/* EMPTY STATE */
.empty-state{display:flex;flex-direction:column;align-items:center;padding:40px 20px;gap:12px;color:var(--muted)}
.empty-state .icon{font-size:40px;opacity:.4}
.empty-state p{font-size:12px;text-align:center;line-height:1.6}

/* PULSE GLOBAL */
@keyframes pulse{0%{transform:translate(-50%,-50%) scale(.5);opacity:1}100%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}
</style>
</head>
<body>

<header>
  <div class="logo-block">
    <div class="logo-brand"><span>J.R.</span> Carrozas</div>
    <div class="logo-sub">Centro de Control · GPS en Vivo</div>
  </div>
  <div class="header-spacer"></div>
  <div class="demo-badge" id="demo-badge">⚠ DEMO</div>
  <div class="stat-chips">
    <div class="stat-chip active" id="chip-active">● 0 en ruta</div>
    <div class="stat-chip idle"   id="chip-idle">○ 0 sin señal</div>
  </div>
  <div class="live-badge">
    <div class="live-dot"></div>
    <span id="live-label">EN VIVO</span>
  </div>
</header>

<div class="app-body">
  <aside>
    <div class="sidebar-header">
      <span class="sidebar-title">Vehículos</span>
      <button class="refresh-btn" id="refresh-btn" onclick="manualRefresh()">↻ Actualizar</button>
    </div>
    <div class="vehicle-list" id="vehicle-list">
      <div class="empty-state">
        <div class="icon">🛰️</div>
        <p>Cargando posiciones GPS…</p>
      </div>
    </div>
    <div class="countdown-bar">
      <span>próxima actualización</span>
      <div class="countdown-track">
        <div class="countdown-fill" id="countdown-fill" style="width:100%"></div>
      </div>
      <span id="countdown-secs">20s</span>
    </div>
  </aside>
  <div id="map"></div>
</div>

<div id="toast-container"></div>

<!-- ══════════════════════════════════════════════
     DB.js — conector J.R. Carrozas (incrustado)
     Versión integral v10.3 compatible con este panel
     ══════════════════════════════════════════════ -->
<script>
// ─────────────────────────────────────────────
//  CONFIGURACIÓN CENTRAL — un solo lugar
// ─────────────────────────────────────────────
const CONFIG = {
  REFRESH_MS:     20_000,
  MAX_TRAIL:      30,
  CENTER_DEFAULT: [-4.535, -75.674],
  ZOOM_DEFAULT:   13,
  STALE_MIN:      5,          // minutos sin señal → offline
};

// ─────────────────────────────────────────────
//  DB.js (versión idéntica a db.js del proyecto)
//  Campos GPS_LIVE:
//    id_salida | placa | lat | lng | precision | timestamp
//  Campos adicionales leídos desde hoja Traslado:
//    conductor | servicio (motivo_de_salida) — se unen por id_salida
// ─────────────────────────────────────────────
const URL_GAS = "https://script.google.com/macros/s/AKfycbx9wr5Od2WgVF2vSSW93OcMmxDoSXs3PLaE7jo44j4rUFElagX4OKNDRy9mqjPpJZWZ/exec";

const SHEET_MAP = {
  carrozas:'carrozas', Traslado:'Traslado', Averias:'Averias',
  usuarios:'usuarios', Llegadas:'Llegadas', mantenimientos:'mantenimientos',
  solicitud_apoyo:'solicitud_apoyo', notificaciones_apoyo:'notificaciones_apoyo',
  config:'config', gps_live:'gps_live',
};

function resolveSheet(name){ return SHEET_MAP[name] || name; }

async function gasGet(sheetName){
  try{
    const url  = `${URL_GAS}?sheetName=${encodeURIComponent(resolveSheet(sheetName))}`;
    const resp = await fetch(url,{method:'GET',redirect:'follow'});
    if(!resp.ok){ console.warn(`gasGet ${sheetName}: HTTP ${resp.status}`); return []; }
    const json = await resp.json();
    if(json && json.error){ console.warn(`gasGet ${sheetName}:`,json.error); return []; }
    return Array.isArray(json)?json:[];
  }catch(err){ console.warn(`gasGet ${sheetName}:`,err.message); return []; }
}

async function gasWrite(sheetName, payload, action='insert', idCol='', idValue=''){
  const p = new URLSearchParams({sheetName:resolveSheet(sheetName),action});
  if(idCol)   p.set('idCol',idCol);
  if(idValue) p.set('idValue',idValue);
  try{
    const resp = await fetch(`${URL_GAS}?${p}`,{
      method:'POST', redirect:'follow',
      headers:{'Content-Type':'text/plain'},
      body:JSON.stringify(payload),
    });
    if(!resp.ok) return {ok:false,error:`HTTP ${resp.status}`};
    const text = await resp.text();
    let json; try{ json=JSON.parse(text); }catch(e){ return {ok:false,error:'No JSON: '+text.slice(0,100)}; }
    if(json.ok===false) return {ok:false,error:json.error||'Error desconocido'};
    return {ok:true,data:json};
  }catch(err){ return {ok:false,error:err.message}; }
}

// Objeto DB (subconjunto necesario para el panel GPS)
const DB = {
  async obtenerTodosPosicionesLive(){
    try{
      const rows = await gasGet('gps_live');
      return {ok:true, data:rows};
    }catch(e){ return {ok:false, data:[], error:e.message}; }
  },
  async obtenerTrasladosRecientes(limite=200){
    try{
      let data = await gasGet('Traslado');
      return {ok:true, data};
    }catch(e){ return {ok:false, data:[], error:e.message}; }
  },
};

// ─────────────────────────────────────────────
//  ESTADO DEL PANEL
// ─────────────────────────────────────────────
const state = {
  vehicles: {},     // { id_salida: { data, marker, polyline, trail } }
  traslados: {},    // { id_salida: { conductor, servicio } } — cache
  selected: null,
  countdown: CONFIG.REFRESH_MS / 1000,
  timer: null,
  cTimer: null,
  demoMode: false,
};

// ─────────────────────────────────────────────
//  MAPA
// ─────────────────────────────────────────────
const map = L.map('map',{
  center: CONFIG.CENTER_DEFAULT,
  zoom:   CONFIG.ZOOM_DEFAULT,
  zoomControl: true,
  preferCanvas: true,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
  attribution:'&copy; OSM &copy; CARTO',
  subdomains:'abcd', maxZoom:19,
}).addTo(map);

// ─────────────────────────────────────────────
//  ICONO
// ─────────────────────────────────────────────
function makeIcon(plate, isStale){
  const color  = isStale ? '#6b7280' : '#e63946';
  const shadow = isStale ? 'rgba(107,114,128,.4)' : 'rgba(230,57,70,.6)';
  return L.divIcon({
    className:'',
    html:`<div style="position:relative;display:flex;flex-direction:column;align-items:center">
      ${!isStale?`<div style="position:absolute;width:64px;height:64px;border-radius:50%;background:rgba(230,57,70,.25);top:50%;left:50%;transform:translate(-50%,-50%);animation:pulse 2s ease-out infinite"></div>`:''}
      <div style="width:42px;height:42px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 3px 16px ${shadow};z-index:1">🚗</div>
      <div style="background:rgba(10,12,16,.85);color:white;font-family:monospace;font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;margin-top:3px;border:1px solid ${color};letter-spacing:.5px;white-space:nowrap">${plate||'—'}</div>
    </div>`,
    iconSize:[42,60], iconAnchor:[21,30], popupAnchor:[0,-34],
  });
}

// ─────────────────────────────────────────────
//  DEMO — cuando la API no responde
// ─────────────────────────────────────────────
let _demoAngle = 0;
function getDemoData(){
  _demoAngle += 0.015;
  const b = {lat:-4.535,lng:-75.674};
  return [
    {
      id_salida:'S-001', placa:'ICQ 333',
      conductor:'Záidar J. Buitragoa', servicio:'Jardines de Armenia',
      lat:String(b.lat + Math.sin(_demoAngle)*0.015),
      lng:String(b.lng + Math.cos(_demoAngle)*0.015),
      precision:'8', timestamp:new Date().toISOString(),
    },
    {
      id_salida:'S-002', placa:'ABC 789',
      conductor:'Carlos Medina', servicio:'Parque Memorial',
      lat:String(b.lat + Math.sin(_demoAngle+2)*0.012),
      lng:String(b.lng + Math.cos(_demoAngle+2)*0.012),
      precision:'12',
      timestamp:new Date(Date.now()-8*60_000).toISOString(),
    },
  ];
}

// ─────────────────────────────────────────────
//  ENRIQUECER FILAS GPS con datos del Traslado
//  La hoja gps_live solo guarda: id_salida, placa,
//  lat, lng, precision, timestamp.
//  El conductor y servicio vienen de Traslado.
// ─────────────────────────────────────────────
async function cargarCacheTraslados(){
  const res = await DB.obtenerTrasladosRecientes(500);
  if(!res.ok) return;
  state.traslados = {};
  (res.data||[]).forEach(t => {
    const id = String(t.id_salida||'').trim();
    if(id) state.traslados[id] = {
      conductor: t.conductor || '',
      servicio:  t.motivo_de_salida || t.servicio || '',
    };
  });
}

function enriquecer(row){
  const id    = String(row.id_salida||'').trim();
  const extra = state.traslados[id] || {};
  return {
    ...row,
    conductor: row.conductor || extra.conductor || 'Desconocido',
    servicio:  row.servicio  || extra.servicio  || '—',
  };
}

// ─────────────────────────────────────────────
//  FETCH GPS — usa DB.obtenerTodosPosicionesLive
// ─────────────────────────────────────────────
async function fetchGPS(){
  try{
    const res = await DB.obtenerTodosPosicionesLive();
    if(!res.ok) throw new Error(res.error || 'Sin datos');
    const rows = res.data || [];
    if(rows.length === 0 && !state.demoMode) throw new Error('empty');
    state.demoMode = false;
    document.getElementById('demo-badge').classList.remove('visible');
    return rows.map(enriquecer);
  }catch(e){
    console.warn('GPS fetch error:', e.message);
    // Activar modo demo silenciosamente
    if(!state.demoMode){
      state.demoMode = true;
      document.getElementById('demo-badge').classList.add('visible');
      showToast('Modo DEMO — conecta la hoja gps_live para datos reales', 'warn');
    }
    return getDemoData();
  }
}

// ─────────────────────────────────────────────
//  RENDERIZAR MARCADORES
// ─────────────────────────────────────────────
function updateMap(rows){
  const now = Date.now();
  let activeCount=0, idleCount=0;

  rows.forEach(row => {
    const id  = String(row.id_salida||'').trim();
    const lat = parseFloat(row.lat);
    const lng = parseFloat(row.lng);
    if(!id || isNaN(lat) || isNaN(lng)) return;

    const ts    = row.timestamp ? new Date(row.timestamp).getTime() : 0;
    const stale = (now - ts) > CONFIG.STALE_MIN * 60_000;
    stale ? idleCount++ : activeCount++;

    const latlng = L.latLng(lat, lng);

    if(!state.vehicles[id]){
      const marker   = L.marker(latlng,{icon:makeIcon(row.placa||id,stale)}).addTo(map);
      const polyline = L.polyline([],{color:'#e63946',weight:2,opacity:.5,dashArray:'4 6'}).addTo(map);
      state.vehicles[id] = {data:row, marker, polyline, trail:[latlng]};
      bindPopup(id, row, stale);
    } else {
      const v = state.vehicles[id];
      v.data  = row;
      animateMarker(v.marker, v.marker.getLatLng(), latlng, 1200);
      v.marker.setIcon(makeIcon(row.placa||id, stale));
      v.trail.push(latlng);
      if(v.trail.length > CONFIG.MAX_TRAIL) v.trail.shift();
      v.polyline.setLatLngs(v.trail);
      bindPopup(id, row, stale);
    }

    if(state.selected === id)
      map.panTo(latlng,{animate:true,duration:.8});
  });

  updateChips(activeCount, idleCount);
  renderSidebar();
}

function animateMarker(marker, from, to, duration){
  const start = performance.now();
  (function step(now){
    const t    = Math.min(1,(now-start)/duration);
    const ease = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    marker.setLatLng([from.lat+(to.lat-from.lat)*ease, from.lng+(to.lng-from.lng)*ease]);
    if(t<1) requestAnimationFrame(step);
  })(performance.now());
}

function bindPopup(id, row, stale){
  const v   = state.vehicles[id];
  const age = row.timestamp ? formatAge(new Date(row.timestamp)) : '—';
  v.marker.bindPopup(`
    <div class="popup-plate">${row.placa||id}</div>
    <div class="popup-driver">${row.conductor||'Conductor desconocido'}</div>
    <hr class="popup-divider">
    <div class="popup-row"><span class="popup-label">SERVICIO</span><span class="popup-val" style="color:var(--text);font-size:10px">${row.servicio||'—'}</span></div>
    <div class="popup-row"><span class="popup-label">ESTADO</span><span class="popup-val" style="color:inherit">${stale?'🔴 Sin señal':'🟢 En ruta'}</span></div>
    <div class="popup-row"><span class="popup-label">COORDS</span><span class="popup-val">${parseFloat(row.lat).toFixed(5)}, ${parseFloat(row.lng).toFixed(5)}</span></div>
    <div class="popup-row"><span class="popup-label">PRECISIÓN</span><span class="popup-val" style="color:var(--yellow)">±${Math.round(row.precision||0)}m</span></div>
    <div class="popup-row"><span class="popup-label">ACTUALIZADO</span><span class="popup-val">${age}</span></div>
  `,{maxWidth:240});
}

// ─────────────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────────────
function renderSidebar(){
  const list = document.getElementById('vehicle-list');
  const ids  = Object.keys(state.vehicles);
  if(!ids.length){
    list.innerHTML=`<div class="empty-state"><div class="icon">🛰️</div><p>No hay vehículos activos.<br>Verifica la hoja gps_live.</p></div>`;
    return;
  }
  list.innerHTML = ids.map(id => {
    const v     = state.vehicles[id];
    const row   = v.data;
    const stale = checkStale(row);
    const age   = row.timestamp ? formatAge(new Date(row.timestamp)) : '—';
    const sel   = state.selected===id ? 'selected' : '';
    return `
    <div class="vcard ${sel}" id="vcard-${id}" onclick="selectVehicle('${id}')">
      <div class="vcard-top">
        <div class="vcard-plate">${row.placa||id}</div>
        <div class="status-pill ${stale?'offline':'en-ruta'}">${stale?'SIN SEÑAL':'EN RUTA'}</div>
      </div>
      <div class="vcard-driver">🧑 ${row.conductor||'Desconocido'}</div>
      <div class="vcard-service">📍 ${row.servicio||'—'}</div>
      <div class="vcard-coords">
        <div class="coord-dot"></div>
        ${parseFloat(row.lat).toFixed(5)}, ${parseFloat(row.lng).toFixed(5)}
      </div>
      <div class="vcard-meta">
        <div>
          <div class="vcard-time">⏱ ${age}</div>
          ${row.precision?`<div class="vcard-precision">±${Math.round(row.precision)}m</div>`:''}
        </div>
        <button class="center-btn" onclick="event.stopPropagation();centerOn('${id}')">📍 Centrar</button>
      </div>
    </div>`;
  }).join('');
}

function updateChips(active,idle){
  document.getElementById('chip-active').textContent=`● ${active} en ruta`;
  document.getElementById('chip-idle').textContent=`○ ${idle} sin señal`;
}

function selectVehicle(id){
  state.selected = state.selected===id ? null : id;
  renderSidebar();
  if(state.selected) centerOn(id);
}

function centerOn(id){
  const v = state.vehicles[id];
  if(!v) return;
  map.flyTo(v.marker.getLatLng(),15,{animate:true,duration:1.2});
  v.marker.openPopup();
}

// ─────────────────────────────────────────────
//  LOOP PRINCIPAL
// ─────────────────────────────────────────────
async function refresh(){
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');

  // Cada 5 ciclos (~100s) recargamos el cache de traslados para
  // mantener conductor/servicio actualizados sin saturar la API.
  refresh._cycle = (refresh._cycle||0) + 1;
  if(refresh._cycle % 5 === 1) await cargarCacheTraslados();

  const rows = await fetchGPS();
  btn.classList.remove('spinning');
  if(rows && rows.length >= 0){
    updateMap(rows);
    const t = new Date();
    document.getElementById('live-label').textContent =
      `EN VIVO · ${t.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  }
  resetCountdown();
}

function resetCountdown(){
  state.countdown = CONFIG.REFRESH_MS/1000;
  clearInterval(state.cTimer);
  state.cTimer = setInterval(()=>{
    state.countdown--;
    const pct = (state.countdown/(CONFIG.REFRESH_MS/1000))*100;
    document.getElementById('countdown-fill').style.width = pct+'%';
    document.getElementById('countdown-secs').textContent = state.countdown+'s';
    if(state.countdown<=0) clearInterval(state.cTimer);
  },1000);
}

function scheduleNext(){
  state.timer = setTimeout(()=>refresh().then(scheduleNext), CONFIG.REFRESH_MS);
}

function manualRefresh(){
  clearTimeout(state.timer);
  refresh().then(scheduleNext);
}

// ─────────────────────────────────────────────
//  UTILIDADES
// ─────────────────────────────────────────────
function checkStale(row){
  if(!row.timestamp) return true;
  return Date.now()-new Date(row.timestamp).getTime() > CONFIG.STALE_MIN*60_000;
}

function formatAge(date){
  const d = Math.floor((Date.now()-date.getTime())/1000);
  if(d<60)   return `hace ${d}s`;
  if(d<3600) return `hace ${Math.floor(d/60)}min`;
  return `hace ${Math.floor(d/3600)}h`;
}

function showToast(msg,type='info'){
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className=`toast ${type}`; t.textContent=msg; c.appendChild(t);
  setTimeout(()=>t.remove(),4500);
}

// ─────────────────────────────────────────────
//  INICIO
// ─────────────────────────────────────────────
(async ()=>{
  await cargarCacheTraslados();   // precarga conductor/servicio
  await refresh();
  scheduleNext();
})();
</script>
</body>
</html>
