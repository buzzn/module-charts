"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ChartWrapper = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _moment = _interopRequireDefault(require("moment"));

var _actions = require("../actions");

var _process_data = require("../util/process_data");

var _chart = _interopRequireDefault(require("./chart"));

var _chart_layout = _interopRequireDefault(require("./chart_layout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChartWrapper =
/*#__PURE__*/
function (_Component) {
  _inherits(ChartWrapper, _Component);

  function ChartWrapper() {
    _classCallCheck(this, ChartWrapper);

    return _possibleConstructorReturn(this, (ChartWrapper.__proto__ || Object.getPrototypeOf(ChartWrapper)).apply(this, arguments));
  }

  _createClass(ChartWrapper, [{
    key: "changeDate",
    value: function changeDate(newDate) {
      var _props = this.props,
          setTimestamp = _props.setTimestamp,
          chartUpdate = _props.chartUpdate;
      setTimestamp(newDate);
      chartUpdate();
    }
  }, {
    key: "changePage",
    value: function changePage(direction) {
      var _props2 = this.props,
          setTimestamp = _props2.setTimestamp,
          resolution = _props2.resolution,
          timestamp = _props2.timestamp,
          chartUpdate = _props2.chartUpdate;
      var newTimestamp = new Date();
      var period = (0, _process_data.getMomentPeriod)(resolution);

      if (direction === 'prev') {
        newTimestamp = (0, _moment.default)(timestamp).subtract(1, period).toDate();
      } else {
        newTimestamp = (0, _moment.default)(timestamp).add(1, period).toDate();
      }

      setTimestamp(newTimestamp);
      chartUpdate();
    }
  }, {
    key: "changeResolution",
    value: function changeResolution(newResolution) {
      var _props3 = this.props,
          setResolution = _props3.setResolution,
          chartUpdate = _props3.chartUpdate;
      setResolution(newResolution);
      chartUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var _props4 = this.props,
          resolution = _props4.resolution,
          timestamp = _props4.timestamp,
          Layout = _props4.Layout;
      var limit = (0, _moment.default)(timestamp).endOf((0, _process_data.getMomentPeriod)(resolution)).isSameOrAfter(new Date());
      return _react.default.createElement(Layout, _extends({}, this.props, {
        limit: limit,
        constants: _actions.constants,
        Chart: _chart.default,
        timestamp: timestamp,
        resolution: resolution,
        changeDate: this.changeDate.bind(this),
        changePage: this.changePage.bind(this),
        changeResolution: this.changeResolution.bind(this)
      }));
    }
  }]);

  return ChartWrapper;
}(_react.Component);

exports.ChartWrapper = ChartWrapper;
Object.defineProperty(ChartWrapper, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    Layout: _chart_layout.default
  }
});

function mapStateToProps(state) {
  // TODO: replace 'charts' with 'mountedPath' ownProps parameter or constant
  return {
    resolution: state.charts.resolution,
    timestamp: state.charts.timestamp,
    loading: state.charts.loading,
    scores: state.charts.scores
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  setResolution: _actions.actions.setResolution,
  setTimestamp: _actions.actions.setTimestamp,
  chartUpdate: _actions.actions.chartUpdate
})(ChartWrapper);

var _default2 = _default;
exports.default = _default2;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ChartWrapper, "ChartWrapper", "app/components/chart_wrapper.js");

  __REACT_HOT_LOADER__.register(mapStateToProps, "mapStateToProps", "app/components/chart_wrapper.js");

  __REACT_HOT_LOADER__.register(_default, "default", "app/components/chart_wrapper.js");
}();

;