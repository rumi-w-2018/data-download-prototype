import { SET_PRODUCTS, REPORT_PRODUCTS_ERROR, RESET_PRODUCTS, REMOVE_PRODUCTS_FOR_A_DATASET } from '../actions';
import { omit } from 'lodash';

export default function(state = {}, action){

    switch (action.type){

        case SET_PRODUCTS:
            const images = [];
            action.payload.items.forEach( item => {
                const img = new Image();
                if(item.previewGraphicURL && item.previewGraphicURL !== '' && !item.previewGraphicURL.match(/ftp/g)){
                    img.src = item.previewGraphicURL;
                    images.push(img);
                }

            });

            const newObj = { baseProdUrl: action.baseProdUrl, max: action.max, offset: action.offset };
            const updatedPayload = { ...action.payload, ...newObj };

            return { ...state, [action.datasetInternalId]: updatedPayload };

        case REPORT_PRODUCTS_ERROR:

            return { ...state, [action.datasetInternalId]: action.payload};

        case REMOVE_PRODUCTS_FOR_A_DATASET:

            // The code below looks for the dataset with the datasetInternalId, remove it and return the whole state as new state
            return omit(state, action.datasetInternalId);

        case RESET_PRODUCTS:

            return action.payload;

        default:
            return state;
    }
}