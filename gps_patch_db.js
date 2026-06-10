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
:root{
  --bg:#f5f6f8;--surface:#ffffff;--border:#e2e5ea;
  --accent:#e63946;--accent2:#c1121f;
  --green:#0b9e8e;--yellow:#d4930a;
  --text:#1a1d23;--muted:#6b7280;--card:#ffffff;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);height:100dvh;display:flex;flex-direction:column;overflow:hidden}

/* HEADER */
header{display:flex;align-items:center;gap:16px;padding:12px 20px;background:var(--surface);border-bottom:1px solid var(--border);z-index:1000;flex-shrink:0}
.logo-brand{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.5px}
.logo-brand span{color:var(--accent)}
.logo-sub{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-top:3px}
.hspacer{flex:1}
.live-badge{display:flex;align-items:center;gap:6px;background:rgba(11,158,142,.1);border:1px solid rgba(11,158,142,.35);border-radius:20px;padding:5px 12px;font-family:'DM Mono',monospace;font-size:11px;color:var(--green);font-weight:500}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:blink 1.2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.stat-chips{display:flex;gap:8px}
.chip{padding:5px 12px;border-radius:20px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;border:1px solid var(--border);background:var(--card)}
.chip.active{border-color:rgba(230,57,70,.4);color:var(--accent2)}
.chip.idle{color:var(--muted)}
.err-badge{background:rgba(230,57,70,.1);border:1px solid rgba(230,57,70,.3);border-radius:20px;padding:5px 12px;font-family:'DM Mono',monospace;font-size:10px;color:var(--accent2);display:none;align-items:center;gap:5px}
.err-badge.on{display:flex}

/* LAYOUT */
.app-body{display:flex;flex:1;overflow:hidden}

/* SIDEBAR */
aside{width:300px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}
.sb-head{padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.sb-title{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.ref-btn{background:none;border:1px solid var(--border);color:var(--muted);border-radius:6px;padding:5px 11px;font-size:11px;cursor:pointer;font-family:'DM Mono',monospace;transition:all .2s;display:flex;align-items:center;gap:6px}
.ref-btn:hover{border-color:var(--accent);color:var(--accent)}
.ref-btn svg{transition:transform .6s}
.ref-btn.spin svg{animation:rot .6s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}

.vlist{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.vlist::-webkit-scrollbar{width:4px}
.vlist::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* VEHICLE CARD */
.vcard{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.vcard-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px}
.vcard:hover,.vcard.sel{border-color:rgba(230,57,70,.4);background:#fff8f8}
.vc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
.vc-plate{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px}
.pill{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px}
.pill.on{background:rgba(230,57,70,.15);border:1px solid rgba(230,57,70,.35);color:var(--accent2)}
.pill.off{background:rgba(107,114,128,.1);border:1px solid rgba(107,114,128,.2);color:var(--muted)}
.vc-driver{font-size:12px;color:var(--muted);margin-bottom:5px}
.vc-svc{font-size:11px;opacity:.8;margin-bottom:9px}
.vc-coords{font-family:'DM Mono',monospace;font-size:10px;color:var(--green);background:rgba(11,158,142,.07);padding:5px 8px;border-radius:5px;margin-bottom:8px;display:flex;gap:8px;align-items:center}
.cdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.vc-trail{font-family:'DM Mono',monospace;font-size:9px;padding:3px 8px;border-radius:4px;margin-bottom:8px;display:inline-block;opacity:.85}
.vc-foot{display:flex;justify-content:space-between;align-items:flex-end}
.vc-times{display:flex;flex-direction:column;gap:3px}
.vc-age{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted)}
.vc-speed{font-family:'DM Mono',monospace;font-size:9px;color:var(--green)}
.btn-row{display:flex;gap:4px}
.btn-sm{font-family:'DM Mono',monospace;font-size:9px;padding:4px 9px;border-radius:5px;cursor:pointer;transition:all .2s;letter-spacing:.5px;text-transform:uppercase;border:1px solid}
.btn-center{background:rgba(230,57,70,.1);border-color:rgba(230,57,70,.25);color:var(--accent2)}
.btn-center:hover{background:rgba(230,57,70,.2)}
.btn-trail{background:rgba(11,158,142,.08);border-color:rgba(11,158,142,.25);color:var(--green)}
.btn-trail:hover{background:rgba(11,158,142,.2)}
.btn-trail.off{background:rgba(107,114,128,.07);border-color:rgba(107,114,128,.2);color:var(--muted)}

/* COUNTDOWN */
.cd-bar{padding:10px 16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)}
.cd-track{flex:1;height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.cd-fill{height:100%;background:var(--green);border-radius:2px;transition:width 1s linear}

/* MAP */
#map{flex:1;background:#0d1117}
.leaflet-control-attribution{display:none!important}
.leaflet-control-zoom a{background:var(--surface)!important;color:var(--text)!important;border-color:var(--border)!important}
.leaflet-popup-content-wrapper{background:var(--surface)!important;border:1px solid var(--border)!important;border-radius:10px!important;color:var(--text)!important;box-shadow:0 8px 32px rgba(0,0,0,.12)!important}
.leaflet-popup-tip{background:var(--surface)!important}
.leaflet-popup-content{margin:14px 16px!important;min-width:200px}
.pp{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:4px}
.pp-sub{font-size:12px;color:var(--muted);margin-bottom:8px}
.pp-row{display:flex;justify-content:space-between;margin-bottom:4px}
.pp-lbl{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)}
.pp-val{font-family:'DM Mono',monospace;font-size:10px;color:var(--green)}
.pp-hr{border:none;border-top:1px solid var(--border);margin:8px 0}

/* TOAST */
#toasts{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:9999}
.toast{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--green);padding:10px 16px;border-radius:8px;font-size:12px;max-width:280px;animation:tIn .3s ease;box-shadow:0 4px 20px rgba(0,0,0,.1)}
.toast.warn{border-left-color:var(--yellow)}
.toast.err{border-left-color:var(--accent)}
@keyframes tIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}

/* EMPTY */
.empty{display:flex;flex-direction:column;align-items:center;padding:40px 20px;gap:12px;color:var(--muted);text-align:center}
.empty .ico{font-size:40px;opacity:.4}
.empty p{font-size:12px;line-height:1.6}

/* PULSE */
@keyframes pulse{0%{transform:translate(-50%,-50%) scale(.5);opacity:1}100%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}

/* LOGIN OVERLAY */
#login-overlay{position:fixed;inset:0;background:rgba(8,10,16,.85);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:9000}
.login-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:36px 32px;width:340px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.login-logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px}
.login-logo span{color:var(--accent)}
.login-sub{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:28px}
.login-box label{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:6px}
.login-box input{width:100%;border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:'DM Mono',monospace;font-size:12px;background:var(--bg);color:var(--text);outline:none;margin-bottom:16px;transition:border-color .2s}
.login-box input:focus{border-color:var(--accent)}
.login-btn{width:100%;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:12px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:background .2s;margin-top:4px}
.login-btn:hover{background:var(--accent2)}
.login-btn:disabled{opacity:.5;cursor:not-allowed}
.login-err{font-size:11px;color:var(--accent2);margin-top:10px;text-align:center;min-height:16px}
.login-info{font-size:11px;color:var(--muted);margin-top:14px;text-align:center;line-height:1.5}
</style>
</head>
<body>

