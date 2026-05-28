// ══════════════════════════════════════════════════════════
//  PARCHE GPS — Agregar al final de db.js (antes del cierre de DB)
//  Copia estas funciones dentro del objeto DB = { ... }
// ══════════════════════════════════════════════════════════

// ── OBTENER POSICIÓN GPS ACTUAL ──
async obtenerGPS() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ok: false, error: 'GPS no disponible en este dispositivo' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        ok: true,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        precision: pos.coords.accuracy
      }),
      (err) => resolve({ ok: false, error: err.message }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
},

// ── ACTUALIZAR POSICIÓN EN TIEMPO REAL (llama cada ~20s) ──
async actualizarGPSLive(id_salida, placa) {
  const gps = await this.obtenerGPS();
  if (!gps.ok) return gps;
  const fila = {
    id_salida,
    placa,
    lat:       String(gps.lat),
    lng:       String(gps.lng),
    precision: String(gps.precision || ''),
    timestamp: new Date().toISOString(),
  };
  // Intenta actualizar; si no existe la fila la inserta (fallback del backend)
  return await gasWrite('gps_live', fila, 'update', 'id_salida', id_salida);
},

// ── OBTENER POSICIÓN ACTUAL DE UN TRASLADO ──
async obtenerPosicionLive(id_salida) {
  try {
    const rows = await gasGet('gps_live');
    const fila = rows.find(r => String(r.id_salida || '').trim() === String(id_salida).trim());
    return fila ? { ok: true, data: fila } : { ok: false, error: 'Sin posición registrada' };
  } catch(e) { return { ok: false, error: e.message }; }
},

// ── OBTENER TODAS LAS POSICIONES LIVE ACTIVAS ──
async obtenerTodosPosicionesLive() {
  try {
    const rows = await gasGet('gps_live');
    return { ok: true, data: rows };
  } catch(e) { return { ok: false, data: [], error: e.message }; }
},
