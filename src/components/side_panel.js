import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeRoutes } from '../actions';
import Datasets from './datasets';
import SavedProducts from './saved_products';

class SidePanel extends Component {

    changeRoute(routeNum, e){
        e.stopPropagation();

        this.props.changeRoutes(routeNum, new Date().getTime());
    }

    startOver(){
        // reset all
        this.props.changeRoutes(0, new Date().getTime());
    }

    render() {
        const routeBtn1Class = this.props.selectedRoute.route === 1 ? 'route-btn btn btn-sm btn-outline-secondary active' : 'route-btn btn btn-sm btn-outline-secondary';
        const routeBtn2Class = this.props.selectedRoute.route === 2 ? 'route-btn btn btn-sm btn-outline-secondary active' : 'route-btn btn btn-sm btn-outline-secondary';
        const datasetsClass = this.props.selectedRoute.route <= 1 ? 'data-panel-content animation-effect' : 'data-panel-content animation-effect hidden';
        const prodListClass = this.props.selectedRoute.route === 2 ? 'data-panel-content' : 'data-panel-content hidden';

        return (
            <div style={{paddingTop: '10px'}}>
                <div className="d-flex justify-content-end">
                    <button type="button" id="start-over-btn" title="Start over" onClick={this.startOver.bind(this)} className="btn btn-sm btn-outline-secondary">Start Over</button>
                    {this.props.selectedRoute.route === 2 ?
                        <button className={routeBtn1Class} title="Go back to product search" onClick={this.changeRoute.bind(this, 1)}>Go Back to Product Search</button> : null
                    }
                    <button className={routeBtn2Class} title="Go saved products list" onClick={this.changeRoute.bind(this, 2)}>Saved Products List
                    </button>
                </div>

                <div className={datasetsClass}>
                    <Datasets map={this.props.map}/>
                </div>

                <div className={prodListClass}>
                    <SavedProducts/>
                </div>

            </div>
        );
    }

}


function mapStateToProps({ selectedRoute }){ //{datasets} is same as datasets = state.datasets
    return { selectedRoute };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators ( {changeRoutes}, (dispatch) );
}

export default connect( mapStateToProps, mapDispatchToProps )(SidePanel);
