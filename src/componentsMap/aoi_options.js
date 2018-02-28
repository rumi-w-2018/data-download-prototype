import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { setAoi, clearAoi } from '../actions';


class AoiTools extends Component{

    constructor(props){
        super(props);

        this.state = {
            aoiActiveOption: 'extent',  // extent/draw/polygon
            selectedDrawType: ''
        };
        this.aoiFeatureGroup = null;
        this.rectangleHandler = null;
        this.markerHandler = null;
        this.option = null;
        this.currentExtent = {};

    }

    componentDidMount(){
        // Fix for marker icon bug in leaflet. https://github.com/Leaflet/Leaflet/issues/4968
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
        //

        this.getCurrentExtent();

        this.props.map.on( 'moveend', () => {
            if(this.state.aoiActiveOption === 'extent') this.getCurrentExtent();
        }, this);

        this.props.map.on( 'zoomend', () => {
            if(this.state.aoiActiveOption === 'extent') this.getCurrentExtent();
        }, this);

        this.initDrawControl();
    }

    componentWillReceiveProps(nextProps){
        // Reset map
        if(nextProps.resetMap !== this.props.resetMap){
            this.resetAOI();
        }

        // 'Polygon' options selected
        if(nextProps.aoi.aoiType === 'polygon' && this.props.aoi.aoiType !== 'polygon' && this.state.aoiActiveOption !== 'polygon'){
            this.setState({
                aoiActiveOption: 'polygon'
            });
        }else if(nextProps.aoi.aoiType === '' && this.props.aoi.aoiType === 'polygon'){ // Selectable polygon layer was reset.
            this.setState({
                aoiActiveOption: ''
            });
        }
    }

    initDrawControl(){
        if(!this.aoiFeatureGroup){
            this.aoiFeatureGroup = new L.FeatureGroup();
            this.props.map.addLayer(this.aoiFeatureGroup);
        }

        const myMarkerIcon = L.Icon.extend({
            options: {
                shadowUrl: null,
                iconSize: new L.Point(22, 34),
                iconAnchor: new L.Point(11, 34),
                iconUrl: './img/marker-icon.png',
                //iconUrl: require('leaflet/dist/images/marker-icon.png')
            }
        });

        this.options = {
            position: 'topleft',
            draw: {
                polyline: false,
                polygon: false,
                circlemarker: false,
                circle: false, // Turns off this drawing tool
                rectangle: {
                    drawError: {
                        color: '#b00b00',
                        timeout: 1000
                    },
                    //repeatMode: true,
                    shapeOptions: {
                        color: '#00e5e5',
                        weight: 2
                    }
                },
                marker: {
                    //repeatMode: true,
                    icon: new myMarkerIcon()
                }
            },
            edit: {
                featureGroup: this.aoiFeatureGroup, //REQUIRED!!
                edit: false,
                remove: false
            }
        };

        // Prevent tooltip from showing up.
        L.drawLocal.draw.handlers.marker.tooltip.start = '';
        L.drawLocal.draw.handlers.rectangle.tooltip.start = '';

        // Set up draw events
        this.props.map.on(L.Draw.Event.CREATED, (e) =>  {
            if (!this.aoiFeatureGroup) {
                this.aoiFeatureGroup = new L.FeatureGroup();
                this.props.map.addLayer(this.aoiFeatureGroup);
            }

            const layerArray = this.aoiFeatureGroup.getLayers();
            if (layerArray.length > 0) {
                this.aoiFeatureGroup.clearLayers();
            }
            const newLayer = e.layer;
            this.aoiFeatureGroup.addLayer(newLayer);

            let left, bottom, right, top;
            if (e.layerType === 'rectangle') {

                //Enable edit only rectangle
                newLayer.editing.enable();
                newLayer.on('edit', (e) => {
                    // Update AOI.
                    const coords = e.target._latlngs[0];
                    if (coords[0].lng <= coords[2].lng) {
                        left = coords[0].lng;
                        right = coords[2].lng;
                    } else {
                        left = coords[2].lng;
                        right = coords[0].lng;
                    }
                    if (coords[0].lat <= coords[2].lat) {
                        bottom = coords[0].lat;
                        top = coords[2].lat;
                    } else {
                        bottom = coords[2].lat;
                        top = coords[0].lat;
                    }
                    //console.log('edited coords', ' left bottom right top', left, bottom, right, top);
                    const aoiCoords = { minX: left, minY: bottom, maxX: right, maxY: top };
                    // setAoi( aoiType, coords )
                    this.props.setAoi ('coords', aoiCoords);

                    // Run query when a rectangle/point is drawn if it's map view
                    // if (self.isMapView) Backbone.trigger("updateProductSearch:event");

                });

                const coords = newLayer.getLatLngs()[0];

                if (coords[0].lng <= coords[2].lng) {
                    left = coords[0].lng;
                    right = coords[2].lng;
                } else {
                    left = coords[2].lng;
                    right = coords[0].lng;
                }

                if (coords[0].lat <= coords[2].lat) {
                    bottom = coords[0].lat;
                    top = coords[2].lat;
                } else {
                    bottom = coords[2].lat;
                    top = coords[0].lat;
                }

            } else if (e.layerType === 'marker') {
                const ptCoords = newLayer.getLatLng();
                //lower left point coords = upper right point coords
                left = ptCoords.lng;
                right = ptCoords.lng;
                bottom = ptCoords.lat;
                top = ptCoords.lat;
            }
            //console.log(e.layerType, ' left bottom right top', left, bottom, right, top);
            const aoiCoords = { minX: left, minY: bottom, maxX: right, maxY: top };
            // setAoi( aoiType, coords )
            this.props.setAoi ('coords', aoiCoords);

            // zoom to the AOI
            this.zoomToAOI();

            // Run query when a rectangle/point is drawn if it's map view
            // if (self.isMapView) Backbone.trigger("updateProductSearch:event");

        }, this);

        this.props.map.on(L.Draw.Event.DRAWSTOP, (e) =>  {
            /* Clear draw type.  Alternatively set repeatMode = true, and somehow finalize drawing and disable drawing.*/
            this.setState({
                selectedDrawType: ''
            });
        }, this);
    }

