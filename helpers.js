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
    return R.reduce(
      (currentNodes, nodeId) =>
        R.concat(currentNodes, getNodeIdsToDelete(byId, nodeId)),
      [id],
      byId[id].childIds,
    );
  }
  return [id];
};

/**
 * Filter out garbage references from node's childIds
 */
const deleteReferencesFromChildIds = R.curry((parentId, nodesToDelete) =>
  R.pipe(
    R.tap(console.log),
    R.over(
      R.lensProp(parentId),
      R.evolve({
        childIds: R.reject(value => R.contains(value, nodesToDelete)),
      }),
    ),
  ),
);

/**
 * Deletes the node from `nodes` object
 * @param {string} nodeId
 * @param {array} nodesToDelete
 * @param {object} nodes
 */
const deleteNodeById = (nodeId, nodesToDelete, nodes) =>
  R.evolve(
    {
      byId: R.pickBy(node => !R.contains(node.id, nodesToDelete)),
      rootIds: R.reject(R.contains(nodeId)),
    },
    nodes,
  );

/**
 * Wrapper around `deleteReferencesFromChildIds` for
 * removing the nodes references which got deleted.
 * @param {string} parentId
 * @param {array} nodesToDelete
 * @param {object} nodes
 */
const removeIds = (parentId, nodesToDelete, nodes) =>
  R.evolve(
    {
      byId: deleteReferencesFromChildIds(parentId, nodesToDelete),
      rootIds: R.identity,
    },
    nodes,
  );

export const deleteNodeWithChildren = (nodes, nodeId, parentId) => {
  const nodesToDelete = getNodeIdsToDelete(nodes.byId, nodeId);
  return R.pipe(
    R.partial(deleteNodeById, [nodeId, nodesToDelete]),
    R.partial(removeIds, [parentId, nodesToDelete]),
  )(nodes);
};
