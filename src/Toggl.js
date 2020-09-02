function fetchDetailsReport(apiToken, workspaceId, since, until, page) {

  var usernamePassword = apiToken + ":api_token";
  var digest = "Basic " + Utilities.base64Encode(usernamePassword);

  Logger.log("Use logger.log for logging");


  var url = "https://www.toggl.com/reports/api/v2/details";
  var queryString = "workspace_id=" + workspaceId + "&user_agent=TogglePersonalExporter" + "&since=" + since + "&until=" + until;
  if (page) {
    queryString = queryString + "&page=" + page;
  }
  var response = UrlFetchApp.fetch(url + "?" + queryString, {
    method: "get",
    headers: {
      "Authorization": digest
    }
  });
  var responseBody = response.getContentText();
  var result = JSON.parse(responseBody);
  return result;
}

function fetchProjects(apiToken, workspaceId) {

  var usernamePassword = apiToken + ":api_token";
  var digest = "Basic " + Utilities.base64Encode(usernamePassword);

  Logger.log("Digest: " + digest);

  var url = "https://www.toggl.com/api/v8/workspaces/" + workspaceId + "/projects";
  var queryString = "";
  var response = UrlFetchApp.fetch(url + "?" + queryString, {
    method: "get",
    headers: {
      "Authorization": digest
    }
  });
  var responseBody = response.getContentText();
  var result = JSON.parse(responseBody);
  return result;
}


function fetchProjectTimesheet(apiToken, workspaceId, since, until, project, ignoreTags) {

  Logger.log("PROJECT='" + project + "'");
  var timesheet = [];

  var report = fetchDetailsReport(apiToken, workspaceId, since, until);
  Logger.log("total count: " + report.total_count + " - per page: " + report.per_page);
  var numberOfPages = Math.ceil(report.total_count / report.per_page);
  Logger.log("number of pages: " + numberOfPages);
  var page = 1;
  do {
    for (var i = 0; i < report.data.length; i++) {
      var ignoreEntry = false;
      var timeEntry = report.data[i];
      if (project && timeEntry.project != project) ignoreEntry = true;
      Logger.log(timeEntry.project, "|", project, "|", ignoreEntry);
      for (var tag in timeEntry.tags) {
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
}