<!-- LOGIN OVERLAY -->
<div id="login-overlay">
  <div class="login-box">
    <div class="login-logo"><span>J.R.</span> Carrozas</div>
    <div class="login-sub">Centro de Control · GPS en Vivo</div>
    <label for="li-user">Correo electrónico</label>
    <input id="li-user" type="email" placeholder="usuario@email.com" value="Calidadoperacional@gmail.com">
    <label for="li-pass">Contraseña</label>
    <input id="li-pass" type="password" placeholder="••••••••" value="123456">
    <button class="login-btn" id="login-btn" onclick="doLogin()">Ingresar al panel</button>
    <div class="login-err" id="login-err"></div>
    <div class="login-info">Conectando con DriveGPS · ingreso.drivegps.com.co</div>
  </div>
</div>

<header>
  <div>
    <div class="logo-brand"><span>J.R.</span> Carrozas</div>
    <div class="logo-sub">Centro de Control · GPS en Vivo</div>
  </div>
  <div class="hspacer"></div>
  <div class="err-badge" id="err-badge">⚠ SIN CONEXIÓN</div>
  <div class="stat-chips">
    <div class="chip active" id="chip-on">● 0 en ruta</div>
    <div class="chip idle"   id="chip-off">○ 0 sin señal</div>
  </div>
  <div class="live-badge"><div class="live-dot"></div><span id="live-lbl">EN VIVO</span></div>
