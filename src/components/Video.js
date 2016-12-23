import React, {Component, PropTypes} from 'react';


export default class video extends React.Component {
    render = ()=> {
        return (
            <div>
                {this.props.children}
            </div>
        );
    };
};

