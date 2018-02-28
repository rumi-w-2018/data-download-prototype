import { SET_ALL_DATASETS, SET_FILTERED_DATASETS, REMOVE_DATASET } from '../actions';
import { mapKeys, omit } from 'lodash';

export default function(state = {}, action){

    switch (action.type){

        case SET_ALL_DATASETS:
            if(action.payload.length > 0) return mapKeys(action.payload, 'datasetInternalId');
            else return state;

        case SET_FILTERED_DATASETS:
            if(action.payload.length > 0) return mapKeys(action.payload, 'datasetInternalId');
            else return {};

        case REMOVE_DATASET:
            return omit(state, action.payload);

        default:
            return state;
    }
}