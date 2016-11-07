import React, { PropTypes } from 'react';

import { ACTION_ON_MOUNT_STORES } from './constants';
import createActions from './create-actions';
import createStore from './create-store';
import { connectToStore, disconnectFromStore } from './store-utils';
import Dispatcher from './dispatcher';


export default function createContext({ displayName, actionsCreate, storesCreate, mediators }, ChildView) {

    const shouldCreateAnything = actionsCreate || storesCreate || mediators;

    if (!shouldCreateAnything) {
        return ChildView;
    }

    /// TODO: switch to using react-display-name:
    const viewDisplayName = displayName + '_ContextCreator';

    return React.createClass({

        displayName: viewDisplayName,

        contextTypes: {
            actions: PropTypes.object,
            dispatcher: PropTypes.object,
            stores: PropTypes.object,
        },

        childContextTypes: {
            actions: PropTypes.object,
            dispatcher: PropTypes.object,
            stores: PropTypes.object,
        },

        getChildContext() {
            return {
                actions: this.actions,
                dispatcher: this.dispatcher,
                stores: this.stores,
            };
        },

        getInitialState() {

            return {};
        },

        componentWillMount() {

            this.displayName = viewDisplayName;

            this.dispatcher = this.context.dispatcher || new Dispatcher;

            this.actions = this.context.actions ? { ...this.context.actions } : {};
            this.stores = this.context.stores ? { ...this.context.stores } : {};
            this.mediators = {};

            for (const name in actionsCreate) {
                if (actionsCreate.hasOwnProperty(name)) {
                    this.actions[name] = createActions(this, name, actionsCreate[name]);
                }
            }

            for (const name in storesCreate) {
                if (storesCreate.hasOwnProperty(name)) {
                    this.stores[name] = createStore(this, name, storesCreate[name]);
                }
            }

            for (const name in mediators) {
                if (mediators.hasOwnProperty(name)) {
                    this.mediators[name] = createStore(this, name + '_mediator', mediators[name]);
                }
            }

            /*
             *  Lets componentWillMount() use a waitFor() in stores and mediators:
             */
            if (this.dispatcher.isDispatching()) {

                for (const name in storesCreate) {
                    if (storesCreate.hasOwnProperty(name)) {
                        this.stores[name].componentWillMount();
                    }
                }

                for (const name in this.mediators) {
                    if (this.mediators.hasOwnProperty(name)) {
                        this.mediators[name].componentWillMount();
                    }
                }
            } else {
                this.dispatcher.dispatch({ actionId: ACTION_ON_MOUNT_STORES });
            }

            for (const name in storesCreate) {
                if (storesCreate.hasOwnProperty(name)) {
                    connectToStore(this, name, this.stores[name]);
                }
            }
        },

        componentWillUnmount() {

            for (const name in storesCreate) {
                if (storesCreate.hasOwnProperty(name)) {
                    disconnectFromStore(this, name, this.stores[name]);
                }
            }

            for (const name in this.mediators) {
                if (this.mediators.hasOwnProperty(name)) {
                    this.mediators[name].componentWillUnmount();
                }
            }

            for (const name in storesCreate) {
                if (storesCreate.hasOwnProperty(name)) {
                    this.stores[name].componentWillUnmount();
                }
            }
        },

        render() {

            return <ChildView { ...this.props } { ...this.state }/>;
        },
    });
}
