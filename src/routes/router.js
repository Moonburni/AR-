import React, {PropTypes} from 'react';
import {Router, RouteHandler, Route, hashHistory, IndexRoute} from "react-router";
import cookie from 'js-cookie';
import App from '../components/App';
import Cloud from '../components/Cloud';
import Video from '../components/Video';
import Login from '../components/login/Login'
import StudioList from '../components/studioList/StudioList'
import StudioListOther from '../components/studioList/StudioListOther'
import StudioDetail from '../components/studioDetail/StudioDetail'
import StudioDetailOther from '../components/studioDetail/StudioDetailOther'
import Create from '../components/create/Create'
import Change from '../components/change/Change'
import CreateOther from '../components/create/CreateOther'
import ChangeOther from '../components/change/ChangeOther'

const Routes = () => {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={Login}/>

            <Route path="/app" component={App}
                   onEnter={(_ignore, replace)=> {
                       if (!cookie.getJSON('token')) {
                           replace(`/`);
                       }
                   }}>
                <IndexRoute component={Cloud}/>
                <Route  path="/cloud" component={Cloud} >
                    <IndexRoute component={StudioList}/>
                    <Route path="/studioList" component={StudioList}/>
                    <Route path="/studioDetail/:id" component={StudioDetail}/>
                    <Route path="/create" component={Create}/>
                    <Route path="/change/:id" component={Change}/>
                </Route>
                <Route  path="/video" component={Video}>
                    <IndexRoute component={StudioListOther}/>
                    <Route path="/studioListOther" component={StudioListOther}/>
                    <Route path="/studioDetailOther/:id" component={StudioDetailOther}/>
                    <Route path="/createOther" component={CreateOther}/>
                    <Route path="/changeOther/:id" component={ChangeOther}/>
                </Route>
            </Route>
        </Router>
    )
};


export default Routes;
