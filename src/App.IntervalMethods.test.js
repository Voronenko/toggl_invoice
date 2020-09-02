import {
  set_interval_1_days_exclusive,
  set_interval_7_days_inclusive,
  set_interval_14_days_inclusive,
  set_interval_previous_week_exclusive,
  set_interval_this_week_exclusive,
} from './App.js'

import {
    getPreviousMonday,
    getMonday
} from './Dates.js'

import {
  authorize,
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js'

import moment from 'moment';

const spreadsheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";

function formatYMD(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

describe('Menu actions', () => {

      test("set_interval_1_days_exclusive", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth);

        var res = await set_interval_1_days_exclusive();

        var endDate = new Date();
        var startDate = new Date(endDate.getTime() - 1 * (24 * 3600 * 1000));
        endDate = startDate;

        const startcell = await sheetProvider.getCell(spreadsheetId, "Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell(spreadsheetId, "Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));

      });

      test("set_interval_7_days_inclusive", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth);

        var res = await set_interval_7_days_inclusive();

        var endDate = new Date();
        var startDate = new Date(endDate.getTime() - 7 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell(spreadsheetId, "Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell(spreadsheetId, "Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));

      });

      test("set_interval_14_days_inclusive", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth);

        var res = await set_interval_14_days_inclusive();

        var endDate = new Date();
        var startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell(spreadsheetId, "Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell(spreadsheetId, "Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });

      test("set_interval_previous_week_exclusive", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth);

        var res = await set_interval_previous_week_exclusive();

        var today = new Date();
        var startDate = getPreviousMonday(today);
        var endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell(spreadsheetId, "Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell(spreadsheetId, "Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });


      test("set_interval_this_week_exclusive", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth);

        var res = await set_interval_this_week_exclusive();

        var today = new Date();
        var startDate = getMonday(today);
        var endDate = new Date(startDate.getTime() + 6 * (24 * 3600 * 1000));

        const startcell = await sheetProvider.getCell(spreadsheetId, "Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell(spreadsheetId, "Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });

      test("set_interval_14_days_inclusive", async () => {
        var auth = await getAuth();
        global.SpreadsheetApp.setAuth(auth);
        var sheetProvider = new SheetProvider(auth);

        var res = await set_interval_14_days_inclusive();

        var endDate = new Date();
        var startDate = new Date(endDate.getTime() - 14 * (24 * 3600 * 1000))

        const startcell = await sheetProvider.getCell(spreadsheetId, "Config!B2:B2");
        const sheetStartDate = startcell.values[0][0];

        const endcell = await sheetProvider.getCell(spreadsheetId, "Config!B3:B3");
        const sheetEndDate = endcell.values[0][0];

        expect(sheetStartDate).toEqual(formatYMD(startDate));
        expect(sheetEndDate).toEqual(formatYMD(endDate));
      });


    }
);
