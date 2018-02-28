import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { size, map } from 'lodash';
import { replaceFootprintList } from '../actions';

class MapPopup extends Component {

    constructor(props){
        super(props);

        this.state = {
            showPopup: false
        };
    }

    componentWillReceiveProps(nextProps){
        if(this.props.map && nextProps.mapPopup && size(nextProps.mapPopup) > 0){
            if( (this.props.mapPopup && size(this.props.mapPopup) > 0 && this.props.mapPopup.timeStamp !== nextProps.mapPopup.timeStamp) ||
                (!this.props.mapPopup || size(this.props.mapPopup) === 0)){

                const footprints = map(this.props.footprintList, (footprint) => {
                    footprint.selected = false;
                    return footprint;
                });
                this.props.replaceFootprintList(footprints);


                this.setState({
                    showPopup: true
                });
            }
        }
    }

    selectProductInPoup(id){
        const footprints = map(this.props.footprintList, (footprint) => {
            const bounds = footprint.layer.getBounds();
            if(bounds.contains(this.props.mapPopup.latlng) && footprint.sourceId === id){
                footprint.selected = true;
            }
            return footprint;
        });

        this.props.replaceFootprintList(footprints);
    }

    closeClicked(){
        this.setState({
            showPopup: false
        });

        const footprints = map(this.props.footprintList, (footprint) => {
            footprint.selected = false;
            return footprint;
        });
        this.props.replaceFootprintList(footprints);
    }

    drawProductItems( product, i ){
        return(
            <p key={i} className="link" onClick={this.selectProductInPoup.bind(this, product.sourceId)}>{product.title}</p>
        );
    }

    render() {
        //https://github.com/Radivarig/react-popups/blob/master/src/Popups.jsx
        const half_w = 0.5*window.innerWidth;
        const half_h = 0.5*window.innerHeight;
        const x = this.props.mapPopup.pageX;
        const y = this.props.mapPopup.pageY;
        let translateXY = '(-100%, 0%)';
        if (x < half_w && y < half_h) translateXY = '(0%, 0%)';
        else if (x < half_w && y > half_h) translateXY = '(0%, -100%)';
        else if (x > half_w && y > half_h) translateXY = '(-100%, -100%)';
        const s = {
            position: 'fixed', left: this.props.mapPopup.pageX, top: this.props.mapPopup.pageY, transform: 'translate' +translateXY
        };

        return (
            <div>
                {
                    this.state.showPopup === false ? null :
                        <div className="card map-popup" style={s} >
                            <div className="card-header text-right">
                                <span style={{fontSize:'0.8rem', fontStyle:'italic', marginRight:'9px'}}
                                      onClick={this.closeClicked.bind(this)}
                                      className="link-no-underline">Close</span>
                            </div>
                            <div className="card-body">
                                { this.props.mapPopup.prodItems.map(this.drawProductItems.bind(this))}
                            </div>
                        </div>
                }
            </div>
        );
    }



}

function mapStateToProps( { mapPopup, footprintList } ){
    return {mapPopup, footprintList };
}

function mapDispatcherToProops(dispatch){
    return bindActionCreators({ replaceFootprintList }, dispatch);
}
export default connect (mapStateToProps, mapDispatcherToProops)(MapPopup);