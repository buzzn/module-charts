import 'whatwg-fetch';
import moment from 'moment';

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

export default {
  getGroupChart: ({ apiUrl, apiPath, groupId, timestamp, resolution, token }) => (
    fetch(`${apiUrl}${apiPath}/${groupId}/charts?timestamp=${uriTimestamp(timestamp)}&duration=${resolution}`, { headers: prepareHeaders(token) })
    .then(parseResponse)
    .then(data => ([
      {
        id: 0,
        direction: 'in',
        name: 'Consumption',
        color: '#00bcd4',
        values: data.in.map(d => ({ value: d.value / 1000, timestamp: new Date(d.timestamp).getTime() * 1000 }))
      },
      {
        id: 1,
        direction: 'out',
        name: 'Production',
        color: '#afb42b',
        values: data.out.map(d => ({ value: d.value / 1000, timestamp: new Date(d.timestamp).getTime() * 1000 }))
      },
    ]))
  ),
};
