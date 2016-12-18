import React, {Component, PropTypes} from 'react';
import Header from './header/Header'
import './app.css'

export default class App extends React.Component {
  render = ()=> {
    return (
      <div className="app">
        <Header/>
        <div className="allContent">
          {this.props.children}
        </div>
      </div>
    );
  };
};

