import objectAssign from 'object-assign';
import R from 'ramda';


const SEPARATOR = '/';
let groupCounter = 0;


function callAction(dispatcher, actionId, argTypes, argument) {

    /// TODO: add argument type validation
    dispatcher.dispatch({ actionId, argument });
}


export default function createActions(view, groupName, groupActions) {

    const groupId = view.displayName + SEPARATOR + groupName + SEPARATOR + groupCounter;
    groupCounter++;

    return R.mapObjIndexed(
        (argTypes, actionName) => {
            const actionId = groupId + SEPARATOR + actionName;
            return objectAssign(
                callAction.bind(view, view.dispatcher, actionId, argTypes),
                { actionId },
            );
        },
        groupActions,
    );
}
