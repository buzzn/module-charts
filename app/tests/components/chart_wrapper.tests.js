import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import spies from 'chai-spies';
import moment from 'moment';
import { constants } from '../../actions';
import { ChartWrapper } from '../../components/chart_wrapper';
import ChartInfoPanel from '../../components/chart_info_panel';
import Chart from '../../components/chart';

describe('charts ChartWrapper', () => {
  chai.use(spies);
  const expect = chai.expect;
  const props = {
    setResolution: chai.spy(),
    setTimestamp: chai.spy(),
    chartUpdate: chai.spy(),
    resolution: constants.RESOLUTIONS.DAY_MINUTE,
    timestamp: new Date(),
    loading: false,
    scores: {},
  };

  it('should render 4 InfoPanels', () => {
    const wrapper = shallow(<ChartWrapper { ...props } />);
    expect(wrapper.find(ChartInfoPanel)).to.have.length(4);
  });

  it('should render Chart', () => {
    const wrapper = shallow(<ChartWrapper { ...props } />);
    expect(wrapper.find(Chart)).to.have.length(1);
  });

  it('should render loading on top of chart in case of loading prop', () => {
    const wrapper = shallow(<ChartWrapper { ...props } />);
    expect(wrapper.find('.basic-loading').html()).to.have.string('z-index:-10');
    wrapper.setProps({ loading: true }).update();
    expect(wrapper.find('.basic-loading').html()).to.have.string('z-index:10');
  });

  it('should dispatch setResolution and chartUpdate actions when resolution buttons clicked', () => {
    const wrapper = shallow(<ChartWrapper { ...props } />);
    wrapper.find('button.year').simulate('click');
    expect(props.setResolution).to.have.been.called.with(constants.RESOLUTIONS.YEAR_MONTH);
    expect(props.chartUpdate).to.have.been.called();
    wrapper.find('button.month').simulate('click');
    expect(props.setResolution).to.have.been.called.with(constants.RESOLUTIONS.MONTH_DAY);
    expect(props.chartUpdate).to.have.been.called();
    wrapper.find('button.day').simulate('click');
    expect(props.setResolution).to.have.been.called.with(constants.RESOLUTIONS.DAY_MINUTE);
    expect(props.chartUpdate).to.have.been.called();
    wrapper.find('button.hour').simulate('click');
    expect(props.setResolution).to.have.been.called.with(constants.RESOLUTIONS.HOUR_MINUTE);
    expect(props.chartUpdate).to.have.been.called();
  });

  it('should dispatch setTimestamp and chartUpdate actions when pagination buttons clicked', () => {
    const pastDate = { ...props };
    const current = new Date();
    pastDate.timestamp = moment(current).subtract(2, 'days').toDate();
    const wrapper = shallow(<ChartWrapper { ...pastDate } />);
    wrapper.find('button.btn-chart-prev').simulate('click');
    expect(props.setTimestamp).to.have.been.called.with(moment(current).subtract(3, 'days').toDate());
    expect(props.chartUpdate).to.have.been.called();
    wrapper.find('button.btn-chart-next').simulate('click');
    expect(props.setTimestamp).to.have.been.called.with(moment(current).subtract(1, 'days').toDate());
    expect(props.chartUpdate).to.have.been.called();
  });
});
