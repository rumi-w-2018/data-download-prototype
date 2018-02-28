import React, { Component } from 'react';


class Popover extends Component{
    constructor(props){
        super(props);

        this.state = {
            show: false
        };
    }

    toggleChildren() {
        this.setState({
            show: !this.state.show
        });
    }

    toggleChildren2() {
        this.setState({
            show: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    show: false
                });
            }, 1000);
        }, this);
    }

    render() {
        return (
            <div >
                <span className={this.props.classLabel} style={{marginLeft: '5px'}} title={this.props.tips} onClick={this.toggleChildren.bind(this)}>
                    {
                        this.props.type === 'icon' ? <i className={this.props.link} /> : this.props.type === 'img' ?
                            <img src={this.props.link} alt={this.props.tips}  /> : this.props.link
                    }
                </span>
                { this.state.show === true ?  this.props.children : null}
            </div>
        );
    }
}

export default Popover;