export const constants = {
  SET_API_PARAMS: 'buzzn_charts/SET_API_PARAMS',
  SET_TOKEN: 'buzzn_charts/SET_TOKEN',

  SET_GROUP_ID: 'buzzn_charts/SET_GROUP_ID',
  SET_DATA: 'buzzn_charts/SET_DATA',
  RESOLUTIONS: {
    DAY_MINUTE: 'day',
    HOUR_MINUTE: 'hour',
    MONTH_DAY: 'month',
    YEAR_MONTH: 'year',
  },
  SET_RESOLUTION: 'buzzn_charts/SET_RESOLUTION',
  SET_TIMESTAMP: 'buzzn_charts/SET_TIMESTAMP',
  LOADING: 'buzzn_charts/LOADING',
  LOADED: 'buzzn_charts/LOADED',
  CHART_UPDATE: 'buzzn_charts/CHART_UPDATE',
};

export const actions = {
  setApiParams: ({ apiUrl, apiPath }) => ({ type: constants.SET_API_PARAMS, apiUrl, apiPath }),
  setToken: token => ({ type: constants.SET_TOKEN, token }),
  setGroupId: ({ groupId, registerId}) => ({ type: constants.SET_GROUP_ID, groupId, registerId }),
  setData: data => ({ type: constants.SET_DATA, data }),
  setResolution: resolution => ({ type: constants.SET_RESOLUTION, resolution }),
  setTimestamp: timestamp => ({ type: constants.SET_TIMESTAMP, timestamp }),
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),
  chartUpdate: () => ({ type: constants.CHART_UPDATE }),
};
