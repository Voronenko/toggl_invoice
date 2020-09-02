var SHT_CONFIG = 'Config';

// Custom menu
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
     {name: "Get Invoice for Month", functionName: "month_invoice"},
     {name: "Get Invoice for Range", functionName: "range_invoice"},
     {name: "-----Configure:-----", functionName: "do_nothing"},
     {name: "Load Projects Data", functionName: "load_projects"},
     {name: "Set time interval - yesterday", functionName: "set_interval_1_days_exclusive"},
     {name: "Set time interval - this week", functionName: "set_interval_this_week_exclusive"},
     {name: "Set time interval - last week", functionName: "set_interval_previous_week_exclusive"},
     {name: "Set time interval - last 7 days incl.", functionName: "set_interval_7_days_inclusive"},
     {name: "Set time interval - last 14 days incl.", functionName: "set_interval_14_days_inclusive"},
  ];
  ss.addMenu("Toggl", menuEntries);
}

function do_nothing(){
}

function month_invoice() {
  app.month_invoice();
}

function range_invoice() {
  app.range_invoice();
}

function load_projects() {
  app.load_projects();
}

function set_interval_1_days_exclusive() {
  app.set_interval_1_days_exclusive();
}

function set_interval_this_week_exclusive() {
  app.set_interval_this_week_exclusive();
}

function set_interval_previous_week_exclusive() {
  app.set_interval_previous_week_exclusive();
}

function set_interval_7_days_inclusive() {
  app.set_interval_7_days_inclusive();
}

function set_interval_14_days_inclusive() {
  app.set_interval_14_days_inclusive();
}
