import React from 'react';
import {Icon} from 'antd'
import './header.css'
import {RouteHandler, hashHistory, Link} from "react-router"
import cookie from 'js-cookie'

const Header = () => {
  return (
    <header>
      <div className="headerContent">
        <p><span/><Link to="/app" style={{color:'white'}}>影集管理</Link></p>
        <span>{cookie.get('userName')}</span>
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
