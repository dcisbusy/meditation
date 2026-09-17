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
    !!s.completedFull
  ]);
  return json_({ ok: true });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'completedAt', 'startedAt', 'category', 'mode', 'durationSeconds', 'targetSeconds', 'completedFull']);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
