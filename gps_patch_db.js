<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>J.R. Carrozas · Panel GPS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#0d0f14;
  --surface:#141720;
  --surface2:#1c2030;
  --border:#252a3a;
  --accent:#e63946;
  --accent2:#c1121f;
  --green:#0db39e;
  --yellow:#f4b942;
  --text:#e8ecf4;
  --muted:#7a8299;
  --card:#181c28;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);display:flex;flex-direction:column}

/* ── HEADER ── */
header{
  display:flex;align-items:center;gap:16px;
  padding:0 20px;height:54px;flex-shrink:0;
  background:var(--surface);border-bottom:1px solid var(--border);
  z-index:100;
}
.brand{
  font-family:'Syne',sans-serif;font-size:17px;font-weight:800;letter-spacing:-.3px;
  display:flex;align-items:baseline;gap:6px;
}
.brand-jr{color:var(--accent)}
.brand-sep{width:1px;height:14px;background:var(--border);margin:0 4px}
.brand-sub{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase}
.spacer{flex:1}

.live-pill{
  display:flex;align-items:center;gap:6px;
  background:rgba(13,179,158,.1);border:1px solid rgba(13,179,158,.28);
  border-radius:20px;padding:5px 13px;
  font-family:'DM Mono',monospace;font-size:10px;color:var(--green);
}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:blink 1.4s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

.btn-open{
  display:flex;align-items:center;gap:7px;
  background:var(--accent);color:#fff;border:none;
  border-radius:8px;padding:7px 14px;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.8px;
  text-transform:uppercase;cursor:pointer;transition:background .15s;
  text-decoration:none;
}
.btn-open:hover{background:var(--accent2)}
.btn-open svg{flex-shrink:0}

/* ── LAYOUT ── */
.app{display:flex;flex:1;overflow:hidden}

