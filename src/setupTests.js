import {
  authorize,
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js'

import moment from 'moment';

const syncrequest = require('sync-request');

const sheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";

const Utilitiesmock = {
  base64Encode: function (value) {
    return Buffer.from(value).toString('base64');
  },
  formatDate: function(someDate, timeZone, dateFormat) {
    return moment(someDate).format(dateFormat);
  },
  removeItem: jest.fn(),
  clear: jest.fn(),
};


const Loggermock = {
  log: function (p1, p2="", p3="", p4="", p5="", p6="", p7="", p8="", p9="", p10="") {
    console.log(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
  }
};

const UrlFetchAppmock = {
  fetch: function(url, params) {
    var response = syncrequest('GET', url, params);
    var body = response.getBody('utf8');
    return {
      getContentText: function() {
         return body;
      }
    }
  }
}

const SessionMock = {
  getScriptTimeZone: function() {
    return "Europe/Helsinki"
  }
}

const auth = getAuth();
var SpreadsheetAppMock = new SheetProvider(auth);
SpreadsheetAppMock.setSpreadSheetId(sheetId);

global.Utilities = Utilitiesmock;
global.Logger = Loggermock;
global.UrlFetchApp = UrlFetchAppmock;
global.SpreadsheetApp = SpreadsheetAppMock;
global.Session = SessionMock;
