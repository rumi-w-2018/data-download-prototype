import React, { Component }from 'react';
import esri from 'esri-leaflet';
import { basemaps } from  '../config/map_config';

const imgBaseUrl = './img';

class Basemaps extends Component {

    constructor(props){
        super(props);

        this.state = {
            selectedBasemapId: 'imageryTopo'
        };

        this.basemap = null;
    }

    componentDidMount(){
        if (!this.basemap) {
            this.selectBasemap( basemaps[1] );
        }
    }

    componentWillReceiveProps(nextProps){
        // Reset map
        if(nextProps.resetMap !== this.props.resetMap && this.state.selectedBasemapId !== 'imageryTopo'){
            this.selectBasemap( basemaps[1] );
        }
    }

    selectBasemap(basemap){
        this.setState({
            selectedBasemapId: basemap.id
        });

        // Remove old basemap if exists.
        if(this.basemap) this.props.map.removeLayer(this.basemap);

        if(basemap.serviceType === 'tiled'){
            this.basemap = esri.tiledMapLayer({
                url: basemap.url,
                minZoom: basemap.minZoomLevel,
                maxZoom: basemap.maxZoomLevel,
                attribution: basemap.attribution,
                zIndex: 0
            });
        }else if (basemap.serviceType === 'dynamic'){
            this.basemap = esri.dynamicMapLayer({
                url: basemap.url,
                minZoom: basemap.minZoomLevel,
                maxZoom: basemap.maxZoomLevel,
                attribution: basemap.attribution,
                layers: basemap.layers,
                opacity: basemap.opacity,
                zIndex: 0
            });
        }
        this.basemap.on('remove', () => {
            // Show spinner
            this.props.toggleSpinner(true);
        });

        this.basemap.on('load', () => {
            // Hide spinner
            this.props.toggleSpinner(false);
        });

        this.props.map.addLayer(this.basemap);
    }


    renderBasemapList( basemap , i ){

        const imgSrc = `${imgBaseUrl}/${basemap.id}.png`;
        const className = this.state.selectedBasemapId === basemap.id ? 'card basemap highlighted' : 'card basemap';
        return(
            <li key={i}>
                <div className={className} onClick={ this.selectBasemap.bind(this, basemap) } >
                    <img className="card-img-top" src={imgSrc} alt={basemap.name} />
                    <div className="card-body text-center" style={{padding:'0'}}>
                        {basemap.name}
                    </div>
                </div>
            </li>
        );
    }

    render(){
        if(!this.props.map) return null;
        const className = this.props.show ? 'collapse show card-body m-0 pb-0 pl-0 pr-0 animation-effect' : 'collapse card-body m-0 pb-0 pl-0 pr-0';

        return (
            <div className="card bg-light">
                <div className="card-header pt-1 pb-0 pl-2 pr-2" onClick={this.props.toggleMapOptions.bind(this, 'basemaps')} >Basemaps</div>
                <div className={className}>
                    <ul>
                        { basemaps.map(this.renderBasemapList.bind(this)) }
                    </ul>
                </div>

            </div>
        );
    }




}


export default Basemaps;
