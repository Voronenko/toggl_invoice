import {
  fetchProjects,
  fetchDetailsReport,
  fetchProjectTimesheet
} from './Toggl.js'

import {
  getPreviousMonday,
  getMonday
} from './Dates.js'

const SHT_CONFIG = 'Config';
const DATE_FORMAT_SHEET = 'YYYY-MM-DD'

async function set_interval_1_days_exclusive() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var endDate = new Date();
  var startDate = new Date(endDate.getTime() - 1 * (24 * 3600 * 1000));
  endDate = startDate;
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));

}


async function set_interval_7_days_inclusive() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var endDate = new Date();
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));

  var startDate = new Date(endDate.getTime() - 7 * (24 * 3600 * 1000));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_14_days_inclusive() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var endDate = new Date();
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));

  var startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000))
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_previous_week_exclusive() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var today = new Date();
  var startDate = getPreviousMonday(today);
  var endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_this_week_exclusive() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var today = new Date();
  var startDate = getMonday(today);
  var endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
}

// Generate time sheet for month
function month_invoice() {

  var config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);

  var timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  var timesheetStartDate = config.timesheetStartDate;
  Logger.log("start date: " + timesheetStartDate);
  var startDate = new Date(timesheetStartDate.getYear(), timesheetStartDate.getMonth(), 1);
  var since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  var days = daysOfMonth(startDate.getYear(), startDate.getMonth());

  var endDate = new Date(startDate.getYear(), startDate.getMonth(), days);
  Logger.log("end date: " + endDate);
  var until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);

  ignoreTagsStr = config.ignoreTags || "";
  ignoreTags = ignoreTagsStr.split(",");
  var timesheet = fetchTimesheet(config.apiToken, config.workspaceId, since, until, config.project, ignoreTags);
  var sheetName = getSheetName(startDate, endDate, timeZone, config.project);
  createTimesheet(sheetName, timesheet);
}

// Generate time sheet for range
function range_invoice() {

  var config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);

  var timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  var timesheetStartDate = config.timesheetStartDate;
  Logger.log("start date: " + timesheetStartDate);
  var startDate = new Date(timesheetStartDate.getYear(), timesheetStartDate.getMonth(), timesheetStartDate.getDate());
  var since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  var timesheetEndDate = config.timesheetEndDate;
  var endDate = new Date(timesheetEndDate.getYear(), timesheetEndDate.getMonth(), timesheetEndDate.getDate());
  Logger.log("end date: " + endDate);
  var until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);

  ignoreTagsStr = config.ignoreTags || "";
  ignoreTags = ignoreTagsStr.split(",");

  var timesheet = fetchTimesheet(config.apiToken, config.workspaceId, since, until, config.project, ignoreTags);
  var sheetName = getSheetName(startDate, endDate, timeZone, config.project);
  createTimesheet(sheetName, timesheet);
}


function load_projects() {
  var config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);
  var projects = fetchProjects(config.apiToken, config.workspaceId);
  var configSheet = SpreadsheetApp.getActive().getSheetByName(SHT_CONFIG);

  currentRow = 2
  for (i = 0; i < projects.length; i++) {
    configSheet.getRange('F' + currentRow).setValue(projects[i].id);
    configSheet.getRange('G' + currentRow).setValue(projects[i].name);
    currentRow++;
  }
}

function fetchTimesheet(apiToken, workspaceId, since, until, project, ignoreTags) {

  Logger.log("PROJECT=", project);

  var timesheet = [];

  var report = fetchDetailsReport(apiToken, workspaceId, since, until);
  Logger.log("total count: " + report.total_count + " - per page: " + report.per_page);
  var numberOfPages = Math.ceil(report.total_count / report.per_page);
  Logger.log("number of pages: " + numberOfPages);
  var page = 1;
  do {
    for (var i = 0; i < report.data.length; i++) {
      ignoreEntry = false;
      var timeEntry = report.data[i];
      if (project && timeEntry.project != project) ignoreEntry = true;
      for (tag in timeEntry.tags) {
        if (tag in ignoreTags) {
          ignoreEntry = true;
        }
      }
      if (!ignoreEntry) {
        timesheet.push(timeEntry);
      }
    }
    ++page;
    report = fetchDetailsReport(apiToken, workspaceId, since, until, page);
  } while (page <= numberOfPages);

  return timesheet;
}

function getSheetName(startDate, endDate, timeZone, project) {
  var startDateString = "";
  var endDateString = "";

  var startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 0, 0, 0, 0);
  var endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  Logger.log("startOfMonth=", startOfMonth);
  Logger.log("endOfMonth=", endOfMonth);

  if ((startOfMonth.getTime() == startDate.getTime()) && (endOfMonth.getTime() == endDate.getTime())) {
    startDateString = Utilities.formatDate(startDate, timeZone, "yyyyMM");
  } else {
    startDateString = Utilities.formatDate(startDate, timeZone, "yyyyMMdd") + "-";
    endDateString = Utilities.formatDate(endDate, timeZone, "yyyyMMdd");
  }

  return project + startDateString + endDateString;
}

function createTimesheet(sheetName, timesheet) {

  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = activeSpreadsheet.getSheetByName(sheetName);
  if (sheet) {
    activeSpreadsheet.deleteSheet(sheet);
  }

  var sheet = activeSpreadsheet.insertSheet(sheetName, activeSpreadsheet.getSheets().length);

  var titles = sheet.getRange(1, 1, 1, 6);
  titles.setValues([
    ["Date", "Description", "Duration", "Start Date", "End Date", "Tags"]
  ]);
  titles.setFontWeights([
    ["bold", "bold", "bold", "bold", "bold", "bold"]
  ]);

  var row = 2
  for (var i = 0; i < timesheet.length; i++) {
    var timesheetEntry = timesheet[i];
    start = parseISODateTime(timesheetEntry["start"]);
    end = parseISODateTime(timesheetEntry["end"]);
    desc = timesheetEntry["description"];
    tags = timesheetEntry["tags"];
    dur = millisToDecimalHours(timesheetEntry["dur"]);

    sheet.getRange(row, 1, 1, 6).setValues([
      [start, desc, dur, start, end, tags]
    ]);
    sheet.getRange(row, 1).setNumberFormat("dd/MM/yyyy");
    sheet.getRange(row, 3).setNumberFormat("0.00");
    sheet.getRange(row, 4).setNumberFormat("HH:mm");
    sheet.getRange(row, 5).setNumberFormat("HH:mm");

    ++row;
  }
  sheet.autoResizeColumn(1);
  sheet.autoResizeColumn(2);
  sheet.autoResizeColumn(3);
  sheet.autoResizeColumn(4);
  sheet.autoResizeColumn(5);
  sheet.autoResizeColumn(6);
}

// http://googleappsdeveloper.blogspot.be/2012/05/insider-tips-for-using-apps-script-and.html
function loadConfiguration(wb, configSheet) {

  Logger.log("Loading configuration ...");

  var configsheet = wb.getSheetByName(configSheet);
  var result = new Array();

  var cfgdata = configsheet.getDataRange().getValues();
  for (i = 1; i < cfgdata.length; i++) {
    var key = cfgdata[i][0];
    var value = cfgdata[i][1];

    Logger.log("key: " + key + " - value: " + value);

    result[key] = value;
  }

  return result
}


export {
  month_invoice,
  range_invoice,
  load_projects,
  set_interval_1_days_exclusive,
  set_interval_this_week_exclusive,
  set_interval_previous_week_exclusive,
  set_interval_7_days_inclusive,
  set_interval_14_days_inclusive,
  getPreviousMonday,
  getMonday
};


