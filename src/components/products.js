import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { size, map } from 'lodash';
import L from 'leaflet';
import Spinner from './spinner';
import Product from './product';
import SaveAllAsCsv from './save_all_as_csv';
import SaveAllAsText from './save_all_as_text';
import { getProdFootprintBounds }  from '../utilities/coordinates';
import { setFeatureGroup, addFootprintToList,
    removeFootprintFromList, addThumbToList,
    removeThumbFromList, setMapPopup,
    addProductToList, deleteProductFromList
} from '../actions';

const boxStyle = { weight: 1, opacity: 1, fillOpacity: 0, color: '#3300FF' };
const boxStyleSelected = { weight: 1, opacity: 1, fillOpacity: 0.1, color: '#00FF00' };

class Products extends Component{

    constructor(props){
        super(props);

        this.state = {
            showSpinner: false,
            allFootprintsOn: false,  // true = Show All Footprints, false = Hide All Footprints
            allThumbnailsOn: false   // true = Show All Thumbnails, false = Hide All Thumbnails
        };
    }

    componentDidMount(){
        if(!this.props.featureGroup.footprint){
            // eslint-disable-next-line
            const fGroup = new L.featureGroup()
                .addTo(this.props.map);
            this.props.setFeatureGroup ('footprint', fGroup);   // This makes footprintFeatureGroup state
        }

        if(!this.props.featureGroup.thumbnail){
            // eslint-disable-next-line
            const imgGroup = new L.featureGroup()
                .addTo(this.props.map);
            this.props.setFeatureGroup ('thumbnail', imgGroup);  // This makes thumbFeatureGroup state.
        }
    }

    componentWillReceiveProps(nextProps){
        // Clear all graphics btn clicked
        if( this.state.allFootprintsOn === true && size(this.props.footprintList) > 0 && size(nextProps.footprintList) === 0){
            this.setState({
                allFootprintsOn: false
            });
        }

        // Clear all graphics btn clicked
        if( this.state.allThumbnailsOn === true && size(this.props.thumbList) > 0 && size(nextProps.thumbList) === 0){
            this.setState({
                allThumbnailsOn: false
            });
        }

        if (this.props.fetchedProducts && this.props.fetchedProducts.offset !== nextProps.fetchedProducts.offset){
            this.setState({
                showSpinner: false
            });
        }
    }

    fetchPreviousItems() {
        if(this.props.fetchedProducts.total > this.props.fetchedProducts.max || this.props.fetchedProducts.offset !== 0){
            this.setState({
                showSpinner: true
            });

            const newOffset = this.props.fetchedProducts.offset - this.props.fetchedProducts.max;
            this.props.fetchNextPreviousItems(this.props.fetchedProducts.baseProdUrl, newOffset, this.props.fetchedProducts.max);
        }
    }

    fetchNextItems () {
        if(this.props.fetchedProducts.total > this.props.fetchedProducts.max && this.props.fetchedProducts.total > (this.props.fetchedProducts.offset + this.props.fetchedProducts.max)){
            this.setState({
                showSpinner: true
            });

            const newOffset = this.props.fetchedProducts.offset + this.props.fetchedProducts.max;
            this.props.fetchNextPreviousItems(this.props.fetchedProducts.baseProdUrl, newOffset, this.props.fetchedProducts.max);
        }
    }

    zoomToFootprint(product){
        const bounds  = getProdFootprintBounds( product.boundingBox);
        const southWest = L.latLng(bounds[0]);
        const northEast = L.latLng(bounds[1]);
        const zoomBounds = L.latLngBounds(southWest, northEast);
        this.props.map.fitBounds(zoomBounds);
    }

    toggleAllFootprints(){

        this.setState({
            allFootprintsOn: !this.state.allFootprintsOn
        }, () => {
            if(this.state.allFootprintsOn === true){
                this.props.fetchedProducts.items.forEach( (product) => {
                    this.drawFootprint(product);
                }, this);
            }else{
                this.props.fetchedProducts.items.forEach( (product) => {
                    this.removeFootprint(product);
                }, this);
            }
        }, this);
    }

