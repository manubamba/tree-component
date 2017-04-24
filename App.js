import React from 'react';
import {autobind} from 'core-decorators';
import R from 'ramda';
import classNames from 'classnames';
import Tree from './tree-component';
import './styles.less';
import TreeRow from './tree-row-component';

const MOCK_SERVER_TIME = 0;

const RowRenderer = (props) => {
    const {node, treeOptions = {}} = props;
    const {
        id, name, type, icon, renameMode, contextMenu = true
    } = node;

    const label = renameMode ?
        <input
            className="infinite-tree-rename-input"
            data-current-value={name}
            data-id={id}
            defaultValue={name}
            type="text"
        /> : <span className="infinite-tree-title">{name}</span>;

  const className = classNames('infinite-tree-closed', {'context-menu-button': contextMenu}, 'pull-right');
  return <TreeRow
    node={node}
    togglerClass={treeOptions.togglerClass}>
    {/*{treeIcon(icon)}*/}
    {label}
    <i className={className} data-id={id} data-type={type}/>
  </TreeRow>
}

const nodes = {
  byId: {
    1: {
      id: '1',
      name: 'One',
      lazyLoad: true,
    },
    2: {
      id: '2',
      name: 'Two',
      childIds: ['2.1', '2.2'],
    },
    4: {
      id: '4',
      name: 'four',
      childIds: []
    },
    2.1: {
      id: '2.1',
      name: 'Two.One',
    },
    2.2: {
      id: '2.2',
      name: 'Two.Two',
      childIds: ['2.2.1', '2.2.2'],
    },
    '2.2.1': {
      id: '2.2.1',
      name: 'Two.Two.one',
    },
    '2.2.2': {
      id: '2.2.2',
      name: 'Two.Two.two',
      lazyLoad: true,
    },
    3: {
      id: '3',
      name: 'three',
    },
    5: {
      id: '5',
      name: 'Five',
      lazyLoad: true,
    },
  },
  ids: ['1', '2', '2.1', '2.2', '2.1', '2.2', '2.2.1', '2.2.2', '3', '4', '5'],
  rootIds: ['1', '2', '3', '4', '5']
};


export default class App extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  state = {
    nodes
  }
  getRandomWord() {
      return fetch('http://www.setgetgo.com/randomword/get.php?len=4')
        .then((resp) => resp.text());
  }

  @autobind
  handleExpand(nodeId) {
    const parentNode = this.state.nodes.byId[nodeId];
    if(parentNode.lazyLoad) {
      setTimeout(() => {
        const randomWords = [];
        this.getRandomWord()
          .then((word) => randomWords.push(word))
          .then(this.getRandomWord)
          .then((word) => randomWords.push(word))
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
              R.assoc(newNode2.id, newNode2),
            )(this.state.nodes.byId);
            const ids = R.concat([newNode1.id, newNode2.id], this.state.nodes.ids);
            this.setState({
              nodes: {
                ...this.state.nodes,
                byId,
                ids,
              }
            });
          })
      }, MOCK_SERVER_TIME)
    }
  }

  render() {
    const {nodes} = this.state;
    return (
      <div className="tree-wrapper">
        <Tree
        nodes={nodes}
        onExpand={this.handleExpand}
        rowRenderer={RowRenderer}
        onCollapse={this.handleCollapse}/>
      </div>
    );
  }
}
