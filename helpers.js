import R from 'ramda';

export const removeNodeById = (nodesById, id) =>
  R.pickBy(node => !R.equals(id, node.id), nodesById);

export const removeNodeWithChildren = R.curry((nodesById, id) => {
  if (nodesById[id].childIds && nodesById[id].childIds.length) {
    const newNodes = removeNodeById(nodesById, id);
    return R.reduce(removeNodeWithChildren, newNodes, nodesById[id].childIds);
  }
  return removeNodeById(nodesById, id);
});

export const getNodeIdsToDelete = (byId, id) => {
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
    rootIds: R.filter(R.complement(R.equals(id))),
  }, nodes);
};
