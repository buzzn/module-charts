export const constants = {
  SET_GROUP: 'buzzn_charts/SET_GROUP',
  SET_IDS: 'buzzn_charts/SET_IDS',
  SET_DATA: 'buzzn_charts/SET_DATA',
  RESOLUTIONS: {
    DAY_MINUTE: 'day_to_minutes',
    HOUR_MINUTE: 'hour_to_minutes',
    MONTH_DAY: 'month_to_days',
    YEAR_MONTH: 'year_to_months',
  },
  SET_RESOLUTION: 'buzzn_charts/SET_RESOLUTION',
  SET_TIMESTAMP: 'buzzn_charts/SET_TIMESTAMP',
  LOADING: 'buzzn_charts/LOADING',
  LOADED: 'buzzn_charts/LOADED',
  CHART_UPDATE: 'buzzn_charts/CHART_UPDATE',
  SET_SCORES: 'buzzn_charts/SET_SCORES',
};

export const actions = {
  setGroup: group => ({ type: constants.SET_GROUP, group }),
  setIds: ids => ({ type: constants.SET_IDS, ids }),
  setData: data => ({ type: constants.SET_DATA, data }),
  setResolution: resolution => ({ type: constants.SET_RESOLUTION, resolution }),
  setTimestamp: timestamp => ({ type: constants.SET_TIMESTAMP, timestamp }),
  loading: () => ({ type: constants.LOADING }),
  loaded: () => ({ type: constants.LOADED }),
  chartUpdate: () => ({ type: constants.CHART_UPDATE }),
  setScores: (scores) => ({ type: constants.SET_SCORES, scores }),
};
