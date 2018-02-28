import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SidePanel from './side_panel';
import Map from '../componentsMap/map';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setFeatureGroup,
    emptyFootprintList,
    emptyThumbList,
    toggleBackdrop} from '../actions';
import './app.css';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            showSidePanel: true,
            mapInitiated: false
        };
        this.map = null;
    }

    componentDidMount(){
        this.initMap();
    }

    initMap(){
        if(!this.map){
            this.map = L.map(ReactDOM.findDOMNode(this.refs.map)).setView([40.20, -96.90], 4);
        }

        this.map.on('resize',() => {
            this.map.invalidateSize();
        }, this);

        this.map.doubleClickZoom.disable();

        if(!this.props.featureGroup.footprint){
            // eslint-disable-next-line
            const footprintGroup = new L.featureGroup()
                .addTo(this.map);
            this.props.setFeatureGroup ('footprint', footprintGroup);
        }

        if(!this.props.featureGroup.thumbnail){
            // eslint-disable-next-line
            const thumbGroup = new L.featureGroup()
                .addTo(this.map);
            this.props.setFeatureGroup ('thumbnail', thumbGroup);
        }

        this.setState({
            mapInitiated: true
        });
    }

    toggleSidePanel(e) {
        e.stopPropagation();
        const self = this;
        this.setState({
            showSidePanel: !this.state.showSidePanel
        }, () => {
            setTimeout( () => {
                self.map.invalidateSize();
            }, 10);

        });
    }

    render() {
        const sidePanelDivClass = this.state.showSidePanel ? 'col-lg-5 col-md-12 col-sm-12 data-panel' : 'data-panel-hidden';
        const mapDivClass = this.state.showSidePanel ? 'col-lg-7 col-md-12 col-sm-12 map-panel animation-effect' : 'col-12 map-panel animation-effect';
        const toggleBtnImgSrc = this.state.showSidePanel===true ? './img/double-arrows-left.png' : './img/double-arrows-right.png';

        const backdrop ={
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: '500'
        };

        return(
            <div style={{ height: '100%'}}>
                <div>
                    <button type="button" id="panel-toggle-btn" title="Show/Hide side panel" className="btn btn-info" onClick={this.toggleSidePanel.bind(this)}>
                       <img alt="arrow" src={toggleBtnImgSrc} />
                    </button>
                </div>

                <div className="row" style={{ height: '100%'}}>
                    <div className={sidePanelDivClass} >
                        { this.state.mapInitiated === false ? null :
                            <SidePanel map={this.map}  />
                        }
                    </div>

                    <div className={mapDivClass} style={{ background: '#fcfcfc' }} >
                        <div style={{width: '100%', height: '100%'}}>
                            <div ref="map" className="map animation-effect" />
                            { this.state.mapInitiated === false ? null :
                                <Map map={this.map}  />
                            }
                        </div>
                    </div>
                </div>
                { this.props.backdropVisibility === true ?  <div style={backdrop} /> : null }

            </div>

        );

    }

}

function mapStateToProps( { featureGroup, footprintList, thumbList, mapPopup, backdropVisibility } ){
    return {featureGroup, footprintList, thumbList, mapPopup, backdropVisibility };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators({ setFeatureGroup, emptyFootprintList, emptyThumbList, toggleBackdrop }, dispatch);

}

export default connect (mapStateToProps, mapDispatcherToProps)(App);