import React, { Component }from 'react';
import L from 'leaflet';
import esri from 'esri-leaflet';
import { selectablePolys } from  '../config/map_config';

class SelectablePolygons extends Component {

    constructor(props){
        super(props);

        this.state = {
            selectedSelectablePolyId: ''
        };

        this.selectablePoly = null;
    }

    componentDidMount(){
        this.props.map.on('layeradd', (e) => {
            //console.log('layer add', e);
            if(e.layer.options.minZoom && e.layer.options.minZoom !== ''){
                if(this.props.map.getZoom() < e.layer.options.minZoom) this.props.map.setZoom(e.layer.options.minZoom);
            }
        });
    }

    componentWillReceiveProps(nextProps){
        // Reset map
        if(nextProps.resetMap !== this.props.resetMap){
            this.resetSelectablePoly();
        }
    }

    selectSelectablePoly(selectablePoly){

        if(selectablePoly.id === this.state.selectedSelectablePolyId){
            this.resetSelectablePoly();

        }else{

            this.resetSelectablePoly();
            this.setState({
                selectedSelectablePolyId: selectablePoly.id
            });

            // Remove previous selectable poly layer
            if(this.selectablePoly && this.props.map.hasLayer(this.selectablePoly)){
                this.props.map.removeLayer(this.selectablePoly);
            }
            this.selectablePoly = esri.dynamicMapLayer({
                url: selectablePoly.url,
                name: selectablePoly.name,
                type: selectablePoly.serviceType,
                identifyLayer: selectablePoly.identifyLayer,
                polyType: selectablePoly.polyType,
                minZoom: selectablePoly.minZoomLevel,
                layers: selectablePoly.layers,
                opacity: selectablePoly.opacity,
                attribution: selectablePoly.attribution,
                zIndex: 10,
            });

            this.selectablePoly.on('requeststart', () => {
                console.log('selectablePoly requeststart');
                // Hide spinner
                this.props.toggleSpinner(true);
            });

            this.selectablePoly.on('loading', () => {
                console.log('selectablePoly loading');
                // Show spinner
                this.props.toggleSpinner(true);
            });

            this.selectablePoly.on('requestend', () => {
                console.log('selectablePoly requestend');
                // Hide spinner
                this.props.toggleSpinner(false);
            });

            this.selectablePoly.on('requeststart', () => {
                console.log('selectablePoly requeststart');
                // Hide spinner
                this.props.toggleSpinner(true);
            });

            // ToDo: Still needs to be tested.
            this.selectablePoly.on('requesterror', () => {
                console.log('selectablePoly requesterror');
                alert ('Error - the layer could not be loaded.');

                if(selectablePoly.id === this.state.selectedSelectablePolyId){
                    console.log('reset');
                    this.resetSelectablePoly();
                }
                this.props.toggleSpinner(false);
            }, this);

            this.props.map.addLayer(this.selectablePoly);
            this.selectablePoly.bringToFront();


        }
    }

    resetSelectablePoly(){
        // Remove previous selectable poly layer
        if(this.selectablePoly && this.props.map.hasLayer(this.selectablePoly)){
            this.props.map.removeLayer(this.selectablePoly);
        }
        this.selectablePoly = null;


        this.setState({
            selectedSelectablePolyId: ''
        });
    }

    renderSelectablePolyList( selectablePoly , i ){

       // const className = this.state.selectedSelectablePolyId === selectablePoly.id ? 'card basemap highlighted' : 'card basemap';
        return(
            <li key={i} className="form-inline">
                <label >
                    <input type="checkbox"
                           className="selectable-poly-checkbox"
                           value={selectablePoly.name}
                           checked={this.state.selectedSelectablePolyId === selectablePoly.id}
                           onClick={this.selectSelectablePoly.bind(this, selectablePoly)} />
                    {selectablePoly.name}
                </label>
            </li>
        );
    }

    render(){
        if(!this.props.map) return null;

        const className = this.props.show ? 'collapse show card-body m-0 pb-0 pl-0 pr-0 animation-effect' : 'collapse card-body m-0 pb-0 pl-0 pr-0';

        return (
            <div className="card bg-light">
                <div className="card-header pt-1 pb-0 pl-2 pr-2" onClick={this.props.toggleMapOptions.bind(this, 'selPolygons')} >Selectable Polygons</div>
                <div className={className} >
                    <ul>
                        { selectablePolys.map(this.renderSelectablePolyList.bind(this)) }
                    </ul>
                </div>
            </div>
        );
    }
}


export default SelectablePolygons;
