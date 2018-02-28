import { SET_ORIG_DATASETS } from '../actions';

export default function(state = {}, action){

    switch (action.type){

        case SET_ORIG_DATASETS:

            if(action.payload.length > 0) return action.payload;    // keep array format
            else return state;


        default:
            return state;
    }
}