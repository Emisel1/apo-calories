// ═══════════════════════════════════════════════════════════════════════
// Google Apps Script — Suivi_Apolline_V3
// Paste this entire file into Extensions → Apps Script in Google Sheets.
// Deploy as Web App: Execute as Me, Access: Anyone.
// ═══════════════════════════════════════════════════════════════════════

const SPREADSHEET_ID = '1PJFHwrYq1G_3EOMHpVZOoUwMBuwaqdHe1ASGZf1vwU0';
const CAL_SHEET      = 'Calories';
const CYC_SHEET      = 'Cycle';

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const calSheet = ss.getSheetByName(CAL_SHEET) || ss.insertSheet(CAL_SHEET);
  const calories = sheetToObjects(calSheet, ['date','jour','seance','resto','kcal','prot','gluc','lip','poids','energie','notes']);

  const cycSheet = ss.getSheetByName(CYC_SHEET);
  const cycle    = cycSheet ? sheetToObjects(cycSheet, ['date','phase','period_active','mood','symptoms','gym_perf','notes']) : [];

  return jsonOut({ success: true, calories, cycle });
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  if (payload.type === 'cycle') {
    let sheet = ss.getSheetByName(CYC_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(CYC_SHEET);
      sheet.appendRow(['date','phase','period_active','mood','symptoms','gym_perf','notes']);
    }

    const row = [
      payload.date,
      payload.phase          || '',
      payload.period_active  || 'N',
      payload.mood           || '',
      payload.symptoms       || '',
      payload.gym_perf       || '',
      payload.notes          || ''
    ];

    upsertRow(sheet, payload.date, row, 7);
    return jsonOut({ success: true, message: 'Cycle saved' });

  } else {
    // Calories (default)
    let sheet = ss.getSheetByName(CAL_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(CAL_SHEET);
      sheet.appendRow(['date','jour','seance','resto','kcal','prot','gluc','lip','poids','energie','notes']);
    }

    const row = [
      payload.date,
      payload.jour           || '',
      payload.seance         || '',
      payload.resto          || 'N',
      payload.kcal           || 0,
      payload.prot           || '',
      payload.gluc           || '',
      payload.lip            || '',
      payload.poids          || '',
      payload.energie        || '',
      payload.notes          || ''
    ];

    upsertRow(sheet, payload.date, row, 11);
    return jsonOut({ success: true, message: 'Calories saved' });
  }
}

// ── Helpers ──

function upsertRow(sheet, dateVal, row, numCols) {
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const dates = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const idx   = dates.indexOf(dateVal);
    if (idx >= 0) {
      sheet.getRange(idx + 2, 1, 1, numCols).setValues([row]);
      return;
    }
  }
  sheet.appendRow(row);
}

function sheetToObjects(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return rows
    .filter(r => r[0] !== '')
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = r[i] !== undefined ? r[i] : ''; });
      if (obj.kcal)    obj.kcal    = Number(obj.kcal)    || 0;
      if (obj.prot)    obj.prot    = Number(obj.prot)    || null;
      if (obj.poids)   obj.poids   = Number(obj.poids)   || null;
      if (obj.energie) obj.energie = Number(obj.energie) || null;
      if (obj.gym_perf) obj.gym_perf = Number(obj.gym_perf) || null;
      return obj;
    });
}

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
