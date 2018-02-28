import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteProductFromList, resetSavedProducts } from '../actions';
import { map, size } from 'lodash';
import SaveAsCsv from './save_as_csv';
import SaveAsText from './save_as_text';
import Spinner from './spinner';


class SavedProducts extends Component {

    componentWillReceiveProps(nextProps){
        // Start over btn clicked.
        if(nextProps.selectedRoute.route === 0 && nextProps.selectedRoute.timeStamp !== this.props.selectedRoute.timeStamp){
            // Reset saved products - delete all
            this.props.resetSavedProducts();
        }
    }

    removeClicked(prodId, e){
        e.stopPropagation();

        this.props.deleteProductFromList(prodId);
    }

    removeAll(e){
        e.stopPropagation();
        this.props.resetSavedProducts();
    }

    render() {
        if( !this.props.savedProducts || this.props.savedProducts.length === 0 ){
            return(
                <div className="col-8 offset-1">
                    <Spinner />
                </div>
            );
        }

        const downloadList = (svdProduct) => {
            // eslint-disable-next-line
            return svdProduct.productDownload.map( (download, i ) => {
                if ( svdProduct.hasOwnProperty(download.name) && svdProduct[download.name] !== ''){
                    return(
                        <li className="info-item" key={i}>
                            <a href={svdProduct[download.name]} target="_blank">{download.display}</a>
                        </li>
                    );
                }
            });
        };

        const savedProductList = map(this.props.savedProducts, savedProduct => {
            return(
                <div className="card product-item" key={savedProduct.sourceId} >
                    <div className="card-body">
                        <div className="row"  >
                            {  savedProduct.previewGraphicURL || savedProduct.previewGraphicURL !== '' ?
                                <div className="prod-info col-lg-2 col-md-2 col-sm-2 col-12" style={{fontSize: '0.9em'}}>
                                    <img src={savedProduct.previewGraphicURL} alt="Preview" />
                                </div>
                                :  <div className="prod-info col-lg-1 col-md-1 col-sm-1 col-12" style={{border:'1px'}}>
                                      <i className="no-preview fa fa-file-image-o" title="No preview image available" /></div>
                            }

                            <div className="prod-info main-col col-lg-8 col-md-8 col-sm-8 col-12">
                                <span className="long-text">{savedProduct.title}</span><br />
                                <span>Product ID:</span> {savedProduct.sourceId}<br />
                                <span>Format:</span><span className="info-item"> {savedProduct.format} ({savedProduct.prettyFileSize})</span><br />
                                <span>Extent:</span><span className="info-item"> {savedProduct.extent}</span>
                                <ul style={{padding: '0', margin: '0'}}>
                                    <li className="info-item"><a href={savedProduct.metaUrl} target="_blank">Metadata</a></li>
                                    { downloadList(savedProduct) }
                                </ul>
                            </div>

                            <div className="prod-info col-lg-2 col-md-2 col-sm-2 col-12">
                                <button onClick={this.removeClicked.bind(this, savedProduct.sourceId )} className="btn btn-sm btn-outline-warning">Remove</button>
                            </div>

                        </div>
                    </div>
                </div>
            );
        });

        return(
            <div className="card-wrapper">
                <div className="card card-saved-product">
                    <div className="card-header">
                        <div className="form-inline">
                            <h6>Saved Products</h6>
                            <div className="badge badge-secondary" style={{fontSize:'0.9rem', marginLeft:'2%', marginTop:'-4px', padding:'4px 8px 6px 8px'}}>{size(this.props.savedProducts)} items</div>
                        </div>

                        <div className="d-flex" style={{marginTop:'10px'}}>
                            <div className="p-1" ><SaveAsCsv savedProducts={this.props.savedProducts} /></div>
                            <div className="p-1"><SaveAsText savedProducts={this.props.savedProducts} /></div>
                            <div className="ml-auto p-1">
                            <button onClick={this.removeAll.bind(this )}
                                    style={{fontSize:'1em', height:'2em', padding:'1px 10px'}}
                                    className="btn btn-sm btn-outline-warning">Remove All</button></div>
                        </div>
                    </div>
                    <div className="card-body">
                        {savedProductList}
                    </div>
                </div>
            </div>

        );
    }


}

function mapStateToProps( { savedProducts, selectedRoute } ) {
    return { savedProducts, selectedRoute };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators({ deleteProductFromList, resetSavedProducts }, (dispatch));
}

export default connect ( mapStateToProps, mapDispatcherToProps )(SavedProducts);