</header>

<div class="app-body">
  <aside>
    <div class="sb-head">
      <span class="sb-title">Vehículos</span>
      <button class="ref-btn" id="ref-btn" onclick="manualRefresh()">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        Actualizar
      </button>
    </div>
    <div class="vlist" id="vlist">
      <div class="empty"><div class="ico">🛰️</div><p>Iniciando sesión…</p></div>
    </div>
    <div class="cd-bar">
      <span>próxima actualización</span>
      <div class="cd-track"><div class="cd-fill" id="cd-fill" style="width:100%"></div></div>
      <span id="cd-secs">30s</span>
    </div>
  </aside>
  <div id="map"></div>
</div>
<div id="toasts"></div>

<script>
// ══════════════════════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════════════════════
const CFG = {
  BASE_URL:    'https://ingreso.drivegps.com.co',
  REFRESH_MS:  30_000,
  CENTER:      [4.535, -75.674],   // Colombia (Eje Cafetero aprox)
  ZOOM:        13,
  STALE_MIN:   10,
  COLORS: ['#e63946','#2a9d8f','#f4a261','#8338ec','#3a86ff','#fb8500','#06d6a0','#ef476f'],
};

// ══════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ══════════════════════════════════════════════════════
const S = {
  hash:      null,
  vehicles:  {},
  selected:  null,
  countdown: CFG.REFRESH_MS / 1000,
  loopTimer: null,
  cdTimer:   null,
  colorIdx:  0,
};

// ══════════════════════════════════════════════════════
//  MAPA
// ══════════════════════════════════════════════════════
const map = L.map('map',{center:CFG.CENTER, zoom:CFG.ZOOM, preferCanvas:true});
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
  subdomains:'abcd', maxZoom:19,
}).addTo(map);

