import React from "react";
import RowRenderer from "../row-renderer";
import logger from "../utils/logger";
import toJson from "enzyme-to-json";
import TreeRowComonent from "../tree-row-component";
import { shallow, mount } from "enzyme";

describe("<RowRenderer/>", () => {
  test("should render without crashing", () => {
    const mockData = {
      id: 1,
      name: "Foo"
    };
    const wrapper = shallow(<RowRenderer node={mockData} />);
    expect(wrapper.length).toBe(1);
  });

  test("should allow user to rename the node", () => {
    const mockData = {
      id: 1,
      name: "Foo",
      renameMode: true,
      state: {
        selected: false
      }
    };
    const wrapper = mount(
      <RowRenderer node={Object.assign({}, mockData, { renameMode: false })} />
    );
    expect(wrapper.find(".infinite-tree-rename-input").length).toBe(0);
    expect(wrapper.find(".infinite-tree-title").length).toBe(1);

    wrapper.setProps({ node: mockData });
    expect(wrapper.find(".infinite-tree-rename-input").length).toBe(1);
    expect(wrapper.find(".infinite-tree-title").length).toBe(0);
  });

  it("should have default props defined", () => {
    const wrapper = shallow(<RowRenderer />);
    expect(wrapper.instance().props.treeOptions).toEqual({});
  });
});
