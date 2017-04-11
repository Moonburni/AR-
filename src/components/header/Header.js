import React from 'react';
import {Icon,Modal,Input,message} from 'antd'
import './header.css'
import {RouteHandler,Link,hashHistory} from "react-router"
import cookie from 'js-cookie'
import {postPassword,postName} from '../../services/service'


export default class Header extends React.Component{
    state = {
        key:true,
        name:'',
        old:'',
        new:'',
        repeat:'',
        tel:'',
        mon:1
    };

    onChange =(v)=>{
        return (e)=>{
           if(v ==='old'){
            this.setState({
                old:e.target.value
            })
        }else if(v === 'new'){
               this.setState({
                   new:e.target.value
               })
           }else if(v === 'repeat'){
               this.setState({
                   repeat:e.target.value
               })
           }else if(v === 'name'){
               this.setState({
                   name:e.target.value
               })
           }else if(v === 'tel'){
               this.setState({
                   tel:e.target.value
               })
           }
        }
    };

    showModal = (e) => {
        return ()=>{
            this.setState({
                visible: true,
                key:e,
            });
        };
    };

    style = {
        Input:{
            width:'60%',
            height:'36px',
            marginLeft:'20%',
            marginBottom:'20px'
        }
    };
    handleOk = () => {
       if(this.state.key === true){
           if(this.state.new === this.state.repeat ){
               let data = {
                   newPassword:this.state.new,
                   oldPassword:this.state.old
               };
               postPassword(data).then(({jsonResult})=>{
                   if(jsonResult){
                       message.success('修改成功,请重新登录');
                       this.setState(
                           {
                               visible: false,
                               mon:this.state.mon+1,
                               name:'',
                               old:'',
                               new:'',
                               repeat:'',
                               tel:'',
                           });
                       hashHistory.push('/')
                   }
               }).catch((e)=> message.error(e))
           }else {
               message.error('密码不一致，请核对')
           }
       }else {
           let data = {
               adminId:cookie.get('adminId')
           };
           if(this.state.name != ''){
               data = {...data,trueName:this.state.name}
           }
           if(this.state.tel != ''){
               data = {...data,tel:this.state.tel}
           }
           if(data.tel){
               if(!(/^1[34578]\d{9}$/.test(data.tel))){
                   message.error("手机号码有误，请重填");
               }
               else {
                   postName(cookie.get('adminId'),data).then(({jsonResult})=>{
                       if(jsonResult){
                           message.success('修改成功');
                           if(this.state.name != ''){
                               cookie.set('userName',this.state.name);
                           }
                           this.setState(
                               {
                                   visible: false,
                                   mon:this.state.mon+1,
                                   name:'',
                                   old:'',
                                   new:'',
                                   repeat:'',
                                   tel:'',
                               });
                       }
                   }).catch((e)=> message.error(e))
               }
           }else {
               postName(cookie.get('adminId'),data).then(({jsonResult})=>{
                   if(jsonResult){
                       message.success('修改成功');
                       if(this.state.name != ''){
                           cookie.set('userName',this.state.name);
                       }
                       this.setState(
                           {
                               visible: false,
                               mon:this.state.mon+1,
                               name:'',
                               old:'',
                               new:'',
                               repeat:'',
                               tel:'',
                           });
                   }
               }).catch((e)=> message.error(e))
           }
       }
    };
    handleCancel = () => {
        this.setState(
            {
                visible: false,
                mon:this.state.mon+1,
                name:'',
                old:'',
                new:'',
                repeat:'',
                tel:'',
            });
    };
    render(){
        return (
            <header>
                <div className="headerContent">
                    <div><span/></div>
                    {
                        cookie.get('roleId') === '2'?
                            <div>
                                <Link to="/cloud" className="links" activeStyle={{color: 'white',borderBottom:'4px solid #ffcb00'}}>名片</Link>
                                <Link to="/video" className="links" activeStyle={{color: 'white',borderBottom:'4px solid #ffcb00'}}>影集</Link>
                            </div>:
                            <div>
                                <Link to="/cloud" className="links" activeStyle={{color: 'white',borderBottom:'4px solid #ffcb00'}}>名片审核</Link>
                                <Link to="/video" className="links" activeStyle={{color: 'white',borderBottom:'4px solid #ffcb00'}}>影集管理</Link>
                                <Link to="/customer" className="links" activeStyle={{color: 'white',borderBottom:'4px solid #ffcb00'}}>客户管理</Link>
                            </div>
                    }
                    <span className="named">
          {cookie.get('userName')}
                        <div>
            <div onClick={this.showModal(true)}>修改密码</div>
            <div onClick={this.showModal(false)}>修改资料</div>
          </div>
        </span>
                    <Link to="/">
                        <Icon type="poweroff" style={{
                            fontSize: '24px',
                            position: 'absolute',
                            right: '0',
                            marginTop:'24px'
                        }}/></Link>
                </div>
                <Modal key={this.state.mon} title={this.state.key?'修改密码':'修改资料'} visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    {
                        this.state.key?
                            <div>
                                <Input onChange={this.onChange('old')} style={this.style.Input} type="password" placeholder="旧密码"/>
                                <Input onChange={this.onChange('new')} style={this.style.Input} type="password" placeholder="新密码"/>
                                <Input onChange={this.onChange('repeat')} style={this.style.Input} type="password" placeholder="重复新密码"/>
                            </div>:
                            <div>
                                <Input onChange={this.onChange('name')} style={this.style.Input} placeholder="请输入姓名"/>
                                <Input onChange={this.onChange('tel')} style={this.style.Input} placeholder="请输入电话号码"/>
                            </div>
                    }
                </Modal>
            </header>
        );
    }
};
