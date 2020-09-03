/*jshint esversion: 8 */
/*jshint camelcase: false */
import {
  fetchProjects,
  fetchDetailsReport,
  fetchProjectTimesheet
} from './Toggl.js';

import {
  getPreviousMonday,
  getMonday,
  parseISODateTime,
  millisToDecimalHours,
  daysOfMonth
} from './Dates.js';

const SHT_CONFIG = 'Config';
const DATE_FORMAT_SHEET = 'yyyy-MM-dd';

function getSheetName(startDate, endDate, timeZone, project) {
  "use strict";
  var startDateString = "";
  var endDateString = "";

  var startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 0, 0, 0, 0);
  var endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  Logger.log("startOfMonth=", startOfMonth);
  Logger.log("endOfMonth=", endOfMonth);

  if ((startOfMonth.getTime() === startDate.getTime()) && (endOfMonth.getTime() === endDate.getTime())) {
    startDateString = Utilities.formatDate(startDate, timeZone, "yyyyMM");
  } else {
    startDateString = Utilities.formatDate(startDate, timeZone, "yyyyMMdd") + "-";
    endDateString = Utilities.formatDate(endDate, timeZone, "yyyyMMdd");
  }

  return project + startDateString + endDateString;
}


async function set_interval_1_days_exclusive() {
  "use strict";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var endDate = new Date();
  var startDate = new Date(endDate.getTime() - 1 * (24 * 3600 * 1000));
  endDate = startDate;
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));

}


async function set_interval_7_days_inclusive() {
  "use strict";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var endDate = new Date();
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));

  var startDate = new Date(endDate.getTime() - 7 * (24 * 3600 * 1000));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_14_days_inclusive() {
  "use strict";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var endDate = new Date();
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));

  var startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_previous_week_exclusive() {
  "use strict";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var today = new Date();
  var startDate = getPreviousMonday(today);
  var endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_this_week_exclusive() {
  "use strict";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  var timeZone = Session.getScriptTimeZone();

  var today = new Date();
  var startDate = getMonday(today);
  var endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
}

// Generate time sheet for month
function month_invoice(config) {
  "use strict";

  var timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  var timesheetStartDate = config.timesheetStartDate;
  Logger.log("start date: " + timesheetStartDate);
  var startDate = new Date(timesheetStartDate.getFullYear(), timesheetStartDate.getMonth(), 1);
  var since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  var days = daysOfMonth(startDate.getFullYear(), startDate.getMonth());

  var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), days);
  Logger.log("end date: " + endDate);
  var until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);

  var ignoreTagsStr = config.ignoreTags || "";
  var ignoreTags = ignoreTagsStr.split(",");
  var timesheet = fetchProjectTimesheet(config.apiToken, config.workspaceId, since, until, config.project, ignoreTags);
  var sheetName = getSheetName(startDate, endDate, timeZone, config.project);
  return {
    timesheet: timesheet,
    sheetName: sheetName
  };
}

// Generate time sheet for range
async function range_invoice(config) {
  "use strict";

  var timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  var timesheetStartDate = config.timesheetStartDate;
  Logger.log("start date: " + timesheetStartDate);
  var startDate = new Date(timesheetStartDate.getFullYear(), timesheetStartDate.getMonth(), timesheetStartDate.getDay());
  var since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  var timesheetEndDate = config.timesheetEndDate;
  var endDate = new Date(timesheetEndDate.getFullYear(), timesheetEndDate.getMonth(), timesheetEndDate.getDay());
  Logger.log("end date: " + endDate);
  var until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);

  var ignoreTagsStr = config.ignoreTags || "";
  var ignoreTags = ignoreTagsStr.split(",");

  var timesheet = await fetchProjectTimesheet(config.apiToken, config.workspaceId, since, until, config.project, ignoreTags);
  var sheetName = getSheetName(startDate, endDate, timeZone, config.project);

  return {
    timesheet: timesheet,
    sheetName: sheetName
  };
}


function load_projects(config) {
  "use strict";
  var projects = fetchProjects(config.apiToken, config.workspaceId);
  var configSheet = SpreadsheetApp.getActive().getSheetByName(SHT_CONFIG);

  var currentRow = 2;
  for (var i = 0; i < projects.length; i++) {
    configSheet.getRange('F' + currentRow).setValue(projects[i].id);
    configSheet.getRange('G' + currentRow).setValue(projects[i].name);
    currentRow++;
  }
}

function createTimesheet(sheetName, timesheet) {
  "use strict";

  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var existingSheet = activeSpreadsheet.getSheetByName(sheetName);
  if (existingSheet) {
    activeSpreadsheet.deleteSheet(existingSheet);
  }

  var sheet = activeSpreadsheet.insertSheet(sheetName, activeSpreadsheet.getSheets().length);

  var titles = sheet.getRange(1, 1, 1, 6);
  titles.setValues([
    ["Date", "Description", "Duration", "Start Date", "End Date", "Tags"]
  ]);
  titles.setFontWeights([
    ["bold", "bold", "bold", "bold", "bold", "bold"]
  ]);

  var row = 2;
  for (var i = 0; i < timesheet.length; i++) {
    let timesheetEntry = timesheet[i];
    let start = parseISODateTime(timesheetEntry.start);
    let end = parseISODateTime(timesheetEntry.end);
    let desc = timesheetEntry.description;
    let tags = timesheetEntry.tags;
    let dur = millisToDecimalHours(timesheetEntry.dur);

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
  getMonday,
  createTimesheet,
  getSheetName
};


