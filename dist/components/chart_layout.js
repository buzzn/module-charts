"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var Chart = _ref.Chart,
      constants = _ref.constants,
      loading = _ref.loading,
      limit = _ref.limit,
      changeDate = _ref.changeDate,
      timestamp = _ref.timestamp,
      resolution = _ref.resolution,
      changeResolution = _ref.changeResolution,
      changePage = _ref.changePage;
  return _react.default.createElement("div", {
    className: "col-12 chart-wrapper"
  }, _react.default.createElement("div", {
    style: {
      position: 'relative'
    }
  }, _react.default.createElement("div", {
    className: "text-center"
  }, _react.default.createElement("button", {
    className: "btn btn-default year",
    onClick: function onClick() {
      return changeResolution(constants.RESOLUTIONS.YEAR_MONTH);
    },
    disabled: loading
  }, "Jahr"), _react.default.createElement("button", {
    className: "btn btn-default month",
    onClick: function onClick() {
      return changeResolution(constants.RESOLUTIONS.MONTH_DAY);
    },
    disabled: loading
  }, "Monat"), _react.default.createElement("button", {
    className: "btn btn-default day",
    onClick: function onClick() {
      return changeResolution(constants.RESOLUTIONS.DAY_MINUTE);
    },
    disabled: loading
  }, "Tag"), _react.default.createElement("button", {
    className: "btn btn-default hour",
    onClick: function onClick() {
      return changeResolution(constants.RESOLUTIONS.HOUR_MINUTE);
    },
    disabled: loading
  }, "Stunde")), _react.default.createElement("button", {
    className: "btn btn-default btn-icon btn-circle icon-lg btn-chart-prev fa fa-chevron-left fa-2x",
    onClick: function onClick() {
      return changePage('prev');
    },
    disabled: loading
  }), _react.default.createElement("button", {
    className: "btn btn-default btn-icon btn-circle icon-lg btn-chart-next pull-right fa fa-chevron-right fa-2x",
    onClick: function onClick() {
      return changePage('next');
    },
    disabled: loading || limit
  }), _react.default.createElement(Chart, {
    layout: "horizontal",
    withTitle: true
  })));
};

var _default2 = _default;
exports.default = _default2;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, "default", "app/components/chart_layout.js");
}();

;