    toggleAllThumbs(){
        this.setState({
            allThumbnailsOn: !this.state.allThumbnailsOn
        }, () => {
            if(this.state.allThumbnailsOn === true){
                this.props.fetchedProducts.items.forEach( (product) => {
                    this.drawThumbnail(product);
                }, this);
            }else{
                this.props.fetchedProducts.items.forEach( (product) => {
                    this.removeThumbnail(product);
                }, this);
            }
        }, this);
    }

    toggleFootprint(product, show){
        if(show === true){
            if(this.props.footprintList.hasOwnProperty(product.sourceId) === false) {
                this.drawFootprint(product);
            }
        }else{
            if(this.props.footprintList.hasOwnProperty(product.sourceId) === true) {
                this.removeFootprint(product);
            }
        }
    }

    toggleThumbnail(product, show){
        if(show === true){  //show
            if(this.props.thumbList.hasOwnProperty(product.sourceId) === false) {
                this.drawThumbnail(product);
            }
        }else{
            if(this.props.thumbList.hasOwnProperty(product.sourceId) === true) {
                this.removeThumbnail(product);
            }
        }
    }

    drawFootprint(product){
       const bounds  = getProdFootprintBounds( product.boundingBox);
       const footprintRectangle = L.rectangle (bounds , boxStyle)
            .on('click', function (e) {
                //  L.DomEvent.stopPropagation(e) is important, Without this, it will call map on click event.
                //  For IE11, L.DomEvent.preventDefault(e) also needed.
                L.DomEvent.stopPropagation(e);
                L.DomEvent.preventDefault(e);
                this.clickThisFootprint(e.latlng, e.originalEvent.pageX, e.originalEvent.pageY);

            }, this)

            .on('mouseover', function (e) {
                this.setStyle(boxStyleSelected); // this = boxVectorLayer
            })
            .on('mouseout', function (e) {
                this.setStyle(boxStyle); // this = boxVectorLayer
            });

        // Add to Footprint List if it's not already in the list
        if(this.props.footprintList.hasOwnProperty(product.sourceId) === false){
            const obj = {};
            obj[product.sourceId] = {
                title: product.title,
                sourceId: product.sourceId,
                selected: false,
                layer: footprintRectangle
            };

            this.props.addFootprintToList( obj );

            // Add to Footprint Feature Group
            this.props.featureGroup.footprint.addLayer(footprintRectangle);

            //this.props.featureGroup.footprint.bringToFront();
            this.props.featureGroup.footprint.setZIndex(5);

        }
    }

    clickThisFootprint(latlng, pageX, pageY){
        const itemArray = [];
        map (this.props.footprintList, (footprint) => {
            const bounds = footprint.layer.getBounds();
            if(bounds.contains(latlng)){
                const obj = {
                    title: footprint.title,
                    sourceId: footprint.sourceId
                };
                itemArray.push(obj);
            }
        });

        const popupObj = {
            prodItems: itemArray,
            latlng: latlng,
            pageX: pageX,
            pageY: pageY,
            timeStamp: new Date().getTime()
        };

        this.props.setMapPopup(popupObj);

    }

    removeFootprint(product) {
        if(this.props.footprintList.hasOwnProperty(product.sourceId)){
            // Remove from Footprint Feature Group
            this.props.featureGroup.footprint.removeLayer(this.props.footprintList[product.sourceId].layer);

            // Remove from Footprint List
            this.props.removeFootprintFromList( product.sourceId );
        }
    }

