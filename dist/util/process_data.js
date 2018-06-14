"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMomentPeriod = getMomentPeriod;
exports.formatLabel = formatLabel;
exports.calcEnergy = calcEnergy;

var _chunk = _interopRequireDefault(require("lodash/chunk"));

var _actions = require("../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMomentPeriod(resolution) {
  var period = 'day';

  switch (resolution) {
    case _actions.constants.RESOLUTIONS.YEAR_MONTH:
      period = 'year';
      break;

    case _actions.constants.RESOLUTIONS.MONTH_DAY:
      period = 'month';
      break;

    case _actions.constants.RESOLUTIONS.HOUR_MINUTE:
      period = 'hour';
      break;

    default:
    case _actions.constants.RESOLUTIONS.DAY_MINUTE:
      period = 'day';
      break;
  }

  return period;
}

function formatNumber(value) {
  var decimalPoint = ',';
  var remainder = 0;
  var leadingNumber = 0;
  var formattedNumber = '';

  if (value >= 1000000000000000) {
    remainder = (value % 1000000000000000 / 1000000000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000000000);
  } else if (value >= 1000000000000) {
    remainder = (value % 1000000000000 / 1000000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000000);
  } else if (value >= 1000000000) {
    remainder = (value % 1000000000 / 1000000).toFixed(0);
    leadingNumber = Math.floor(value / 1000000000);
  } else if (value >= 1000000) {
    remainder = (value % 1000000 / 1000).toFixed(0);
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
      formattedNumber = "".concat(leadingNumber).concat(decimalPoint, "00");
    } else if (remainder < 100) {
      formattedNumber = "".concat(leadingNumber).concat(decimalPoint, "0").concat((remainder / 10).toFixed(0));
    } else if (remainder < 1000) {
      formattedNumber = "".concat(leadingNumber).concat(decimalPoint).concat((remainder / 10).toFixed(0));
    }
  } else {
    formattedNumber = leadingNumber.toString();
  }

  return formattedNumber;
}

function formatLabel(value, mode, type) {
  if (typeof value !== 'number') return value;
  var result = '';
  var number = formatNumber(value);

  if (value >= 1000000000000000) {
    result = "".concat(number, " PW");
  } else if (value >= 1000000000000) {
    result = "".concat(number, " TW");
  } else if (value >= 1000000000) {
    result = "".concat(number, " GW");
  } else if (value >= 1000000) {
    result = "".concat(number, " MW");
  } else if (value >= 1000) {
    result = "".concat(number, " kW");
  } else {
    result = "".concat(number, " W");
  }

  return type === 'h' ? "".concat(result, "h") : result;
}

function calcEnergy(rawData, resolution, timestamp) {
  var data = rawData;

  switch (resolution) {
    case _actions.constants.RESOLUTIONS.HOUR_MINUTE:
      if (rawData.length === 0) return 0;

      if (timestamp) {
        return (rawData.find(function (v) {
          return v.timestamp === timestamp;
        }) || {}).value || 0;
      } else {
        return rawData.reduce(function (s, d) {
          return d.value + s;
        }, 0) / rawData.length;
      }

    case _actions.constants.RESOLUTIONS.DAY_MINUTE:
      if (timestamp) {
        data = rawData.filter(function (v) {
          return v.timestamp <= timestamp;
        }); // dirty hack, that will allow user to see energy on :00 points and not on :45 points.

        if (data.length === 0) return 0;
        data.pop();
      }

      if (data.length === 0) return '-----';
      if (data.length % 4 !== 0 && timestamp) return '-----';
      return (0, _chunk.default)(data, 4).reduce(function (sh, h) {
        return h.reduce(function (sv, v) {
          return sv + v.value;
        }, 0) / 4 + sh;
      }, 0);

    case _actions.constants.RESOLUTIONS.MONTH_DAY:
    case _actions.constants.RESOLUTIONS.YEAR_MONTH:
      if (rawData.length === 0) return 0;

      if (timestamp) {
        return (rawData.find(function (v) {
          return v.timestamp === timestamp;
        }) || {}).value || 0;
      } else {
        return rawData.reduce(function (s, d) {
          return d.value + s;
        }, 0);
      }

    default:
      return 0;
  }
}

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getMomentPeriod, "getMomentPeriod", "app/util/process_data.js");

  __REACT_HOT_LOADER__.register(formatNumber, "formatNumber", "app/util/process_data.js");

  __REACT_HOT_LOADER__.register(formatLabel, "formatLabel", "app/util/process_data.js");

  __REACT_HOT_LOADER__.register(calcEnergy, "calcEnergy", "app/util/process_data.js");
}();

;