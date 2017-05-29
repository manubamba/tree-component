import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import TreeRowComponent from '../tree-row-component';
import logger from '../utils/logger';

describe('<TreeRowComponent/>', () => {
  test('should load without crashing', () => {});

  test('should add appropriate class whenever a node is selected', () => {
    const mockData = { state: {} };
    const wrapper = shallow(<TreeRowComponent node={mockData} />);
    let component = wrapper.find('.infinite-tree-item');
    let classNames = component.props().className.split(' ');

    expect(classNames).not.toContain('infinite-tree-selected');

    wrapper.setProps({
      node: Object.assign({}, mockData, { state: { selected: true } }),
    });

    component = wrapper.find('.infinite-tree-item');
    classNames = component.props().className.split(' ');

    expect(classNames).toContain('infinite-tree-selected');
  });
});
