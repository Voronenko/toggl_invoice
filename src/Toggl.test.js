/*jshint esversion: 8 */
/*jshint strict: false */
import {
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js';

import {
  fetchProjects,
  fetchDetailsReport,
  fetchProjectTimesheet
} from './Toggl.js';

const fs = require('fs');

const sheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";


describe('Toggl Api works', () => {

  test("Project list can be retrieved", async () => {
    var auth = await getAuth();
    var sheetProvider = new SheetProvider(auth, sheetId);
    var workspaceID = await sheetProvider.getWorkspaceID();
    var apiToken = await sheetProvider.getTogglToken();
    var projects = fetchProjects(apiToken, workspaceID);
    expect(projects.length).toEqual(9);
  });

  test("Unsorted entries based on date period can be retrieved", async () => {
    var auth = await getAuth();
    // console.log(1, auth);
    var sheetProvider = new SheetProvider(auth, sheetId);
    var workspaceId = await sheetProvider.getWorkspaceID();
    var apiToken = await sheetProvider.getTogglToken();
    var entries = fetchDetailsReport(apiToken, workspaceId, "2020-07-01", "2020-08-31", 1);
    let data = JSON.stringify(entries);
    fs.writeFileSync('z-entries-since-to.json', data);
    expect(entries.total_count).toEqual(41);
  });

  test("Project entries based on date period can be retrieved", async () => {
    var auth = await getAuth();
    var sheetProvider = new SheetProvider(auth, sheetId);
    var workspaceId = await sheetProvider.getWorkspaceID();
    var apiToken = await sheetProvider.getTogglToken();
    var project_entries = fetchProjectTimesheet(apiToken, workspaceId, "2020-07-01", "2020-10-31", "toggltest", []);
    let data = JSON.stringify(project_entries);
    fs.writeFileSync('z-project-entries-since-to.json', data);
    expect(project_entries.length).toEqual(4);
  });







});
