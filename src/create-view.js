import R from './ramda.custom';
import React, { PropTypes } from 'react';


const makeTypeObject = R.mapObjIndexed(R.always(PropTypes.object));
const makeTypeShape = R.mapObjIndexed(PropTypes.shape);

const renderErrorStyle = {
    display: 'block',
    border: '2px solid red',
    padding: '1em',
    color: 'red',
    backgroundColor: 'white',
};


export default function createView(spec) {

    const {
        actionsCreate,
        actionsUse,
        contextTypes,
        componentWillMount,
        propTypes,
        storesUse,
        storesCreate,
        render,
    } = spec;

    return React.createClass({

        ...spec,

        contextTypes: {
            ...contextTypes,
            actions: PropTypes.object,
        },

        propTypes: {
            ...makeTypeShape(storesUse),
            ...makeTypeObject(storesCreate),
            ...propTypes,
        },

        componentWillMount() {

            if (actionsCreate || actionsUse) {

                const mergedActions = {
                    ...actionsUse,
                    ...actionsCreate,
                };
                this.actions = {};
                for (const groupName in mergedActions) {
                    if (mergedActions.hasOwnProperty(groupName)) {
                        this.actions[groupName] = this.context.actions[groupName];
                    }

                }
            }

            return componentWillMount && componentWillMount.apply(this, arguments);
        },

        render() {

            try {
                return (render
                    ? render.apply(this, arguments)
                    : this.props.children
                );
            } catch (err) {
                console && console.error && console.error(
                    spec.displayName,
                    'rendering',
                    err.name + ':',
                    err,
                    err.stack
                );
                return (
                    <div style={ renderErrorStyle }>
                        Oops... something went wrong.
                    </div>
                );
            }
        },
    });
}
