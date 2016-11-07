import React, { PropTypes } from 'react';

import { connectToStore, disconnectFromStore } from './store-utils';


export default function useContext({ displayName, storesUse }, ChildView) {

    if (!storesUse) {
        return ChildView;
    }

    const viewDisplayName = displayName + '_ContextUser';

    return React.createClass({

        displayName: viewDisplayName,

        contextTypes: {
            stores: PropTypes.object,
        },

        getInitialState() {

            return {};
        },

        componentWillMount() {

            this.displayName = viewDisplayName;

            const { stores } = this.context;
            for (const name in storesUse) {
                if (storesUse.hasOwnProperty(name)) {
                    connectToStore(this, name, stores[name]);
                }
            }
        },

        componentWillUnmount() {

            const { stores } = this.context;
            for (const name in storesUse) {
                if (storesUse.hasOwnProperty(name)) {
                    disconnectFromStore(this, name, stores[name]);
                }
            }
        },

        render() {

            return <ChildView { ...this.state } { ...this.props }/>;
        },
    });
}