    zoomToAOI(){
        if (this.aoiFeatureGroup) {
            const layerArray = this.aoiFeatureGroup.getLayers();
            if (layerArray.length === 0) return;

            const aoiLayer = layerArray[0]; // There should only one aoi layer.
            if (aoiLayer.hasOwnProperty('_latlngs')) {
                this.props.map.fitBounds(aoiLayer.getBounds(), {
                    padding: [0.1, 0.1]
                });
            } else { //When marker is used, zoom to marker
                if(this.props.map.getZoom() >= 6){
                    this.props.map.setView(aoiLayer.getLatLng());
                }else{
                    this.props.map.setView(aoiLayer.getLatLng(), 6);
                }
            }
        }
    }

    handleDrawTypeChange(type){
        this.setState({
            aoiActiveOption: 'draw',
            selectedDrawType: type
        }, () => {
            switch(type){
                case 'rectangle':
                    if(this.markerHandler && this.markerHandler._enabled === true) this.markerHandler.disable();
                    this.rectangleHandler = new L.Draw.Rectangle(this.props.map, this.options.draw.rectangle);
                    this.rectangleHandler.enable();
                    return;

                case 'point':
                    if(this.rectangleHandler && this.rectangleHandler._enabled === true) this.rectangleHandler.disable();
                    this.markerHandler = new L.Draw.Marker(this.props.map, this.options.draw.marker);
                    this.markerHandler.enable();
                    return;

                case 'delete':
                    if(this.markerHandler && this.markerHandler._enabled === true) this.markerHandler.disable();
                    if(this.rectangleHandler && this.rectangleHandler._enabled._enabled === true) this.rectangleHandler.disable();
                    this.clearAOI();

                    return;

                default:
                    return;
            }
        });
    }

