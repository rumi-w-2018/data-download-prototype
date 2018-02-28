import { CHANGE_ROUTES } from '../actions';

export default function(state = { route: 1, timeStamp:  new Date().getTime() }, action){     // 1: dataset, 2: product, 3: cart
    switch (action.type){

        case CHANGE_ROUTES:
            return { route: action.payload, timeStamp: action.timeStamp};

        default:
            return state;
    }
}