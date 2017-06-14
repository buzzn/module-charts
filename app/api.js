import 'whatwg-fetch';
import moment from 'moment';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
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

export function uriTimestamp(timestamp) {
  return encodeURIComponent(moment(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
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

export default {
  getChart: ({ apiUrl, apiPath, group, timestamp, resolution, token }) => (
    fetch(`${apiUrl}${apiPath}/${group}/charts?timestamp=${uriTimestamp(timestamp)}&duration=${resolution}`)
    .then(parseResponse)
    .then(data => ({
      inData: data.in.map(d => ({ powerMilliwatt: d.value, timestamp: new Date(d.timestamp).getTime() })),
      outData: data.out.map(d => ({ powerMilliwatt: d.value, timestamp: new Date(d.timestamp).getTime() })),
    }))
  ),
  getScores: ({ apiUrl, apiPath, group, interval, timestamp, token }) => (
    fetch(`${apiUrl}${apiPath}/${group}/scores?timestamp=${uriTimestamp(timestamp)}&interval=${interval}`, { headers: prepareHeaders(token) })
    .then(parseResponse)
    .then(formatScores)
  ),
};
