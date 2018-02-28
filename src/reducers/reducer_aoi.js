import { SET_AOI, CLEAR_AOI } from '../actions';

export default function(state = { aoiType: '', coords: {} }, action){

    switch(action.type){

        case SET_AOI:
            return { aoiType: action.aoiType, coords: action.coords };

        case CLEAR_AOI:
            return action.payload;  // = {}

        default:
            return state;
    }

}