/* ── SIDEBAR ── */
aside{
  width:290px;flex-shrink:0;
  background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow:hidden;
}
.sb-hd{
  padding:14px 16px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.sb-title{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase}
.stats{display:flex;gap:8px}
.stat{
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;
  padding:3px 10px;border-radius:12px;border:1px solid var(--border);
  background:var(--card);color:var(--muted);
}
.stat.act{color:var(--accent);border-color:rgba(230,57,70,.3)}

.vlist{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:7px}
.vlist::-webkit-scrollbar{width:3px}
.vlist::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* ── VEHICLE CARD ── */
.vcard{
  background:var(--card);border:1px solid var(--border);
  border-radius:10px;padding:13px;cursor:pointer;
  transition:border-color .15s,background .15s;
  border-left:3px solid var(--vc, var(--accent));
}
.vcard:hover{border-color:rgba(230,57,70,.4);background:#1e2235}
.vcard.sel{border-color:var(--vc, var(--accent));background:#1e2235}

.vc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:7px}
.vc-plate{
  font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:.5px;
}
.pill{
  font-family:'DM Mono',monospace;font-size:8px;font-weight:600;
  padding:2px 7px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px;
}
.pill-on{background:rgba(13,179,158,.15);border:1px solid rgba(13,179,158,.3);color:var(--green)}
.pill-off{background:rgba(122,130,153,.1);border:1px solid rgba(122,130,153,.2);color:var(--muted)}
.pill-svc{background:rgba(244,185,66,.12);border:1px solid rgba(244,185,66,.25);color:var(--yellow)}

.vc-name{font-size:11px;color:var(--muted);margin-bottom:3px}
.vc-svc-tag{
  font-family:'DM Mono',monospace;font-size:9px;color:var(--yellow);
  margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.vc-loc{
  font-family:'DM Mono',monospace;font-size:9px;color:var(--green);
  background:rgba(13,179,158,.07);border:1px solid rgba(13,179,158,.15);
  border-radius:5px;padding:4px 8px;margin-bottom:7px;
  display:flex;align-items:center;gap:6px;
}
.dot{width:4px;height:4px;border-radius:50%;background:var(--green);flex-shrink:0}
.vc-spd{font-size:10px;color:var(--muted);margin-bottom:8px}
.vc-foot{display:flex;justify-content:space-between;align-items:center}
.vc-age{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted)}
.btn-row{display:flex;gap:5px}
.btn-xs{
  font-family:'DM Mono',monospace;font-size:8px;padding:4px 9px;
  border-radius:5px;cursor:pointer;border:1px solid;
  text-transform:uppercase;letter-spacing:.5px;transition:all .15s;
}
.btn-ver{background:rgba(230,57,70,.12);border-color:rgba(230,57,70,.25);color:#e8616b}
.btn-ver:hover{background:rgba(230,57,70,.22)}
.btn-gps{background:rgba(13,179,158,.1);border-color:rgba(13,179,158,.25);color:var(--green)}
.btn-gps:hover{background:rgba(13,179,158,.2)}

/* empty */
.empty{
  display:flex;flex-direction:column;align-items:center;
  padding:40px 16px;gap:10px;color:var(--muted);text-align:center;
}
.empty-ico{font-size:36px;opacity:.35}
.empty-msg{font-size:11px;line-height:1.65}
.empty-hint{
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.5px;
  background:var(--surface2);border:1px solid var(--border);
  border-radius:6px;padding:8px 12px;margin-top:6px;line-height:1.7;color:var(--muted);
}

/* ── CARROZAS EN SERVICIO (collapsible) ── */
.svc-section{border-top:1px solid var(--border);flex-shrink:0;max-height:220px;display:flex;flex-direction:column}
.svc-hd{
  padding:10px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);
  user-select:none;
}
.svc-hd:hover{color:var(--text)}
.svc-hd .caret{transition:transform .2s;display:inline-block}
.svc-hd.open .caret{transform:rotate(180deg)}
.svc-body{overflow-y:auto;padding:0 10px 10px;display:flex;flex-direction:column;gap:6px}
.svc-body.collapsed{display:none}
.svc-card{
  background:var(--surface2);border:1px solid var(--border);border-radius:8px;
  padding:10px 12px;display:flex;align-items:center;gap:10px;
}
.svc-color{width:4px;height:36px;border-radius:2px;flex-shrink:0}
.svc-info{flex:1;min-width:0}
.svc-plate2{font-family:'Syne',sans-serif;font-size:13px;font-weight:700}
.svc-detail{font-size:10px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.svc-badge{font-family:'DM Mono',monospace;font-size:8px;padding:2px 6px;border-radius:10px;border:1px solid;white-space:nowrap;flex-shrink:0}

/* ── IFRAME AREA ── */
.map-area{flex:1;position:relative;overflow:hidden;background:#0d1117;display:flex;flex-direction:column}

.map-toolbar{
  position:absolute;top:14px;right:14px;z-index:10;
  display:flex;flex-direction:column;gap:8px;
}
.mtool-btn{
  display:flex;align-items:center;gap:6px;
  background:rgba(20,23,32,.9);border:1px solid var(--border);
  border-radius:8px;padding:7px 12px;
  font-family:'DM Mono',monospace;font-size:10px;color:var(--text);
  cursor:pointer;transition:all .15s;backdrop-filter:blur(8px);
  text-decoration:none;white-space:nowrap;
}
.mtool-btn:hover{border-color:var(--accent);color:var(--accent)}

.gps-frame{
  width:100%;flex:1;border:none;
  /* El iframe cargará drivegps directamente */
}

/* panel de instrucción cuando iframe no carga */
.frame-placeholder{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  flex:1;gap:20px;padding:40px;text-align:center;
}
.fp-ico{font-size:52px;opacity:.5}
.fp-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:700}
.fp-sub{font-size:13px;color:var(--muted);line-height:1.7;max-width:380px}
.fp-link{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--accent);color:#fff;border:none;
  border-radius:10px;padding:12px 22px;
  font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.8px;
  text-transform:uppercase;cursor:pointer;text-decoration:none;
  margin-top:4px;transition:background .15s;
}
.fp-link:hover{background:var(--accent2)}
.fp-note{
  font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);
  background:var(--surface2);border:1px solid var(--border);
  border-radius:8px;padding:12px 18px;line-height:1.8;max-width:420px;
  text-align:left;
}
.fp-note b{color:var(--yellow)}

/* countdown bar */
.cd-bar{
  padding:8px 16px;border-top:1px solid var(--border);
  display:flex;align-items:center;gap:10px;
  font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);
  flex-shrink:0;
}
.cd-track{flex:1;height:2px;background:var(--border);border-radius:2px;overflow:hidden}
.cd-fill{height:100%;background:var(--green);border-radius:2px;transition:width 1s linear}

