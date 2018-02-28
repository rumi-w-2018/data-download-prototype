import 'whatwg-fetch';

// Datasets
export const SET_ORIG_DATASETS = 'SET_ORIG_DATASETS';
export const SET_ALL_DATASETS = 'SET_ALL_DATASETS';
export const SET_FILTERED_DATASETS = 'SET_FILTERED_DATASETS';
export const REMOVE_DATASET = 'REMOVE_DATASET';
// Products
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const REPORT_PRODUCTS_ERROR = 'REPORT_PRODUCTS_ERROR';
export const RESET_PRODUCTS= 'RESET_PRODUCTS';
export const REMOVE_PRODUCTS_FOR_A_DATASET = 'REMOVE_PRODUCTS_FOR_A_DATASET';
// Saved products
export const ADD_PRODUCT_TO_LIST = 'ADD_PRODUCT_TO_LIST';
export const DELETE_PRODUCT_FROM_LIST = 'DELETE_PRODUCT_FROM_LIST';
export const RESET_SAVED_PRODUCTS = 'RESET_SAVED_PRODUCTS';
// Routes
export const CHANGE_ROUTES = 'CHANGE_ROUTES';
// AOI
export const SET_AOI = 'SET_AOI';
export const CLEAR_AOI = 'CLEAR_AOI';
export const SET_FEATURE_GROUP = 'SET_FEATURE_GROUP';
// footprint list
export const ADD_FEATURE_TO_LIST = 'ADD_FEATURE_TO_LIST';
export const REMOVE_FEATURE_FROM_LIST = 'REMOVE_FEATURE_FROM_LIST';
export const REPLACE_FEATURE_LIST = 'REPLACE_FEATURE_LIST';
export const EMPTY_FEATURE_LIST = 'EMPTY_FEATURE_LIST';
// thumb list
export const ADD_THUMB_TO_LIST = 'ADD_THUMB_TO_LIST';
export const REMOVE_THUMB_FROM_LIST = 'REMOVE_THUMB_FROM_LIST';
export const EMPTY_THUMB_LIST = 'EMPTY_THUMB_LIST';
// popup
export const SET_MAP_POPUP = 'SET_MAP_POPUP';
// backdrop
export const TOGGLE_BACKDROP = ' SHOW_BACKDROP';

const QUEUE_PRODUCTS_FETCH = 'QUEUE_PRODUCTS_FETCH';

/*backdrop*/
export function toggleBackdrop ( show ){    // status=true, false
    return{
        type: TOGGLE_BACKDROP,
        payload: show
    };
}

/*
    Datasets
*/
export function setOrigDatasets( datasets ){
    return {
        type: SET_ORIG_DATASETS,
        payload: datasets
    };
}

export function setAllDatasets( datasets ){
    return {
        type: SET_ALL_DATASETS,
        payload: datasets
    };
}

export function setFilterDatasets( datasets ){
    return {
        type: SET_FILTERED_DATASETS,
        payload: datasets
    };
}

export function getAllDatasets(){
    const datasetsUrl = './data/datasets.json';
    return (dispatch) => {
        const request = fetch(datasetsUrl)
            .then((response) => response.json())
            .catch((error) => {
                console.log('Error retrieving datasets: ', error);
                return [];
            });
        dispatch(setAllDatasets(request));
        dispatch(setOrigDatasets(request));

    };
}

export function filterDatasetsByCheckbox(keywordSet, datasets){
    return (dispatch) => {
        let filteredDatasets = [];
        keywordSet.forEach( (keyword ) => {
            // eslint-disable-next-line
            let tempArray = datasets.filter ( dataset => {
                if (dataset.filterKeys.indexOf(keyword.toLowerCase()) > -1) {

                    return dataset;
                }
            });
            filteredDatasets = [...filteredDatasets, ...tempArray];
        });
        if(filteredDatasets.length === 0 ){
            dispatch(setFilterDatasets(datasets));
        }else {
            dispatch(setFilterDatasets(filteredDatasets));
        }
    };
}

