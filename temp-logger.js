// Extracted constants for easy acess and editing for amount of fridges and freezers
// IMPORTANT!: Changing these values in the middle of the month will mess up the formatting of the columns
//  and likely lead to the headers not lining up.
//  Recomended workaround is either changing the values at end of the month AFTER the code has triggered OR
//  delete the sheet page for the current month and then manually running the code for the number of days
//  this month; then manually editing the dates in the generated sheet.
const NUMBER_OF_FRIDGES = 6;
const NUMBER_OF_FREEZERS = 5;

// Extracted lists of temps and wheighting for easy access and editing
// The more frequently a value appears in this list, the higher the chance it will appear in the document
const FRIDGE_TEMPS = [1, 2, 2, 3, 3, 3, 3, 4, 4];
const FREEZER_TEMPS = [-19, -20, -20, -21, -21, -21, -21, -22];

// Signature
// The more frequently a value appears in this list, the higher the chance it will appear in the document
const SIGNATURES = ['JTE'];

// Global constant for number of columns
const NUMBER_OF_COLUMNS = NUMBER_OF_FRIDGES + NUMBER_OF_FREEZERS + 2;

function fillDailyData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  const monthName = today.toLocaleString('no-NO', { month: 'long' });
  const year = today.getFullYear();
  const sheetName = `${monthName} ${year}`;
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // Create new sheet and add headers
    sheet = ss.insertSheet(sheetName);
    // Catch error on sheet creation
    if (!sheet) throw new Error(`Failed to create sheet: ${sheetName}`);
    // Header rows
    let rows = ['Dato'];
    for(let i = 0; i < NUMBER_OF_FRIDGES; i++) {
      rows.push('Kjøleskap ' + (i + 1));
    }
    for(let i = 0; i < NUMBER_OF_FREEZERS; i++) {
      rows.push('Fryser ' + (i + 1));
    }
    rows.push('Underskrift');
    sheet.appendRow(rows);

    // Style the header
    styleHeader(sheet);
  }

  // Format todays date for date row and comparison
  const todayStr = Utilities.formatDate(today, ss.getSpreadsheetTimeZone(), "dd.MM.yyyy");
  // Check if todays row is already logged
  const data = sheet.getDataRange().getValues();
  const alreadyLogged = data.some(row => {
    const cellDate = row[0];
    return cellDate instanceof Date &&
      Utilities.formatDate(cellDate, ss.getSpreadsheetTimeZone(), "dd.MM.yyyy") === todayStr;
  });

  if (!alreadyLogged) {
    // Generate values
    let row = [todayStr];
    for(let i = 0; i < NUMBER_OF_FRIDGES; i++) {
      row.push(getRandomValueFromList(FRIDGE_TEMPS));
    }
    for(let i = 0; i < NUMBER_OF_FREEZERS; i++) {
      row.push(getRandomValueFromList(FREEZER_TEMPS));
    }
    row.push(getRandomValueFromList(SIGNATURES));

    sheet.appendRow(row);
    // Apply alternating row colors
    styleRows(sheet);
    Logger.log(`Logged data for ${todayStr}`);
  } else {
    Logger.log(`Data for ${todayStr} already logged.`);
  }
}

// Gets a random value from a list
function getRandomValueFromList(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// Styling function for headers
function styleHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, NUMBER_OF_COLUMNS);
    headerRange.setBackground('#4a6fa5');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
}

// Syling function for rows
function styleRows(sheet) {
  const numRows = sheet.getLastRow() - 1; // exclude header
  if (numRows <= 0) return;
  const range = sheet.getRange(2, 1, numRows, NUMBER_OF_COLUMNS); // data rows
  const backgrounds = [];
  for (let i = 0; i < numRows; i++) {
    const isEven = i % 2 === 0;
    // Define alternating shades for each group
    const dateColor = isEven ? '#f0f0f0' : '#e0e0e0';       // neutral gray for Date
    const fridgeColor = isEven ? '#eef4fb' : '#dbe9f5';     // soft blue-gray for fridge
    const freezerColor = isEven ? '#f3edf9' : '#e4dbf4';    // light purple-gray for freezer
    const signatureColor = isEven ? '#d0ecef' : '#b8dee1';  // teal gray for signature
    // Compose full row
    const rowBackground = [
      dateColor, // Column A (Date)
      ...Array(NUMBER_OF_FRIDGES).fill(fridgeColor),    // Columns fridges
      ...Array(NUMBER_OF_FREEZERS).fill(freezerColor),  // Columns freezers
      signatureColor // Column signature
    ];
    backgrounds.push(rowBackground);
  }
  range.setBackgrounds(backgrounds);
}
