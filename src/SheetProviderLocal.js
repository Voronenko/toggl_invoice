const fs = require('fs');
const fsp = require('fs').promises;
const readline = require('readline');
const {
  google
} = require('googleapis');

const TOKEN_PATH = 'token.json';


async function getAuth() {
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
  var that = this;

  this.defaultSheetName = "Config";
  this.startPosition = "";
  this.endPosition = "";

  this.spreadSheetId = "";


  this.auth = auth;

  this.getAuth = function() {
    return this.auth;
  }

  this.setAuth = function (auth) {
    that.auth = auth;
  }

  this.setSpreadSheetId = function(newId) {
    that.spreadSheetId = newId;
  }

  this.getWorkspaceID = async function (spreadsheetId) {
    const cell = await that.getCell(spreadsheetId, "Config!B4:B4");
    const workspaceId = cell.values[0][0];
    return workspaceId;
  }

  this.getTogglToken = async function (spreadsheetId) {
    const cell = await that.getCell(spreadsheetId, "Config!B5:B5");
    const togglToken = cell.values[0][0];
    return togglToken;
  }

  this.getStartDate = async function (spreadsheetId) {
    const cell = await that.getCell(spreadsheetId, "Config!B2:B2");
    const startDate = cell.values[0][0];
    return startDate;
  }

  this.getEndDate = async function (spreadsheetId) {
    const cell = await that.getCell(spreadsheetId, "Config!B3:B3");
    const startDate = cell.values[0][0];
    return startDate;
  }

  this.getProject = async function (spreadsheetId) {
    const cell = await that.getCell(spreadsheetId, "Config!B6:B6");
    const project = cell.values[0][0];
    return project;
  }

  this.getIgnoreTags = async function (spreadsheetId) {
    const cell = await that.getCell(spreadsheetId, "Config!B7:B7");
    const ignoretags = cell.values[0][0];
    return ignoretags;
  }

  this.loadConfiguration = async function (spreadsheetId) {
     return {
       timesheetStartDate: await that.getStartDate(spreadsheetId),
       timesheetEndDate: await that.getEndDate(spreadsheetId),
       workspaceId: await that.getWorkspaceID(spreadsheetId),
       apiToken: await that.getTogglToken(spreadsheetId),
       project: await that.getProject(spreadsheetId),
       ignoreTags: await that.getIgnoreTags(spreadsheetId),
     }
  }

  this.getActive = function() {
    return that;
  }

  this.getSheetByName = function(sheetName) {
     that.defaultSheetName = sheetName;
     return that
  }

  this.getActiveSpreadsheet = function() {
    return that;
  }

  this.getRange = function(col, row) {
     var setterObj = new SheetProvider(that.auth);
     setterObj.setRange(col, row);
     setterObj.setSpreadSheetId(that.spreadSheetId);
     return setterObj;
  }

  this.setRange = function (col, row) {
    that.startPosition = String.fromCharCode(64 + row) + col;
    that.endPosition = String.fromCharCode(64 + row) + col;
  }

  this.getCell = async function (spreadsheetId, range) {
      var sheets = google.sheets({
        version: 'v4',
        auth: that.auth
      });
      try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
      return response.data;
      } catch(err) {
       Logger.log("Api returned error", err);
       return -1;
      }
  }

  this.setValue = async function(value) {

    var sheets = google.sheets({
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
  }

}

export {
  getAuth,
  SheetProvider
}
