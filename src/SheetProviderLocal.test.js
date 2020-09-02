import {
  authorize,
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js'

const sheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";


describe('Config pane', () => {

      test("getAuth is provided", () => {
        expect(getAuth).toBeTruthy();
      });


      test("WorkspaceID is specified", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var workspaceID = sheetProvider.getWorkspaceID(sheetId);
        expect(workspaceID).resolves.toEqual("1162029");
      });

      test("Toggl token is specified", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var cell = await sheetProvider.getTogglToken(sheetId);
        expect(cell).toBeTruthy();
      });

      test("Start date is specified", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var value = sheetProvider.getStartDate(sheetId);
        expect(value).resolves.toEqual("7/1/2020");
      });

      test("End date is specified", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var value = sheetProvider.getEndDate(sheetId);
        expect(value).resolves.toEqual("8/22/2020");
      });

      test("Project is specified", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var value = sheetProvider.getProject(sheetId);
        expect(value).resolves.toEqual("LittleBigMake");
      });

      test("Ignore tags are specified", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var value = sheetProvider.getIgnoreTags(sheetId);
        expect(value).resolves.toEqual("pomidoro-break, sync1, standup1");
      });

      test("Configuration can be read as a whole", async () => {
        var auth = await getAuth();
        var sheetProvider = new SheetProvider(auth);
        var value = await sheetProvider.loadConfiguration(sheetId);
        expect(value.apiToken).toBeTruthy();
        expect(value.ignoreTags).toEqual("pomidoro-break, sync1, standup1");
        expect(value.project).toBeTruthy();
        expect(value.timesheetStartDate).toBeTruthy();
        expect(value.timesheetEndDate).toBeTruthy();
        expect(value.workspaceId).toEqual("1162029");
      });

     }
);
