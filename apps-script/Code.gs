// Sit — Google Sheets sync backend.
//
// Setup:
// 1. Create a new Google Sheet (any name).
// 2. Extensions -> Apps Script, delete the placeholder code, paste this file in.
// 3. Change SECRET below to a password only you know.
// 4. Deploy -> New deployment -> type "Web app" -> Execute as "Me" ->
//    Who has access "Anyone" -> Deploy. Authorize when prompted.
// 5. Copy the Web App URL (ends in /exec) and paste it, with the same
//    SECRET, into the app's "Sync across devices" panel on every device.
//
// A "Sessions" sheet/tab is created automatically on first use.

var SHEET_NAME = 'Sessions';
var SECRET = 'change-me-to-something-only-you-know';

function doGet(e) {
  if ((e.parameter.key || '') !== SECRET) return json_({ error: 'unauthorized' });
  var rows = getSheet_().getDataRange().getValues();
  var headers = rows.shift();
  var sessions = rows
    .filter(function (r) { return r.join('') !== ''; })
    .map(function (r) {
      var obj = {};
      headers.forEach(function (h, i) { obj[h] = r[i]; });
      return obj;
    });
  return json_({ sessions: sessions });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ error: 'bad request' });
  }
  if ((body.key || '') !== SECRET) return json_({ error: 'unauthorized' });
  var s = body.session || {};
  getSheet_().appendRow([
    s.id || '',
    s.completedAt || '',
    s.startedAt || '',
    s.category || '',
    s.mode || '',
    s.durationSeconds || '',
    s.targetSeconds || '',
    !!s.completedFull,
    s.style || '',
    // Weights are logged by reps, not time: exercise + reps + kg. Note a
    // weight of 0 (bodyweight) is real, so only null/undefined is left blank.
    s.exercise || '',
    s.reps == null ? '' : s.reps,
    s.weightKg == null ? '' : s.weightKg,
    !!s.manual
  ]);
  return json_({ ok: true });
}

// Column order matters: appendRow above writes positionally.
var COLUMNS = ['id', 'completedAt', 'startedAt', 'category', 'mode', 'durationSeconds', 'targetSeconds', 'completedFull', 'style', 'exercise', 'reps', 'weightKg', 'manual'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
  } else {
    // Backfill any header missing from a sheet created before that column
    // existed (style, exercise, reps, weightKg), in order at the end, so old
    // sheets pick them up without needing to be recreated.
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    COLUMNS.forEach(function (name) {
      if (headers.indexOf(name) === -1) {
        sheet.getRange(1, headers.length + 1).setValue(name);
        headers.push(name);
      }
    });
  }
  // Sheets auto-detects ISO-looking strings and silently converts them to
  // Date cells, which can shift/round the value on every read and break
  // the app's exact-match sync. Forcing these two columns to plain text
  // keeps completedAt/startedAt as the literal strings the app sent.
  sheet.getRange('B:C').setNumberFormat('@');
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
