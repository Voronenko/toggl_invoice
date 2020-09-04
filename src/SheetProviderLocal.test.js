/*jshint esversion: 8 */
import {
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js';

const sheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";


describe('Config pane', () => {
      "use strict";

      test("getAuth is provided", () => {
        expect(getAuth).toBeTruthy();
      });


      test("WorkspaceID is specified", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const workspaceID = sheetProvider.getWorkspaceID(sheetId);
        expect(workspaceID).resolves.toEqual("1162029");
      });

      test("Toggl token is specified", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const cell = await sheetProvider.getTogglToken();
        expect(cell).toBeTruthy();
      });

      test("Start date is specified", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const value = sheetProvider.getStartDate();
        expect(value).resolves.toBeTruthy();
      });

      test("End date is specified", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const value = sheetProvider.getEndDate();
        expect(value).resolves.toBeTruthy();
      });

      test("Project is specified", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const value = sheetProvider.getProject();
        expect(value).resolves.toBeTruthy();
      });

      test("Ignore tags are specified", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const value = sheetProvider.getIgnoreTags();
        expect(value).resolves.toEqual("pomidoro-break, sync1, standup1");
      });

      test("Configuration can be read as a whole", async () => {
        const auth = await getAuth();
        const sheetProvider = new SheetProvider(auth, sheetId);
        const value = await sheetProvider.loadConfiguration();
        expect(value.apiToken).toBeTruthy();
        expect(value.ignoreTags).toEqual("pomidoro-break, sync1, standup1");
        expect(value.project).toBeTruthy();
        expect(value.timesheetStartDate).toBeTruthy();
        expect(value.timesheetEndDate).toBeTruthy();
        expect(value.workspaceId).toEqual("1162029");
      });

     }
);

