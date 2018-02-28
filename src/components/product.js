import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { map, size } from 'lodash';
import Spinner from './spinner';
import {
    addProductToList,
    deleteProductFromList,
    setFeatureGroup,
    addFootprintToList,
    removeFootprintFromList,
    addThumbToList,
    removeThumbFromList,
    setMapPopup } from '../actions';

class Product extends Component {

    constructor(props){
        super(props);
        
        this.renderProductDownload = this.renderProductDownload.bind(this);
        this.saveBtnClicked = this.saveBtnClicked.bind(this);

        this.state = {
            saved: false,
            thumbnailShown: false,
            footprintShown: false,
            footprintSelectedOnMap: false
        };
    }

    componentDidMount(){
        if( !this.props.savedProducts.hasOwnProperty(this.props.product.sourceId)){
            this.setState({
                saved: false
            });
        }else{
            this.setState({
                saved: true
            });
        }

    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.savedProducts.hasOwnProperty(this.props.product.sourceId)){
            this.setState({
                saved: false
            });
        }else{
            this.setState({
                saved: true
            });
        }

        // Show/Hide All Footprints
        if(this.props.allFootprintsOn !== nextProps.allFootprintsOn ){
            if(nextProps.allFootprintsOn === true && this.state.footprintShown === false){
                this.setState({
                    footprintShown: true
                });
            }else if(nextProps.allFootprintsOn === false && this.state.footprintShown === true){
                this.setState({
                    footprintShown: false
                });
            }
        }

        // Show/Hide All Thumbnails
        if(this.props.allThumbnailsOn !== nextProps.allThumbnailsOn ){
            if(nextProps.allThumbnailsOn === true && this.state.thumbnailShown === false){
                this.setState({
                    thumbnailShown: true
                });

            }else if(nextProps.allThumbnailsOn === false && this.state.thumbnailShown === true){
                this.setState({
                    thumbnailShown: false
                });
            }
        }

        // Clear All Graphics Btn clicked
        if( this.state.footprintShown === true && size(this.props.footprintList) > 0 && size(nextProps.footprintList) === 0){
            this.setState({
                footprintShown: false,
                footprintSelectedOnMap: false
            });
        }

        // Clear All Graphics Btn clicked
        if( this.state.thumbnailShown ===  true && size(this.props.thumbList) > 0 && size(nextProps.thumbList) === 0){
            this.setState({
                thumbnailShown: false,
                footprintSelectedOnMap: false
            });
        }

