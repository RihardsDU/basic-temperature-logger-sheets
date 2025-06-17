function fillDailyData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  const monthName = today.toLocaleString('no-NO', { month: 'long' });
  const year = today.getFullYear();
  const sheetName = `${monthName} ${year}`;
  let sheet = ss.getSheetByName(sheetName);

  // Create new sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (!sheet) throw new Error(`Failed to create sheet: ${sheetName}`);

    // Header row
    sheet.appendRow([
      'Dato', 'kjøleskap 1', 'kjøleskap 2', 'kjøleskap 3',
      'kjøleskap 4', 'kjøleskap 5', 'kjøleskap 6',
      'fryser 1', 'fryser 2', 'fryser 3', 'fryser 4', 'fryser 5',
      'Underskrift'
    ]);

    styleHeader(sheet);
  }

  // Format today's date for comparison
  const todayStr = Utilities.formatDate(today, ss.getSpreadsheetTimeZone(), "dd.MM.yyyy");

  // Check if today's data is already logged
  const data = sheet.getDataRange().getValues();
  const alreadyLogged = data.some(row => {
    const cellDate = row[0];
    return cellDate instanceof Date &&
      Utilities.formatDate(cellDate, ss.getSpreadsheetTimeZone(), "dd.MM.yyyy") === todayStr;
  });

  // Log data if not already present
  if (!alreadyLogged) {
    const row = [
      todayStr,
      getFringeTemp(), getFringeTemp(), getFringeTemp(),
      getFringeTemp(), getFringeTemp(), getFringeTemp(),
      getFreezerTemp(), getFreezerTemp(), getFreezerTemp(),
      getFreezerTemp(), getFreezerTemp(),
      'JTE'
    ];

    sheet.appendRow(row);
    styleRows(sheet);
    Logger.log(`Logged data for ${todayStr}`);
  } else {
    Logger.log(`Data for ${todayStr} already logged.`);
  }
}

function getFringeTemp() {
  const weighted = [1, 2, 2, 3, 3, 3, 3, 4, 4];
  const index = Math.floor(Math.random() * weighted.length);
  return weighted[index];
}

function getFreezerTemp() {
  const weighted = [-19, -20, -20, -21, -21, -21, -21, -22];
  const index = Math.floor(Math.random() * weighted.length);
  return weighted[index];
}

function styleHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, 13);
  headerRange.setBackground('#4a6fa5');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
}

function styleRows(sheet) {
  const numRows = sheet.getLastRow() - 1; // Exclude header
  if (numRows <= 0) return;

  const range = sheet.getRange(2, 1, numRows, 13);
  const backgrounds = [];

  for (let i = 0; i < numRows; i++) {
    const isEven = i % 2 === 0;

    const dateColor = isEven ? '#f0f0f0' : '#e0e0e0';
    const fridgeColor = isEven ? '#eef4fb' : '#dbe9f5';
    const freezerColor = isEven ? '#f3edf9' : '#e4dbf4';
    const signatureColor = isEven ? '#d0ecef' : '#b8dee1';

    const rowBackground = [
      dateColor,
      ...Array(6).fill(fridgeColor),
      ...Array(5).fill(freezerColor),
      signatureColor
    ];

    backgrounds.push(rowBackground);
  }

  range.setBackgrounds(backgrounds);
}
