/*jshint esversion: 8 */
import {
  range_invoice,
  month_invoice,
  getSheetName
} from './App.js';

import {
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js';

import fs from 'fs';

const spreadsheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";

beforeAll(() => {
});

beforeEach(() => {
});

describe('Menu report actions', () => {
      "use strict";

      test("getSheetName", () => {
         let startDate1 = new Date("2020-09-01");
         let endDate1 = new Date("2020-10-15");

         let startDate2 = new Date("2020-09-01");
         let endDate2 = new Date("2020-09-30");

         let title1 = getSheetName(startDate1, endDate1, "Europe/Helsinki", "testproject");
         let title2 = getSheetName(startDate2, endDate2, "Europe/Helsinki", "testproject");
         expect(title1).toEqual("testproject20200901-20201015");
         expect(title2).toEqual("testproject202009");
      });


    test("range_invoice works over month", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth, spreadsheetId);

        var config = await sheetProvider.loadConfiguration();
        config.project = "toggltest";
        config.timesheetStartDate = new Date("2020-09-01");
        config.timesheetEndDate = new Date("2020-09-30");

        var projectEntries = await range_invoice(config);
        let data = JSON.stringify(projectEntries);
        fs.writeFileSync('z-rangeinvoice-toggltest-entries-sep1-sep30.json', data);
        expect(projectEntries.sheetName).toEqual("toggltest202009");
        expect(projectEntries.timesheet.length).toEqual(4);
        expect(projectEntries.since).toEqual("2020-09-01");
        expect(projectEntries.until).toEqual("2020-09-30");
      });


    test("month_invoice works over any end date", async () => {
      var auth = await getAuth();
      global.SpreadsheetApp.setAuth(auth);
      var sheetProvider = new SheetProvider(auth, spreadsheetId);

      var config = await sheetProvider.loadConfiguration();
      config.project = "toggltest";
      config.timesheetStartDate = new Date("2020-09-01");
      config.timesheetEndDate = new Date("2020-10-30");

      var projectEntries = await month_invoice(config);
      let data = JSON.stringify(projectEntries);
      fs.writeFileSync('z-monthinvoice-toggltest-entries-sep1-oct30.json', data);
      expect(projectEntries.sheetName).toEqual("toggltest202009");
      expect(projectEntries.timesheet.length).toEqual(4);
      expect(projectEntries.since).toEqual("2020-09-01");
      expect(projectEntries.until).toEqual("2020-09-30");
    });
});
