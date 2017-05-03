import React, {Component, PropTypes} from 'react';
import R from 'ramda';
import classNames from 'classnames';

export default class TreeRowComponent extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        node: PropTypes.object.isRequired,
        togglerClass: PropTypes.string.isRequired
    };

    render() {
        const {
            id, isStep = false, loadOnDemand = false, children, state, title, customClasses
        } = this.props.node;
        return <span
            className={classNames(
                'infinite-tree-item',
                {'infinite-tree-selected': state.selected},
                customClasses
            )}
            title={title}>
            <span className="infinite-tree-node">
                {this.props.children}
            </span>
        </span>;
    }
}
