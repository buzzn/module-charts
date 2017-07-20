import moment from 'moment';
import { constants } from './actions';
import { getMomentPeriod } from './util/process_data';

const initialState = {
  groupId: '',
  registerId: null,
  resolution: constants.RESOLUTIONS.DAY_MINUTE,
  timestamp: new Date(),
  chartData: [],
  loading: false,
  shouldUpdate: true,
};

export function shouldUpdate(timestamp, resolution) {
  return moment(timestamp).endOf(getMomentPeriod(resolution)).isSameOrAfter(new Date());
}

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_GROUP_ID:
      return { ...state, groupId: action.groupId, registerId: action.registerId };
    case constants.SET_DATA:
      return { ...state, chartData: action.data };
    case constants.SET_RESOLUTION:
      return { ...state, resolution: action.resolution, shouldUpdate: shouldUpdate(state.timestamp, action.resolution) };
    case constants.SET_TIMESTAMP:
      return { ...state, timestamp: action.timestamp, shouldUpdate: shouldUpdate(action.timestamp, state.resolution) };
    case constants.LOADING:
      return { ...state, loading: true };
    case constants.LOADED:
      return { ...state, loading: false };
    case constants.CHART_UPDATE:
    default:
      return state;
  }
};
