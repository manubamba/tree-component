import React from 'react';
import { Map } from 'immutable';

import { autobind } from 'core-decorators';
import R from 'ramda';
import classNames from 'classnames';
import Tree from './tree-component';
import './styles.less';
import { deleteNodeWithChildren } from './helpers';
import TreeRow from './tree-row-component';
import RowRenderer from './row-renderer';
import nodes from './mock-data';

const MOCK_SERVER_TIME = 0;

export default class App extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  state = {
    nodes
  };
  getRandomWord() {
    return fetch(
      'http://www.setgetgo.com/randomword/get.php?len=4'
    ).then(resp => resp.text());
  }

  @autobind handleExpand(nodeId) {
    const parentNode = this.state.nodes.byId[nodeId];
    if (parentNode.lazyLoad) {
      setTimeout(() => {
        const randomWords = [];
        this.getRandomWord()
          .then(word => randomWords.push(word))
          .then(this.getRandomWord)
          .then(word => randomWords.push(word))
          .then(() => {
            const newNode1 = {
              id: `${nodeId}.${randomWords[0]}`,
              name: `${parentNode.name}.${randomWords[0]}`,
              lazyLoad: true
            };
            const newNode2 = {
              id: `${nodeId}.${randomWords[1]}`,
              name: `${parentNode.name}.${randomWords[1]}`,
              lazyLoad: true
            };
            const byId = R.pipe(
              R.evolve({
                [nodeId]: R.assoc('childIds', [newNode1.id, newNode2.id])
              }),
              R.assoc(newNode1.id, newNode1),
              R.assoc(newNode2.id, newNode2)
            )(this.state.nodes.byId);
            this.setState({
              nodes: {
                ...this.state.nodes,
                byId
              }
            });
          });
      }, MOCK_SERVER_TIME);
    }
  }

  @autobind handleClick(event, nodeId, parentId) {
    const classNames = event.target.className;
    if (R.contains('delete', classNames)) {
      this.setState({
        nodes: deleteNodeWithChildren(this.state.nodes, nodeId, parentId)
      });
    }
  }

  @autobind shouldSelectNode(node) {
    console.log(
      'shouldSelectNode ',
      node.id,
      '---',
      this.tree.getSelectedNode()
    );

    if (!node || node.id === this.tree.getSelectedNode()) {
      return false; // Prevent from deselecting the current node
    }
    return true;
  }

  render() {
    const { nodes } = this.state;
    return (
      <div className='tree-wrapper'>
        <Tree
          nodes={nodes}
          onClick={this.handleClick}
          onExpand={this.handleExpand}
          ref={c => {
            this.tree = c && c.state;
            console.log('Tree ', c);
          }}
          shouldSelectNode={this.shouldSelectNode}
          rowRenderer={RowRenderer}
          onCollapse={this.handleCollapse}
        />
      </div>
    );
  }
}
