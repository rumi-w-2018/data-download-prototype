import { omit, mapKeys } from 'lodash';
import { ADD_FEATURE_TO_LIST, REMOVE_FEATURE_FROM_LIST, REPLACE_FEATURE_LIST, EMPTY_FEATURE_LIST } from '../actions';


export default function ( state = {}, action ){

    switch (action.type){

        case ADD_FEATURE_TO_LIST:

            return { ...state, ...action.payload };

        case REMOVE_FEATURE_FROM_LIST:

            return omit(state, action.payload);

        case REPLACE_FEATURE_LIST:
            /*
            Action.payload is an array.  Convert it to an object
            */
            return mapKeys ( action.payload, 'sourceId');

        case EMPTY_FEATURE_LIST:
            /*
            Action.payload is an array.  Convert it to an object
            */
            return action.payload;  // = {}

        default:

            return state;
    }

}