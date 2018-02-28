import React, { Component } from 'react';
import { connect } from 'react-redux';
import { size, map } from 'lodash';
import { bindActionCreators } from 'redux';
import 'whatwg-fetch';
import Checkbox from './checkbox';
import Dataset from './dataset';
import Popover from './popover';
import './datasets.css';
import {
    getAllDatasets,
    filterDatasetsByCheckbox,
    setAllDatasets,
    removeDataset,
    resetProducts  } from '../actions';


const filterItems = [
    'US Topo',
    'Historical Topo Maps',
    'Elevation Products (3DEP)',
    'Structures',
    'Transportation'
];

class Datasets extends Component{

    constructor (props){
        super(props);
        this.fetchedProducts = [];

        this.state = {
            clearAllDatasetSelection: true,
            showDatasetsFilter: true,
            showDatasetCategories: true
        };

        this.closeDatasetsFilters =  this.closeDatasetsFilters.bind(this);
        this.removeDataset =  this.removeDataset.bind(this);
    }

    componentWillMount () {
        this.selectedFilterCheckboxes = new Set();
    }

    componentDidMount() {
        this.props.getAllDatasets();
    }

    componentWillReceiveProps(nextProps){
        if(size(nextProps.products) > 0){
            this.fetchedProducts = Object.keys(nextProps.products);
        }

        // Start over btn clicked.
        if(nextProps.selectedRoute.route === 0 && nextProps.selectedRoute.timeStamp !== this.props.selectedRoute.timeStamp){
            // Reset dataset filter
            this.resetFilter();
            // Reset products
            this.props.resetProducts();
            this.fetchedProducts = [];
        }
    }

    resetFilter(){
        this.clearCheckboxes();
        this.props.setAllDatasets(this.props.origDatasets);

        this.setState({
            clearAllDatasetSelection: true,
            showDatasetsFilter: true
        });
    }

    handleFilterCheckboxChange(label){
        label = label.toLowerCase();
        if(this.selectedFilterCheckboxes.has(label)){
            this.selectedFilterCheckboxes.delete(label);
        }else{
            this.selectedFilterCheckboxes.add(label);
        }

        if(size(this.selectedFilterCheckboxes) > 0){
            this.props.filterDatasetsByCheckbox(this.selectedFilterCheckboxes, this.props.origDatasets);

            if(this.state.clearAllDatasetSelection === true) {
                this.setState({
                    clearAllDatasetSelection: false
                });
            }
        }else {
            this.props.setAllDatasets(this.props.origDatasets);

            if(this.state.clearAllDatasetSelection === false) {
                this.setState({
                    clearAllDatasetSelection: true
                });
            }
        }
    }

    clearCheckboxes(){
        this.selectedFilterCheckboxes.clear();
        this.setState({
            clearAllDatasetSelection: true
        });
    }

    toggleDatasetsFilters(){
        this.setState({
            showDatasetsFilter: !this.state.showDatasetsFilter
        });
    }

    closeDatasetsFilters(){
        this.setState({
            showDatasetsFilter: false
        });
    }

    toggleDatasetCategories(){
        this.setState({
            showDatasetCategories: !this.state.showDatasetCategories
        });
    }

    removeDataset(datasetInternalId){
        this.props.removeDataset(datasetInternalId);
    }

    showAllDatasets(){
        this.clearCheckboxes();

        this.props.setAllDatasets(this.props.origDatasets);

        this.setState({
            clearAllDatasetSelection: false
        });
    }

    renderDatasets() {
        return map(this.props.datasets, (dataset, i) => {
            return(
                <div className="row card-row" key={i}>
                    <Dataset datasetItem={dataset}
                             closeDatasetsFilters = {this.closeDatasetsFilters}
                             removeDataset={this.removeDataset}
                             map={this.props.map}
                             showProducts={ this.fetchedProducts.indexOf(dataset.datasetInternalId) > -1}  />
                </div>
            );
        });
    }

    render() {
        const datasetFilterItems = filterItems.map((filterItem) => {
            return(
                <li key={filterItem} className="form-inline">
                    <Checkbox
                        label={filterItem}
                        clearAllDatasetSelection={this.state.clearAllDatasetSelection}
                        handleFilterCheckboxChange={this.handleFilterCheckboxChange.bind(this)} />
                </li>
            );
        });

        const datasetsFilterClass =  this.state.showDatasetsFilter===true ? 'card-body animation-effect' : 'card-body animation-effect hidden';
        const toggleFilterLabel = this.state.showDatasetsFilter===true ? 'Hide Filter' : 'Show Filter';
        const categFilterClass = this.state.showDatasetCategories=== true ? 'animation-effect' : 'hidden';

        return (
            <div className="card-wrapper control-select">
                <div id="datasets-filter" className="card" >
                    <div className="card-header text-white form-inline">
                        <h4>Datasets
                            <button className="btn btn-sm btn-info" style={{marginLeft: '5px'}} onClick={this.toggleDatasetsFilters.bind(this)} >{toggleFilterLabel}</button>
                        </h4>

                        <div className="text-white ml-auto" style={{color: '#ffffff'}}>
                        <Popover type="icon" link="fa fa-question-circle" classLabel={'link-xl text-white lg-question'} tips=""  >
                            <div className="modal-dialog modal-sm datasets-tooltip animation-effect" >
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <h6 style={{textDecoration: 'underline'}}>How to Show Datasets</h6>
                                        Clicking "Show All Datasets" button will display all available datasets.
                                        Datasets can be filtered by using category checkboxes.
                                    </div>
                                </div>
                            </div>
                        </Popover></div>
                    </div>

                    <div  className={datasetsFilterClass} >
                        <div className="form-inline">
                            <button className="btn btn-sm btn-outline-info" onClick={this.showAllDatasets.bind(this)}>Show All Datasets</button>
                            <button className="btn btn-sm btn-outline-info mr-auto " onClick={this.resetFilter.bind(this)}>Reset Selection</button>
                        </div>
                        <div style={{marginTop: '1rem'}} className="link-sm" onClick={this.toggleDatasetCategories.bind(this)} >Filter by Categories</div>
                        <div className={categFilterClass} id="filter-checkboxes" >
                            <ul>
                                { datasetFilterItems }
                            </ul>
                        </div>
                    </div>
                </div>

                <div >
                    { this.state.clearAllDatasetSelection === false ? this.renderDatasets() : null}
                </div>
            </div>
        );
    }

}

function mapStateToProps({ datasets, origDatasets, products, selectedRoute }){ //{datasets} is same as datasets = state.datasets
    return { datasets, origDatasets, products, selectedRoute };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators( { getAllDatasets, filterDatasetsByCheckbox, setAllDatasets, removeDataset, resetProducts }, dispatch);
}


export default connect(mapStateToProps, mapDispatcherToProps)(Datasets);
