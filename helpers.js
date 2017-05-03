import R from 'ramda';


export const removeNode = R.curry((nodesById, id) => {
  if (nodesById[id].childIds && nodesById[id].childIds.length) {
    const newNodes = R.pickBy(node => !R.equals(id, node.id), nodesById);
    return R.reduce(removeNode, newNodes, nodesById[id].childIds);
  }
  return R.pickBy(node => !R.equals(id, node.id), nodesById);
});

export const getNodeIdsToDelete = ({ byId }, id) => {
  if (byId[id].childIds && byId[id].childIds.length) {
    return R.reduce((currentNodes, nodeId) =>
        R.concat(currentNodes, getNodeIdsToDelete(byId, nodeId)), [id], byId[id].childIds);
  }
  return [id];
};

export const deleteNodeWithChildren = (nodes, id) => {
  const nodesToDelete = getNodeIdsToDelete(nodes.byId, id);
  return R.evolve({
    byId: R.pickBy(node => !R.contains(node.id, nodesToDelete)),
    ids: R.filter(nodeId => !R.contains(nodeId, nodesToDelete)),
    rootIds: R.filter(R.complement(R.equals(id))),
  }, nodes);
};
