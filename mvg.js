const axios = require('axios');

const API_BASE_URL = 'https://apps.mvg-fahrinfo.de/v10/rest/10.0/';
const API_KEY = 'aklKa290LsadOLW';

const PRODUCTS = [
  'SBAHN',
  'TRAM',
  'BUS',
  'UBAHN',
  'BAHN',
  'SCHIFF'
];

const DEPARTURES_DEFAULTS = {
  footway: 0,
  bus: 1,
  ubahn: 1,
  sbahn: 1,
  tram: 1,
  zug: 1
};

function apiRequest(method, url, config = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: method.toLowerCase(),
      url: `${API_BASE_URL}${url}`,
      params: Object.assign({
        apiKey: API_KEY
      }, config.params || {}),
      data: config.data || {}
    }).then((response) => {
      resolve(response.data);
    }).catch(reject);
  });
}

function getMessages() {
  return new Promise((resolve, reject) => {
    apiRequest('get', 'messages').then((response) => {
      resolve(response.messages);
    }).catch(reject);
  });
}

function getIncidents() {
  return new Promise((resolve, reject) => {
    apiRequest('get', 'messages/incidents').then((response) => {
      resolve(response.messages);
    }).catch(reject);
  });
}

function getLines() {
  return new Promise((resolve, reject) => {
    apiRequest('get', 'dynamicdata/lines').then(resolve).catch(reject);
  });
}

function getStations() {
  return new Promise((resolve, reject) => {
    apiRequest('get', 'dynamicdata/stationData').then((response) => {
      resolve(response.stations);
    }).catch(reject);
  });
}

function getDepartures(stationId, config = {}) {
  if (!stationId) {
    return Promise.reject(new Error('Missing stationId'));
  }
  return new Promise((resolve, reject) => {
    const filters = {};
    Object.keys(DEPARTURES_DEFAULTS).forEach((prop) => {
      const propValue = (config[prop] ? 1 : 0);
      filters[prop] = config[prop] !== undefined ? propValue : DEPARTURES_DEFAULTS[prop];
    });
    apiRequest('get', `departure/${stationId}`, {
      params: filters
    }).then(resolve).catch(reject);
  });
}

function getVehicles(latitude, longitude) {
  if (!latitude || !longitude) {
    return Promise.reject(new Error('Missing latitude and/or longitude'));
  }
  return new Promise((resolve, reject) => {
    apiRequest('post', 'vehicles/available/count', {
      data: {
        type: 'location',
        latitude,
        longitude
      }
    }).then((response) => {
      resolve(response);
    }).catch(reject);
  });
}

function getLocations(query) {
  if (!query) {
    return Promise.reject(new Error('Missing query'));
  }
  return new Promise((resolve, reject) => {
    apiRequest('get', 'routing/streetsAndPois', {
      params: {
        query
      }
    }).then((response) => {
      resolve(response.locations);
    }).catch(reject);
  });
}

function getPlans() {
  return new Promise((resolve, reject) => {
    apiRequest('get', 'dynamicdata/availablePlans', {
      params: {
        showDefaultPlansOnly: 0,
        world: 1
      }
    }).then((response) => {
      resolve(response.networkPlans.map((plan) => {
        let titles = {};
        try {
          titles = JSON.parse(plan.title);
        } catch (e) {} // eslint-disable-line no-empty
        return Object.assign(plan, {
          titles
        });
      }));
    }).catch(reject);
  });
}

function getPlan(planName) {
  if (!planName) {
    return Promise.reject(new Error('Missing plan name'));
  }
  return new Promise((resolve, reject) => {
    apiRequest('get', `dynamicdata/plan/${planName.toUpperCase()}`, {
      params: {
        includeThumbnailData: 0,
        includeImageData: 0,
        world: 1
      }
    }).then((response) => {
      let titles = {};
      try {
        titles = JSON.parse(response.title);
      } catch (e) {} // eslint-disable-line no-empty
      resolve(Object.assign(response, {
        titles
      }));
    }).catch(reject);
  });
}

module.exports = {
  PRODUCTS,
  getMessages,
  getIncidents,
  getLines,
  getStations,
  getDepartures,
  getVehicles,
  getLocations,
  getPlans,
  getPlan
};
