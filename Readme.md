# Personal Toggl invoice generator

, basing on ideas found in https://github.com/thinkinglabs/toggl-google-sheet/

This Google Apps script imports time entries from Toggl.com into a Google Sheet using their [Detailed Report API](https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md).

Report can be filtered by project, and drop ignored tags (like pomidoro-break, or nonbillable)

## Installation

### Simple

Open [this Google Sheet](https://docs.google.com/spreadsheets/d/19yda-N69KBc4EvxGnFQItDg0Y_cS7ZDg4Iq0WPfw4g8/edit?usp=sharing) and make a copy in your Google Drive account.

https://docs.google.com/spreadsheets/d/19yda-N69KBc4EvxGnFQItDg0Y_cS7ZDg4Iq0WPfw4g8/edit?usp=sharing

History:

[Toggle Invoice'2019.02](https://docs.google.com/spreadsheets/d/19yda-N69KBc4EvxGnFQItDg0Y_cS7ZDg4Iq0WPfw4g8/edit?usp=sharing )

[Toggle Invoice'2018.05](https://docs.google.com/spreadsheets/d/1lSqnC6dxMgknevUSmaINxam6LgNHvpkVPkXs8PBalQk/edit?usp=sharing )


### From scratch

Create a new Google Sheet.

Create a new script in your newly created Google Sheet and paste the contents of the files `Code.gs`, `Dates.gs` and `Toggl.gs` in their respective script files.

Edit "config" sheet to fill in your *workspace_id* and *api_token*.

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


## Deep troubleshouting with vscode

Google Apps Script built-in online editor. It provides error handling, some debugging, making it ideal to hash out a small automation project pretty quickly. However, one of its major limitations is that after 1,000 or so lines of code and multiple files, it can start to get a little annoying.  It also makes things a bit difficult when you want to use your own debugging or testing software.

Fortunately, Google developed a tool that enables us to develop Google Apps Script code from the command line, clasp.
https://developers.google.com/apps-script/guides/clasp


The steps to setting up Visual Studio for Google Apps Script production are as follows:

Install clasp via npm.
Give permission to run the Apps Script API.
Get text completion for Apps Script

clasp is run in node.js via npm. You will need to install a recent version of Node.js that is 6.0.0 or later.

```sh
npm i @google/clasp -g
```

To test to see if clasp is working, you can now type clasp into the command line. You should see a list of command option if all is working
Next, login.

```sh
clasp login
```

assuming you are working individually, grant all the required permissions.
One final little job you will need to do is to go into your Google Apps Script Settings and toggle the API to, on.
Do it under link https://script.google.com/home/usersettings

See docs below

https://yagisanatode.com/2019/04/01/working-with-google-apps-script-in-visual-studio-code-using-clasp/


## Acknowledgment
Credits go to [thinkinglabs](https://github.com/thinkinglabs/toggl-google-sheet/) which provided an example on how to use the Toggl API with Google Sheet.




