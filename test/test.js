/* global test, expect, jest */
const mvg = require('..');

jest.setTimeout(10000);

test('API', () => {
  expect(typeof mvg).toBe('object');
  expect(typeof mvg.getMessages).toBe('function');
  expect(typeof mvg.getIncidents).toBe('function');
  expect(typeof mvg.getLines).toBe('function');
  expect(typeof mvg.getStations).toBe('function');
  expect(typeof mvg.getDepartures).toBe('function');
  expect(typeof mvg.getVehicles).toBe('function');
  expect(typeof mvg.getLocations).toBe('function');
  expect(typeof mvg.getPlans).toBe('function');
  expect(typeof mvg.getPlan).toBe('function');
});

// Messages

test('Fetch all messages', async () => {
  expect.assertions(11);
  const data = await mvg.getMessages();
  expect(data).toBeArray();
  const child = data[0];
  expect(child).toBeDefined();
  expect(child.title).toBeDefined();
  expect(child.description).toBeDefined();
  expect(child.publication).toBeDefined();
  expect(child.validFrom).toBeDefined();
  expect(child.validTo).toBeDefined();
  expect(child.id).toBeDefined();
  expect(child.type).toBeDefined();
  expect(child.lines).toBeArray();
  expect(child.eventTypes).toBeArray();
});

// Incidents

test('Fetch all incidents', async () => {
  expect.assertions(11);
  const data = await mvg.getIncidents();
  expect(data).toBeArray();
  const child = data[0];
  expect(child).toBeDefined();
  expect(child.title).toBeDefined();
  expect(child.description).toBeDefined();
  expect(child.publication).toBeDefined();
  expect(child.validFrom).toBeDefined();
  expect(child.validTo).toBeDefined();
  expect(child.id).toBeDefined();
  expect(child.type).toBeDefined();
  expect(child.lines).toBeArray();
  expect(child.eventTypes).toBeArray();
});

// Lines

test('Fetch all lines', async () => {
  expect.assertions(7);
  const data = await mvg.getLines();
  expect(data).toBeArray();
  const child = data[0];
  expect(child).toBeDefined();
  expect(child.sev).toBeDefined();
  expect(child.partialNet).toBeDefined();
  expect(child.product).toBeDefined();
  expect(child.lineNumber).toBeDefined();
  expect(child.divaId).toBeDefined();
});

// Stations

test('Fetch all stations', async () => {
  expect.assertions(14);
  const data = await mvg.getStations();
  expect(data).toBeArray();
  const child = data[0];
  expect(child).toBeDefined();
  expect(child.type).toBeDefined();
  expect(child.latitude).toBeDefined();
  expect(child.longitude).toBeDefined();
  expect(child.id).toBeDefined();
  expect(child.place).toBeDefined();
  expect(child.name).toBeDefined();
  expect(child.hasLiveData).toBeDefined();
  expect(child.hasZoomData).toBeDefined();
  expect(child.products).toBeArray();
  expect(child.aliases).toBeDefined();
  expect(child.link).toBeDefined();
  expect(child.lines).toBeDefined();
});

// Departures

test('Fetch departures for a specific station', async () => {
  expect.assertions(18);
  const data = await mvg.getDepartures(70);
  expect(data.servingLines).toBeArray();
  expect(data.departures).toBeArray();
  const childLine = data.servingLines[0];
  expect(childLine).toBeDefined();
  expect(childLine.destination).toBeDefined();
  expect(childLine.sev).toBeDefined();
  expect(childLine.partialNet).toBeDefined();
  expect(childLine.product).toBeDefined();
  expect(childLine.lineNumber).toBeDefined();
  expect(childLine.divaId).toBeDefined();
  const childDeparture = data.departures[0];
  expect(childDeparture).toBeDefined();
  expect(childDeparture.departureTime).toBeDefined();
  expect(childDeparture.product).toBeDefined();
  expect(childDeparture.label).toBeDefined();
  expect(childDeparture.destination).toBeDefined();
  expect(childDeparture.live).toBeDefined();
  expect(childDeparture.lineBackgroundColor).toBeDefined();
  expect(childDeparture.departureId).toBeDefined();
  expect(childDeparture.sev).toBeDefined();
});

