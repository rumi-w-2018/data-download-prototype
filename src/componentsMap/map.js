import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { size } from 'lodash';
import Spinner from '../components/spinner';
import Basemaps from './basemaps';
import MapPopup from './map_popup';
import AoiOptions from './aoi_options';
import './map.css';
import {
    setFeatureGroup,
    emptyFootprintList,
    emptyThumbList} from '../actions';

class Map extends Component{

    constructor(props){
        super(props);

        this.state = {
            showMapOptionPanel: false,
            showAoiOptionPanel: false,
            showClearGraphicsBtn: false,
            showBasemaps: true,
            showSpinner: false,
            resetMap: new Date().getTime()      // timestamp when map is reset
        };
    }

    componentWillReceiveProps(nextProps){
        if(this.state.showClearGraphicsBtn === false && (size(nextProps.footprintList) > 0 || size(nextProps.thumbList) > 0)){
            this.setState({
                showClearGraphicsBtn: true
            });
        }else if(this.state.showClearGraphicsBtn === true && (size(nextProps.footprintList) === 0 || size(nextProps.thumbList) === 0)){
            this.setState({
                showClearGraphicsBtn: false
            });
        }

        // Start over btn clicked.
        if(nextProps.selectedRoute.route === 0 && nextProps.selectedRoute.timeStamp !== this.props.selectedRoute.timeStamp){
            // reset map
            this.clearAllGraphics();    // This will take care of all footprints/thumbnails
            this.props.map.setView([40.20, -96.90], 4);
            this.setState({
                showMapOptionPanel: false,
                showAoiOptionPanel: false,
                showClearGraphicsBtn: false,
                showBasemaps: true,
                resetMap: new Date().getTime()
            });
        }

    }

    clearAllGraphics(){
        if(this.props.featureGroup.thumbnail){
            const layers = this.props.featureGroup.thumbnail.getLayers();
            if( layers.length > 0){
                this.props.featureGroup.thumbnail.clearLayers();
                //this.props.setThumbFeatureGroup(this.props.thumbFeatureGroup); - not necessary
            }
            this.props.emptyThumbList();
        }

        if(this.props.featureGroup.footprint){
            if( this.props.featureGroup.footprint.getLayers().length > 0){
                this.props.featureGroup.footprint.clearLayers();
                //this.props.setFootprintFeatureGroup(this.props.featureGroup.footprint); - not necessary
            }
            this.props.emptyFootprintList();
        }
    }

    toggleSpinner( status ) {
        this.setState({
            showSpinner: status
        });
    }

    toggleAoiOptionPanel() {
        this.setState({
            showAoiOptionPanel: !this.state.showAoiOptionPanel
        });
    }

    toggleMapOptionPanel() {
        this.setState({
            showMapOptionPanel: !this.state.showMapOptionPanel
        });
    }

    toggleMapOptions(id){
        switch(id){
            case 'basemaps':
                this.setState({
                    showBasemaps: !this.state.showBasemaps
                });
                return;

            default:
                this.setState({
                    showBasemaps: true
                });
                return;
        }
    }

    render(){
        const spinnerDivClass = this.state.showSpinner === true ? 'spinner-map' : 'spinner-map hidden';
        const aoiPanelClass = this.state.showAoiOptionPanel === true ? 'animation-effect shown' : 'animation-effect hidden';
        const mapPanelClass = this.state.showMapOptionPanel === true ? 'animation-effect shown' : 'animation-effect hidden';

        return(
            <div>
                <div className={spinnerDivClass}>
                    <Spinner />
                </div>
                <div id="map-control-btn-wrapper" className="btn-group" role="group">
                    { this.state.showClearGraphicsBtn === true ?
                        <button className="btn btn-sm btn-light border-secondary map-control-btn" title="Remove graphics from map" onClick={this.clearAllGraphics.bind(this)} >Remove Graphics</button> : null
                    }

                    <button className="btn btn-sm btn-light border-secondary map-control-btn" onClick={this.toggleAoiOptionPanel.bind(this)} >AOI Options</button>
                    <button className="btn btn-sm btn-light border-secondary map-control-btn" onClick={this.toggleMapOptionPanel.bind(this)} >Map Options</button>
                </div>

                <div id="aoiOptionsPanel" className={aoiPanelClass}>
                    <AoiOptions map={this.props.map} resetMap={this.state.resetMap} />
                </div>

                <div id="mapOptionsPanel" className={mapPanelClass}>
                    <div id="accordion" role="tablist">
                        <Basemaps map={this.props.map} toggleSpinner={this.toggleSpinner.bind(this)} resetMap={this.state.resetMap}
                                  toggleMapOptions={this.toggleMapOptions.bind(this)} show={this.state.showBasemaps} />

                    </div>
                </div>
                <MapPopup map={this.props.map} />
            </div>


        );
    }

}

function mapStateToProps( { featureGroup, footprintList, thumbList, mapPopup, selectedRoute } ){
    return {featureGroup, footprintList, thumbList, mapPopup, selectedRoute };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators({ setFeatureGroup, emptyFootprintList, emptyThumbList }, dispatch);

}

export default connect (mapStateToProps, mapDispatcherToProps)(Map);