        // Footprint clicked on the map.
        if(nextProps.footprintList.hasOwnProperty(this.props.product.sourceId) === true && nextProps.footprintList[this.props.product.sourceId].selected === true){
            if(this.state.footprintSelectedOnMap === false){
                this.setState({
                    footprintSelectedOnMap: true
                }, () => {
                    this.props.scrollToProduct(ReactDOM.findDOMNode(this));
                }, this);
            }
        }else if(nextProps.footprintList.hasOwnProperty(this.props.product.sourceId) === true && nextProps.footprintList[this.props.product.sourceId].selected === false){
            if(this.state.footprintSelectedOnMap === true){
                this.setState({
                    footprintSelectedOnMap: false
                });
            }
        }
    }

    renderProductDownload(download, i){
        if(this.props.product.hasOwnProperty(download.name) && this.props.product[download.name] !== '' ){
            return(
                <li  className="info-item" key={i}>
                    <a href={this.props.product[download.name]} className="link-no-underline" style={{fontSize: '0.8rem'}} target="_blank">{download.display}</a>
                </li>
            );
        }
    }

    saveBtnClicked(e){
        e.stopPropagation();

        if(this.props.savedProducts){
            this.setState({
                saved: !this.state.saved
            });

            if(this.props.savedProducts.hasOwnProperty(this.props.product.sourceId)){
                // The product is already in the list.  Remove it from the list.
                this.props.deleteProductFromList(this.props.product.sourceId);
            }else{
                // Save the product - add the product to the saved product list
                // Add 'productDownload' from Dataset - needed in the list
                this.props.addProductToList( { ...this.props.product, 'productDownload': this.props.productDownload } );
            }
        }
    }

    toggleFootprint(){
        this.setState({
            footprintShown: !this.state.footprintShown
        }, () => {
            if (this.state.footprintShown === true){
                this.props.toggleFootprint(this.props.product, true);
            }else{
                this.props.toggleFootprint(this.props.product, false);
            }
        });
    }

    toggleThumbnail(){
        this.setState({
            thumbnailShown: !this.state.thumbnailShown
        }, () => {
            if (this.state.thumbnailShown === true){
                this.props.toggleThumbnail(this.props.product, true);
            }else{
                this.props.toggleThumbnail(this.props.product, false);
            }
        });
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
            // 'prodTitle': this.props.product.title,
            // 'prodSourceId': this.props.product.sourceId,
            latlng: latlng,
            pageX: pageX,
            pageY: pageY,
            timeStamp: new Date().getTime()
        };
        this.props.setMapPopup(popupObj);

    }

    render(){
        if( !this.props.product || this.props.product === [] ){
            return(
                <div className="col-8 offset-1">
                    <Spinner />
                </div>
            );
        }

        const cardClass = this.state.footprintSelectedOnMap === true ? 'card product-item selected' : 'card product-item';
        const saveBtnClass = this.state.saved === false ? 'btn btn-sm btn-outline-info save-btn' : 'btn btn-sm btn-outline-info save-btn active';
        const saveBtnLabel = this.state.saved === false ? 'Save' : 'Saved';
        const footprintClass = (this.state.footprintShown === false || (this.state.footprintShown === true && this.state.thumbnailShown === true )) ? 'link-no-underline' : 'link-no-underline footprintShown';
        const thumbClass = this.state.thumbnailShown === false ? 'link-no-underline' : 'link-no-underline footprintShown';

        const thumbImgClass = 'modal-dialog modal-sm product-thumb animation-effect';


        return (
            <div className={cardClass} >
                <div className="card-body">
                    <div className="row">

                        { this.props.thumbUrl !== '' ?
                            <div className="prod-info col-lg-2 col-md-2 col-sm-2 col-12" style={{border:'1px'}}>
                                <img className={thumbImgClass} src={this.props.thumbUrl} alt="Preview" />
                            </div>
                            :
                            <div className="prod-info col-lg-2 col-md-2 col-sm-2 col-12" style={{border:'1px'}}>
                                <i className="no-preview fa fa-file-image-o" title="No preview image available" />
                            </div>
                        }

                        <div className="prod-info main-col col-lg-8 col-md-8 col-sm-9 col-12">
                            <span className="long-text">{this.props.product.title}</span><br />
                            <span className="bold">Published Date:</span><span className="info-item">{this.props.product.publicationDate}</span><br />
                            <span className="bold">Metadata Updated:</span><span className="info-item">{this.props.product.lastUpdated}</span><br />
                            <span className="bold">Format:</span><span className="info-item">{this.props.product.format} ({this.props.product.prettyFileSize})</span><br />
                            <span className="bold">Extent:</span><span className="info-item">{this.props.product.extent}</span>
                        </div>

                        <div className="prod-info col-lg-2 col-md-2 col-sm-2 col-12">
                            <button className={saveBtnClass} onClick={this.saveBtnClicked} style={{width: '70px'}}>{saveBtnLabel}</button>
                        </div>
                    </div>

                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-end">
                         <ul>
                             <li className="info-item"><span className={footprintClass} onClick={this.toggleFootprint.bind(this)} title="Draw footprint" >Footprint</span></li>

                             {
                                 this.props.thumbUrlForMap !== '' ?
                                     <li className="info-item"><span className={thumbClass} onClick={this.toggleThumbnail.bind(this)}>Thumbnail</span></li>  : null
                             }

                             <li className="info-item"><span className="link-no-underline" onClick={this.props.zoomToFootprint.bind(this, this.props.product)}>ZoomTo</span></li>
                             <li className="info-item">Metadata</li>
                             {this.props.productDownload.map(this.renderProductDownload)}
                         </ul>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps ( { savedProducts, featureGroup, footprintList, thumbList }){
    return { savedProducts, featureGroup, footprintList, thumbList };
}

function mapDispatcherToProps (dispatch){
    return bindActionCreators( { addProductToList, deleteProductFromList, setFeatureGroup,
        addFootprintToList, removeFootprintFromList, addThumbToList, removeThumbFromList, setMapPopup }, (dispatch));
}

export default connect( mapStateToProps, mapDispatcherToProps )(Product);