export function removeDataset(datasetInternalId){
    return{
        type: REMOVE_DATASET,
        payload: datasetInternalId
    };
}

/*
    Routes
*/
export function changeRoutes( newRoute, timeStamp ){
    return{
        type: CHANGE_ROUTES,
        payload: newRoute,
        timeStamp: timeStamp
    };
}

/*
    Products
*/
export function setProducts( products, baseProdUrl, max, offset, datasetInternalId ){
    return {
        type: SET_PRODUCTS,
        payload: products,
        baseProdUrl: baseProdUrl,
        max: max,
        offset: offset,
        datasetInternalId: datasetInternalId
    };
}

function reportProductsError(datasetInternalId){
    return{
        type: REPORT_PRODUCTS_ERROR,
        payload: { 'errorProduct' : 'Error - Products could not be retrieved. '},
        datasetInternalId: datasetInternalId
    };
}

export function queueFetchProducts(prodUrl, baseProdUrl, max, offset, datasetInternalId){
    console.log('datasetInternalId', datasetInternalId);
    return {
        queue: QUEUE_PRODUCTS_FETCH,
        callback: (next, dispatch, getState) => {
            fetch(prodUrl)
                .then( response => {

                    return response.json();
                })
                .then( json => {

                    dispatch(setProducts(json, baseProdUrl, max, offset, datasetInternalId));
                    next();
                })
                .catch( (error) => {
                    console.log('Error retrieving products', error);
                    dispatch(reportProductsError(datasetInternalId));

                    next();
                });
        }
    };
}

export function removeProductsForADataset(datasetInternalId){
    return{
        type: REMOVE_PRODUCTS_FOR_A_DATASET,
        datasetInternalId
    };
}

export function resetProducts() {
    return{
        type: RESET_PRODUCTS,
        payload: {}
    };

}

/*
    Saved Products
*/

export function addProductToList(product){
    return{
        type: ADD_PRODUCT_TO_LIST,
        payload: product
    };
}

export function deleteProductFromList(productId){
    return{
        type: DELETE_PRODUCT_FROM_LIST,
        payload: productId
    };
}

export function resetSavedProducts() {
    return{
        type: RESET_SAVED_PRODUCTS,
        payload: {}
    };

}

/*
    AOI
        aoiType: coords/polygon
        coords: { minX, minY, maxX, maxY }
*/
export function setAoi( aoiType, coordinates ){
    return{
        type: SET_AOI,
        aoiType,
        coords: {
            minX: (coordinates.minX <= -180 ? -179.9999 : coordinates.minX),
            minY: coordinates.minY,
            maxX: coordinates.maxX,
            maxY: coordinates.maxY
        }

    };
}

export function clearAoi(){
    return{
        type: CLEAR_AOI,
        payload: {}
    };
}


/*
    Feature Group
*/
export function setFeatureGroup(layerType, layerGroup){

    return {
        type: SET_FEATURE_GROUP,
        layerType,
        layerGroup
    };
}


/*
    Footprint List
*/

export function addFootprintToList(footprintItem){
    return {
        type: ADD_FEATURE_TO_LIST,
        payload: footprintItem
    };
}

export function removeFootprintFromList(id){
    return {
        type: REMOVE_FEATURE_FROM_LIST,
        payload: id
    };
}

export function replaceFootprintList(array){
    return{
        type: REPLACE_FEATURE_LIST,
        payload: array
    };
}

export function emptyFootprintList(){
    return {
        type: EMPTY_FEATURE_LIST,
        payload: {}
    };
}

/*
    Thumb List
*/

export function addThumbToList(thumItem){
    return {
        type: ADD_THUMB_TO_LIST,
        payload: thumItem
    };
}

export function removeThumbFromList(id){
    return {
        type: REMOVE_THUMB_FROM_LIST,
        payload: id
    };
}

export function emptyThumbList(){
    return {
        type: EMPTY_THUMB_LIST,
        payload: {}
    };
}

/*
    Map popup
*/

export function setMapPopup(popupObj){
    return {
        type: SET_MAP_POPUP,
        payload: popupObj
    };

}

