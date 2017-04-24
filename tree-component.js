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
  handleClick(nodeId) {
    if (!this.props.multiselectMode) {
      if (this.state.selectedNodeIds.contains(nodeId)) {
        this.setState({
          selectedNodeIds: List()
        })
      } else {
        this.setState({
          selectedNodeIds: List([nodeId])
        })
      }
    }
  }

  componentWillReceiveProps(newProps) {
    const loadingNodeIds = this.state.loadingNodeIds.filter((nodeId) => !newProps.nodes.byId[nodeId].childIds);
    this.setState({
      nodes: this.getImmutableData(newProps.nodes),
      loadingNodeIds,
    })
  }

  render() {
    const {selectedNodeIds, expandedNodeIds, loadingNodeIds, nodes} = this.state;
    const {rowRenderer} = this.props;
    const rootNodeIds = nodes.get('rootIds');
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