    drawThumbnail(product) {
        if (!product.previewGraphicURL || product.previewGraphicURL === '' || this.props.datasetItem.showThumbOnMap ===  false) {
            return;
        }

        if(this.props.thumbList.hasOwnProperty(product.sourceId) === false){
            const imageBounds  = getProdFootprintBounds(product.boundingBox);
            const self = this;
            const thumbLayer = L.imageOverlay(product.previewGraphicURL, imageBounds);
            const img = new Image();
            img.src = product.previewGraphicURL;

            // Make a layer only when the url is good.
            img.onload = () => {
                // Add to Footprint List
                const obj = {};
                obj[product.sourceId] = { layer: thumbLayer };
                self.props.addThumbToList( obj );

                // Add thumb to Thumb Feature Group
                self.props.featureGroup.thumbnail.addLayer(thumbLayer);
                //self.props.featureGroup.thumbnail.bringToFront();
                self.props.featureGroup.thumbnail.setZIndex(8);

                // Save modified thumbFeatureGroup to state
                //self.props.setThumbFeatureGroup(self.props.thumbFeatureGroup); - not necessary
            };

            img.onerror = function(){
                console.log('Image does not exist at the URL location.');
            };

            // Need to add footprint since ImageOverlay doesn't have mouse event for identirying. Add this even if image url is bad.
            this.drawFootprint(product);
        }

    }

    removeThumbnail(product) {
        if (!product.previewGraphicURL || product.previewGraphicURL === '' || this.props.datasetItem.showThumbOnMap ===  false) {
            return;
        }

        if(this.props.thumbList.hasOwnProperty(product.sourceId) === true){
            this.setState({
                thumbnailShown: false
            });

            // Remove from Footprint Feature Group
            this.props.featureGroup.thumbnail.removeLayer(this.props.thumbList[product.sourceId].layer);

            // Remove from Footprint List
            this.props.removeThumbFromList( product.sourceId );

            // Need to remove footprint usedfor identirying.
            this.removeFootprint(product);
        }
    }

    saveAllProducts(e){
        e.stopPropagation();

        this.props.fetchedProducts.items.forEach( product => {
            if(this.props.savedProducts && this.props.savedProducts.hasOwnProperty(product.sourceId)=== false){
                // Save the product - add the product to the saved product list
                // Add 'productDownload' from Dataset - needed in the list
                this.props.addProductToList( { ...product, 'productDownload': this.props.datasetItem.productDownload } );
            }
        });
    }

    unsaveAllProducts(e){
        e.stopPropagation();

        this.props.fetchedProducts.items.forEach( product => {
            if(this.props.savedProducts && this.props.savedProducts.hasOwnProperty(product.sourceId)=== true){

                // The product is already in the list.  Remove it from the list.
                this.props.deleteProductFromList(product.sourceId);
            }
        });
    }

