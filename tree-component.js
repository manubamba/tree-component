import React from 'react';
import Row from './row';
import R from 'ramda';
import {fromJS, List, updateAt} from 'immutable';
import {autobind} from 'core-decorators';
import Title from './title';

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
  }

  static defaultProps = {
    shouldSelectNode: R.T,
    rowRenderer: Title
  }

  @autobind
  handleToggle(nodeId) {
    const index = this.state.expandedNodeIds.indexOf(nodeId);
    if (index >= 0) {
        return this.setState({
            expandedNodeIds: this.state.expandedNodeIds.remove(index)
        });
    }
    this.props.onExpand(nodeId);
    if(this.state.nodes.getIn(['byId', nodeId, 'lazyLoad'])) {
      this.setState({
        loadingNodeIds: this.state.loadingNodeIds.push(nodeId)
      })
    }
    return this.setState({
        expandedNodeIds: this.state.expandedNodeIds.push(nodeId)
    });
  }

  @autobind
  handleClick(event, nodeId) {
    this.props.onClick(event, nodeId);
    if (!this.props.multiselectMode) {
      if (this.state.selectedNodeIds.contains(nodeId)) {
        this.setState({
          selectedNodeIds: List()
        })
      } else {
        this.setState({
          selectedNodeIds: List([nodeId])
        });
        this.props.onSelect(nodeId, this.state.selectedNodeIds);
      }
    }
  }

  filterCurrentNodes(newNodes, nodesToFilter) {
    return nodesToFilter.filter((nodeId) => R.contains(nodeId, R.keys(newNodes.byId)));
  }

  componentWillReceiveProps(newProps) {
    const loadingNodeIds = this.state.loadingNodeIds.filter((nodeId) => !newProps.nodes.byId[nodeId].childIds);
    const newNodes = this.getImmutableData(newProps.nodes);
    this.setState({
      nodes: newNodes,
      loadingNodeIds,
    });
    this.setState({
      expandedNodeIds: this.filterCurrentNodes(newNodes, this.state.expandedNodeIds),
      loadingNodeIds: this.filterCurrentNodes(newNodes, this.state.loadingNodeIds),
      selectedNodeIds: this.filterCurrentNodes(newNodes, this.state.selectedNodeIds),
    });
  }

  render() {
    const {selectedNodeIds, expandedNodeIds, loadingNodeIds, nodes} = this.state;
    const {rowRenderer} = this.props;
    const rootNodeIds = nodes.get('rootIds');
    //TODO: can try to optimise to send only children to rows
    return (
      <div className="rows-container">
      {rootNodeIds.map((nodeId) => {
        const node = nodes.getIn(['byId', nodeId]);
          return <Row
            key={node.get('id')}
            nodeId={node.get('id')}
            nodes={nodes}
            rowRenderer={rowRenderer}
            selectedNodeIds={selectedNodeIds}
            onClick={this.handleClick}
            loadingNodeIds={loadingNodeIds}
            expandedNodeIds={expandedNodeIds}
            onToggle={this.handleToggle}
              />})
      }
      </div>
    );
  }
}
