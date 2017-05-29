import React, { PropTypes } from "react";
import classNames from "classnames";
import TreeRow from "./tree-row-component";

const RowRendererComponent = props => {
  const { node, treeOptions } = props;
  const { id, name, type, renameMode, contextMenu = true } = node;
  const { deleteNode } = treeOptions;
  const label = renameMode
    ? <input
        className="infinite-tree-rename-input"
        data-current-value={name}
        data-id={id}
        defaultValue={name}
        type="text"
      />
    : <span className="infinite-tree-title">{name}</span>;

  const className = classNames(
    "infinite-tree-closed",
    { "context-menu-button": contextMenu },
    "pull-right"
  );
  return (
    <TreeRow node={node} togglerClass={treeOptions.togglerClass}>
      {label}
      <i className={className} data-id={id} data-type={type} />
      <a className="delete">D</a>
    </TreeRow>
  );
};

RowRendererComponent.propTypes = {
  node: PropTypes.shape().isRequired,
  treeOptions: PropTypes.shape()
};

RowRendererComponent.defaultProps = {
  treeOptions: {},
  node: {}
};

export default RowRendererComponent;
