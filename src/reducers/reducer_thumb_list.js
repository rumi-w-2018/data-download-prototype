import { omit } from 'lodash';
import { ADD_THUMB_TO_LIST, REMOVE_THUMB_FROM_LIST, EMPTY_THUMB_LIST } from '../actions';


export default function ( state = {}, action ){

    switch (action.type){

        case ADD_THUMB_TO_LIST:

            return { ...state, ...action.payload };

        case REMOVE_THUMB_FROM_LIST:

            return omit(state, action.payload);

        case EMPTY_THUMB_LIST:

            return action.payload;


        default:

            return state;
    }

}