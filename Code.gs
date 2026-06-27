// ── Maeve's Hours → Google Sheet ──────────────────────────────
// Paste this into Extensions ▸ Apps Script inside YOUR sheet,
// then Deploy ▸ New deployment ▸ Web app
//   - Execute as: Me
//   - Who has access: Anyone
// Copy the /exec URL it gives you and paste it into the app's
// Settings ▸ Google Sheet sync field.

const SHEET_NAME = "Timesheet";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // header row, once
    if (sh.getLastRow() === 0) {
      sh.appendRow([
        "Submitted", "Week Of", "Date", "Day", "Start", "End",
        "Hours", "Rate", "Day Pay", "Expenses / Needs", "Nanny"
      ]);
      sh.getRange(1, 1, 1, 11).setFontWeight("bold");
      sh.setFrozenRows(1);
    }

    // one row per day worked
    (data.days || []).forEach(function (d) {
      sh.appendRow([
        data.submittedAt, data.weekOf, d.date, d.day, d.start, d.end,
        d.hours, data.rate, d.dayPay, d.expenses, data.nanny
      ]);
    });

    // one bold total row for the week
    const totalRow = sh.getLastRow() + 1;
    sh.appendRow([
      "", data.weekOf, "", "WEEK TOTAL", "", "",
      data.totalHours, data.rate, data.totalPay, "", data.nanny
    ]);
    sh.getRange(totalRow, 1, 1, 11).setFontWeight("bold");

    return json({ ok: true, rows: (data.days || []).length });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
