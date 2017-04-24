import React from 'react';

export default class Title extends React.Component {
  static propTypes = {
    node: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {node} = this.props;
    return (
      <span>{node.name}</span>
    );
  }
}
