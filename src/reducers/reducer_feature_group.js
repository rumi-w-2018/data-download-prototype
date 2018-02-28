import { SET_FEATURE_GROUP } from '../actions';


export default function ( state = {footprint: null, thumbnail: null}, action ){

    switch (action.type){

        case SET_FEATURE_GROUP:

            return { ...state, [action.layerType]: action.layerGroup };


        default:

            return state;
    }

}