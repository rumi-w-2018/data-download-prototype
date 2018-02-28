import {SET_MAP_POPUP} from '../actions';

export default function(state = {}, action) {

    switch(action.type){

        case SET_MAP_POPUP:

            return action.payload;

        default:

            return state;

    }
}