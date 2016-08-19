import { Dispatcher } from 'flux';

class DebugDispatcher extends Dispatcher {

    dispatch(...args) {
        console.log(
            'dispatch',
            this.isDispatching() ? 'IN DA MIDDLE OF DISPATCH' : 'ok',
            args[0].actionId,
            '\n',
            args[0].argument,
        );
        super.dispatch(...args);
    }
}

module.exports = {
    DebugDispatcher,
    Dispatcher: DebugDispatcher,
};
