import React, { Component } from 'react';


export default class RadioButton extends Component {

    constructor(props){
        super (props);

        this.state = {
            isChecked: false,
        };

    }

    toggleCheckbox() {
        this.setState({
            isChecked: !this.state.isChecked
        });

        this.props.handleCheckboxChange(this.props.name, this.props.sbTag);
    }

    render(){

        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        value={this.props.sbTag}
                        checked={this.state.isChecked}
                        onChange={this.toggleCheckbox}
                    />
                    {this.props.display}
                </label>
            </div>
        );





    }
}