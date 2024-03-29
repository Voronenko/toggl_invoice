/*jshint esversion: 8 */
/*jshint unused:false*/
const SHT_CONFIG = 'Config';

// Custom menu
function onOpen() {
  "use strict";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const menuEntries = [
     {name: "Get Invoice for Month", functionName: "month_invoice"},
     {name: "Get Invoice for Range", functionName: "range_invoice"},
     {name: "-----Configure:-----", functionName: "do_nothing"},
     {name: "Load Projects Data", functionName: "load_projects"},
     {name: "Set time interval - yesterday", functionName: "set_interval_1_days_exclusive"},
     {name: "Set time interval - this week", functionName: "set_interval_this_week_exclusive"},
     {name: "Set time interval - last week", functionName: "set_interval_previous_week_exclusive"},
     {name: "Set time interval - last 7 days incl.", functionName: "set_interval_7_days_inclusive"},
     {name: "Set time interval - last 14 days incl.", functionName: "set_interval_14_days_inclusive"},
  ];
  ss.addMenu("Toggl", menuEntries);
}

function do_nothing(){
}

// http://googleappsdeveloper.blogspot.be/2012/05/insider-tips-for-using-apps-script-and.html
function loadConfiguration(wb, configSheet) {
  "use strict";

  Logger.log("Loading configuration ...");

  const configsheet = wb.getSheetByName(configSheet);
  let result = [];

  const cfgdata = configsheet.getDataRange().getValues();
  for (let i = 1; i < cfgdata.length; i++) {
    let key = cfgdata[i][0];
    let value = cfgdata[i][1];

    Logger.log("key: " + key + " - value: " + value);

    result[key] = value;
  }

  return result;
}

function month_invoice() {
  "use strict";
  const config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);
  const result = app.month_invoice(config);
  app.createTimesheet(result.sheetName, result.timesheet);
}

async function range_invoice() {
  "use strict";
  const config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);
  const result = await app.range_invoice(config);
  app.createTimesheet(result.sheetName, result.timesheet);
}

function load_projects() {
  "use strict";
  const config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);
  app.load_projects(config);
}

function set_interval_1_days_exclusive() {
  "use strict";
  app.set_interval_1_days_exclusive();
}

function set_interval_this_week_exclusive() {
  "use strict";
  app.set_interval_this_week_exclusive();
}

function set_interval_previous_week_exclusive() {
  "use strict";
  app.set_interval_previous_week_exclusive();
}

function set_interval_7_days_inclusive() {
  "use strict";
  app.set_interval_7_days_inclusive();
}

function set_interval_14_days_inclusive() {
  "use strict";
  app.set_interval_14_days_inclusive();
}
