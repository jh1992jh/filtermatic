import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers';

import thunk from 'redux-thunk'

const initialState = {};

const middleware = [thunk];


// const composerEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    initialState,
    /*composerEnchancers(
        applyMiddleware(...middleware)
    )*/
    applyMiddleware(...middleware)
)

export default store;