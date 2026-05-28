/**
* ══════════════════════════════════════════════════════════════════════════════
* BACKEND J.R. CARROZAS — Code.gs v10.6 (VERSIÓN INTEGRAL FINAL + GPS LIVE)
* ══════════════════════════════════════════════════════════════════════════════
*/

var SPREADSHEET_ID = "1fBMeQkvSadmTsbTMwRcZEbTAKv-PAqua2qlnjMFa0c4";
var FOLDER_ID      = "1jWeONj0IxODBgU4TyFpkgsh2NWbAM_3u";

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── OBTENER O CREAR HOJA ──
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// ── CABECERAS POR HOJA (para auto-creación) ──
var HEADERS_MAP = {
  'gps_live': ['id_salida', 'placa', 'lat', 'lng', 'precision', 'timestamp'],
};

// ── PROTECCIÓN DRIVE (imágenes base64 → Google Drive) ──
function procesarImagenesDrive(payload) {
  for (var key in payload) {
    var val = payload[key];
    if (typeof val === 'string' && val.indexOf("data:image/") === 0) {
      try {
        var folder = DriveApp.getFolderById(FOLDER_ID);
        var parts = val.split(','), mime = parts[0].split(':')[1].split(';')[0];
        var base64Data = parts[1], ext = mime.split('/')[1] || "jpg";
        var fileName = key + "_" + (payload.id_salida || payload.id || new Date().getTime()) + "." + ext;
        var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mime, fileName);
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        payload[key] = "https://drive.google.com/uc?id=" + file.getId();
      } catch (e) {
        payload[key] = "Error Drive: " + e.toString();
      }
    }
  }
  return payload;
}

/**
* ── GET → leer hoja ──
*/
function doGet(e) {
  try {
    var sheetName = e.parameter.sheetName;
    if (!sheetName)
      return jsonOut({ mensaje: "✅ API J.R. Carrozas v10.6 activa" });

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);

    // Auto-crear hoja gps_live si no existe
    if (!sheet && sheetName === 'gps_live') {
      sheet = ss.insertSheet('gps_live');
      sheet.appendRow(['id_salida', 'placa', 'lat', 'lng', 'precision', 'timestamp']);
      return jsonOut([]);
    }

    if (!sheet)
      return jsonOut({ error: "Hoja no encontrada: " + sheetName });

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return jsonOut([]);

    var headers = values[0];
    var rows = values.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        var v = row[i];
        obj[h] = (v === null || v === undefined) ? "" : String(v).trim();
      });
      return obj;
    });

    return jsonOut(rows);
  } catch(err) {
    return jsonOut({ error: err.toString() });
  }
}

/**
* ── POST → insertar o actualizar ──
*/
function doPost(e) {
  try {
    var ss = getSpreadsheet();
    var sheetName = e.parameter.sheetName;
    var action    = e.parameter.action   || "insert";
    var idCol     = e.parameter.idCol    || "";
    var idValue   = e.parameter.idValue  || "";

    if (!sheetName) return jsonOut({ ok: false, error: "Falta sheetName" });

    // ── Auto-crear hoja gps_live si no existe ──
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet && sheetName === 'gps_live') {
      sheet = ss.insertSheet('gps_live');
      sheet.appendRow(['id_salida', 'placa', 'lat', 'lng', 'precision', 'timestamp']);
    }
    if (!sheet) return jsonOut({ ok: false, error: "Hoja no encontrada: " + sheetName });

    // Leer payload
    var payload = {};
    if (e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); }
      catch(pe) { return jsonOut({ ok: false, error: "JSON inválido: " + pe.toString() }); }
    }

    // Procesar imágenes base64 → Drive (solo si NO es gps_live para mayor velocidad)
    if (sheetName !== 'gps_live') {
      payload = procesarImagenesDrive(payload);
    }

    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // ── UPDATE ──
    if (action === "update") {
      if (!idCol || !idValue)
        return jsonOut({ ok: false, error: "update requiere idCol e idValue" });

      var colIdx = headers.indexOf(idCol);
      if (colIdx === -1)
        return jsonOut({ ok: false, error: "Columna no encontrada: " + idCol });

      var data = sheet.getDataRange().getValues();
      var rowIndex = -1;

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][colIdx]).trim() === String(idValue).trim()) {
          rowIndex = i + 1;
          break;
        }
      }

      // Fallback: si no existe la fila, insertarla
      if (rowIndex === -1) {
        // Para gps_live: asegurarse que las columnas están bien
        if (sheetName === 'gps_live' && headers.length < 2) {
          // Hoja recién creada sin datos, reinicializar cabeceras
          sheet.clearContents();
          var gpsHeaders = ['id_salida', 'placa', 'lat', 'lng', 'precision', 'timestamp'];
          sheet.appendRow(gpsHeaders);
          headers = gpsHeaders;
        }
        var newFallbackRow = headers.map(function(h) {
          return payload[h] !== undefined ? payload[h] : "";
        });
        var idColPos = headers.indexOf(idCol);
        if (idColPos >= 0 && !payload[idCol]) newFallbackRow[idColPos] = idValue;
        sheet.appendRow(newFallbackRow);
        return jsonOut({ ok: true, method: "insert-fallback" });
      }

      // Actualizar solo los campos que vienen en payload
      headers.forEach(function(h, i) {
        if (payload[h] !== undefined) {
          sheet.getRange(rowIndex, i + 1).setValue(payload[h]);
        }
      });

      return jsonOut({ ok: true, method: "update", row: rowIndex });
    }

    // ── INSERT ──
    var newRow = headers.map(function(h) {
      return payload[h] !== undefined ? payload[h] : "";
    });
    sheet.appendRow(newRow);

    return jsonOut({ ok: true, method: "insert" });

  } catch (err) {
    return jsonOut({ ok: false, error: err.toString() });
  }
}
