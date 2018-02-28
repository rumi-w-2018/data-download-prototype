import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { map } from 'lodash';
import Moment from 'moment';
import { toggleBackdrop } from '../actions';
import { exportToFile } from '../utilities/export-to-file';


class SaveAsText extends Component {

    constructor(props){
        super(props);

        this.state = {
            show: false,
            selectedFormat: 'las'
        };
    }

    // Check if the products include ones with LAZ format.
    hasLaz(){
        return map(this.props.savedProducts).find( product => {
            return product.hasOwnProperty('downloadLazURL'); // Return the first model product or 'undefined'
        });
    }

    exportAsTextClicked(e){
        e.stopPropagation();
        if(typeof this.hasLaz() === 'undefined' || this.hasLaz() === null){ // no LAZ
            this.writeToText();

        }else{  // Includes LAZ
            this.setState({
                show: true
            }, () => {
                this.props.toggleBackdrop(true);
            }, this);
        }
    }

    exportSelectedFormatClicked(e){
        e.preventDefault();
        e.stopPropagation();

        switch(this.state.selectedFormat){
            case 'las':
                this.writeToTextLpc();
                break;

            case 'laz':
                this.writeToTextLpc();
                break;

            case 'both':
                this.writeToText();
                break;

            default:
                this.writeToText();
        }

    }

    writeToTextLpc(){

        const exportArray = [];
        map(this.props.savedProducts, product => {
            const rowArray = [];
            product.productDownload.forEach( (download, i) => {
                rowArray.push(product[download.name]);
            });
            exportArray.push(rowArray);
        });

        const exportFileName = 'savedProducts_' + Moment().format('YYYYMMDD_HHmmss') + '.txt';
        exportToFile(exportFileName, exportArray, 'text');

        this.setState({
            show: false
        });
        this.props.toggleBackdrop(false);
    }

    writeToText(){
        const exportArray = [];
        map(this.props.savedProducts, product => {
            const rowArray = [];
            product.productDownload.forEach( (download, i) => {
                    rowArray.push(product[download.name]);
            });
            exportArray.push(rowArray);
        });

        const exportFileName = 'savedProducts_' + Moment().format('YYYYMMDD_HHmmss') + '.txt';
        exportToFile(exportFileName, exportArray, 'text');
    }

    handleFormatCheckboxChange(e){
        e.stopPropagation();

        this.setState({
            selectedFormat: e.currentTarget.value
        });
    }

    toggleDialog(e){
        e.stopPropagation();

        this.setState({
            show: !this.state.show
        }, () => {
            if (this.state.show === true)  this.props.toggleBackdrop(true);
            else this.props.toggleBackdrop(false);
        });
    }

    close(e){
        e.stopPropagation();

        this.setState({
           show: false
        });
        this.props.toggleBackdrop(false);
    }

    render() {

        return (
            <span>
                <button className="btn btn-sm btn-secondary" onClick={this.exportAsTextClicked.bind(this)}
                        style={{fontSize:'1em', height:'2em', padding:'1px 10px'}}>Export As Text</button>

                {
                    this.state.show ?
                            <div className="modal-dialog save-as-modal lpc animation-effect shadow" >
                                <div className="modal-content bg-light">
                                    <div className="modal-body">
                                        <h4 style={{color:'#f89406'}}>LPC Format Options</h4>

                                        <p>Selected items include LPC product(s) for which LAS and LAZ formats are available.
                                            Please select an export option below:</p>

                                        <ul id='lpc-export-format-radios' style={{listStyle: 'none'}} >
                                            <p>Export the product download URL(s) for: </p>
                                            <li className="form-inline">
                                                <label className="label-option radio radio-inline control-label">
                                                    <input type="radio" name='lpc-download-format' value='las'
                                                           checked={this.state.selectedFormat === 'las'}
                                                           onChange={this.handleFormatCheckboxChange.bind(this)} />LAS Format Only
                                                </label>
                                            </li>
                                            <li className="form-inline">
                                                <label className="label-option radio radio-inline control-label">
                                                    <input type="radio" name='lpc-download-format' value='laz'
                                                           checked={this.state.selectedFormat === 'laz'}
                                                           onChange={this.handleFormatCheckboxChange.bind(this)} />LAZ Format Only
                                                </label>
                                            </li>
                                            <li className="form-inline">
                                                <label className="label-option radio radio-inline control-label">
                                                    <input type="radio" name='lpc-download-format' value='both'
                                                           checked={this.state.selectedFormat === 'both'}
                                                           onChange={this.handleFormatCheckboxChange.bind(this)} />Both Formats
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm btn-secondary" onClick={this.exportSelectedFormatClicked.bind(this)}> Export </button>
                                        <button className="btn btn-sm btn-secondary" onClick={this.close.bind(this)}> Cancel </button>

                                    </div>
                                </div>
                            </div>

                    : null
                }
            </span>
        );
    }

}

function mapStateToProps( { backdropVisibility } ){
    return { backdropVisibility };
}

function mapDispatcherToProps(dispatch){
    return bindActionCreators( { toggleBackdrop }, dispatch );
}

export default connect( mapStateToProps, mapDispatcherToProps )(SaveAsText);







