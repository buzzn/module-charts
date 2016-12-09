import forEach from 'lodash/forEach';
import sortBy from 'lodash/sortBy';

import find from 'lodash/find';
import filter from 'lodash/filter';

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

export function matchesTimestamp(time1, time2, resolution) {
  const delta = Math.abs(time1 - time2);

  switch (resolution) {
    case constants.RESOLUTIONS.YEAR_MONTH:
      return delta <= 15 * 24 * 60 * 60 * 1000;
    case constants.RESOLUTIONS.MONTH_DAY:
      return delta <= 12 * 60 * 60 * 1000;
    case constants.RESOLUTIONS.DAY_MINUTE:
    default:
      return delta <= 8 * 60 * 1000;
    case constants.RESOLUTIONS.HOUR_MINUTE:
      return delta <= 1000;
  }
}

export function sumData({ data, resolution }) {
  if (data.length === 0) return [{ timestamp: (new Date).getTime(), powerMilliwatt: -1 }];

  const sortedData = sortBy(data, [d => (-d.values.length)]);
  const tail = sortedData.slice(1);
  let result = [];

  if (tail.length === 0) {
    result = sortedData[0].values;
  } else {
    forEach(sortedData[0].values, (value, idx) => {
      let { powerMilliwatt, timestamp } = value;
      forEach(tail, meteringPoint => {
        // console.log(filter(meteringPoint.values, v => matchesTimestamp(v.timestamp, timestamp, resolution)));
        const c = find(meteringPoint.values, v => matchesTimestamp(v.timestamp, timestamp, resolution));
        // console.log(filter(meteringPoint.values, v => v.timestamp === timestamp));
        // const c = find(meteringPoint.values, v => v.timestamp === timestamp);
        if (c) powerMilliwatt += c.powerMilliwatt;


        // const v = meteringPoint.values[idx];
        // if (v && v.timestamp && (v.timestamp === timestamp || matchesTimestamp(v.timestamp, timestamp, resolution))) {
        //   powerMilliwatt += v.powerMilliwatt;
        // }
      });
      result.push({ timestamp, powerMilliwatt });
    });
  }

  return result;
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

export function formatLabel(value, mode) {
  let result = '';

  const number = formatNumber(value);
  if (value >= 1000000000000000) {
    result = `${number} PWh`;
  } else if (value >= 1000000000000) {
    result = `${number} TWh`;
  } else if (value >= 1000000000) {
    result = `${number} GWh`;
  } else if (value >= 1000000) {
    result = `${number} MWh`;
  } else if (value >= 1000) {
    result = `${number} kWh`;
  } else {
    result = `${number} Wh`;
  }
  return result;
}
