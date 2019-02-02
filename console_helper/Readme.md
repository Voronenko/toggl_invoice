zsh console helper for TogglCli https://pypi.org/project/togglCli/	 

Docs: https://toggl.adam-uhlir.me/
Source:  https://github.com/auhau/toggl-cli/


You can now tab complete most of the toggl commands in your terminal

```sh

Usage: toggl [OPTIONS] [ACTION]

Options:
  -h, --help     show this help message and exit
  -q, --quiet    don't print anything
  -v, --verbose  print additional info
  -d, --debug    print debugging output

Actions:
  add DESCR [:WORKSPACE] [@PROJECT | #PROJECT_ID] START_DATETIME ('d'DURATION | END_DATETIME)
	creates a completed time entry
  add DESCR [:WORKSPACE] [@PROJECT | #PROJECT_ID] 'd'DURATION
	creates a completed time entry, with start time DURATION ago
  clients
	lists all clients
  continue [from DATETIME | 'd'DURATION]
	restarts the last entry
  continue DESCR [from DATETIME | 'd'DURATION]
	restarts the last entry matching DESCR
  ls
	list recent time entries
  now
	print what you're working on now
  workspaces
	lists all workspaces
  projects [:WORKSPACE]
	lists all projects
  rm ID
	delete a time entry by id
  start DESCR [:WORKSPACE] [@PROJECT | #PROJECT_ID] ['d'DURATION | DATETIME]
	starts a new entry
  stop [DATETIME]
	stops the current entry
  www
	visits toggl.com

  DURATION = [[Hours:]Minutes:]Seconds



```


