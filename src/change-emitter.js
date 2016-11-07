export default class ChangeEmitter {

    changeListeners = [];

    constructor() {

        this.addChangeListener = this.addChangeListener.bind(this);
        this.removeChangeListener = this.removeChangeListener.bind(this);
    }

    addChangeListener(fn) {

        this.changeListeners.push(fn);
    }

    removeChangeListener(fn) {

        const index = this.changeListeners.indexOf(fn);
        if (index === -1) {
            throw Error('Trying to unregister a change listener that is not registered in store ' + this.displayName);
        }

        this.changeListeners.splice(index, 1);
    }

    emitChange(payload) {
        for (const listener of this.changeListeners) {
            if (this.changeListeners.hasOwnProperty(listener)) {
                try {
                    listener(payload);
                } catch (err) {
                    console.error(
                        'Error propagating Store changes to a View(?)',
                        err, payload, listener,
                    );
                }
            }
        }
    }
}
