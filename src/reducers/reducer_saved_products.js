import { ADD_PRODUCT_TO_LIST, DELETE_PRODUCT_FROM_LIST, RESET_SAVED_PRODUCTS } from '../actions';
import { omit } from 'lodash';

export default function(state = {}, action){

    switch (action.type){

        case ADD_PRODUCT_TO_LIST:

            return { ...state, [action.payload.sourceId]: action.payload};

        case DELETE_PRODUCT_FROM_LIST:

            return omit (state, action.payload);

        case RESET_SAVED_PRODUCTS:

            return action.payload;

        default:
            return state;

    }

}