// ══════════════════════════════════════════════════════
//  ICONO SVG
// ══════════════════════════════════════════════════════
function makeIcon(label, stale, color) {
  const c = stale ? '#6b7280' : color;
  const s = stale ? 'rgba(107,114,128,.4)' : c + '99';
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;position:relative">
      ${!stale ? `<div style="position:absolute;width:58px;height:58px;border-radius:50%;background:${c}30;top:50%;left:50%;transform:translate(-50%,-50%);animation:pulse 2s ease-out infinite"></div>` : ''}
      <div style="width:38px;height:38px;background:${c};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;border:3px solid #fff;box-shadow:0 3px 14px ${s};z-index:1">🚗</div>
      <div style="background:rgba(8,10,14,.88);color:#fff;font-family:monospace;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;margin-top:3px;border:1px solid ${c};letter-spacing:.5px;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis">${label||'—'}</div>
    </div>`,
    iconSize:[38,56], iconAnchor:[19,28], popupAnchor:[0,-30],
  });
}

// ══════════════════════════════════════════════════════
//  LOGIN — API Navixy/DriveGPS
//  POST /v2/user/auth  { login, password }
//  → { success:true, hash:"..." }
// ══════════════════════════════════════════════════════
async function doLogin() {
  const btn  = document.getElementById('login-btn');
  const err  = document.getElementById('login-err');
  const user = document.getElementById('li-user').value.trim();
  const pass = document.getElementById('li-pass').value.trim();

  if (!user || !pass) { err.textContent = 'Ingresa correo y contraseña.'; return; }
  btn.disabled = true;
  btn.textContent = 'Conectando…';
  err.textContent = '';

  try {
    // Intentamos primero con /v2/user/auth (Navixy estándar)
    const res = await apiFetch('/v2/user/auth', { login: user, password: pass }, false);

    if (res && res.success && res.hash) {
      S.hash = res.hash;
      document.getElementById('login-overlay').style.display = 'none';
      toast('Conectado a DriveGPS ✓', 'info');
      await refresh();
      scheduleNext();
    } else {
      const msg = res && res.status
        ? codeMsg(res.status)
        : (res && res.error ? res.error : 'Credenciales incorrectas.');
      err.textContent = msg;
      btn.disabled = false;
      btn.textContent = 'Ingresar al panel';
    }
  } catch(e) {
    err.textContent = 'Error de conexión: ' + e.message;
    btn.disabled = false;
    btn.textContent = 'Ingresar al panel';
  }
}

function codeMsg(code) {
  const m = { 4:'Credenciales inválidas.', 5:'Hash inválido.', 101:'No tienes permisos.', 201:'Objeto no encontrado.', 236:'Usuario/contraseña incorrectos.' };
  return m[code] || `Error ${code}`;
}

// Enter en inputs
document.getElementById('li-user').addEventListener('keydown', e => e.key==='Enter' && document.getElementById('li-pass').focus());
document.getElementById('li-pass').addEventListener('keydown', e => e.key==='Enter' && doLogin());

// ══════════════════════════════════════════════════════
//  FETCH HELPER (Navixy REST)
//  POST a BASE_URL + path con body JSON
// ══════════════════════════════════════════════════════
async function apiFetch(path, body = {}, addHash = true) {
  const payload = addHash ? { ...body, hash: S.hash } : body;
  const r = await fetch(CFG.BASE_URL + path, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

// ══════════════════════════════════════════════════════
//  OBTENER LISTA DE TRACKERS + ÚLTIMAS POSICIONES
//  /v2/tracker/list  →  array de trackers
//  /v2/tracker/get_last_gps_point  →  posición de uno
// ══════════════════════════════════════════════════════
async function fetchTrackers() {
  // 1. Lista completa de trackers
  const listRes = await apiFetch('/v2/tracker/list', {});
  if (!listRes || !listRes.success) throw new Error('tracker/list falló: ' + JSON.stringify(listRes));

  const trackers = listRes.list || [];
  if (!trackers.length) return [];

  // 2. Últimas posiciones en paralelo
  const posResults = await Promise.allSettled(
    trackers.map(t =>
      apiFetch('/v2/tracker/get_last_gps_point', { tracker_id: t.id })
        .then(r => ({ tracker: t, gps: r && r.success ? r.value : null }))
        .catch(() => ({ tracker: t, gps: null }))
    )
  );

  return posResults
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(v => v.gps && v.gps.lat != null && v.gps.lng != null);
}

// ══════════════════════════════════════════════════════
//  ACTUALIZAR MAPA
// ══════════════════════════════════════════════════════
function updateMap(entries) {
  const now = Date.now();
  let active = 0, idle = 0;

  entries.forEach(({ tracker, gps }) => {
    const id    = String(tracker.id);
    const lat   = parseFloat(gps.lat);
    const lng   = parseFloat(gps.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    // Timestamp: puede venir como "2024-06-10 14:32:00" o Unix
    let ts = 0;
    if (gps.get_time) {
      ts = typeof gps.get_time === 'number'
        ? gps.get_time * 1000
        : new Date(gps.get_time.replace(' ', 'T')).getTime();
    }
    const stale = ts ? (now - ts) > CFG.STALE_MIN * 60_000 : false;
    stale ? idle++ : active++;

    const label = tracker.label || tracker.source?.device_id || id;
    const ll    = L.latLng(lat, lng);

    if (!S.vehicles[id]) {
      const color    = CFG.COLORS[S.colorIdx++ % CFG.COLORS.length];
      const polyline = L.polyline([ll], { color, weight:3, opacity:.8 }).addTo(map);
      const startDot = L.circleMarker(ll, {
        radius:5, color:'#fff', fillColor:color, fillOpacity:1, weight:2,
      }).addTo(map).bindTooltip('Inicio', { permanent:false, direction:'top' });
      const marker   = L.marker(ll, {
        icon: makeIcon(label, stale, color), zIndexOffset:1000,
      }).addTo(map);

      S.vehicles[id] = { tracker, gps, trail:[ll], prevLL:ll, marker, polyline, startDot, color, showTrail:true };
      bindPopup(id, tracker, gps, stale, 1);

    } else {
      const v    = S.vehicles[id];
      const prev = v.trail[v.trail.length - 1];
      const dist = map.distance(prev, ll);
      if (dist > 5) {
        v.trail.push(ll);
        if (v.showTrail) v.polyline.setLatLngs(v.trail);
      }
      animateMarker(v.marker, v.prevLL, ll, 1000);
      v.marker.setIcon(makeIcon(label, stale, v.color));
      v.gps     = gps;
      v.tracker = tracker;
      v.prevLL  = ll;
      bindPopup(id, tracker, gps, stale, v.trail.length);
      if (S.selected === id) map.panTo(ll, { animate:true, duration:.8 });
    }
  });

  document.getElementById('chip-on').textContent  = `● ${active} en ruta`;
  document.getElementById('chip-off').textContent = `○ ${idle} sin señal`;
  renderSidebar();
}

function animateMarker(marker, from, to, ms) {
  const start = performance.now();
  (function step(now) {
    const t = Math.min(1, (now-start)/ms);
    const e = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    marker.setLatLng([from.lat+(to.lat-from.lat)*e, from.lng+(to.lng-from.lng)*e]);
    if (t<1) requestAnimationFrame(step);
  })(performance.now());
}

function bindPopup(id, tracker, gps, stale, pts) {
  const v     = S.vehicles[id];
  const label = tracker.label || id;
  const lat   = parseFloat(gps.lat).toFixed(5);
  const lng   = parseFloat(gps.lng).toFixed(5);
  const age   = gps.get_time ? formatAge(parseGpsTime(gps.get_time)) : '—';
  const speed = gps.speed != null ? `${Math.round(gps.speed)} km/h` : '—';
  v.marker.bindPopup(`
    <div class="pp">${label}</div>
    <div class="pp-sub">${tracker.source?.device_id || 'ID: ' + tracker.id}</div>
    <hr class="pp-hr">
    <div class="pp-row"><span class="pp-lbl">ESTADO</span><span class="pp-val">${stale?'🔴 Sin señal':'🟢 En ruta'}</span></div>
    <div class="pp-row"><span class="pp-lbl">COORDS</span><span class="pp-val">${lat}, ${lng}</span></div>
    <div class="pp-row"><span class="pp-lbl">VELOCIDAD</span><span class="pp-val">${speed}</span></div>
    <div class="pp-row"><span class="pp-lbl">PUNTOS RUTA</span><span class="pp-val">${pts}</span></div>
    <div class="pp-row"><span class="pp-lbl">ACTUALIZADO</span><span class="pp-val">${age}</span></div>
  `, { maxWidth:240 });
}

// ══════════════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════════════
function renderSidebar() {
  const list = document.getElementById('vlist');
  const ids  = Object.keys(S.vehicles);
  if (!ids.length) {
    list.innerHTML = `<div class="empty"><div class="ico">🛰️</div><p>No hay vehículos disponibles.</p></div>`;
    return;
  }
  list.innerHTML = ids.map(id => {
    const v     = S.vehicles[id];
    const { tracker, gps } = v;
    const label = tracker.label || id;
    const lat   = parseFloat(gps.lat).toFixed(5);
    const lng   = parseFloat(gps.lng).toFixed(5);
    const stale = gps.get_time ? ((Date.now() - parseGpsTime(gps.get_time).getTime()) > CFG.STALE_MIN * 60_000) : false;
    const age   = gps.get_time ? formatAge(parseGpsTime(gps.get_time)) : '—';
    const speed = gps.speed != null ? `${Math.round(gps.speed)} km/h` : null;
    const pts   = v.trail.length;
    return `
    <div class="vcard${S.selected===id?' sel':''}" id="vc-${id}" onclick="selectVehicle('${id}')">
      <div class="vcard-bar" style="background:${v.color}"></div>
      <div class="vc-top">
        <div class="vc-plate" style="color:${v.color}">${label}</div>
        <div class="pill ${stale?'off':'on'}">${stale?'SIN SEÑAL':'EN RUTA'}</div>
      </div>
      <div class="vc-driver">🆔 ID Tracker: ${tracker.id}</div>
      <div class="vc-coords">
        <div class="cdot" style="background:${v.color}"></div>
        ${lat}, ${lng}
      </div>
      <div class="vc-trail" style="background:${v.color}18;border:1px solid ${v.color}44;color:${v.color}">
        🛤 ${pts} punto${pts!==1?'s':''} de ruta
      </div>
      <div class="vc-foot">
        <div class="vc-times">
          <div class="vc-age">⏱ ${age}</div>
          ${speed ? `<div class="vc-speed">🚀 ${speed}</div>` : ''}
        </div>
        <div class="btn-row">
          <button class="btn-sm btn-trail${v.showTrail?'':' off'}"
            onclick="event.stopPropagation();toggleTrail('${id}')">
            ${v.showTrail?'🛤 ON':'🛤 OFF'}
          </button>
          <button class="btn-sm btn-center"
            onclick="event.stopPropagation();centerOn('${id}')">📍 Ver</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function selectVehicle(id) {
  S.selected = S.selected===id ? null : id;
  renderSidebar();
  if (S.selected) centerOn(id);
}

function centerOn(id) {
  const v = S.vehicles[id];
  if (!v) return;
  if (v.showTrail && v.trail.length > 1) {
    map.fitBounds(L.latLngBounds(v.trail).pad(.15), { animate:true, maxZoom:16 });
  } else {
    map.flyTo(v.marker.getLatLng(), 15, { animate:true, duration:1.2 });
  }
  v.marker.openPopup();
}

function toggleTrail(id) {
  const v = S.vehicles[id];
  if (!v) return;
  v.showTrail = !v.showTrail;
  if (v.showTrail) {
    v.polyline.setLatLngs(v.trail);
    v.polyline.addTo(map);
    v.startDot.addTo(map);
  } else {
    v.polyline.setLatLngs([]);
    map.removeLayer(v.startDot);
  }
  renderSidebar();
}

// ══════════════════════════════════════════════════════
//  LOOP PRINCIPAL
// ══════════════════════════════════════════════════════
async function refresh() {
  if (!S.hash) return;
  const btn = document.getElementById('ref-btn');
  btn.classList.add('spin');

  try {
    const entries = await fetchTrackers();
    document.getElementById('err-badge').classList.remove('on');
    if (entries.length > 0) {
      updateMap(entries);
    } else {
      document.getElementById('vlist').innerHTML =
        `<div class="empty"><div class="ico">📡</div><p>No hay vehículos activos en DriveGPS.</p></div>`;
    }
    const t = new Date();
    document.getElementById('live-lbl').textContent =
      `EN VIVO · ${t.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  } catch(e) {
    console.error('refresh error:', e);
    document.getElementById('err-badge').classList.add('on');
    // Si el hash venció, volver al login
    if (e.message.includes('5') || e.message.includes('hash')) {
      S.hash = null;
      document.getElementById('login-overlay').style.display = 'flex';
      document.getElementById('login-err').textContent = 'Sesión expirada, inicia sesión nuevamente.';
    } else {
      toast('Error al obtener posiciones GPS: ' + e.message, 'err');
    }
  } finally {
    btn.classList.remove('spin');
    resetCD();
  }
}

function resetCD() {
  S.countdown = CFG.REFRESH_MS / 1000;
  clearInterval(S.cdTimer);
  S.cdTimer = setInterval(() => {
    S.countdown--;
    const pct = (S.countdown / (CFG.REFRESH_MS/1000)) * 100;
    document.getElementById('cd-fill').style.width  = pct + '%';
    document.getElementById('cd-secs').textContent  = S.countdown + 's';
    if (S.countdown <= 0) clearInterval(S.cdTimer);
  }, 1000);
}

function scheduleNext() {
  S.loopTimer = setTimeout(() => refresh().then(scheduleNext), CFG.REFRESH_MS);
}

function manualRefresh() {
  clearTimeout(S.loopTimer);
  refresh().then(scheduleNext);
}

// ══════════════════════════════════════════════════════
//  UTILIDADES
// ══════════════════════════════════════════════════════
function parseGpsTime(t) {
  if (typeof t === 'number') return new Date(t * 1000);
  return new Date(String(t).replace(' ', 'T'));
}

function formatAge(date) {
  if (!date || isNaN(date.getTime())) return '—';
  const d = Math.floor((Date.now() - date.getTime()) / 1000);
  if (d < 0)     return 'ahora';
  if (d < 60)    return `hace ${d}s`;
  if (d < 3600)  return `hace ${Math.floor(d/60)}min`;
  return `hace ${Math.floor(d/3600)}h`;
}

function toast(msg, type='info') {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = `toast ${type}`; t.textContent = msg; c.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}
</script>
</body>
</html>
