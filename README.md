# MVG

> A simple API adapter for fetching live data (timetables, stations, lines, messages, incidents, etc.) from MVG (Münchner Verkehrsgesellschaft)

[![Build Status](https://travis-ci.org/rasshofer/mvg.svg)](https://travis-ci.org/rasshofer/mvg)
[![Coverage Status](https://coveralls.io/repos/github/rasshofer/mvg/badge.svg)](https://coveralls.io/github/rasshofer/mvg)
[![Dependency Status](https://david-dm.org/rasshofer/mvg/status.svg)](https://david-dm.org/rasshofer/mvg)
[![Dependency Status](https://david-dm.org/rasshofer/mvg/dev-status.svg)](https://david-dm.org/rasshofer/mvg)

## Usage

```shell
npm install --save-dev mvg
```

```js
const mvg = require('mvg');

mvg.getStations().then((stations) => {
  const demo = stations.find((station) => station.name === 'Universität');
  mvg.getDepartures(demo.id).then((departures) => {
    console.log(departures);
  });
});
```

## API

### `getMessages()`

> Fetches all known messages like incidents or schedule changes

#### Example

```js
mvg.getMessages().then((messages) => {
  console.log(messages);
});
```

#### Response

```json
[
  {
    "title": "Ab ca. 22.00 Uhr abschnittsweise Bus statt U-Bahn (SEV) wegen Schienenschleifarbeiten",
    "description": "Wegen Schienenschleifarbeiten wird die U2 von Montag, 9. April mit Donnerstag, 12. April 2018, jeweils ab ca. 22.00 Uhr bis Betriebsschluss, zwischen Innsbrucker Ring und Messestadt Ost durch Busse ersetzt. Letzte durchfahrende Züge: Ab Messestadt Ost 22.15 Uhr, ab Feldmoching 21.34 Uhr (Hauptbahnhof 21.52 Uhr).",
    "publication": 1522131665000,
    "validFrom": 1523239200000,
    "validTo": 1523570340000,
    "id": "227050003",
    "links": [
      {
        "text": "Für weitere Informationen bitte hier klicken / For further information please klick here",
        "url": "https://www.mvg.de/betriebsaenderungen/2018-03-25-schienenschleifzug"
      }
    ],
    "type": "SCHEDULE_CHANGES",
    "lines": [
      {
        "sev": false,
        "product": "UBAHN",
        "lineNumber": "U2",
        "divaId": "UBAHNU2"
      }
    ],
    "eventTypes": []
  }
]
```

### `getIncidents()`

> Fetches all known incidents

#### Example

```js
mvg.getIncidents().then((incidents) => {
  console.log(incidents);
});
```

#### Response

```json
[
  {
    "title": "Verkehrsbedingte Fahrplanabweichungen",
    "description": "Liebe Fahrgäste,<br /><br />bei der Buslinie 100 kommt es derzeit wegen der Sperrung des Altstadtringtunnels zu Beeinträchtigungen. Es ist mit Verspätungen sowie vereinzelten Fahrzeugausfällen und vorzeitigen Wendungen zu rechnen. Die Behinderungen dauern noch vsl. bis 3. April an. Bitte planen Sie daher längere Reisezeiten ein.<br /><br />Wir bitten wir um Ihr Verständnis.<br /> <br />Ihre MVG",
    "publication": 1522057217000,
    "validFrom": 1522057200000,
    "validTo": 1522792500000,
    "id": "2055043199",
    "type": "INCIDENT",
    "lines": [
        {
        "sev": false,
        "product": "BUS",
        "lineNumber": "100",
        "divaId": "BUS100"
      }
    ],
    "eventTypes": []
  }
]
```

### `getLines()`

> Fetches all available lines

#### Example

```js
mvg.getLines().then((lines) => {
  console.log(lines);
});
```

#### Response

```json
[
  {
    "sev": false,
    "partialNet": "mvv",
    "product": "SBAHN",
    "lineNumber": "S1",
    "divaId": "01001"
  }
]
```

### `getStations()`

> Fetches all available stations

#### Example

```js
mvg.getStations().then((stations) => {
  console.log(stations);
});
```

#### Response

```json
[
  {
    "type": "station",
    "latitude": 48.1391669640734,
    "longitude": 11.5652403434013,
    "id": 1,
    "place": "München",
    "name": "Karlsplatz (Stachus)",
    "hasLiveData": true,
    "hasZoomData": true,
    "products": [
      "SBAHN",
      "UBAHN",
      "TRAM",
      "BUS"
    ],
    "aliases": "Stachus Bf. Bahnhof Muenchen Munchen",
    "link": "KA",
    "lines": {
      "tram": [],
      "nachttram": [],
      "sbahn": [],
      "ubahn": [],
      "bus": [],
      "nachtbus": [],
      "otherlines": []
    }
  }
]
```

### `getDepartures(stationId [, config])`

> Fetches serving lines and departures for a specific station

#### Parameters

* (`String` | `Number`) `stationId` (Required) The station ID
* (`Object`) `config` (Optional) Custom filter configuration regarding lines/services

#### Examples

```js
mvg.getDepartures(70).then((departures) => {
  console.log(departures);
});
```

```js
mvg.getDepartures(70, {
  footway: false,
  bus: true,
  ubahn: true,
  sbahn: true,
  tram: false,
  zug: true
}).then((departures) => {
  console.log(departures);
});
```

#### Response

```json
{
  "servingLines": [
    {
      "destination": "Fürstenried West",
      "sev": false,
      "partialNet": "mvv",
      "product": "UBAHN",
      "lineNumber": "U3",
      "divaId": "21003"
    }
  ],
  "departures": [
    {
      "departureTime": 1522406360000,
      "product": "UBAHN",
      "label": "U3",
      "destination": "Moosach",
      "live": true,
      "lineBackgroundColor": "#ef8824",
      "departureId": 810156845,
      "sev": false
    }
  ]
}
```

### `getVehicles(latitude, longitude)`

> Fetches available vehicles (i.e. rental bikes and car sharing offerings) for a specific location

#### Parameters

* (`String` | `Number`) `latitude` (Required) Latitude
* (`String` | `Number`) `longitude` (Required) Longitude

#### Example

```js
mvg.getVehicles('48.1373968', '11.5732598').then((vehicles) => {
  console.log(vehicles);
});
```

#### Response

```json
{
  "type": "vehicleDataNearby",
  "bikeStations": [
    {
      "type": "bikeStation",
      "name": "Universität",
      "location": {
        "type": "location",
        "latitude": 48.1495361328125,
        "longitude": 11.580649375915527
      },
      "availableBikeCount": 1
    }
  ],
  "bikes": [
    {
      "type": "bike",
      "name": "96947",
      "location": {
        "type": "location",
        "latitude": 48.1495361328125,
        "longitude": 11.580649375915527
      }
    }
  ],
  "carStations": [],
  "cars": []
}
```

### `getLocations(query)`

> Fetches streets and POIs matching a specific query

#### Parameters

* (`String`) `query` (Required) Search query

#### Example

```js
mvg.getLocations('Leopold').then((locations) => {
  console.log(locations);
});
```

#### Response

```json
[
  {
    "type": "address",
    "latitude": 48.170596,
    "longitude": 11.585905,
    "place": "München",
    "street": "Leopoldstraße",
    "poi": false
  }
]
```

### `getPlans()`

> Fetches details for all plans/services

#### Example

```js
mvg.getPlans().then((plans) => {
  console.log(plans);
});
```

#### Response

```json
[
  {
    "fileSize": "1036887",
    "md5Hash": "ad87578d4d375fcebdb9f6a637351936",
    "planId": "SCHNELL",
    "title": "{\"de\":\"Schnellbahnnetz\",\"en\":\"Suburban train network\",\"by\":\"Schneibahnnetz\"}",
    "validFrom": "2017-12-10",
    "provider": "MVV",
    "sortIndex": 1,
    "minLatitude": 0,
    "maxLatitude": 0,
    "minLongitude": 0,
    "maxLongitude": 0,
    "rotationAngle": 0,
    "titles": {
      "de": "Schnellbahnnetz",
      "en": "Suburban train network",
      "by": "Schneibahnnetz"
    }
  }
]
```

### `getPlan(planName)`

> Fetches details for a specific plan/service

#### Example

```js
mvg.getPlan('SCHNELL').then((plan) => {
  console.log(plan);
});
```

#### Response

```json
{
  "fileSize": "1036887",
  "md5Hash": "ad87578d4d375fcebdb9f6a637351936",
  "planId": "SCHNELL",
  "title": "{\"de\":\"Schnellbahnnetz\",\"en\":\"Suburban train network\",\"by\":\"Schneibahnnetz\"}",
  "validFrom": "2017-12-10",
  "provider": "MVV",
  "sortIndex": 1,
  "minLatitude": 0,
  "maxLatitude": 0,
  "minLongitude": 0,
  "maxLongitude": 0,
  "rotationAngle": 0,
  "titles": {
    "de": "Schnellbahnnetz",
    "en": "Suburban train network",
    "by": "Schneibahnnetz"
  }
}
```

## Changelog

* 1.0.0
  * Initial version

## Disclaimer

This project consumes the official [MVG Fahrinfo app](https://www.mvg.de/services/mobile-services/fahrinfo.html) API and is not related, acknowledged, or sponsored by MVG or SWM. Use at your own risk.

## License

Copyright (c) 2018 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
