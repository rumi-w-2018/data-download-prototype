import React, { Component } from 'react';


export default class Checkbox extends Component {

    constructor(props){
        super (props);

        this.state = {
            isChecked: false,
        };

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.clearAllDatasetSelection === true) {
            this.setState({
                isChecked: false
            });
        }
    }

    toggleCheckbox(e) {
        e.stopPropagation();

        this.setState({
            isChecked: !this.state.isChecked
        });

        this.props.handleFilterCheckboxChange(this.props.label);
    }

    render(){

        return (
            <label>
                <input
                    type="checkbox"
                    value={this.props.label}
                    checked={this.state.isChecked}
                    onChange={this.toggleCheckbox.bind(this)}

                />
                {this.props.label}
            </label>

        );
    }
}