    render() {
        if( !this.props.fetchedProducts ){
            return(
                <div className="col-8 offset-1 spinner-sm">
                    <Spinner />
                </div>
            );
        } else if(this.props.fetchedProducts.hasOwnProperty('errorProduct')){
            return(
                <div className="alert alert-warning" role="alert" style={{fontSize: '0.9em'}}>Error - Products could not be retrieved.</div>
            );
        }

        const productsList = this.props.fetchedProducts.items.map((product) => {
            const thumbUrl = (this.props.datasetItem.showThumbOnProdList === true && product.previewGraphicURL && product.previewGraphicURL !== '') ? product.previewGraphicURL : '';
            const thumbUrlForMap = (this.props.datasetItem.showThumbOnMap === true && product.previewGraphicURL && product.previewGraphicURL !== '') ? product.previewGraphicURL : '';

            return(
                <div className="row" key={product.sourceId}>
                    <Product product={product}
                             thumbUrl={thumbUrl}
                             thumbUrlForMap = {thumbUrlForMap}
                             productDownload={this.props.datasetItem.productDownload}
                             toggleFootprint={this.toggleFootprint.bind(this)}
                             toggleThumbnail={this.toggleThumbnail.bind(this)}
                             zoomToFootprint={this.zoomToFootprint.bind(this)}
                             scrollToProduct={this.props.scrollToProduct.bind(this)}
                             allFootprintsOn={this.state.allFootprintsOn}
                             allThumbnailsOn={this.state.allThumbnailsOn}  />
                </div>
            );
        });

        const toggleLabel = (e) => {
            e.stopPropagation();
            const current = e.currentTarget.innerText;
            const regexHide = /hide/i;
            const regexShow = /show/i;
            if(current.match(regexHide)) e.currentTarget.innerText = current.replace(regexHide, 'Show');
            else if(current.match(regexShow)) e.currentTarget.innerText = current.replace(regexShow, 'Hide');
        };

        const PrevBtnDisabled = this.props.fetchedProducts.total <= this.props.fetchedProducts.max || this.props.fetchedProducts.offset === 0;
        const nextBtnDisabled = this.props.fetchedProducts.total <= this.props.fetchedProducts.max || this.props.fetchedProducts.total <= (this.props.fetchedProducts.offset + this.props.fetchedProducts.max);
        const showAllFootprintsLabel = this.state.allFootprintsOn === true ? 'Hide All Footprints' : 'Show All Footprints';
        const showAllThumbnailsLabel = this.state.allThumbnailsOn === true ? 'Hide All Thubmails' : 'Show All Thubmails';

        return (
            <div className="card card-product">
                <div className="card-header search-summary text-white">
                    <div className="form-inline" >
                        <span style={{color: '#250aee'}} >{this.props.fetchedProducts.total} results </span>
                        <a className="link-special" data-toggle="collapse" href={'#' + this.props.datasetItem.datasetInternalId + '-prod'} aria-expanded="false"
                           aria-controls={this.props.datasetItem.datasetInternalId  + '-prod'} onClick={toggleLabel} >Hide</a>

                        <div className="btn-group ml-auto">
                            <SaveAllAsCsv fetchedProducts={this.props.fetchedProducts} />
                            <SaveAllAsText fetchedProducts={this.props.fetchedProducts} />
                        </div>
                    </div>
                </div>
                <div className="collapse show" id={this.props.datasetItem.datasetInternalId  + '-prod'}>
                    <div className="card-body">
                        <div className="d-flex justify-content-center" style={{paddingTop: '12px'}}>
                            { PrevBtnDisabled ?  <button className="btn btn-sm btn-outline-info btn-back-next" disabled>Previous Page</button> :
                                <button onClick={this.fetchPreviousItems.bind(this)} className="btn btn-sm btn-outline-info btn-back-next">Previous Page</button>
                            }

                            <span className="page-num"><span style={{marginRight:'2px'}}>Page {(this.props.fetchedProducts.offset/this.props.fetchedProducts.max) + 1}</span>
                                of<span style={{marginLeft:'2px'}}>{Math.ceil(this.props.fetchedProducts.total/this.props.fetchedProducts.max)}</span></span>

                            { nextBtnDisabled ? <button className="btn btn-sm btn-outline-info btn-back-next" disabled>Next Page</button> :
                                <button onClick={this.fetchNextItems.bind(this)} className="btn btn-sm btn-outline-info btn-back-next">Next Page</button>
                            }

                        </div>
                        <div className="d-flex justify-content-center" style={{paddingTop: '12px', paddingBottom: '12px'}}>
                            <span className="page-action" onClick={this.toggleAllFootprints.bind(this)}>{showAllFootprintsLabel}</span>

                            { this.props.datasetItem.showThumbOnMap === true ?
                                <span className="page-action" onClick={this.toggleAllThumbs.bind(this)}>{showAllThumbnailsLabel}</span> : null
                            }
                            <span className="page-action" onClick={this.saveAllProducts.bind(this)} >Save All Products</span>
                            <span className="page-action" onClick={this.unsaveAllProducts.bind(this)} >Unsave All Products</span>
                        </div>

                        <div className="card prod-detail">
                            { this.state.showSpinner === false ? <div className="card-body">{productsList}</div>
                                : <div className="spinner-sm card-body"><Spinner /></div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        );

    }
}

function mapsStateToProps({ savedProducts, featureGroup, footprintList, thumbList, products }, ownProps){
    return{
        savedProducts,
        featureGroup,
        footprintList,
        thumbList,
        fetchedProducts: products[ownProps.datasetItem.datasetInternalId]};
}

function mapDispatcherToProps (dispatch){
    return bindActionCreators( {
        addProductToList,
        deleteProductFromList,
        setFeatureGroup,
        addFootprintToList,
        removeFootprintFromList,
        addThumbToList,
        removeThumbFromList,
        setMapPopup }, (dispatch));
}

export default connect(mapsStateToProps, mapDispatcherToProps)(Products);
