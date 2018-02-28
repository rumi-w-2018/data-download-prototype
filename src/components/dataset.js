import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { queueFetchProducts, removeProductsForADataset } from '../actions';
import { size } from 'lodash';
import Products from './products';
import Spinner from './spinner';
import Popover from './popover';
import { URLs } from '../config/config';

const API_DOMAIN = URLs.apiDomain;
const PROD_ROOT_URL = `${API_DOMAIN}tnmaccess/api/products?`;

class Dataset extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showProducts: false,
            selectedExtentName: '',
            selectedExtentValue: '',
            selectedFormatName: '',
            selectedFormatValue: '',
        };

        this.defaultOffset = 0;
        this.defaultMax = 40;

    }

    componentDidMount(){
        this.setState({
            showProducts: this.props.showProducts,
            selectedExtentName: this.props.datasetItem.defaultExtentName,
            selectedExtentValue: this.props.datasetItem.defaultExtentSbTag,
            selectedFormatName: this.props.datasetItem.defaultFormatName,
            selectedFormatValue: this.props.datasetItem.defaultFormatSbTag
        });
    }

    componentWillReceiveProps(nextProps){
        if(this.state.showProducts !== nextProps.showProducts){
            this.setState({
                showProducts: nextProps.showProducts,
            });
        }
    }

    handleExtentCheckboxChange(sbTag, name) {
        this.setState({
            selectedExtentName: name,
            selectedExtentValue: sbTag,
            selectedFormatName: '',
            selectedFormatValue: ''
        });
    }

    handleFormatCheckboxChange(sbTag, name) {
        this.setState({
            selectedFormatName: name,
            selectedFormatValue: sbTag
        });
    }

    fetchNextPreviousItems(baseUrl, offset, max){
        const maxParam = max !== '' ? `max=${max}` : 'max=40';
        const offsetParam = offset !== '' ? `offset=${offset}` : 'offset=0';
        const url = `${baseUrl}&${maxParam}&${offsetParam}`;

        this.props.queueFetchProducts(url, baseUrl, max, offset, this.props.datasetItem.datasetInternalId);
    }

    fetchProdItems(e){

        e.stopPropagation();

        // Clear products from the previouse fetch if there are.
        if(this.props.products.hasOwnProperty(this.props.datasetItem.datasetInternalId)){
            this.props.removeProductsForADataset(this.props.datasetItem.datasetInternalId);
        }
        this.props.closeDatasetsFilters();

        let bbox = '', q = '', start = '', end = '', dateType = '';
        let datasets = '', prodFormats = '', prodExtents = '';

        const max = this.defaultMax;
        const offset = this.defaultOffset;

        // AOI
        if(this.props.aoi.aoiType === 'coords'){
            bbox = size(this.props.aoi.coords) > 0 ?
                this.props.aoi.coords.minX + ',' +  this.props.aoi.coords.minY + ',' + this.props.aoi.coords.maxX + ',' + this.props.aoi.coords.maxY : '';
            q = '';
        }

        datasets = this.props.datasetItem.sbDatasetTag;
        prodExtents = this.state.selectedExtentValue;
        prodFormats = this.state.selectedFormatValue;

        const bboxParam = (bbox !== '') ? `bbox=${bbox}` : 'bbox=';
        const qParam = (q !== '') ? `q=${q}` : 'q=';
        const startParam =  (start !== '') ? `start=${start}` : 'start=';
        const endParam = (end !== '') ? `end=${end}` : 'end=';
        const dateTypeParam = (dateType !== '') ? `dateType=${dateType}` : 'dateType=';
        const datasetParam = (datasets !== '') ? `datasets=${datasets}` : 'datasets=';
        const prodFormatsParam = (prodFormats !== '') ? `prodFormats=${prodFormats}` : 'prodFormats=';
        const prodExtentsParam = prodExtents !== '' ? `prodExtents=${prodExtents}` : 'prodExtents=';
        const maxParam = max !== '' ? `max=${max}` : 'max=40';
        const offsetParam = offset !== '' ? `offset=${offset}` : 'offset=0';

        const baseUrl = `${PROD_ROOT_URL}${bboxParam}&${qParam}&${startParam}&${endParam}&${dateTypeParam}&${datasetParam}&${prodFormatsParam}&${prodExtentsParam}`;
        const url = `${baseUrl}&${maxParam}&${offsetParam}`;

        this.setState({
            showProducts: true
        });

        this.props.queueFetchProducts(url, baseUrl, max, offset, this.props.datasetItem.datasetInternalId);
    }

    remove(e){
        e.stopPropagation();
        this.props.removeDataset(this.props.datasetItem.datasetInternalId);
    }

    scrollToProduct(node){
        ReactDOM.findDOMNode(node).scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    render() {
        // console.log('process.env.REACT_APP_ENV',process.env.REACT_APP_ENV );

        const extents = this.props.datasetItem.extents.map( extent => {
            if(this.props.datasetItem.extents.length > 1){
                return(
                    <li key={extent.name} className="form-inline">
                        <label className="label-option radio radio-inline control-label">
                            <input type="radio"
                                   name={this.props.datasetItem.datasetInternalId + '-extent-radio'}
                                   value={extent.sbTag}
                                   checked={this.state.selectedExtentName === extent.name}
                                   onChange={this.handleExtentCheckboxChange.bind(this, extent.sbTag, extent.name)} />
                            {extent.display}

                        </label>
                    </li>
                );

            }else {
                return(
                    <li  key={extent.name} style={{marginLeft: '5px'}} className="form-inline" >
                        {extent.display}
                    </li>
                );
            }
        });

        const selectedExtent = this.state.selectedExtentName === '' ? this.props.datasetItem.defaultExtentName : this.state.selectedExtentName;

        const formats = this.props.datasetItem.extentsFormats[selectedExtent].map( format => {
            if(this.props.datasetItem.extentsFormats[selectedExtent].length > 1){
                return(
                    <li key={format.formatName} className="form-inline">
                        <label className="label-option radio radio-inline control-label">
                            <input type="radio"
                                   name={this.props.datasetItem.datasetInternalId + '-format-radio'}
                                   value={format.formatSbTag}
                                   checked={this.state.selectedFormatName === format.formatName}
                                   onChange={this.handleFormatCheckboxChange.bind(this, format.formatSbTag, format.formatName)} />
                            {format.display}
                        </label>
                    </li>
                );
            }else{
                return(
                    <li  key={format.formatName} style={{marginLeft: '5px'}}>{format.display}</li>
                );
            }
        });

        const toggleLabel = (e) => {
            e.stopPropagation();

            const current = e.currentTarget.innerText;
            const regexHide = /hide/i;
            const regexShow = /show/i;
            if(current.match(regexHide)) e.currentTarget.innerText = current.replace(regexHide, 'Show');
            else if(current.match(regexShow)) e.currentTarget.innerText = current.replace(regexShow, 'Hide');
        };

        // eslint-disable-next-line
        const moreInfo = this.props.datasetItem.moreInfo.map( (moreInfoItem, i) => {
            if (moreInfoItem.show === true){
                return (
                    <span key={i} ><a href={moreInfoItem.url} className="link-sm" target="_blank" title="Open ScienceBase page" style={{marginLeft:'8px'}}>{moreInfoItem.display}</a></span>
                );
            }
        });

        const thumbBoxClass = `modal-dialog modal-sm dataset-thumb-box animation-effect ${this.props.datasetItem.thumbnail.orientation}`;
        const thumbImgClass = `dataset-thumb ${this.props.datasetItem.thumbnail.orientation}`;

        return (
            <div className="card card-dataset border-light">
                <div className="card-header">
                    <div className="form-inline">
                        <button onClick={this.remove.bind(this)} title="Hide this dataset" className="mr-auto btn btn-sm btn-remove-dataset btn-outline-info">Hide</button>
                        <span style={{fontSize: '1rem', fontWeight: '500'}}> {this.props.datasetItem.title}</span>
                        <button onClick={this.fetchProdItems.bind(this)} title="Run product search" className="ml-auto btn btn-sm btn-info btn-find-prod">Find Products</button>
                    </div>
                    <div className="form-inline">
                        { this.props.datasetItem.moreInfoShow===true ? <div >{moreInfo}</div> : null }
                        { this.props.datasetItem.thumbnail.url !== '' ?
                            <Popover type="text" link='Preview' classLabel="link-sm" tips="Preview graphic">
                                <div className={thumbBoxClass} >
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <img alt="Dataset Preview" className={thumbImgClass} src={this.props.datasetItem.thumbnail.url} />
                                        </div>
                                    </div>
                                </div>
                            </Popover> : null }
                    </div>
                    <div>
                        <a className="link-sm-bold" data-toggle="collapse" href={'#' + this.props.datasetItem.datasetInternalId + '-body'} aria-expanded="false" style={{marginLeft: '8px'}}
                           onClick={toggleLabel} title="Show/hide Extents/Formats" aria-controls={this.props.datasetItem.datasetInternalId + '-body'} >
                            Hide Extents/Formats
                        </a>
                    </div>
                </div>
                <div className="collapse show" id={this.props.datasetItem.datasetInternalId + '-body'}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6">
                                <span>Data Extents:</span>
                                <ul>
                                    { extents }
                                </ul>
                            </div>
                            <div className="col-6">
                                <span>Available Formats:</span>
                                <ul>
                                    { formats }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                { this.state.showProducts === true ?
                    (this.props.products.hasOwnProperty(this.props.datasetItem.datasetInternalId) ?
                        <Products  datasetItem = {this.props.datasetItem}
                                   fetchNextPreviousItems={this.fetchNextPreviousItems.bind(this)}
                                   scrollToProduct={this.scrollToProduct.bind(this)}
                                   map={this.props.map} />
                        :  <div className="spinner-sm"><div className="card-body"><Spinner /></div></div>
                    ) : null
                }

            </div>


        );
    }
}

function mapStateToProps({ products, aoi }){ //{datasets} is same as datasets = state.datasets
    return { products, aoi };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators( { queueFetchProducts, removeProductsForADataset }, dispatch);

}

export default connect(mapStateToProps, mapDispatcherToProps)(Dataset);

