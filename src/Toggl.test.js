import {
  authorize,
  getAuth,
  SheetProvider
} from './SheetProviderLocal.js'

import {
  fetchProjects,
  fetchDetailsReport,
  fetchProjectTimesheet
} from './Toggl.js'

const fs = require('fs');

const sheetId = "1YF6laLAx2SXgImPahbyZva0_GuFKElqh612mBNG7tMI";


describe('Toggl Api works', () => {

  // test("Project list can be retrieved", async () => {
  //   var auth = await getAuth();
  //   // console.log(1, auth);
  //   var sheetProvider = new SheetProvider(auth);
  //   var workspaceID = await sheetProvider.getWorkspaceID(sheetId);
  //   var apiToken = await sheetProvider.getTogglToken(sheetId);
  //   var projects = fetchProjects(apiToken, workspaceID);
  //   expect(projects.length).toEqual(9);
  // });

//   test("Unsorted entries based on date period can be retrieved", async () => {
//     var auth = await getAuth();
//     // console.log(1, auth);
//     var sheetProvider = new SheetProvider(auth);
//     var workspaceId = await sheetProvider.getWorkspaceID(sheetId);
//     var apiToken = await sheetProvider.getTogglToken(sheetId);
// //    var entries = fetchDetailsReport(apiToken, workspaceId, "2019-09-28", "2019-09-30", 1);
//     var entries = fetchDetailsReport(apiToken, workspaceId, "2020-07-01", "2020-08-31", 1);
//     let data = JSON.stringify(entries);
//     fs.writeFileSync('z-entries-since-to.json', data);
// //    expect(entries.total_count).toEqual(2);
//     expect(entries.total_count).toEqual(41);
//   });

  test("Project entries based on date period can be retrieved", async () => {
    var auth = await getAuth();
    var sheetProvider = new SheetProvider(auth);
    var workspaceId = await sheetProvider.getWorkspaceID(sheetId);
    var apiToken = await sheetProvider.getTogglToken(sheetId);
    var project_entries = fetchProjectTimesheet(apiToken, workspaceId, "2020-07-01", "2020-08-31", "LittleBigMake", []);
    let data = JSON.stringify(project_entries);
    fs.writeFileSync('z-project-entries-since-to.json', data);
    expect(entries.total_count).toEqual(2);
  });







});
