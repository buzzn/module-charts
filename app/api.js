import 'whatwg-fetch';
import moment from 'moment';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import range from 'lodash/range';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import find from 'lodash/find';
import { constants } from './actions';

function prepareHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    return json.then(error => Promise.reject(error));
  }
}

function remainingPages({ apiUrl, apiPath, group, json }) {
  const totalPages = json.meta.total_pages;
  if (totalPages === 1) {
    return [json];
  } else {
    return Promise.all(map(range(totalPages), page => (
        fetch(`${apiUrl}${apiPath}/groups/${group}/metering-points?page=${page + 1}`, { headers: prepareHeaders() })
        .then(parseResponse)
      )));
  }
}

function extractIds(jsonArr) {
  const ids = { inIds: [], outIds: [] };
  forEach(jsonArr, json => {
    forEach(json.data, m => {
      if (m.attributes.mode === 'in') {
        ids.inIds.push(m.id);
      } else {
        ids.outIds.push(m.id);
      }
    });
  });
  return ids;
}

export function uriTimestamp(timestamp) {
  return encodeURIComponent(moment(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
}

export function getPower(v, resolution) {
  let power = 0;
  switch (resolution) {
    case constants.RESOLUTIONS.YEAR_MONTH:
    case constants.RESOLUTIONS.MONTH_DAY:
      power = v.energy_milliwatt_hour / 1000;
      break;
    default:
      power = v.power_milliwatt / 1000;
      break;
  }
  return power;
}

function formatScores(json) {
  const scores = {};
  forEach(['fitting', 'autarchy', 'closeness', 'sufficiency'], type => {
    const score = find(json.data, j => j.attributes.mode === type);
    scores[type] = score ? score.attributes.value : 0;
  });
  return scores;
}

function generateRequests({ apiUrl, apiPath, ids, timestamp, resolution }) {
  return map(ids, id => (
    fetch(`${apiUrl}${apiPath}/aggregates/past?timestamp=${uriTimestamp(timestamp)}&resolution=${resolution}&metering_point_ids=${[id]}`, { headers: prepareHeaders() })
    .then(parseResponse)
    .then(values => ({ id, values: map(values, v => ({ powerMilliwatt: getPower(v, resolution), timestamp: new Date(v.timestamp).getTime() })) }))
    )
  );
}

function filterData(data) {
  // [{ id, values }, ...], values can be array (if correct), or object (if incorrect)
  // values: [{ power_milliwatt, timestamp }]
  return filter(data, m => isArray(m.values));
}

export default {
  getIds: ({ apiUrl, apiPath, group }) => (
      fetch(`${apiUrl}${apiPath}/groups/${group}/metering-points`, { headers: prepareHeaders() })
      .then(parseResponse)
      .then(json => remainingPages({ apiUrl, apiPath, group, json }))
      .then(extractIds)
    ),
  getData: (params) => (
    Promise.all(generateRequests(params))
    .then(filterData)
  ),
  getScores: ({ apiUrl, apiPath, group, interval, timestamp }) => (
    fetch(`${apiUrl}${apiPath}/groups/${group}/scores?timestamp=${uriTimestamp(timestamp)}&interval=${interval}`, { headers: prepareHeaders() })
    .then(parseResponse)
    .then(formatScores)
  ),
};
