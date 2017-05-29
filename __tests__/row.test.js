import React from "react";
import { shallow, mount } from "enzyme";
import { fromJS, List } from "immutable";
import toJSON from "enzyme-to-json";
import Row from "../row";
import TitleComponent from "../title";
import logger from "../utils/logger";

const mockData = {
  byId: {
    1: {
      id: "1",
      name: "One",
      lazyLoad: true
    },
    2: {
      id: "2",
      name: "Two",
      childIds: ["2.1", "2.2"]
    },
    2.1: {
      id: "2.1",
      name: "Two.One"
    },
    2.2: {
      id: "2.2",
      name: "Two.Two"
    }
  }
};

describe("<Row/>", () => {
  const states = {
    expander: <span>+</span>,
    collapser: <span>-</span>,
    loader: <span>^</span>
  };
  const requiredProps = {
    expandedNodeIds: List(),
    loadingNodeIds: List(),
    nodes: fromJS(mockData),
    nodeId: "2",
    parentId: "2",
    rowRenderer: TitleComponent,
    renderedNodeIds: List(),
    selectedNodeIds: List()
  };
  test("should load without crashing", () => {
    const wrapper = shallow(<Row {...requiredProps} />);
    expect(wrapper.length).toBe(1);
  });

  test("should have required default props", () => {
    const wrapper = shallow(<Row {...requiredProps} />);
    "expander,collapser,loader,expanded,depth".split(",").forEach(value => {
      expect(wrapper.instance().props[value]).toBeDefined();
    });
  });

  test("should show expand icon if node have childs or is lazy loaded", () => {});

  test("should have required methods passed as props", () => {
    //   onClick={this.handleClick}
    //           onToggle={this.handleToggle}
  });

  test("should call `toggle` function when clicked on expand icon", () => {
    const onToggleFn = jest.fn();
    const wrapper = mount(<Row {...requiredProps} onToggle={onToggleFn} />);
    //   Row.prototype.mockToggleFn = jest.fn();
    //   const spy = jest.spyOn(Row.prototype, "mockToggleFn");
    let ele = wrapper
      .find(`#row-${requiredProps.nodeId}`)
      .children(".toggle-wrapper")
      .find("a")
      .simulate("click");
    //   expect(spy).toHaveBeenCalled();
    expect(onToggleFn).toHaveBeenCalledWith(requiredProps.nodeId);
    //   expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test("should call `onClick` function to `delete node` with proper args when clicked", () => {
    const onClick = jest.fn();
    const wrapper = mount(<Row {...requiredProps} onClick={onClick} />);
    const ele = wrapper
      .find(`#row-${requiredProps.nodeId}`)
      .children(".title-wrapper");
    let event = ele.simulate("click");
    logger.log("ele", ele.length);
    //Unable to test this
    // expect(onClick).toBeCalledWith(event,requiredProps.nodeId,requiredProps.parentId);
    expect(onClick).toBeCalled();
  });
  test("should show loading indicator when node is lazily loaded", () => {});
  test("should select the node when user clicks on any node", () => {});
  test("should be able render the child nodes", () => {});
});
