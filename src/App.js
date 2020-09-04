/*jshint esversion: 8 */
/*jshint camelcase: false */
import {
  fetchProjects,
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
  let startDateString = "";
  let endDateString = "";

  const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0);
  const endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  Logger.log("startOfMonth=", startOfMonth);
  Logger.log("endOfMonth=", endOfMonth);

  if ((startOfMonth.toDateString() === startDate.toDateString()) && (endOfMonth.toDateString() === endDate.toDateString())) {
    startDateString = Utilities.formatDate(startDate, timeZone, "yyyyMM");
  } else {
    startDateString = Utilities.formatDate(startDate, timeZone, "yyyyMMdd") + "-";
    endDateString = Utilities.formatDate(endDate, timeZone, "yyyyMMdd");
  }

  return project + startDateString + endDateString;
}


async function set_interval_1_days_exclusive() {
  "use strict";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  const timeZone = Session.getScriptTimeZone();

  let endDate = new Date();
  const startDate = new Date(endDate.getTime() - 1 * (24 * 3600 * 1000));
  endDate = startDate;
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));

}


async function set_interval_7_days_inclusive() {
  "use strict";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  const timeZone = Session.getScriptTimeZone();

  const endDate = new Date();
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));

  const startDate = new Date(endDate.getTime() - 7 * (24 * 3600 * 1000));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_14_days_inclusive() {
  "use strict";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  const timeZone = Session.getScriptTimeZone();

  const endDate = new Date();
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));

  const startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000));
  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_previous_week_exclusive() {
  "use strict";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  const timeZone = Session.getScriptTimeZone();

  const today = new Date();
  const startDate = getPreviousMonday(today);
  const endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
}

async function set_interval_this_week_exclusive() {
  "use strict";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHT_CONFIG);
  const timeZone = Session.getScriptTimeZone();

  const today = new Date();
  const startDate = getMonday(today);
  const endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

  await sheet.getRange(2, 2).setValue(Utilities.formatDate(startDate, timeZone, DATE_FORMAT_SHEET));
  await sheet.getRange(3, 2).setValue(Utilities.formatDate(endDate, timeZone, DATE_FORMAT_SHEET));
}

// Generate time sheet for month
function month_invoice(config) {
  "use strict";

  const timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  const timesheetStartDate = config.timesheetStartDate;
  Logger.log("start date: " + timesheetStartDate);
  const startDate = new Date(timesheetStartDate.getFullYear(), timesheetStartDate.getMonth(), 1);
  const since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  const days = daysOfMonth(startDate.getFullYear(), startDate.getMonth());

  const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), days);
  Logger.log("end date: " + endDate);
  const until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);

  const ignoreTagsStr = config.ignoreTags || "";
  const ignoreTags = ignoreTagsStr.split(",");
  const timesheet = fetchProjectTimesheet(config.apiToken, config.workspaceId, since, until, config.project, ignoreTags);
  const sheetName = getSheetName(startDate, endDate, timeZone, config.project);
  return {
    timesheet: timesheet,
    sheetName: sheetName,
    since: since,
    until: until,
    project: config.project,
    ignoreTags: ignoreTags
  };
}

// Generate time sheet for range
async function range_invoice(config) {
  "use strict";

  const timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  const timesheetStartDate = config.timesheetStartDate;
  Logger.log("start date: " + timesheetStartDate);
  const startDate = new Date(timesheetStartDate.getFullYear(), timesheetStartDate.getMonth(), timesheetStartDate.getDate());
  const since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  const timesheetEndDate = config.timesheetEndDate;
  const endDate = new Date(timesheetEndDate.getFullYear(), timesheetEndDate.getMonth(), timesheetEndDate.getDate());
  Logger.log("end date: " + endDate);
  const until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);

  const ignoreTagsStr = config.ignoreTags || "";
  const ignoreTags = ignoreTagsStr.split(",");

  const timesheet = await fetchProjectTimesheet(config.apiToken, config.workspaceId, since, until, config.project, ignoreTags);
  const sheetName = getSheetName(startDate, endDate, timeZone, config.project);

  return {
    timesheet: timesheet,
    sheetName: sheetName,
    since: since,
    until: until,
    project: config.project,
    ignoreTags: ignoreTags
  };
}


function load_projects(config) {
  "use strict";
  const projects = fetchProjects(config.apiToken, config.workspaceId);
  const configSheet = SpreadsheetApp.getActive().getSheetByName(SHT_CONFIG);

  let currentRow = 2;
  for (let i = 0; i < projects.length; i++) {
    configSheet.getRange('F' + currentRow).setValue(projects[i].id);
    configSheet.getRange('G' + currentRow).setValue(projects[i].name);
    currentRow++;
  }
}

function createTimesheet(sheetName, timesheet) {
  "use strict";

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const existingSheet = activeSpreadsheet.getSheetByName(sheetName);
  if (existingSheet) {
    activeSpreadsheet.deleteSheet(existingSheet);
  }

  const sheet = activeSpreadsheet.insertSheet(sheetName, activeSpreadsheet.getSheets().length);

  let titles = sheet.getRange(1, 1, 1, 6);
  titles.setValues([
    ["Date", "Description", "Duration", "Start Date", "End Date", "Tags"]
  ]);
  titles.setFontWeights([
    ["bold", "bold", "bold", "bold", "bold", "bold"]
  ]);

  let row = 2;
  for (let i = 0; i < timesheet.length; i++) {
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


