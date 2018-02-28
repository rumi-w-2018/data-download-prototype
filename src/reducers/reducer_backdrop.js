import { TOGGLE_BACKDROP } from '../actions';

export default function ( state=false, action){
    switch (action.type){

        case TOGGLE_BACKDROP:

            return action.payload;

        default:

            return state;

    }

}