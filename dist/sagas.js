"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearData = clearData;
exports.fetchData = fetchData;
exports.getData = getData;
exports.chartSagas = chartSagas;
exports.default = chartsSaga;
exports.getCharts = exports.getConfig = void 0;

var _reduxSaga = require("redux-saga");

var _effects = require("redux-saga/effects");

var _moment = _interopRequireDefault(require("moment"));

var _actions = require("./actions");

var _api = _interopRequireDefault(require("./api"));

var _process_data = require("./util/process_data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(clearData),
    _marked2 =
/*#__PURE__*/
regeneratorRuntime.mark(fetchData),
    _marked3 =
/*#__PURE__*/
regeneratorRuntime.mark(getData),
    _marked4 =
/*#__PURE__*/
regeneratorRuntime.mark(chartSagas),
    _marked5 =
/*#__PURE__*/
regeneratorRuntime.mark(chartsSaga);

var getConfig = function getConfig(state) {
  return state.config;
};

exports.getConfig = getConfig;

var getCharts = function getCharts(state) {
  return state.charts;
};

exports.getCharts = getCharts;

function clearData() {
  return regeneratorRuntime.wrap(function clearData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.put)(_actions.actions.setData([]));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

function fetchData(_ref) {
  var apiUrl, apiPath, token, groupId, registerId, _ref2, resolution, timestamp, data;

  return regeneratorRuntime.wrap(function fetchData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          apiUrl = _ref.apiUrl, apiPath = _ref.apiPath, token = _ref.token, groupId = _ref.groupId, registerId = _ref.registerId;
          _context2.next = 3;
          return (0, _effects.put)(_actions.actions.loading());

        case 3:
          _context2.next = 5;
          return (0, _effects.select)(getCharts);

        case 5:
          _ref2 = _context2.sent;
          resolution = _ref2.resolution;
          timestamp = _ref2.timestamp;
          _context2.prev = 8;
          _context2.next = 11;
          return (0, _effects.call)(_api.default.getGroupChart, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            groupId: groupId,
            timestamp: timestamp,
            resolution: resolution,
            token: token
          });

        case 11:
          data = _context2.sent;
          _context2.next = 14;
          return (0, _effects.put)(_actions.actions.setData(data));

        case 14:
          _context2.next = 21;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](8);
          console.log(_context2.t0);
          _context2.next = 21;
          return (0, _effects.call)(clearData);

        case 21:
          _context2.next = 23;
          return (0, _effects.put)(_actions.actions.loaded());

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this, [[8, 16]]);
}

function getData(_ref3, _ref4) {
  var apiUrl, apiPath, token, groupId, registerId, _ref5, resolution, timestamp, shouldUpdate, updateDelay, _ref6, chartUpdate;

  return regeneratorRuntime.wrap(function getData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          apiUrl = _ref3.apiUrl, apiPath = _ref3.apiPath, token = _ref3.token;
          groupId = _ref4.groupId, registerId = _ref4.registerId;

        case 2:
          if (!true) {
            _context3.next = 39;
            break;
          }

          _context3.next = 5;
          return (0, _effects.call)(fetchData, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            registerId: registerId
          });

        case 5:
          _context3.next = 7;
          return (0, _effects.select)(getCharts);

        case 7:
          _ref5 = _context3.sent;
          resolution = _ref5.resolution;
          timestamp = _ref5.timestamp;
          shouldUpdate = _ref5.shouldUpdate;

          if (!shouldUpdate) {
            _context3.next = 33;
            break;
          }

          updateDelay = 5 * 60 * 1000;
          _context3.t0 = resolution;
          _context3.next = _context3.t0 === _actions.constants.RESOLUTIONS.YEAR_MONTH ? 16 : _context3.t0 === _actions.constants.RESOLUTIONS.MONTH_DAY ? 18 : _context3.t0 === _actions.constants.RESOLUTIONS.HOUR_MINUTE ? 20 : _context3.t0 === _actions.constants.RESOLUTIONS.DAY_MINUTE ? 22 : 22;
          break;

        case 16:
          updateDelay = 24 * 60 * 60 * 1000;
          return _context3.abrupt("break", 24);

        case 18:
          updateDelay = 60 * 60 * 1000;
          return _context3.abrupt("break", 24);

        case 20:
          updateDelay = 5 * 60 * 1000;
          return _context3.abrupt("break", 24);

        case 22:
          updateDelay = 30 * 60 * 1000;
          return _context3.abrupt("break", 24);

        case 24:
          _context3.next = 26;
          return (0, _effects.race)({
            delay: (0, _effects.call)(_reduxSaga.delay, updateDelay),
            chartUpdate: (0, _effects.take)(_actions.constants.CHART_UPDATE)
          });

        case 26:
          _ref6 = _context3.sent;
          chartUpdate = _ref6.chartUpdate;

          if (!(!chartUpdate && (0, _moment.default)(timestamp).endOf((0, _process_data.getMomentPeriod)(resolution)).isBefore(new Date()))) {
            _context3.next = 31;
            break;
          }

          _context3.next = 31;
          return (0, _effects.put)(_actions.actions.setTimestamp(new Date()));

        case 31:
          _context3.next = 35;
          break;

        case 33:
          _context3.next = 35;
          return (0, _effects.take)(_actions.constants.CHART_UPDATE);

        case 35:
          _context3.next = 37;
          return (0, _effects.call)(clearData);

        case 37:
          _context3.next = 2;
          break;

        case 39:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3, this);
}