    // Current Extent vs. Draw AOI ...
    toggleAoiOptions(e){
        this.setState({
            aoiActiveOption: e.currentTarget.value
        }, () => {
            if (this.state.aoiActiveOption === 'draw' && !this.state.selectedDrawType ){
                this.setState({
                    selectedDrawType: 'rectangle'
                }, () => {
                    this.clearAOI();

                    // setAoi( aoiType, coords )
                    this.props.setAoi('coords', {} );

                    this.handleDrawTypeChange('rectangle');
                });
            }else if(this.state.aoiActiveOption === 'extent'){
                this.clearAOI();
                this.getCurrentExtent();

            }

        }, this);
    }

    clearAOI (){
        this.props.clearAoi();

        if (this.aoiFeatureGroup !== null) {
            if (this.aoiFeatureGroup.getLayers().length > 0) {
                this.aoiFeatureGroup.clearLayers();
                //this.props.map.removeLayer(this.aoiFeatureGroup);
            }
        }
    }

    resetAOI(){
        this.clearAOI();
        // setAoi( aoiType, coords )
        this.props.setAoi ('coords', {});

        this.setState({
            aoiActiveOption: 'extent',
            selectedDrawType: ''
        }, () => {
            this.getCurrentExtent();
        }, this);
    }

    getCurrentExtent(){
        const bounds = this.props.map.getBounds();
        const aoiCoords = { minX: bounds.getWest(), minY: bounds.getSouth(), maxX: bounds.getEast(), maxY: bounds.getNorth() };

        // setAoi( aoiType, coords )
        this.props.setAoi ('coords', aoiCoords);
    }

    render(){
        const activeExtentClassName = this.state.aoiActiveOption === 'extent' ? 'radio radio-inline control-label selected' : 'radio radio-inline control-label';
        const activeDrawClassName = this.state.aoiActiveOption === 'draw' ? 'radio radio-inline control-label selected' : 'radio radio-inline control-label';

        return (
            <div className="card bg-light">
                <div className="card-header pt-1 pb-0 pl-2 pr-2">AOI Options</div>
                <div className="collapse show card-body m-0 pb-0 pl-3 pr-0 " >
                    <ul className="aoi-option-selection">
                        <li>
                            <label className={activeExtentClassName}>
                                <input type="radio"
                                       name="aoi-option"
                                       value="extent"
                                       checked={this.state.aoiActiveOption === 'extent'}
                                       onChange={this.toggleAoiOptions.bind(this)} />
                                Current Map Extent
                            </label>
                        </li>
                        <li>
                            <label className={activeDrawClassName}>
                                <input type="radio"
                                       name="aoi-option"
                                       value="draw"
                                       checked={this.state.aoiActiveOption === 'draw'}
                                       onChange={this.toggleAoiOptions.bind(this)} />
                                Draw
                            </label>

                            <ul className="aoi-action-type">
                                <li>
                                    <label className="radio radio-inline control-label" >
                                        <input type="radio" name="action-type" checked={this.state.selectedDrawType === 'rectangle'}
                                               onChange={this.handleDrawTypeChange.bind(this, 'rectangle')} />
                                        Rectangle
                                    </label>
                                </li>
                                <li>
                                    <label className="radio radio-inline control-label" >
                                        <input type="radio" name="action-type" checked={this.state.selectedDrawType === 'point'}
                                               onChange={this.handleDrawTypeChange.bind(this, 'point')} />
                                        Point
                                    </label>
                                </li>
                                <li>
                                    <label className="radio radio-inline control-label" >
                                        <input type="radio"
                                               name="action-type"
                                               checked={this.state.selectedDrawType === 'delete'}
                                               onChange={this.handleDrawTypeChange.bind(this, 'delete')} />
                                        Delete AOI
                                    </label>
                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </div>
        );
    }
}

function mapStateToProps( {selectedRoute, aoi} ){
    return{ selectedRoute, aoi };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators( { setAoi, clearAoi }, dispatch);
}

export default connect( mapStateToProps, mapDispatcherToProps)(AoiTools);