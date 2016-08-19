export function connectToStore(view, storeName, storeInstance) {

    function setStateValue(key, value) {

        const patch = {};
        patch[key] = value;
        try {
            this.setState(patch);
        } catch (err) {
            console.error('Error calling setState on a View.', err, this, key, value);
        }
    }

    view.setStateValue = view.setStateValue || setStateValue;
    const fn = view.setStateValue[storeName] = view.setStateValue.bind(view, storeName);
    storeInstance.addChangeListener(fn);
    fn(storeInstance.state);

}

export function disconnectFromStore(view, storeName, storeInstance) {

    storeInstance.removeChangeListener(view.setStateValue[storeName]);
}

