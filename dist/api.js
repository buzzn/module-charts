"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uriTimestamp = uriTimestamp;
exports.default = void 0;

require("whatwg-fetch");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prepareHeaders(token) {
  var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  if (token) headers.Authorization = "Bearer ".concat(token);
  return headers;
}

function parseResponse(response) {
  var json = response.json();

  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    return json.then(function (error) {
      return Promise.reject(error);
    });
  }
}

function uriTimestamp(timestamp) {
  return encodeURIComponent((0, _moment.default)(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
}

var _default = {
  getGroupChart: function getGroupChart(_ref) {
    var apiUrl = _ref.apiUrl,
        apiPath = _ref.apiPath,
        groupId = _ref.groupId,
        timestamp = _ref.timestamp,
        resolution = _ref.resolution,
        token = _ref.token;
    return fetch("".concat(apiUrl).concat(apiPath, "/").concat(groupId, "/charts?timestamp=").concat(uriTimestamp(timestamp), "&duration=").concat(resolution), {
      headers: prepareHeaders(token)
    }).then(parseResponse).then(function (data) {
      return [{
        id: 0,
        direction: 'in',
        name: 'Consumption',
        color: '#00bcd4',
        values: data.in.map(function (d) {
          return {
            value: d.value / 1000,
            timestamp: new Date(d.timestamp).getTime() * 1000
          };
        })
      }, {
        id: 1,
        direction: 'out',
        name: 'Production',
        color: '#afb42b',
        values: data.out.map(function (d) {
          return {
            value: d.value / 1000,
            timestamp: new Date(d.timestamp).getTime() * 1000
          };
        })
      }];
    });
  }
};
var _default2 = _default;
exports.default = _default2;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(prepareHeaders, "prepareHeaders", "app/api.js");

  __REACT_HOT_LOADER__.register(parseResponse, "parseResponse", "app/api.js");

  __REACT_HOT_LOADER__.register(uriTimestamp, "uriTimestamp", "app/api.js");

  __REACT_HOT_LOADER__.register(_default, "default", "app/api.js");
}();

;