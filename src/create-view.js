import R from 'ramda';
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
                    this.actions[groupName] = this.context.actions[groupName];
                }
            }

            return componentWillMount && componentWillMount.apply(this, arguments);
        },

        render() {

            if (!render) {
                return this.props.children;
            }

            try {
                return render.apply(this, arguments);
            } catch (err) {
                const message = spec.displayName + ' rendering error:';
                console && console.error && console.error(message, err);
                return (
                    <div style={ renderErrorStyle }>
                        Oops... something went wrong.
                    </div>
                );
            }
        },
    });
}
