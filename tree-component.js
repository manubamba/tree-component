import React from "react";
import Row from "./row";
import R from "ramda";
import { fromJS, List, updateAt } from "immutable";
import { autobind } from "core-decorators";
import Title from "./title";

export default class TreeComponent extends React.Component {
  static propTypes = {
    nodes: React.PropTypes.object,
    rowRenderer: React.PropTypes.func
  };

  getImmutableData(nodes) {
    return fromJS(nodes);
  }

  state = {
    expandedNodeIds: List(),
    loadingNodeIds: List(),
    nodes: this.getImmutableData(this.props.nodes),
    renderedNodeIds: List(),
    selectedNodeIds: List(),
    getSelectedNode: this.getSelectedNode
  };

  static defaultProps = {
    shouldSelectNode: null,
    rowRenderer: Title
  };

  /**
 * An public api which returns the selected node id
 */
  @autobind getSelectedNode() {
    return this.state.selectedNodeIds.get(0);
  }

  @autobind handleToggle(nodeId) {
    const index = this.state.expandedNodeIds.indexOf(nodeId);
    if (index >= 0) {
      return this.setState({
        expandedNodeIds: this.state.expandedNodeIds.remove(index)
      });
    }
    this.props.onExpand(nodeId);
    if (this.state.nodes.getIn(["byId", nodeId, "lazyLoad"])) {
      this.setState({
        loadingNodeIds: this.state.loadingNodeIds.push(nodeId)
      });
    }
    return this.setState({
      expandedNodeIds: this.state.expandedNodeIds.push(nodeId)
    });
  }

  @autobind handleClick(event, nodeId, parentId) {
    //Handles node deletion
    this.props.onClick(event, nodeId, parentId);
    //Allows user to choose whether node should get selected
    // or not
    const shouldGetSelected = this.props.shouldSelectNode(
      this.props.nodes.byId[nodeId]
    );

    if (!this.props.multiselectMode && shouldGetSelected) {
      if (this.state.selectedNodeIds.contains(nodeId)) {
        this.setState({
          selectedNodeIds: List()
        });
      } else {
        this.setState({
          selectedNodeIds: List([nodeId])
        });
      }
    }
  }

  filterCurrentNodes(newNodes, nodesToFilter) {
    console.log(
      "filterCurrentNodes ",
      newNodes.get("byId"),
      " ",
      nodesToFilter
    );
    return nodesToFilter.filter(nodeId =>
      R.contains(nodeId, R.keys(newNodes.get("byId").keys))
    );
  }

  componentWillReceiveProps(newProps) {
    const loadingNodeIds = this.state.loadingNodeIds.filter(
      nodeId => !newProps.nodes.byId[nodeId].childIds
    );
    const newNodes = this.getImmutableData(newProps.nodes);
    this.setState({
      nodes: newNodes,
      loadingNodeIds
    });
    this.setState({
      // expandedNodeIds: this.filterCurrentNodes(
      //   newNodes,
      //   this.state.expandedNodeIds
      // ),
      // loadingNodeIds: this.filterCurrentNodes(
      //   newNodes,
      //   this.state.loadingNodeIds
      // ),
      selectedNodeIds: this.filterCurrentNodes(
        newNodes,
        this.state.selectedNodeIds
      )
    });
  }

  render() {
    const {
      selectedNodeIds,
      expandedNodeIds,
      loadingNodeIds,
      nodes
    } = this.state;
    const { rowRenderer } = this.props;
    const rootNodeIds = nodes.get("rootIds");
    //TODO: can try to optimise to send only children to rows
    return (
      <div className="rows-container">
        {rootNodeIds.map(nodeId => {
          const node = nodes.getIn(["byId", nodeId]);
          return (
            <Row
              key={node.get("id")}
              nodeId={node.get("id")}
              nodes={nodes}
              rowRenderer={rowRenderer}
              selectedNodeIds={selectedNodeIds}
              onClick={this.handleClick}
              loadingNodeIds={loadingNodeIds}
              expandedNodeIds={expandedNodeIds}
              onToggle={this.handleToggle}
            />
          );
        })}
      </div>
    );
  }
}
