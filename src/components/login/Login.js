import React from 'react'
import {RouteHandler, hashHistory} from "react-router"
import './login.css'
import Header from '../header/HeaderLogin'
import { Form, Icon, Input, Button, Checkbox,message } from 'antd'
import {login} from '../../services/service'
import cookie from 'js-cookie';

const FormItem = Form.Item;

export default class Login extends React.Component{

    state = {
        login:true,
        visible:false
    };

    handleSubmit =(e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // hashHistory.push('/app')
                login(values,2).then(({jsonResult})=>{
                    console.log(values);
                    // console.log(jsonResult);
                    if(jsonResult.msg === "登录成功"){
                        console.log(jsonResult);
                        cookie.set('token',jsonResult.data.token);
                        cookie.set('qiNiuToken',jsonResult.data.qiuNiuToken);
                        cookie.set('userName',jsonResult.data.admin.adminName);
                        cookie.set('roleId',jsonResult.data.admin.roleId);
                        cookie.set('adminId',jsonResult.data.admin.adminId);
                        hashHistory.push('/studioList')
                    }else{
                        message.error('登录失败，'+jsonResult.msg)
                    }
                })
            }
        });
    };

    register =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // hashHistory.push('/app')
                if(values.password === values.beSure){
                    this.setState({
                        visible:true
                    })
                }else{
                    message.error('2次密码不一致',3)
                }
            }
        });
    };

    style = {
        box:{
            display:'flex',
            justifyContent:'space-around',
            alignItems:'center',
            height:'30px',
            width:'100%',
            marginBottom:'16px'
        },
        btn:{
            width:'72px',
            height:'32px',
            lineHeight:'32px',
            borderRadius:'16px',
            textAlign:'center',
            fontSize:'14px',
            color:'#444444',
            cursor:'pointer'
        },
        btnActive:{
            width:'72px',
            height:'32px',
            lineHeight:'32px',
            borderRadius:'16px',
            textAlign:'center',
            backgroundColor:'rgba(18,18,18,0.8)',
            fontSize:'14px',
            color:'white',
            cursor:'pointer'
        }
    };

    changeLogin =()=>{
       if(this.state.login){
           this.setState({
               login:false
           })
       }else{
           this.setState({
               login:true
           })
       }
    };

    cancel =()=>{
        this.setState({
            visible:false
        })
    };

    render =()=>{
        const { getFieldDecorator } = this.props.form;
        const style = {
            width:'200px',
            height:'48px',
            fontSize:'18px',
            color:'#333333',
            backgroundColor:'white',
            paddingLeft:'24px',
        };
        const btn = {
            width:'260px',
            height:'48px',
            fontSize:'24px',
            color:'#333333',
            backgroundColor:'#ffcb00',
            borderColor:'#ffcb00',
            marginTop:'27px',
            marginLeft:'40px'
        };
        const icon = {
            width:'45px',
            fontSize:'24px',
        };
        return(
            <div className="login">
             <div className="modal" style={this.state.visible?{display:'flex'}:{display:'none'}}>
                 <div className="modal-body">
                     <div className="modal-body-head">完善资料</div>
                     <div className="modal-body-content">
                         <input placeholder="我们该如何称呼您（姓名）"/>
                         <input placeholder="我们该如何联系你（手机号码）"/>
                         <input/>
                     </div>
                     <div className="modal-body-foot">
                         <div className="modal-body-foot-btn">完成</div>
                         <div className="modal-body-foot-btn" onClick={this.cancel}>取消</div>
                     </div>
                 </div>
             </div>
                <Header/>
                <div className={this.state.login?'loginBox':'loginBoxR'}>
                    <div style={this.style.box}>
                        <div style={this.state.login?this.style.btnActive:this.style.btn} onClick={this.changeLogin}>登录</div>
                        <div style={this.state.login?this.style.btn:this.style.btnActive} onClick={this.changeLogin}>注册</div>
                    </div>
                    {
                        this.state.login?
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('adminName', {
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(
                                    <Input style={style} addonBefore={<Icon type="user" style={icon}/>} placeholder="请输入用户名" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input style={style} addonBefore={<Icon type="lock" style={icon}/>} type="password" placeholder="请输入密码" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" style={btn} htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>:
                            <Form onSubmit={this.register} className="login-form">
                                <FormItem>
                                    {getFieldDecorator('adminName', {
                                        rules: [{ required: true, message: '请输入用户名!' }],
                                    })(
                                        <Input style={style} addonBefore={<Icon type="user" style={icon}/>} placeholder="请输入用户名" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入密码!' }],
                                    })(
                                        <Input style={style} addonBefore={<Icon type="lock" style={icon}/>} type="password" placeholder="请输入密码" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('beSure', {
                                        rules: [{ required: true, message: '请再次输入密码!' }],
                                    })(
                                        <Input style={style} addonBefore={<Icon type="lock" style={icon}/>} type="password" placeholder="请再次输入密码" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" style={btn} htmlType="submit" className="login-form-button">
                                        注册
                                    </Button>
                                </FormItem>
                            </Form>

                    }

                </div>
            </div>
        )
    }
};
Login = Form.create({})(Login);

