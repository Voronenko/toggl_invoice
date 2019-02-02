
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
 
  var url = "https://www.toggl.com/api/v8/workspaces/"+workspaceId+"/projects";
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
