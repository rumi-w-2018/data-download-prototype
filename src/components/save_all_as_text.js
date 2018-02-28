import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import Moment from 'moment';
import { toggleBackdrop } from '../actions';


class SaveAllAsText extends Component {

    constructor(props){
        super(props);

        this.state = {
            show: false,
            showMsgModal: false,
            msgHeader: '',
            msgContents: '',
            msgShowLoadingIcon: false,
            msgShowFooterBtn: false
        };
    }

    fetch(e) {
        e.stopPropagation();

        const maxParam = `max=${this.props.fetchedProducts.total}`;
        const offsetParam = 'offset=0';
        const outputFormat = 'outputFormat=TEXT';
        const url = `${this.props.fetchedProducts.baseProdUrl}&${maxParam}&${offsetParam}&${outputFormat}`;

        this.setState({
            show: false
        });

        this.setState({
            showMsgModal: true,
            msgHeader: 'Processing....',
            msgContents: 'Please wait.',
            msgShowLoadingIcon: true,
            msgShowFooterBtn: false
        });

        this.props.toggleBackdrop(true);

        $.ajax({
            url: url,
            type: 'GET'
        })
        .done( response => {
            if(response.length>0){
                const tempArray = response.split('\n');
                // Needed to add back '\n'
                const finalArray=[];

                tempArray.forEach( item => {
                    const str = item.toString() + '\n';
                    finalArray.push(str);
                });

                const filename = 'product_list_' + Moment().format('YYYYMMDD_HHmmss') + '.txt';
                const blob = new Blob(finalArray, { type: 'text/csv' });

                if (navigator.msSaveBlob) { // IE 10+
                    navigator.msSaveBlob(blob, filename);
                }else {
                    const link = document.createElement('a');
                    if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', filename);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }

                this.setState({
                    showMsgModal: false,
                    msgHeader: '',
                    msgContents: '',
                    msgShowLoadingIcon: false
                });

                this.props.toggleBackdrop(false);

            }else{
                console.log('Error!', 'Error occurred while processing text file.');
                this.setState({
                    showMsgModal: false,
                    msgHeader: 'Errir',
                    msgContents: 'Error occurred while processing text file.',
                    msgShowLoadingIcon: true,
                    msgShowFooterBtn: true
                });
                this.props.toggleBackdrop(true);
            }
        })
        .fail(function(){
            console.log('Error!', 'Error occurred while processing text file.');
            this.setState({
                showMsgModal: false,
                msgHeader: 'Errir',
                msgContents: 'Error occurred while processing text file.',
                msgShowLoadingIcon: true,
                msgShowFooterBtn: true
            });
            this.props.toggleBackdrop(true);

        });

    }

    toggleDialog(e){
        e.stopPropagation();

        if (this.props.fetchedProducts.total > 5000){
            this.setState({
                showMsgModal: true,
                msgHeader: 'Error',
                msgContents: 'The number of results have exceeded. Please modify your request to return a smaller number of products',
                msgShowLoadingIcon: true,
                msgShowFooterBtn: true
            });
            return;
        }

        this.setState({
            show: !this.state.show
        }, () => {
            if (this.state.show === true)  this.props.toggleBackdrop(true);
            else this.props.toggleBackdrop(false);
        });
    }

    closeMsg(e){
        this.setState({
            showMsgModal: false,
            msgHeader: '',
            msgContents: '',
            msgShowLoadingIcon: false,
            msgShowFooterBtn: false
        });
        this.props.toggleBackdrop(false);
    }


    render() {

        return (
            <span>
                <button className="btn btn-sm btn-info" onClick={this.toggleDialog.bind(this)}
                        style={{fontSize:'1em', height:'2em', padding:'1px 10px', marginRight:'4px', marginTop: '-5px'}}>Export As Text</button>
                {
                    this.state.show ?
                            <div className="modal-dialog save-as-modal animation-effect shadow" >
                                <div className="modal-content bg-light">
                                    <div className="modal-body">
                                        <h4 style={{color:'#f89406'}}>Export</h4>
                                        <p>You are requesting <span style={{fontWeight:'bold', color:'#f89406'}}>{this.props.fetchedProducts.total}</span> items
                                            in text format. Are you sure you want to proceed?</p>

                                        <p style={{fontSize:'12px'}}>Note: the maximum allowed is 5,000 products.
                                            Open <a target='_blank' rel="noopener noreferrer" href='https://viewer.nationalmap.gov/uget-instructions/index.html'>uGet instructions</a> in a new window.</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-sm btn-secondary" onClick={this.fetch.bind(this)}> Yes </button>
                                        <button className="btn btn-sm btn-secondary" onClick={this.toggleDialog.bind(this)}> No </button>
                                    </div>
                                </div>
                            </div>

                    : null
                }

                {
                    this.state.showMsgModal ?
                        <div className="modal-dialog save-as-modal animation-effect shadow" >
                            <div className="modal-content bg-light">
                                <div className="modal-body">
                                    <h4 style={{color:'#f89406'}}>{this.state.msgHeader}</h4>
                                    <p>{this.state.msgContents}
                                        {
                                            this.state.msgShowLoadingIcon ?
                                                <img style={{marginTop:'4px',marginLeft:'4px'}} alt='loading' src='./img/dots_22x6.gif' /> : null
                                        }
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    {
                                        this.state.msgShowFooterBtn ?
                                            <button className="btn btn-sm btn-secondary" onClick={this.closeMsg.bind(this)}> Close </button> : null
                                    }
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

export default connect( mapStateToProps, mapDispatcherToProps )(SaveAllAsText);







