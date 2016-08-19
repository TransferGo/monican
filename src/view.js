import createView from './create-view';
import createContext from './create-context';
import useContext from './use-context';

export default function View(spec) {

    return createContext(spec, useContext(spec, createView(spec)));
}
