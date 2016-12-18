import React from 'react'
import {RouteHandler, hashHistory} from "react-router"
import './login.css'
import Header from '../header/HeaderLogin'
import { Form, Icon, Input, Button, Checkbox,message } from 'antd'
import {login} from '../../services/service'
import cookie from 'js-cookie';

const FormItem = Form.Item;

export default class Login extends React.Component{

  handleSubmit =(e)=> {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        // hashHistory.push('/app')
        login(values).then(({jsonResult})=>{
          // console.log(jsonResult);
          if(jsonResult.msg === "登录成功"){
            // console.log(jsonResult);
            cookie.set('token',jsonResult.data.token);
            cookie.set('qiNiuToken',jsonResult.data.qiuNiuToken);
            hashHistory.push('/app')
          }else{
            message.error('登录失败，'+jsonResult.msg)
          }
        })
      }
    });
  };

  render =()=>{
    const { getFieldDecorator } = this.props.form;
    const style = {
      width:'313px',
      height:'72px',
      fontSize:'24px',
      color:'#333333',
      backgroundColor:'white',
      paddingLeft:'30px'
    };
    const btn = {
      width:'399px',
      height:'72px',
      fontSize:'32px',
      color:'#333333',
      backgroundColor:'#ffcb00',
      borderColor:'#ffcb00',
      marginTop:'72px'
    };
    const icon = {
      width:'72px',
      fontSize:'36px'
    };
    return(
      <div className="login">
        <Header/>
        <div className="loginBox">
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
          </Form>
        </div>
      </div>
    )
  }
};
Login = Form.create({})(Login);

