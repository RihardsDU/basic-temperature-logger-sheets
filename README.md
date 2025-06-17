# Daily Temperature Logger (Google Sheets)

This Google Apps Script automatically logs daily temperature readings to a Google Sheets spreadsheet, organizing them month by month.
The temperature values are randomly generated. This script is meant to be easily edited in case real time readings can be fetched from a external source.

## Features

- **Auto-generates a new sheet every month**  
  Sheets are named in the format: `Month Year` (e.g., `June 2025`).

- **Logs daily data**:
  - Current date (format: `dd.MM.yyyy`)
  - 6 fridge temperatures
  - 5 freezer temperatures
  - Signature field (`"JTE"` by default)

- **Uses weighted random values** to simulate realistic readings:
  - Fridge: values between 1 and 4 (most often 3)
  - Freezer: values between -19 and -22 (most often -21)

- **Stylized formatting**:
  - Alternating row colors for better readability
  - Custom background colors for:
    - Date
    - Fridge columns
    - Freezer columns
    - Signature column

- **Error reporting**:  
  If the script fails (e.g., due to a structural change in the sheet), and you’ve set up email notifications for triggers, Google will automatically email you the error.

---

## Installation

### 1. Open Google Sheets  
Go to [https://sheets.google.com](https://sheets.google.com) and create a new spreadsheet.

### 2. Open the Script Editor  
Click: `Extensions → Apps Script`.

### 3. Paste the Script  
Delete any existing code and paste in the entire script.

### 4. Save and Authorize  
Click the floppy disk icon to save. 
Authorize permissions when prompted.

> You can manually run the script by clicking the ▶ (Run) button — this will log today's data in the sheet.

---

## Set Up Daily Automation

1. In the Apps Script editor, click the **Trigger** icon (clock symbol in the left-hand menu).
2. Click **+ Add Trigger** (bottom right).
3. Choose the following options:
   - **Function to run**: `fillDailyData`
   - **Deployment**: `Head`
   - **Event source**: `Time-driven`
   - **Type of time-based trigger**: `Day timer`
   - **Time of day**: Choose any preferred time
4. Click **Save**
