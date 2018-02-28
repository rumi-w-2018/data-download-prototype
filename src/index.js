import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import ReduxAsyncQueue from 'redux-async-queue';
import App from './components/app';
import reducers from './reducers';


// Add middleware
const createStoreWithMiddleware = applyMiddleware(promise, thunk, ReduxAsyncQueue )(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <App />
    </Provider>
    , document.getElementById('content')
);
