/*jshint esversion: 8 */
function fetchDetailsReport(apiToken, workspaceId, since, until, page) {
  "use strict";

  const usernamePassword = apiToken + ":api_token";
  const digest = "Basic " + Utilities.base64Encode(usernamePassword);

  const url = "https://api.track.toggl.com/reports/api/v2/details";
  let queryString = "workspace_id=" + workspaceId + "&user_agent=TogglePersonalExporter" + "&since=" + since + "&until=" + until;
  if (page) {
    queryString = queryString + "&page=" + page;
  }
  const response = UrlFetchApp.fetch(url + "?" + queryString, {
    method: "get",
    headers: {
      "Authorization": digest
    }
  });
  const responseBody = response.getContentText();
  const result = JSON.parse(responseBody);
  return result;
}

function fetchProjects(apiToken, workspaceId) {
  "use strict";

  const usernamePassword = apiToken + ":api_token";
  const digest = "Basic " + Utilities.base64Encode(usernamePassword);

  Logger.log("Digest: " + digest);

  const url = "https://api.track.toggl.com/api/v8/workspaces/" + workspaceId + "/projects";
  const queryString = "";
  const response = UrlFetchApp.fetch(url + "?" + queryString, {
    method: "get",
    headers: {
      "Authorization": digest
    }
  });
  const responseBody = response.getContentText();
  const result = JSON.parse(responseBody);
  return result;
}


function fetchProjectTimesheet(apiToken, workspaceId, since, until, project, ignoreTags) {
  "use strict";

  Logger.log("PROJECT='" + project + "'");
  let timesheet = [];

  let report = fetchDetailsReport(apiToken, workspaceId, since, until);
  Logger.log("total count: " + report.total_count + " - per page: " + report.per_page);
  const numberOfPages = Math.ceil(report.total_count / report.per_page);
  Logger.log("number of pages: " + numberOfPages);
  let page = 1;
  do {
    for (let i = 0; i < report.data.length; i++) {
      let ignoreEntry = false;
      let timeEntry = report.data[i];
      if (project && timeEntry.project !== project) {
        ignoreEntry = true;
      }
      Logger.log(timeEntry.project, "|", project, "|", ignoreEntry);
      for (let tag in timeEntry.tags) {
        if (tag in ignoreTags) {
          ignoreEntry = true;
        }
      }
      if (!ignoreEntry) {
        timesheet.push(timeEntry);
      }
    }
    ++page;
    report = fetchDetailsReport(apiToken, workspaceId, since, until, page);
  } while (page <= numberOfPages);
  return timesheet;
}


export {
  fetchProjects,
  fetchDetailsReport,
  fetchProjectTimesheet
};