function chartSagas(_ref7) {
  var apiUrl, apiPath, token, groupId, registerId;
  return regeneratorRuntime.wrap(function chartSagas$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          apiUrl = _ref7.apiUrl, apiPath = _ref7.apiPath, token = _ref7.token, groupId = _ref7.groupId, registerId = _ref7.registerId;
          _context4.next = 3;
          return (0, _effects.takeLatest)(_actions.constants.SET_GROUP_ID, getData, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token
          });

        case 3:
          if (!groupId) {
            _context4.next = 6;
            break;
          }

          _context4.next = 6;
          return (0, _effects.put)(_actions.actions.setGroupId({
            groupId: groupId,
            registerId: registerId
          }));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

function chartsSaga() {
  var _ref8, apiUrl, apiPath, _ref9, token, _ref10, groupId, registerId, sagas, payload, _ref11, newGroupId, newRegisterId;

  return regeneratorRuntime.wrap(function chartsSaga$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _effects.take)(_actions.constants.SET_API_PARAMS);

        case 2:
          _ref8 = _context5.sent;
          apiUrl = _ref8.apiUrl;
          apiPath = _ref8.apiPath;
          _context5.next = 7;
          return (0, _effects.take)(_actions.constants.SET_TOKEN);

        case 7:
          _ref9 = _context5.sent;
          token = _ref9.token;
          _context5.next = 11;
          return (0, _effects.select)(getCharts);

        case 11:
          _ref10 = _context5.sent;
          groupId = _ref10.groupId;
          registerId = _ref10.registerId;

          if (!groupId) {
            _context5.next = 17;
            break;
          }

          _context5.next = 17;
          return (0, _effects.call)(fetchData, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            registerId: registerId
          });

        case 17:
          if (!true) {
            _context5.next = 36;
            break;
          }

          _context5.next = 20;
          return (0, _effects.fork)(chartSagas, {
            apiUrl: apiUrl,
            apiPath: apiPath,
            token: token,
            groupId: groupId,
            registerId: registerId
          });

        case 20:
          sagas = _context5.sent;
          _context5.next = 23;
          return (0, _effects.take)(_actions.constants.SET_TOKEN);

        case 23:
          payload = _context5.sent;
          token = payload.token;
          _context5.next = 27;
          return (0, _effects.select)(getCharts);

        case 27:
          _ref11 = _context5.sent;
          newGroupId = _ref11.groupId;
          newRegisterId = _ref11.registerId;
          groupId = newGroupId;
          registerId = newRegisterId;
          _context5.next = 34;
          return (0, _effects.cancel)(sagas);

        case 34:
          _context5.next = 17;
          break;

        case 36:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getConfig, "getConfig", "app/sagas.js");

  __REACT_HOT_LOADER__.register(getCharts, "getCharts", "app/sagas.js");

  __REACT_HOT_LOADER__.register(clearData, "clearData", "app/sagas.js");

  __REACT_HOT_LOADER__.register(fetchData, "fetchData", "app/sagas.js");

  __REACT_HOT_LOADER__.register(getData, "getData", "app/sagas.js");

  __REACT_HOT_LOADER__.register(chartSagas, "chartSagas", "app/sagas.js");

  __REACT_HOT_LOADER__.register(chartsSaga, "chartsSaga", "app/sagas.js");
}();

;