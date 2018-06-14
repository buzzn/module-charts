"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Chart = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactHighcharts = _interopRequireDefault(require("react-highcharts"));

var _moment = _interopRequireDefault(require("moment"));

var _map = _interopRequireDefault(require("lodash/map"));

var _chart_config = _interopRequireDefault(require("../util/chart_config"));

var _process_data = require("../util/process_data");

var _actions = require("../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart =
/*#__PURE__*/
function (_Component) {
  _inherits(Chart, _Component);

  function Chart() {
    _classCallCheck(this, Chart);

    return _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).apply(this, arguments));
  }

  _createClass(Chart, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      _reactHighcharts.default.Highcharts.setOptions({
        global: {
          // timezoneOffset: (new Date()).getTimezoneOffset(),
          useUTC: false
        }
      });
    }
  }, {
    key: "draw",
    value: function draw(props) {
      var resolution = props.resolution,
          timestamp = props.timestamp,
          chartData = props.chartData,
          setResolution = props.setResolution,
          setTimestamp = props.setTimestamp,
          chartUpdate = props.chartUpdate,
          layout = props.layout,
          withTitle = props.withTitle;
      var chartTitle = {
        text: ''
      };
      var currentType = '';

      var axisFormatter = function axisFormatter(type) {
        return function () {
          return (0, _process_data.formatLabel)(this.value, 'axis', type);
        };
      };

      var tooltipFormatter = function tooltipFormatter(type) {
        return function () {
          switch (resolution) {
            case _actions.constants.RESOLUTIONS.DAY_MINUTE:
              return "\n              <div style=\"text-align: center; font-size: 16px; padding: 6px; background-color: #6c6c6c\"><b>".concat(this.series.name, "</b></div>\n              <div style=\"padding: 6px\">\n                <div style=\"width: 60px; display: inline-block\">Time:</div> <b>").concat((0, _moment.default)(this.x).format('DD. MMMM, HH:mm'), "</b><br/>\n                <div style=\"width: 60px; display: inline-block\">Power:</div> <b>").concat((0, _process_data.formatLabel)(this.y, resolution), "</b><br/>\n                <div style=\"width: 60px; display: inline-block\">Energy:</div> <b>").concat((0, _process_data.formatLabel)((0, _process_data.calcEnergy)(this.series.data.map(function (p) {
                return {
                  timestamp: p.x,
                  value: p.y
                };
              }), resolution, this.x), 'tooltip', type), "</b><br/>\n              </div>\n                   ");

            case _actions.constants.RESOLUTIONS.YEAR_MONTH:
              return "\n              <div style=\"text-align: center; font-size: 16px; padding: 6px; background-color: #6c6c6c\"><b>".concat(this.series.name, "</b></div>\n              <div style=\"padding: 6px\">\n                <div style=\"width: 60px; display: inline-block\">Time:</div> <b>").concat((0, _moment.default)(this.x).format('MMMM. YYYY'), "</b><br/>\n                <div style=\"width: 60px; display: inline-block\">Energy:</div> <b>").concat((0, _process_data.formatLabel)(this.y, resolution, 'h'), "</b><br/>\n              </div>\n                   ");

            case _actions.constants.RESOLUTIONS.MONTH_DAY:
              return "\n              <div style=\"text-align: center; font-size: 16px; padding: 6px; background-color: #6c6c6c\"><b>".concat(this.series.name, "</b></div>\n              <div style=\"padding: 6px\">\n                <div style=\"width: 60px; display: inline-block\">Time:</div> <b>").concat((0, _moment.default)(this.x).format('DD. MMMM'), "</b><br/>\n                <div style=\"width: 60px; display: inline-block\">Energy:</div> <b>").concat((0, _process_data.formatLabel)(this.y, resolution, 'h'), "</b><br/>\n              </div>\n                   ");

            case _actions.constants.RESOLUTIONS.HOUR_MINUTE:
              return "\n              <div style=\"text-align: center; font-size: 16px; padding: 6px; background-color: #6c6c6c\"><b>".concat(this.series.name, "</b></div>\n              <div style=\"padding: 6px\">\n                <div style=\"width: 60px; display: inline-block\">Time:</div> <b>").concat((0, _moment.default)(this.x).format('HH:mm'), "</b><br/>\n                <div style=\"width: 60px; display: inline-block\">Power:</div> <b>").concat((0, _process_data.formatLabel)(this.y, resolution), "</b><br/>\n              </div>\n                   ");

            default:
              return '';
          }
        };
      };

      _moment.default.locale('de');

      switch (resolution) {
        case _actions.constants.RESOLUTIONS.YEAR_MONTH:
          chartTitle.text = (0, _moment.default)(timestamp).format('YYYY');
          currentType = 'h';
          break;

        case _actions.constants.RESOLUTIONS.MONTH_DAY:
          chartTitle.text = (0, _moment.default)(timestamp).format('MMMM YYYY');
          currentType = 'h';
          break;

        case _actions.constants.RESOLUTIONS.HOUR_MINUTE:
          chartTitle.text = "".concat((0, _moment.default)(timestamp).format('DD.MM.YYYY'), " ... ").concat((0, _moment.default)(timestamp).startOf('hour').format('HH:mm'), " - ").concat((0, _moment.default)(timestamp).endOf('hour').format('HH:mm'));
          currentType = '';
          break;

        default:
        case _actions.constants.RESOLUTIONS.DAY_MINUTE:
          chartTitle.text = (0, _moment.default)(timestamp).format('DD.MM.YYYY');
          currentType = 'h';
          break;
      }

      if (withTitle) {
        this.chart.setTitle(chartTitle);
      } else {
        this.chart.setTitle({
          text: null
        });
      }

      if (this.chart.series.length < chartData.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = chartData.sort(function (a, b) {
            return a.id - b.id;
          })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _chartObj = _step.value;
            this.chart.addSeries({
              name: _chartObj.name,
              color: _chartObj.color,
              stack: _chartObj.direction,
              data: (0, _map.default)(_chartObj.values, function (v) {
                return [v.timestamp, v.value];
              })
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = chartData[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _chartObj3 = _step2.value;

            this.chart.series[_chartObj3.id].setData((0, _map.default)(_chartObj3.values, function (v) {
              return [v.timestamp, v.value];
            }));

            this.chart.series[_chartObj3.id].update({
              color: _chartObj3.color,
              stack: _chartObj3.direction,
              name: _chartObj3.name
            });
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      if (layout === 'vertical') {
        this.chart.legend.update({
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical'
        });
      } else {
        this.chart.legend.update({
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal'
        });
      }

      this.chart.legend.update({
        labelFormatter: function labelFormatter() {
          var _this = this;

          return "<div style=\"margin-top: -10px\">".concat(this.name, "</div>\n                <div style=\"margin-top: 4px; font-size: 14px\">\n                  ").concat((0, _process_data.formatLabel)((0, _process_data.calcEnergy)((chartData.find(function (c) {
            return c.name === _this.name;
          }) || {}).values || [], resolution), 'legend', currentType), "\n                </div>");
        }
      });

      var zoomIn = function zoomIn(newTimestamp, currentResolution) {
        if (currentResolution === _actions.constants.RESOLUTIONS.HOUR_MINUTE) return;
        var newResolution = _actions.constants.RESOLUTIONS.DAY_MINUTE;

        switch (currentResolution) {
          case _actions.constants.RESOLUTIONS.YEAR_MONTH:
            newResolution = _actions.constants.RESOLUTIONS.MONTH_DAY;
            break;

          case _actions.constants.RESOLUTIONS.MONTH_DAY:
            newResolution = _actions.constants.RESOLUTIONS.DAY_MINUTE;
            break;

          default:
            newResolution = _actions.constants.RESOLUTIONS.HOUR_MINUTE;
            break;
        }

        setResolution(newResolution);
        setTimestamp(newTimestamp);
        chartUpdate();
      };

      switch (resolution) {
        case _actions.constants.RESOLUTIONS.YEAR_MONTH:
        case _actions.constants.RESOLUTIONS.MONTH_DAY:
          this.chart.update({
            yAxis: {
              labels: {
                formatter: axisFormatter(currentType)
              }
            }
          });
          this.chart.series.forEach(function (series) {
            series.update({
              type: 'column',
              tooltip: {
                pointFormatter: tooltipFormatter(currentType)
              },
              events: {
                click: function click(event) {
                  zoomIn(event.point.x, resolution);
                }
              }
            });
          });
          break;

        default:
          this.chart.update({
            yAxis: {
              labels: {
                formatter: axisFormatter('')
              }
            }
          });
          this.chart.series.forEach(function (series) {
            series.update({
              type: 'line',
              tooltip: {
                pointFormatter: tooltipFormatter(currentType)
              },
              events: {
                click: function click(event) {
                  zoomIn(event.point.x, resolution);
                }
              }
            });
          });
          break;
      }

      var momentRes = (0, _process_data.getMomentPeriod)(resolution);
      this.chart.xAxis[0].setExtremes((0, _moment.default)(timestamp).startOf(momentRes).valueOf(), (0, _moment.default)(timestamp).endOf(momentRes).valueOf());

      if (resolution === _actions.constants.RESOLUTIONS.DAY_MINUTE) {
        this.chart.xAxis[0].update({
          tickInterval: 3 * 60 * 60 * 1000
        });
      } else {
        this.chart.xAxis[0].update({
          tickInterval: null
        });
      }

      this.chart.redraw();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.chart = this.refs.chart.getChart();
      this.draw(this.props);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.draw(nextProps);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_reactHighcharts.default, {
        config: _chart_config.default,
        ref: "chart",
        domProps: {
          className: 'chart',
          style: {
            width: '100%',
            height: '100%'
          }
        }
      });
    }
  }]);

  return Chart;
}(_react.Component);

exports.Chart = Chart;

function mapStateToProps(state) {
  // TODO: replace 'charts' with 'mountedPath' ownProps parameter or constant
  return {
    resolution: state.charts.resolution,
    timestamp: state.charts.timestamp,
    chartData: state.charts.chartData
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  setResolution: _actions.actions.setResolution,
  setTimestamp: _actions.actions.setTimestamp,
  chartUpdate: _actions.actions.chartUpdate
})(Chart);

var _default2 = _default;
exports.default = _default2;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Chart, "Chart", "app/components/chart.js");

  __REACT_HOT_LOADER__.register(mapStateToProps, "mapStateToProps", "app/components/chart.js");

  __REACT_HOT_LOADER__.register(_default, "default", "app/components/chart.js");
}();

;