"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldUpdate = shouldUpdate;
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _actions = require("./actions");

var _process_data = require("./util/process_data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var initialState = {
  groupId: '',
  registerId: null,
  resolution: _actions.constants.RESOLUTIONS.DAY_MINUTE,
  timestamp: new Date(),
  chartData: [],
  loading: false,
  shouldUpdate: true
};

function shouldUpdate(timestamp, resolution) {
  return (0, _moment.default)(timestamp).endOf((0, _process_data.getMomentPeriod)(resolution)).isSameOrAfter(new Date());
}

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _actions.constants.SET_GROUP_ID:
      return _extends({}, state, {
        groupId: action.groupId,
        registerId: action.registerId
      });

    case _actions.constants.SET_DATA:
      return _extends({}, state, {
        chartData: action.data
      });

    case _actions.constants.SET_RESOLUTION:
      return _extends({}, state, {
        resolution: action.resolution,
        shouldUpdate: shouldUpdate(state.timestamp, action.resolution)
      });

    case _actions.constants.SET_TIMESTAMP:
      return _extends({}, state, {
        timestamp: action.timestamp,
        shouldUpdate: shouldUpdate(action.timestamp, state.resolution)
      });

    case _actions.constants.LOADING:
      return _extends({}, state, {
        loading: true
      });

    case _actions.constants.LOADED:
      return _extends({}, state, {
        loading: false
      });

    case _actions.constants.CHART_UPDATE:
    default:
      return state;
  }
};

var _default2 = _default;
exports.default = _default2;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "app/reducers.js");

  __REACT_HOT_LOADER__.register(shouldUpdate, "shouldUpdate", "app/reducers.js");

  __REACT_HOT_LOADER__.register(_default, "default", "app/reducers.js");
}();

;