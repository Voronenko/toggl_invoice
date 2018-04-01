# Personal Toggl invoice generator

, basing on ideas found in https://github.com/thinkinglabs/toggl-google-sheet/

This Google Apps script imports time entries from Toggl.com into a Google Sheet using their [Detailed Report API](https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md).

Report can be filtered by project, and drop ignored tags (like pomidoro-break, or nonbillable)

## Installation

### Simple

Open [this Google Sheet](https://docs.google.com/spreadsheets/d/1lSqnC6dxMgknevUSmaINxam6LgNHvpkVPkXs8PBalQk/edit?usp=sharing ) and make a copy in your Google Drive account.

### From scratch

Create a new Google Sheet.

Create a new script in your newly created Google Sheet and paste the contents of the files `Code.gs`, `Dates.gs` and `Toggl.gs` in their respective script files.

Edit `Toggl.gs` to fill in your *workspace_id* and *api_token*.

To figure out your *workspace_id*: go to Team in toggl.com. The number at the end of the URL is the workspace id.

To figure out your *api_token*: go to your Profile in toggl.com, your API token is at the bottom of the page.

## Usage
After a reopen of your Google Sheet you will have a new menu open called "*Toggl*" with a sub-menu 

"*Get Invoice for Month*". 

Fill an any date of the month you want to import in cell B1. So if you want your timesheet for December 2019, fill the date 01/12/2019 and click *Toggl > Get Invoice for Month*.

"*Get Invoice for Range*".

Fill a start and end date of the period you want to import in cell B1 and C1. So if you want your timesheet for Q4 2019, fill the date 01/10/2019 - 31/12/2019  and 
click *Toggl > Get Invoice for Range*.

All reports support filtering by project - click  *Toggl > Load Projects Data* to load list of the projects for your account 

## Acknowledgment
Credits go to [thinkinglabs](https://github.com/thinkinglabs/toggl-google-sheet/) which provided an example on how to use the Toggl API with Google Sheet.



