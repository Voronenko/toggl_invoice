/*jshint esversion: 8 */
import {
  load_projects,
  set_interval_1_days_exclusive,
  set_interval_this_week_exclusive,
  set_interval_previous_week_exclusive,
  set_interval_7_days_inclusive,
  set_interval_14_days_inclusive,
} from './App.js';

import {
    getPreviousMonday,
    getMonday
} from './Dates.js';

import {
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js';

const spreadsheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";

function formatYMD(date) {
  "use strict";
  let d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}

describe('Menu interval actions', () => {
        "use strict";
      test("set_interval_1_days_exclusive", async () => {
        const auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        const sheetProvider = new SheetProvider(auth, spreadsheetId);

        await set_interval_1_days_exclusive();

        let endDate = new Date();
        const startDate = new Date(endDate.getTime() - 1 * (24 * 3600 * 1000));
        endDate = startDate;

        const startcell = await sheetProvider.getCell("Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell("Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));

      });

      test("set_interval_7_days_inclusive", async () => {
        const auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        const sheetProvider = new SheetProvider(auth, spreadsheetId);

        await set_interval_7_days_inclusive();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell("Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell("Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));

      });

      test("set_interval_14_days_inclusive", async () => {
        const auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        const sheetProvider = new SheetProvider(auth, spreadsheetId);

        await set_interval_14_days_inclusive();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell("Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell("Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });

      test("set_interval_previous_week_exclusive", async () => {
        const auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        const sheetProvider = new SheetProvider(auth, spreadsheetId);

        await set_interval_previous_week_exclusive();

        const today = new Date();
        const startDate = getPreviousMonday(today);
        const endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell("Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell("Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });


      test("set_interval_this_week_exclusive", async () => {
        const auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        const sheetProvider = new SheetProvider(auth, spreadsheetId);

        await set_interval_this_week_exclusive();

        const today = new Date();
        const startDate = getMonday(today);
        const endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell("Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell("Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });

      test("set_interval_14_days_inclusive", async () => {
        const auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        const sheetProvider = new SheetProvider(auth, spreadsheetId);

        await set_interval_14_days_inclusive();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell("Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell("Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });


    }
);
