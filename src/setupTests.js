/*jshint esversion: 8 */
import {
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js';

import moment from 'moment-timezone';

const syncrequest = require('sync-request');

const sheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";

const Utilitiesmock = {
  base64Encode: function (value) {
    "use strict";
    return Buffer.from(value).toString('base64');
  },
  formatDate: function(someDate, timeZone="Europe/Helsinki", dateFormat="YYY-MM-DD") {
    /*jshint strict: false */
    let targetDateFormat = dateFormat;
    switch (dateFormat) {
      case 'yyyy-MM-dd':
         targetDateFormat = 'YYYY-MM-DD';
         break;
      case 'yyyyMMdd':
         targetDateFormat = 'YYYYMMDD';
         break;
      case 'yyyyMM':
         targetDateFormat = 'YYYYMM';
         break;

    }
    return moment(someDate).tz(timeZone).format(targetDateFormat);
  },
  removeItem: jest.fn(),
  clear: jest.fn(),
};


const Loggermock = {
  log: function (p1, p2="", p3="", p4="", p5="", p6="", p7="", p8="", p9="", p10="") {
    /*jshint strict: false */
    console.log(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
  }
};

const UrlFetchAppmock = {
  fetch: function(url, params) {
    "use strict";
    const response = syncrequest('GET', url, params);
    const body = response.getBody('utf8');
    return {
      getContentText: function() {
         return body;
      }
    };
  }
};

const SessionMock = {
  getScriptTimeZone: function() {
    "use strict";
    return "Europe/Helsinki";
  }
};

const auth = getAuth();
const SpreadsheetAppMock = new SheetProvider(auth);
SpreadsheetAppMock.setSpreadSheetId(sheetId);

global.Utilities = Utilitiesmock;
global.Logger = Loggermock;
global.UrlFetchApp = UrlFetchAppmock;
global.SpreadsheetApp = SpreadsheetAppMock;
global.Session = SessionMock;
