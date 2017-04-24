import R from 'ramda';
import {TEST_ACTION} from './actions';
import {Map, List} from 'immutable';


const initialState = Map({
    nodes: Map({
        byId: Map(),
        ids: List()
    })
});

const t = R.curry((type, action) => R.equals(type, action.type));

export default (state = initialState, action) => {
    const conditions = R.cond([
        [t(TEST_ACTION), (action) => {
            return state
                .updateIn(['nodes', 'byId'], (byId) => byId.set(action.id, 'hello'))
                .updateIn(['nodes', 'ids'], (ids) => ids.push(action.id));
        }],
        [R.T, R.always(state)]
    ]);
    return conditions(action);
}
