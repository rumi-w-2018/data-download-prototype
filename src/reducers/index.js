import { combineReducers } from 'redux';
import datasetsReducer from './reducer_datasets';
import origDatasetsReducer from './reducer_original_datasets';
import selectedRouteReducer from './reducer_routes';
import productsReducer from './reducer_products';
import savedProductsReducer from './reducer_saved_products';
import aoiReducer from './reducer_aoi';
import featureGroupReducer from './reducer_feature_group';
import footprintListReducer from './reducer_footprint_list';
import thumbListReducer from './reducer_thumb_list';
import mapPopupReducer from './reducer_map_popup';
import backdropReducer from './reducer_backdrop';

const rootReducer = combineReducers({
    datasets: datasetsReducer,
    origDatasets: origDatasetsReducer,
    products: productsReducer,
    savedProducts: savedProductsReducer,
    selectedRoute: selectedRouteReducer,
    aoi: aoiReducer,
    featureGroup: featureGroupReducer,
    footprintList: footprintListReducer,
    thumbList: thumbListReducer,
    mapPopup: mapPopupReducer,
    backdropVisibility: backdropReducer
});

export default rootReducer;