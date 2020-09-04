/*jshint esversion: 8 */
import {
  parseISODateTime
} from './Dates.js';

const fsp = require('fs').promises;
const {
  google
} = require('googleapis');

const TOKEN_PATH = 'token.json';


async function getAuth() {
  "use strict";
  const content = await fsp.readFile('credentials.json');
  const credentials = JSON.parse(content);

  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  const token = await fsp.readFile(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}


function SheetProvider(auth, spreadSheetId) {
  "use strict";
  const that = this;

  this.defaultSheetName = "Config";
  this.startPosition = "";
  this.endPosition = "";

  this.spreadSheetId = spreadSheetId;


  this.auth = auth;

  this.getAuth = function() {
    return this.auth;
  };

  this.setAuth = function (auth) {
    that.auth = auth;
  };

  this.setSpreadSheetId = function(newId) {
    that.spreadSheetId = newId;
  };

  this.getWorkspaceID = async function () {
    const cell = await that.getCell("Config!B4:B4");
    const workspaceId = cell.values[0][0];
    return workspaceId;
  };

  this.getTogglToken = async function () {
    const cell = await that.getCell("Config!B5:B5");
    const togglToken = cell.values[0][0];
    return togglToken;
  };

  this.getStartDate = async function () {
    const cell = await that.getCell("Config!B2:B2");
    const startDateRaw = cell.values[0][0];
    const startDate = parseISODateTime(startDateRaw);
    return startDate;
  };

  this.getEndDate = async function () {
    const cell = await that.getCell("Config!B3:B3");
    const endDateRaw = cell.values[0][0];
    const endDate = parseISODateTime(endDateRaw);
    return endDate;
  };

  this.getProject = async function () {
    const cell = await that.getCell("Config!B6:B6");
    const project = cell.values[0][0];
    return project;
  };

  this.getIgnoreTags = async function () {
    const cell = await that.getCell("Config!B7:B7");
    const ignoretags = cell.values[0][0];
    return ignoretags;
  };

  this.loadConfiguration = async function () {
     return {
       timesheetStartDate: await that.getStartDate(),
       timesheetEndDate: await that.getEndDate(),
       workspaceId: await that.getWorkspaceID(),
       apiToken: await that.getTogglToken(),
       project: await that.getProject(),
       ignoreTags: await that.getIgnoreTags(),
     };
  };

  this.getActive = function() {
    return that;
  };

  this.getSheetByName = function(sheetName) {
     that.defaultSheetName = sheetName;
     return that;
  };

  this.getActiveSpreadsheet = function() {
    return that;
  };

  this.getRange = function(col, row) {
     const setterObj = new SheetProvider(that.auth);
     setterObj.setRange(col, row);
     setterObj.setSpreadSheetId(that.spreadSheetId);
     return setterObj;
  };

  this.setRange = function (col, row) {
    that.startPosition = String.fromCharCode(64 + row) + col;
    that.endPosition = String.fromCharCode(64 + row) + col;
  };

  this.getCell = async function (range) {
      const sheets = google.sheets({
        version: 'v4',
        auth: that.auth
      });
      try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: that.spreadSheetId,
        range: range,
      });
      return response.data;
      } catch(err) {
       Logger.log("Api returned error", err);
       return -1;
      }
  };

  this.setValue = async function(value) {

    const sheets = google.sheets({
      version: 'v4',
      auth: that.auth
    });

    let values = [
      [
        value
      ],
    ];

    const resource = {
      values,
    };

    let range = that.defaultSheetName + "!" + that.startPosition + ":" + that.endPosition;

    let spreadsheetId = that.spreadSheetId;

    try {
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource
      });
      return response;
    } catch (err) {
      Logger.log("Api returned error", err);
      return -1;
    }
  };

}

export {
  getAuth,
  SheetProvider
};