test('Fetch departures for a specific station with a custom configuration', async () => {
  expect.assertions(18);
  const data = await mvg.getDepartures(70, {
    footway: false,
    bus: true,
    ubahn: true,
    sbahn: true,
    tram: false,
    zug: true
  });
  expect(data.servingLines).toBeArray();
  expect(data.departures).toBeArray();
  const childLine = data.servingLines[0];
  expect(childLine).toBeDefined();
  expect(childLine.destination).toBeDefined();
  expect(childLine.sev).toBeDefined();
  expect(childLine.partialNet).toBeDefined();
  expect(childLine.product).toBeDefined();
  expect(childLine.lineNumber).toBeDefined();
  expect(childLine.divaId).toBeDefined();
  const childDeparture = data.departures[0];
  expect(childDeparture).toBeDefined();
  expect(childDeparture.departureTime).toBeDefined();
  expect(childDeparture.product).toBeDefined();
  expect(childDeparture.label).toBeDefined();
  expect(childDeparture.destination).toBeDefined();
  expect(childDeparture.live).toBeDefined();
  expect(childDeparture.lineBackgroundColor).toBeDefined();
  expect(childDeparture.departureId).toBeDefined();
  expect(childDeparture.sev).toBeDefined();
});

test('getDepartures() rejects in case the "stationId" parameter is undefined', async () => {
  expect.assertions(1);
  await expect(mvg.getDepartures()).rejects.toMatchObject(new Error('Missing stationId'));
});

// Vehicles

test('Fetch all vehicles for a specific latitude/longitude', async () => {
  expect.assertions(5);
  const data = await mvg.getVehicles('48.1373968', '11.5732598');
  expect(data).toBeDefined();
  expect(data.bikeStations).toBeArray();
  expect(data.bikes).toBeArray();
  expect(data.carStations).toBeArray();
  expect(data.cars).toBeArray();
});

test('getVehicles() rejects in case the "latitude" and/or "longitude" parameters are undefined', async () => {
  expect.assertions(1);
  await expect(mvg.getVehicles()).rejects.toMatchObject(new Error('Missing latitude and/or longitude'));
});

// Locations

test('Search for streets and POIs', async () => {
  expect.assertions(8);
  const data = await mvg.getLocations('Leopold');
  expect(data).toBeArray();
  const child = data[0];
  expect(child).toBeDefined();
  expect(child.type).toBeDefined();
  expect(child.latitude).toBeDefined();
  expect(child.longitude).toBeDefined();
  expect(child.place).toBeDefined();
  expect(child.street).toBeDefined();
  expect(child.poi).toBeDefined();
});

test('getLocations() rejects in case the "query" parameter is undefined', async () => {
  expect.assertions(1);
  await expect(mvg.getLocations()).rejects.toMatchObject(new Error('Missing query'));
});

// Network plans

test('Fetch all available network plans', async () => {
  expect.assertions(6);
  const data = await mvg.getPlans();
  expect(data).toBeArray();
  const child = data.find((plan) => plan.planId === 'BOB');
  expect(child).toBeDefined();
  expect(child.title).toBeDefined();
  expect(child.titles).toBeDefined();
  expect(child.titles.de).toEqual('Bayerische Oberlandbahn');
  expect(child.titles.en).toEqual('Bayerische Oberlandbahn');
});

test('Fetch a specific network plan', async () => {
  expect.assertions(5);
  const data = await mvg.getPlan('bob');
  expect(data.planId).toEqual('BOB');
  expect(data.title).toBeDefined();
  expect(data.titles).toBeDefined();
  expect(data.titles.de).toEqual('Bayerische Oberlandbahn');
  expect(data.titles.en).toEqual('Bayerische Oberlandbahn');
});

test('getPlan() rejects in case the "planName" parameter is undefined', async () => {
  expect.assertions(1);
  await expect(mvg.getPlan()).rejects.toMatchObject(new Error('Missing plan name'));
});
