import React from 'react';
import {Icon} from 'antd'
import './header.css'
import {RouteHandler, hashHistory, Link} from "react-router"

const Header = () => {
  return (
    <header>
      <div className="headerContent">
        <p><span/>影集管理</p>
        <img/>
        <span>陈小明</span>
        <Link to="/">
        <Icon type="poweroff" style={{
          fontSize: '24px',
          position: 'absolute',
          right: '0',
          marginTop:'24px'
        }}/></Link>
      </div>
    </header>
  );
};

export default Header;