/* toasts */
#toasts{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:6px;z-index:9999}
.toast{
  background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--green);
  padding:10px 15px;border-radius:8px;font-size:11px;max-width:270px;
  animation:tin .25s ease;box-shadow:0 4px 20px rgba(0,0,0,.3);color:var(--text);
}
.toast.warn{border-left-color:var(--yellow)}
.toast.err{border-left-color:var(--accent)}
@keyframes tin{from{transform:translateX(14px);opacity:0}to{transform:translateX(0);opacity:1}}

/* modal de salida */
#modal-bg{
  display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);
  backdrop-filter:blur(6px);z-index:500;align-items:center;justify-content:center;
}
#modal-bg.on{display:flex}
.modal{
  background:var(--surface);border:1px solid var(--border);
  border-radius:14px;width:360px;overflow:hidden;
  box-shadow:0 24px 60px rgba(0,0,0,.5);
}
.modal-hd{
  background:var(--surface2);padding:18px 22px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.modal-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700}
.modal-close{background:none;border:none;color:var(--muted);font-size:18px;cursor:pointer;line-height:1}
.modal-close:hover{color:var(--text)}
.modal-body{padding:20px 22px;display:flex;flex-direction:column;gap:14px}
.mfield label{display:block;font-family:'DM Mono',monospace;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
.mfield select,.mfield input{
  width:100%;background:var(--bg);border:1px solid var(--border);
  border-radius:7px;padding:9px 12px;
  font-family:'DM Mono',monospace;font-size:11px;color:var(--text);outline:none;
  transition:border-color .15s;
}
.mfield select:focus,.mfield input:focus{border-color:var(--green)}
.mfield select option{background:var(--surface)}
.modal-foot{padding:0 22px 20px;display:flex;gap:8px}
.btn-modal{
  flex:1;padding:10px;border-radius:8px;border:1px solid;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.8px;
  text-transform:uppercase;cursor:pointer;transition:all .15s;
}
.btn-cancel{background:transparent;border-color:var(--border);color:var(--muted)}
.btn-cancel:hover{border-color:var(--text);color:var(--text)}
.btn-confirm{background:var(--accent);border-color:var(--accent);color:#fff}
.btn-confirm:hover{background:var(--accent2);border-color:var(--accent2)}

/* pulse anim para marcadores */
@keyframes pulse{0%{transform:translate(-50%,-50%) scale(.5);opacity:1}100%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}
</style>
</head>
<body>

<!-- ═══ HEADER ═══ -->
<header>
  <div class="brand">
    <span class="brand-jr">J.R.</span> Carrozas
    <div class="brand-sep"></div>
    <span class="brand-sub">Centro GPS</span>
  </div>
  <div class="spacer"></div>
  <div class="live-pill" id="live-pill">
    <div class="live-dot"></div>
    <span id="live-lbl">EN VIVO</span>
  </div>
  <a class="btn-open" href="https://ingreso.drivegps.com.co/objects" target="_blank" title="Abrir DriveGPS en nueva pestaña">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    DriveGPS
  </a>
</header>

<div class="app">

  <!-- ═══ SIDEBAR ═══ -->
  <aside>
    <div class="sb-hd">
      <span class="sb-title">Carrozas activas</span>
      <div class="stats">
        <div class="stat act" id="chip-on">● 0</div>
        <div class="stat" id="chip-off">○ 0</div>
      </div>
    </div>

    <div class="vlist" id="vlist">
      <div class="empty">
        <div class="empty-ico">🛰️</div>
        <div class="empty-msg">Ninguna carroza en ejecución aún.</div>
        <div class="empty-hint">
          Registra una <b>Salida</b> usando el botón<br>
          <b>+ Nueva Salida</b> en la sección inferior.<br>
          La carroza aparecerá aquí y en el mapa.
        </div>
      </div>
    </div>

    <!-- sección carrozas en servicio / salidas -->
    <div class="svc-section" id="svc-section">
      <div class="svc-hd open" id="svc-hd" onclick="toggleSvc()">
        <span>📋 Salidas registradas</span>
        <span class="caret">▲</span>
      </div>
      <div class="svc-body" id="svc-body">
        <div class="empty" style="padding:16px 8px">
          <div class="empty-msg" style="font-size:10px">Sin salidas aún. Usa <b>Nueva Salida</b>.</div>
        </div>
      </div>
      <div style="padding:8px 10px 10px">
        <button onclick="openModal()"
          style="width:100%;background:rgba(230,57,70,.14);border:1px solid rgba(230,57,70,.3);color:#e8616b;border-radius:8px;padding:9px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;transition:background .15s"
          onmouseover="this.style.background='rgba(230,57,70,.24)'" onmouseout="this.style.background='rgba(230,57,70,.14)'">
          + Nueva Salida
        </button>
      </div>
    </div>

    <div class="cd-bar">
      <span>actualización</span>
      <div class="cd-track"><div class="cd-fill" id="cd-fill" style="width:100%"></div></div>
      <span id="cd-secs">30s</span>
    </div>
  </aside>

  <!-- ═══ MAPA / IFRAME ═══ -->
  <div class="map-area">
    <div class="map-toolbar">
      <a class="mtool-btn" href="https://ingreso.drivegps.com.co/objects" target="_blank">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
        Abrir mapa completo
      </a>
      <button class="mtool-btn" onclick="refreshSalidas()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
        Actualizar
      </button>
    </div>

    <!-- Iframe DriveGPS — cargará el mapa real -->
    <iframe
      id="gps-frame"
      class="gps-frame"
      src="https://ingreso.drivegps.com.co/objects"
      allow="geolocation"
      title="Mapa GPS DriveGPS"
      onload="onFrameLoad()"
      onerror="onFrameError()"
    ></iframe>

    <!-- Placeholder por si el iframe es bloqueado -->
    <div class="frame-placeholder" id="frame-placeholder" style="display:none">
      <div class="fp-ico">🗺️</div>
      <div class="fp-title">Mapa GPS DriveGPS</div>
      <div class="fp-sub">El mapa en tiempo real se abre directamente en DriveGPS. Haz clic para verlo en esta misma ventana o en una nueva pestaña.</div>
      <a class="fp-link" href="https://ingreso.drivegps.com.co/objects" target="_blank">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
        Abrir DriveGPS
      </a>
      <div class="fp-note">
        <b>¿Por qué aparece esto?</b><br>
        Algunos navegadores bloquean la incrustación de sitios externos (política de seguridad X-Frame-Options). Si ves este mensaje, usa el botón de arriba para abrir el mapa. Las carrozas registradas en <b>Nueva Salida</b> sí se gestionan aquí en el panel lateral.
      </div>
    </div>
  </div>
</div>

<!-- ═══ MODAL NUEVA SALIDA ═══ -->
<div id="modal-bg">
  <div class="modal">
    <div class="modal-hd">
      <div class="modal-title">Nueva Salida</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="mfield">
        <label>Carroza / Placa</label>
        <select id="m-carroza">
          <option value="">Seleccionar carroza…</option>
          <option value="ICQ-333">ICQ-333 — Carroza 1</option>
          <option value="ABC-789">ABC-789 — Carroza 2</option>
          <option value="XYZ-101">XYZ-101 — Carroza 3</option>
          <option value="custom">Otra (escribir)</option>
        </select>
      </div>
      <div class="mfield" id="custom-field" style="display:none">
        <label>Placa personalizada</label>
        <input type="text" id="m-custom" placeholder="Ej: KBT-552" maxlength="10">
      </div>
      <div class="mfield">
        <label>Tipo de servicio</label>
        <select id="m-tipo">
          <option value="Traslado local">Traslado local</option>
          <option value="Traslado intermunicipal">Traslado intermunicipal</option>
          <option value="Salida regional">Salida regional</option>
          <option value="Recogida">Recogida</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div class="mfield">
        <label>Conductor</label>
        <input type="text" id="m-conductor" placeholder="Nombre del conductor">
      </div>
      <div class="mfield">
        <label>Destino / Observación</label>
        <input type="text" id="m-destino" placeholder="Ej: Cementerio La Nubia, Manizales">
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn-modal btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-modal btn-confirm" onclick="confirmarSalida()">Registrar Salida</button>
    </div>
  </div>
</div>

<div id="toasts"></div>

<script>
// ══════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════
const COLORS = ['#e63946','#0db39e','#f4b942','#8338ec','#3a86ff','#fb8500','#06d6a0','#ff006e'];
let colorIdx = 0;
const salidas  = {}; // id → { placa, tipo, conductor, destino, hora, color }
let countdown  = 30;
let cdTimer    = null;
let svcOpen    = true;
let frameOk    = false;
let frameTimer = null;

// ══════════════════════════════════════════
//  IFRAME
// ══════════════════════════════════════════
function onFrameLoad() {
  frameOk = true;
  clearTimeout(frameTimer);
  document.getElementById('frame-placeholder').style.display = 'none';
  document.getElementById('gps-frame').style.display = 'block';
  toast('Mapa DriveGPS cargado ✓');
}

function onFrameError() {
  showPlaceholder();
}

// Si en 4s no cargó, mostrar placeholder
frameTimer = setTimeout(() => {
  if (!frameOk) showPlaceholder();
}, 4000);

function showPlaceholder() {
  document.getElementById('gps-frame').style.display = 'none';
  document.getElementById('frame-placeholder').style.display = 'flex';
}

// ══════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════
document.getElementById('m-carroza').addEventListener('change', function() {
  document.getElementById('custom-field').style.display =
    this.value === 'custom' ? 'block' : 'none';
});

function openModal() {
  document.getElementById('modal-bg').classList.add('on');
  document.getElementById('m-conductor').focus();
}
function closeModal() {
  document.getElementById('modal-bg').classList.remove('on');
}
document.getElementById('modal-bg').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-bg')) closeModal();
});

