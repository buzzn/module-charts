import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import spies from 'chai-spies';
import moment from 'moment';
import { constants } from '../../actions';
import ChartLayout from '../../components/chart_layout';
import ChartInfoPanel from '../../components/chart_info_panel';
import Chart from '../../components/chart';

describe('charts ChartLayout', () => {
  chai.use(spies);
  const expect = chai.expect;
  const props = {
    changeResolution: chai.spy(),
    changePage: chai.spy(),
    resolution: constants.RESOLUTIONS.DAY_MINUTE,
    timestamp: new Date(),
    loading: false,
    scores: {},
    ChartInfoPanel,
    Chart,
    constants,
  };

  it('should render 4 InfoPanels', () => {
    const wrapper = shallow(<ChartLayout { ...props } />);
    expect(wrapper.find(ChartInfoPanel)).to.have.length(4);
  });

  it('should render Chart', () => {
    const wrapper = shallow(<ChartLayout { ...props } />);
    expect(wrapper.find(Chart)).to.have.length(1);
  });

  it('should render loading on top of chart in case of loading prop', () => {
    const wrapper = shallow(<ChartLayout { ...props } />);
    expect(wrapper.find('.basic-loading').html()).to.have.string('z-index:-10');
    wrapper.setProps({ loading: true }).update();
    expect(wrapper.find('.basic-loading').html()).to.have.string('z-index:10');
  });

  it('should call changeResolution when resolution buttons clicked', () => {
    const wrapper = shallow(<ChartLayout { ...props } />);
    wrapper.find('button.year').simulate('click');
    expect(props.changeResolution).to.have.been.called.with(constants.RESOLUTIONS.YEAR_MONTH);
    wrapper.find('button.month').simulate('click');
    expect(props.changeResolution).to.have.been.called.with(constants.RESOLUTIONS.MONTH_DAY);
    wrapper.find('button.day').simulate('click');
    expect(props.changeResolution).to.have.been.called.with(constants.RESOLUTIONS.DAY_MINUTE);
    wrapper.find('button.hour').simulate('click');
    expect(props.changeResolution).to.have.been.called.with(constants.RESOLUTIONS.HOUR_MINUTE);
  });

  it('should call changePage when pagination buttons clicked', () => {
    const pastDate = { ...props };
    const current = new Date();
    pastDate.timestamp = moment(current).subtract(2, 'days').toDate();
    const wrapper = shallow(<ChartLayout { ...pastDate } />);
    wrapper.find('button.btn-chart-prev').simulate('click');
    expect(props.changePage).to.have.been.called.with('prev');
    wrapper.find('button.btn-chart-next').simulate('click');
    expect(props.changePage).to.have.been.called.with('next');
  });
});
