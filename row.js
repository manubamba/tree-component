import React from 'react';
import Title from './title';
import {autobind} from 'core-decorators';
import R from 'ramda';

export default class Row extends React.Component {
  static propTypes = {
    collapser: React.PropTypes.element,
    depth: React.PropTypes.number,
    expanded: React.PropTypes.bool,
    name: React.PropTypes.string,
    node: React.PropTypes.object,
    rowRenderer: React.PropTypes.func,
  };

  static defaultProps = {
    expander: <span>+</span>,
    collapser: <span>-</span>,
    loader: <span>^</span>,
    expanded: false,
    depth: 0,
  }

  constructor(props) {
    super(props);
  }

  @autobind
  handleExpand() {
    if (typeof this.props.children === 'function') {
        return this.props.children();
    }
    return this.setState({
        expanded: true
    });
  }

  @autobind
  handleToggle(e) {
    this.props.onToggle(this.props.nodeId);
    e.stopPropagation();
  }

  @autobind
  handleClick(e) {
      this.props.onClick(this.props.nodeId);
      e.stopPropagation();
  }

  render() {
    const {expander, collapser, nodeId, depth, nodes, selectedNodeIds, expandedNodeIds, loadingNodeIds, onToggle, onClick, loader, rowRenderer} = this.props;
    const node = nodes.get('byId').get(nodeId);
    const expanded = expandedNodeIds.indexOf(node.get('id')) >= 0;
    const internalLoading = loadingNodeIds.indexOf(node.get('id')) >= 0;
    const loading = node.get('isLoading');
    const lazyLoad = node.get('lazyLoad');
    const internalOrExternalLoading = loading || internalLoading;

    const expand = !expanded && (lazyLoad || (!expanded && ((node.get('childIds')
      && !node.get('childIds').isEmpty())))) &&
      <a onClick={this.handleToggle}>{expander}</a>;

    const collapse = expanded && node.get('childIds') && node.get('childIds').size &&
      <a onClick={this.handleToggle}>{collapser}</a>
    const TitleRenderer = rowRenderer;
    const nodeState = {
        expanded,
        selected: selectedNodeIds.contains(nodeId),
        depth,
    }
    const nodeWithState = {
        ...node.toJS(),
        state: nodeState
    }
    const toggler = expand || collapse;
    return (
      <div className="row-wrapper">
        <div className="toggle-wrapper">
            {!internalOrExternalLoading ? toggler : loader}
        </div>
        <div className="title-wrapper" onClick={this.handleClick}>
            <TitleRenderer node={nodeWithState}/>
        </div>
        <div className="children-container">
          {expanded && node.get('childIds') &&
              node.get('childIds').map((childId) => {
              const childNode = nodes.get('byId').get(childId);
              return <Row
                  expandedNodeIds={expandedNodeIds}
                  key={childNode.get('id')}
                  loadingNodeIds={loadingNodeIds}
                  nodeId={childNode.get('id')}
                  nodes={nodes}
                  depth={depth + 1}
                  onClick={onClick}
                  onToggle={onToggle}
                  rowRenderer={TitleRenderer}
                  selectedNodeIds={selectedNodeIds}
          />})}
        </div>
      </div>
    );
  }
}