function confirmarSalida() {
  let placa = document.getElementById('m-carroza').value;
  if (placa === 'custom') placa = document.getElementById('m-custom').value.trim().toUpperCase();
  if (!placa) { toast('Selecciona o escribe una placa', 'err'); return; }

  const tipo      = document.getElementById('m-tipo').value;
  const conductor = document.getElementById('m-conductor').value.trim() || 'Sin especificar';
  const destino   = document.getElementById('m-destino').value.trim() || '—';
  const id        = `sal-${Date.now()}`;
  const color     = COLORS[colorIdx++ % COLORS.length];
  const hora      = new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'});

  salidas[id] = { placa, tipo, conductor, destino, hora, color, activa: true };

  closeModal();
  renderAll();
  toast(`🚗 Salida registrada: ${placa} — ${tipo}`);

  // limpiar modal
  document.getElementById('m-carroza').value   = '';
  document.getElementById('m-custom').value    = '';
  document.getElementById('m-conductor').value = '';
  document.getElementById('m-destino').value   = '';
  document.getElementById('custom-field').style.display = 'none';
}

// ══════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════
function renderAll() {
  const ids = Object.keys(salidas);
  const activas = ids.filter(id => salidas[id].activa);

  // chips header
  document.getElementById('chip-on').textContent  = `● ${activas.length}`;
  document.getElementById('chip-off').textContent = `○ ${ids.length - activas.length}`;

  // live label
  const t = new Date();
  document.getElementById('live-lbl').textContent =
    `${t.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;

  renderVlist(ids, activas);
  renderSvcCards(ids);
}

function renderVlist(ids, activas) {
  const el = document.getElementById('vlist');
  if (!ids.length) {
    el.innerHTML = `<div class="empty">
      <div class="empty-ico">🛰️</div>
      <div class="empty-msg">Ninguna carroza en ejecución aún.</div>
      <div class="empty-hint">
        Registra una <b>Salida</b> usando el botón<br>
        <b>+ Nueva Salida</b> en la sección inferior.
      </div>
    </div>`;
    return;
  }
  el.innerHTML = ids.map(id => {
    const s = salidas[id];
    const pill = s.activa
      ? `<div class="pill pill-on">EN RUTA</div>`
      : `<div class="pill pill-off">CERRADO</div>`;
    return `
    <div class="vcard${!s.activa ? ' sel' : ''}" style="--vc:${s.color}" onclick="verEnGPS('${id}')">
      <div class="vc-top">
        <div class="vc-plate" style="color:${s.color}">${s.placa}</div>
        ${pill}
      </div>
      <div class="vc-name">👤 ${s.conductor}</div>
      <div class="vc-svc-tag">📍 ${s.destino}</div>
      <div class="vc-loc">
        <div class="dot"></div>
        ${s.tipo}
      </div>
      <div class="vc-foot">
        <div class="vc-age">⏱ Salida ${s.hora}</div>
        <div class="btn-row">
          ${s.activa
            ? `<button class="btn-xs btn-ver" onclick="event.stopPropagation();cerrarSalida('${id}')">✓ Cerrar</button>`
            : ''}
          <button class="btn-xs btn-gps" onclick="event.stopPropagation();verEnGPS('${id}')">🗺 Ver GPS</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderSvcCards(ids) {
  const el = document.getElementById('svc-body');
  if (!ids.length) {
    el.innerHTML = `<div class="empty" style="padding:12px 8px"><div class="empty-msg" style="font-size:10px">Sin salidas aún.</div></div>`;
    return;
  }
  el.innerHTML = ids.map(id => {
    const s = salidas[id];
    const pill = s.activa
      ? `<div class="svc-badge" style="background:rgba(13,179,158,.12);border-color:rgba(13,179,158,.25);color:#0db39e">ACTIVA</div>`
      : `<div class="svc-badge" style="background:rgba(122,130,153,.1);border-color:rgba(122,130,153,.2);color:#7a8299">CERRADA</div>`;
    return `
    <div class="svc-card">
      <div class="svc-color" style="background:${s.color}"></div>
      <div class="svc-info">
        <div class="svc-plate2" style="color:${s.color}">${s.placa}</div>
        <div class="svc-detail">${s.tipo} · ${s.hora}</div>
      </div>
      ${pill}
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════
//  ACCIONES
// ══════════════════════════════════════════
function cerrarSalida(id) {
  if (!salidas[id]) return;
  salidas[id].activa = false;
  renderAll();
  toast(`Salida ${salidas[id].placa} cerrada`);
}

function verEnGPS(id) {
  const s = salidas[id];
  if (!s) return;
  // Abrir DriveGPS con filtro si es posible, sino abrir el mapa
  const url = `https://ingreso.drivegps.com.co/objects`;
  if (frameOk) {
    // intentar navegar el iframe (puede ser bloqueado)
    try {
      document.getElementById('gps-frame').contentWindow.location.href = url;
    } catch(e) {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
  toast(`Abriendo GPS para ${s.placa}…`);
}

// ══════════════════════════════════════════
//  SVC TOGGLE
// ══════════════════════════════════════════
function toggleSvc() {
  svcOpen = !svcOpen;
  const hd = document.getElementById('svc-hd');
  const bd = document.getElementById('svc-body');
  hd.classList.toggle('open', svcOpen);
  bd.classList.toggle('collapsed', !svcOpen);
}

// ══════════════════════════════════════════
//  REFRESH / COUNTDOWN
// ══════════════════════════════════════════
function refreshSalidas() {
  renderAll();
  resetCD();
  toast('Panel actualizado');
}

function resetCD() {
  countdown = 30;
  clearInterval(cdTimer);
  cdTimer = setInterval(() => {
    countdown--;
    const pct = (countdown / 30) * 100;
    document.getElementById('cd-fill').style.width = pct + '%';
    document.getElementById('cd-secs').textContent = countdown + 's';
    if (countdown <= 0) {
      clearInterval(cdTimer);
      refreshSalidas();
      resetCD();
    }
  }, 1000);
}

// ══════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════
function toast(msg, type = 'info') {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
renderAll();
resetCD();

// Actualizar reloj vivo cada segundo
setInterval(() => {
  if (Object.keys(salidas).length > 0) renderAll();
  else {
    const t = new Date();
    document.getElementById('live-lbl').textContent =
      `${t.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  }
}, 5000);
</script>
</body>
</html>
