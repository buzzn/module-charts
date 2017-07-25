import chunk from 'lodash/chunk';

import { constants } from '../actions';

export function getMomentPeriod(resolution) {
  let period = 'day';

  switch (resolution) {
    case constants.RESOLUTIONS.YEAR_MONTH:
      period = 'year';
      break;
    case constants.RESOLUTIONS.MONTH_DAY:
      period = 'month';
      break;
    case constants.RESOLUTIONS.HOUR_MINUTE:
      period = 'hour';
      break;
    default:
    case constants.RESOLUTIONS.DAY_MINUTE:
      period = 'day';
      break;
  }

  return period;
}

function formatNumber(value) {
  const decimalPoint = ',';
  let remainder = 0;
  let leadingNumber = 0;
  let formattedNumber = '';

  if (value >= 1000000000000000) {
    remainder = ((value % 1000000000000000) / 1000000000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000000000);
  } else if (value >= 1000000000000) {
    remainder = ((value % 1000000000000) / 1000000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000000);
  } else if (value >= 1000000000) {
    remainder = ((value % 1000000000) / 1000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000);
  } else if (value >= 1000000) {
    remainder = ((value % 1000000) / 1000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000);
  } else if (value >= 1000) {
    remainder = (value % 1000).toFixed(0);
    leadingNumber = Math.floor(value / 1000);
  } else {
    remainder = 0;
    leadingNumber = value.toFixed(0);
  }
  if (remainder !== 0) {
    if (remainder < 1) {
      formattedNumber = leadingNumber.toString();
    } else if (remainder < 10) {
      formattedNumber = `${leadingNumber}${decimalPoint}00`;
    } else if (remainder < 100) {
      formattedNumber = `${leadingNumber}${decimalPoint}0${((remainder / 10).toFixed(0))}`;
    } else if (remainder < 1000) {
      formattedNumber = `${leadingNumber}${decimalPoint}${((remainder / 10).toFixed(0))}`;
    }
  } else {
    formattedNumber = leadingNumber.toString();
  }

  return formattedNumber;
}

export function formatLabel(value, mode, type) {
  if (typeof value !== 'number') return value;
  let result = '';

  const number = formatNumber(value);
  if (value >= 1000000000000000) {
    result = `${number} PW`;
  } else if (value >= 1000000000000) {
    result = `${number} TW`;
  } else if (value >= 1000000000) {
    result = `${number} GW`;
  } else if (value >= 1000000) {
    result = `${number} MW`;
  } else if (value >= 1000) {
    result = `${number} kW`;
  } else {
    result = `${number} W`;
  }
  return type === 'h' ? `${result}h` : result;
}

export function calcEnergy(rawData, resolution, timestamp) {
  let data = rawData;

  switch (resolution) {
    case constants.RESOLUTIONS.HOUR_MINUTE:
      if (rawData.length === 0) return 0;
      if (timestamp) {
        return (rawData.find(v => v.timestamp === timestamp) || {}).value || 0;
      } else {
        return rawData.reduce((s, d) => (d.value + s), 0) / rawData.length;
      }
    case constants.RESOLUTIONS.DAY_MINUTE:
      if (timestamp) {
        data = rawData.filter(v => v.timestamp <= timestamp);
        // dirty hack, that will allow user to see energy on :00 points and no on :45 points.
        if (data.length === 0) return 0;
        data.pop();
      }
      if (data.length === 0) return '-----';
      if ((data.length % 4 !== 0) && timestamp) return '-----';
      return chunk(data, 4).reduce((sh, h) => (h.reduce((sv, v) => (sv + v.value), 0) / 4) + sh, 0);
    case constants.RESOLUTIONS.MONTH_DAY:
    case constants.RESOLUTIONS.YEAR_MONTH:
      if (rawData.length === 0) return 0;
      if (timestamp) {
        return (rawData.find(v => v.timestamp === timestamp) || {}).value || 0;
      } else {
        return rawData.reduce((s, d) => (d.value + s), 0);
      }
    default:
      return 0;
  }
}
