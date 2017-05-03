import 'whatwg-fetch';
import moment from 'moment';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import find from 'lodash/find';
import { constants } from './actions';

function prepareHeaders(token) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    return json.then(error => Promise.reject(error));
  }
}

function extractIds(jsonRaw) {
  const ids = { inIds: [], outIds: [] };
  const json = jsonRaw.data ? jsonRaw.data : jsonRaw;
  forEach(json, mRaw => {
    const m = mRaw.attributes ? { id: mRaw.id, ...mRaw.attributes } : mRaw;
    if (m.direction === 'in') {
      ids.inIds.push(m.id);
    } else {
      ids.outIds.push(m.id);
    }
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

function formatScores(jsonRaw) {
  const scores = {};
  const json = map(jsonRaw.data || jsonRaw, jr => jr.attributes || jr);
  forEach(['fitting', 'autarchy', 'closeness', 'sufficiency'], type => {
    const score = find(json, j => j.mode === type);
    scores[type] = score ? score.value : 0;
  });
  return scores;
}

function generateRequests({ apiUrl, apiPath, ids, timestamp, resolution, token }) {
  return map(ids, id => (
    fetch(`${apiUrl}${apiPath}/aggregates/past?timestamp=${uriTimestamp(timestamp)}&resolution=${resolution}&register_ids=${id}`, { headers: prepareHeaders(token) })
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
  getIds: ({ apiUrl, apiPath, group, token }) => (
      fetch(`${apiUrl}${apiPath}/groups/${group}/registers`, { headers: prepareHeaders(token) })
      .then(parseResponse)
      .then(extractIds)
    ),
  getData: (params) => (
    Promise.all(generateRequests(params))
    .then(filterData)
  ),
  getScores: ({ apiUrl, apiPath, group, interval, timestamp, token }) => (
    fetch(`${apiUrl}${apiPath}/groups/${group}/scores?timestamp=${uriTimestamp(timestamp)}&interval=${interval}`, { headers: prepareHeaders(token) })
    .then(parseResponse)
    .then(formatScores)
  ),
};
