import React from 'react'
import {Breadcrumb, Input, Table, Icon, Modal,message} from 'antd'
import {Link} from 'react-router'
import {getAdmin,postAdmin} from '../services/service'

export default class Customer extends React.Component {

    constructor() {
        super();
        this.state = {
            dataSource: [],
            trueName: [],
            adminName: [],
            visible: false,
            cloud:0,
            video:0
        }

    }

    componentDidMount() {
        getAdmin().then(({jsonResult})=> {
            console.log(jsonResult.data);
            this.setState({
                dataSource: jsonResult.data
            })
        })
    }

    search = (e)=> {
        getAdmin(e.target.value).then(({jsonResult})=> {
            this.setState({adminName: jsonResult.data})
        });
        getAdmin('', e.target.value).then(({jsonResult})=>
            this.setState({trueName: jsonResult.data},
                ()=> {
                    if (this.state.trueName.length > this.state.adminName.length) {
                        this.setState({dataSource: this.state.trueName})
                    } else {
                        this.setState({dataSource: this.state.adminName})
                    }
                })
        )
    };

    showModal = (record) => {
        return ()=>{
            this.setState({
                visible: true,
                adminId:record.adminId,
                currentCloudImageAmount:record.currentCloudImageAmount,
                currentAlbumAmount:record.currentAlbumAmount
            });
        }
    };

    handleOk = (e) => {
        let data = {
            currentCloudImageAmount:parseInt(this.state.currentCloudImageAmount)+parseInt(this.state.cloud),
            currentAlbumAmount:parseInt(this.state.currentAlbumAmount)+parseInt(this.state.video)
        };
        postAdmin(this.state.adminId,data).then(()=>{
            this.setState({
                visible: false,
            },()=>{
                getAdmin().then(({jsonResult})=> {
                    // console.log(jsonResult.data);
                    this.setState({
                        dataSource: jsonResult.data
                    })
                });
                message.success('充值成功')
            });
        });
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    style = {
        search: {
            marginLeft: '10px',
            width: '200px',
            height: '31px',
            padding: '0',
            paddingLeft: '2px',
            float: 'right',
            marginBottom: '10px',
            marginTop: '20px',
            marginRight: '2.5%'
        },
        bigBox: {
            width: '100%',
            height: 'auto',
            backgroundColor: 'white',
        },
        table: {
            width: '95%',
            margin: 'auto',
            clear: 'both'
        },
        a: {
            color: '#3AA7EC'
        }
    };

    columns = [{
        title: '账号',
        dataIndex: 'adminName',
        key: 'adminName ',
    }, {
        title: '姓名',
        dataIndex: 'trueName',
        key: 'trueName ',
    }, {
        title: '名片余额',
        dataIndex: 'currentCloudImageAmount',
        key: 'currentCloudImageAmount',
    }, {
        title: '影集余额',
        dataIndex: 'currentAlbumAmount',
        key: 'currentAlbumAmount',
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
               <a onClick={this.showModal(record)} style={this.style.a}>充值</a>
           </span>
        ),
    }];

    number = (value)=> {
        return (e)=> {
            if (value === 'cloud') {
                this.setState({
                    cloud: e.target.value
                })
            } else {
                this.setState({
                    video: e.target.value
                })
            }
        }
    };

    render() {
        return (
            <div className="customer">
                <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
                <div style={{marginLeft: '16px', marginBottom: '12px'}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>客户管理</Breadcrumb.Item>
                        <Breadcrumb.Item>客户列表</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={this.style.bigBox}>
                    <Input placeholder="输入用户名或账号，回车键检索" onPressEnter={this.search} style={this.style.search}/>
                    <div style={this.style.table}>
                        <Table rowKey={record => record.adminId} dataSource={this.state.dataSource}
                               columns={this.columns}/>
                    </div>
                </div>
                <Modal title="充值" visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    <div style={{width:'60%',margin:'auto'}}>
                        <Input
                            style={{marginBottom: '20px'}}
                            onChange={this.number('cloud')}
                            placeholder="请填写名片图片数"
                        />
                        <Input
                            style={{marginBottom: '20px'}}
                            onChange={this.number('video')}
                            placeholder="请填写影集图片数"
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}
