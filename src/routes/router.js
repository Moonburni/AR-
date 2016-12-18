import React, { PropTypes } from 'react';
import {Router, RouteHandler, Route, hashHistory, IndexRoute} from "react-router";
import cookie from 'js-cookie';
import App from '../components/App';
import Login from '../components/login/Login'
import StudioList from '../components/studioList/StudioList'
import StudioDetail from '../components/studioDetail/StudioDetail'
import Create from '../components/create/Create'
import Change from '../components/change/Change'

const Routes = () =>{
  return(
    <Router history={hashHistory}>
      <Route path="/" component={Login}/>

      <Route path="/app" component={App}
             onEnter={(_ignore,replace)=>{
               if (!cookie.getJSON('token')) {
                 replace(`/`);
               }
             }}>
        <IndexRoute component={StudioList}/>
        <Route path="/studioList" component={StudioList}/>
        <Route path="/studioDetail/:id" component={StudioDetail}/>
        <Route path="/create" component={Create}/>
        <Route path="/change/:id" component={Change}/>
      </Route>
    </Router>
  )
};



export default Routes;
