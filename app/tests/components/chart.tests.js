import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Chart } from '../../components/chart';

describe('charts Chart', () => {
  it('should not redraw on new props', () => {
    const wrapper = shallow(<Chart />);
    expect(wrapper.instance().shouldComponentUpdate({})).to.be.false;
  });
});
