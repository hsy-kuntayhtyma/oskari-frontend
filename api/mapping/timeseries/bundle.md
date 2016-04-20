# Timeseries

## Description

Bundle creates timeseries playback module to over map when layer supports time dimensions.

## Screenshot

![screenshot](timeseries.png)

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> MapSizeChangedEvent </td><td> Update timeslider when map size have been changed.</td>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Checks playback slider visibility. </td>
  </tr>
  <tr>
    <td> AfterMapLayerAddEvent </td><td> Checks playback slider visibility. </td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td> Checks playback slider visibility. </td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](/documentation/bundles/framework/mapmodule) </td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to map/gain control to Openlayers map</td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td></td>
  </tr>
  <tr>
    <td> [Moment.js](http://momentjs.com//) </td>
    <td> Expects to be present in application setup. </td>
    <td> Calculate timeseries to playback slider. </td>
  </tr>
</table>
