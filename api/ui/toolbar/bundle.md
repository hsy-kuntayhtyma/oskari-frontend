# toolbar

Generic and extensible toolbar implementation

## Description

The toolbar bundle provides a common interface for other bundles to add and manipulate tool buttons to a common toolbar. Bundles can add, remove, disable and enable buttons in the toolbar. The toolbar is rendered to a HTML element with id "toolbar". The bundle doesn't create it but assumes it exists on the page.

## TODO

* Currently toolbar has a set of default buttons. These should probably be added by other bundles.
* Handling missing for disabling an active tool (selected tool is disabled through request)

## Screenshot

![screenshot](toolbar.png)

## Bundle configuration

Some configuration is needed for URLs:

```javascript
"conf": {
  "changeInfoUrl": {
    "en": "https://www.paikkatietoikkuna.fi/web/en/profile",
    "fi": "https://www.paikkatietoikkuna.fi/web/fi/profiili",
    "sv": "https://www.paikkatietoikkuna.fi/web/sv/profil"
  }
}
```

Toolgroups and tools can be excluded from being added by default.

In the example below, all tools are excluded from the toolbar.

```javascript
"conf": {
  "history": {
    "reset": false,
    "history_back": false,
    "history_forward": false
  },
  "basictools": {
    "zoombox": false,
    "select": false,
    "measureline": false,
    "measurearea": false
  },
  "viewtools": {
    "link": false,
    "print": false
  }
}
```

The following example also excludes all the tools from the toolbar, by setting all groups to false.

```javascript
"conf": {
  "history": false,
  "basictools": false,
  "viewtools": false
}
```

A tool button can be configured to be disabled by adding following to the configuration:

```javascript
"conf": {
  "disabled": true
}
```

## Bundle state

```javascript
state : {
  selected : {
    id : '<id for the selected button>',
    group: '<group for the selected button>'
  }
}
```

## Requests the bundle sends out

Currently default buttons send out requests but these should be defined in bundles that use toolbar.

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td> ToolSelectionRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> StateHandler.SetStateRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> ClearHistoryRequest </td><td> tbd</td>
  </tr>
</table>

## Dependencies

Depends on an element with id "toolbar" to be present on DOM.
Print and link buttons require mapfull bundle, Oskari.userinterface.component.Popup and Oskari.userinterface.component.Button from divmanazer bundle.

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create tool buttons/HTML</td>
  </tr>
</table>
