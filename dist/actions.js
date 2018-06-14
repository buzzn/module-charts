"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.constants = void 0;
var constants = {
  SET_API_PARAMS: 'buzzn_charts/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_charts/SET_TOKEN',
  SET_GROUP_ID: 'buzzn_charts/SET_GROUP_ID',
  SET_DATA: 'buzzn_charts/SET_DATA',
  RESOLUTIONS: {
    DAY_MINUTE: 'day',
    HOUR_MINUTE: 'hour',
    MONTH_DAY: 'month',
    YEAR_MONTH: 'year'
  },
  SET_RESOLUTION: 'buzzn_charts/SET_RESOLUTION',
  SET_TIMESTAMP: 'buzzn_charts/SET_TIMESTAMP',
  LOADING: 'buzzn_charts/LOADING',
  LOADED: 'buzzn_charts/LOADED',
  CHART_UPDATE: 'buzzn_charts/CHART_UPDATE'
};
exports.constants = constants;
var actions = {
  setApiParams: function setApiParams(_ref) {
    var apiUrl = _ref.apiUrl,
        apiPath = _ref.apiPath;
    return {
      type: constants.SET_API_PARAMS,
      apiUrl: apiUrl,
      apiPath: apiPath
    };
  },
  setToken: function setToken(token) {
    return {
      type: constants.SET_TOKEN,
      token: token
    };
  },
  setGroupId: function setGroupId(_ref2) {
    var groupId = _ref2.groupId,
        registerId = _ref2.registerId;
    return {
      type: constants.SET_GROUP_ID,
      groupId: groupId,
      registerId: registerId
    };
  },
  setData: function setData(data) {
    return {
      type: constants.SET_DATA,
      data: data
    };
  },
  setResolution: function setResolution(resolution) {
    return {
      type: constants.SET_RESOLUTION,
      resolution: resolution
    };
  },
  setTimestamp: function setTimestamp(timestamp) {
    return {
      type: constants.SET_TIMESTAMP,
      timestamp: timestamp
    };
  },
  loading: function loading() {
    return {
      type: constants.LOADING
    };
  },
  loaded: function loaded() {
    return {
      type: constants.LOADED
    };
  },
  chartUpdate: function chartUpdate() {
    return {
      type: constants.CHART_UPDATE
    };
  }
};
exports.actions = actions;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(constants, "constants", "app/actions.js");

  __REACT_HOT_LOADER__.register(actions, "actions", "app/actions.js");
}();

;