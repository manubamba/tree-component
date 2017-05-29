import React from 'react';
import { mount } from 'enzyme';
import Title from '../title';

describe('<Title/>', () => {
  test('should render without crashing', () => {
    const mockData = {
      name: 'Foo',
      id: '1',
    };
    const wrapper = mount(<Title node={mockData} />);
    // wrapper.setProps({ node: mockData });
    expect(wrapper.length).toBe(1);
  });
});
