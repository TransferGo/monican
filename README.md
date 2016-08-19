# A Monican Conspiracy

This is not a framework. Just like React.

It lets one create _Actions_ and _Stores_ that are mounted/unmounted with a parent _View_.

## Installation

``` 
npm install monican
```

## Usage

### Example

```
import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { View } from 'monican';

const ChildView = View({

    displayName: 'YourChildView',

    actionsUse: {
        /// Action group
        parentActions: {
            /// Action name and the type of it's argument:
            onClickSomething: PropTypes.any,
        },
    },

    storesUse: {
        /// Store name
        parentStore: {
            /// Store value name and its type:
            clickCounter: PropTypes.number,
        },
    },

    render() {
        return (
            <button onClick={ this.actions.parentActions.onClickSomething }>
                Click me ({ this.props.parentStore.clickCounter })
            </button>
        );
    },
});

const parentActions = {
    onClickSomething: PropTypes.any,
};

const parentStore = {

    getInitialState() {
        return { clickCounter: 0 };
    },

    getActionHandlers() {
        return {
            parentActions: {
                onClickSomething: this.onClickSomething,
            },
        };
    },

    onClickSomething(arg, { state }) {
        return { clickCounter: state.clickCounter + 1 };
    },
};

const ParentView = View({

    displayName: 'YourParentView',

    actionsCreate: {
        parentActions: parentActions,
    },

    storesCreate: {
        parentStore: parentStore,
    },

    render() {
        return (
            <div>
                <h2>Parent view</h2>
                <p>Button has been clicked: { this.props.parentStore.clickCounter } times.</p>
                <ChildView/>
            </div>
        );
    },
});

const div = document.createElement('div');
render(<ParentView/>, div);
document.body.appendChild(div);
```

## License

A Monican Conspiracy is MIT licensed.
