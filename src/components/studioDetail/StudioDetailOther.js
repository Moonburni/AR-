import React from 'react'
import {Breadcrumb, Input, Carousel, Modal, Button, Upload, Icon, notification, message} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import {getSingleData, delSingleData, changeData} from '../../services/service'
import {qiNiu, qiNiuDomain, qiNiuBucket} from '../../../config'
import './studioDetail.css'
import cookie from 'js-cookie'

const confirm = Modal.confirm;

export default class StudioDetailOther extends React.Component {


    state = {
        data: {
            photoList: [{
                imageUrl: ''
            }]
        },
        visible: false,
        xml: '',
        dat: ''
    };

    openNotificationWithIcon = (type, text) => (
        notification[type]({
            message: '上传错误',
            description: text,
        })
    );

    beforeUpload = (file)=> {
        // console.log(file.type);
        const isType = ()=> {
            if (file.name.indexOf('.dat') === -1 && file.type.indexOf('text/xml') === -1) {
                return false
            } else {
                return true
            }
        };
        if (!isType()) {
            this.openNotificationWithIcon('error', '只能上传.xml或者.dat格式的文件');
        }
        return isType()
    };

    showModal = ()=> {
        this.setState({
            visible: true,
        });
    };

    handleOk = ()=> {
        if ((this.state.xml && this.state.dat) != '') {
            let upData = {
                localResource: this.state.xml + ';' + this.state.dat,
                state: 3,
                albumId: this.props.params.id
            };
            changeData(upData).then(({jsonResult})=> {
                if (jsonResult) {
                    this.setState({
                        visible: false,
                    });
                }
            });
        }else if( this.state.dat === ''){
            message.error('请上传.dat文件',3)
        }else if( this.state.xml === ''){
            message.error('请上传.xml文件',3)
        }else{
            message.error('请上传文件',3)
        }
    };

    handleCancel = (e)=> {
        this.setState({
            visible: false,
        });
    };

    componentWillMount() {
        getSingleData(this.props.params.id)
            .then(({jsonResult}) => {
                console.log(jsonResult.data);
                this.setState({
                    data: jsonResult.data
                });
            });
    }

    // componentDidMount(){
    //   console.log(this.state.data.photoList);
    // }

    handleChange = (info) => {
        console.log(info.file);
        if (info.file.status === 'done') {
            if (info.file.type === 'text/xml') {
                this.state.xml = qiNiuDomain + '/' + info.file.response.key;
                message.success(`上传${info.file.name}成功`, 3)
            }else {
                this.state.dat = qiNiuDomain + '/' + info.file.response.key;
                message.success(`上传${info.file.name}成功`, 3)
            }
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };

    render = () => {
        const del = ()=> {
            let that = this.props.params.id;
            // console.log(this.props.params.id);
            confirm({
                title: '是否删除此影集?',
                content: '删除后将不可恢复',
                onOk() {

                    delSingleData(that)
                        .then(({jsonResult})=> {
                            if (jsonResult) {
                                hashHistory.push('/studioListOther')
                            }
                        })
                },
                onCancel() {
                },
            });
        };

        const change = () => {
            hashHistory.push(`/changeOther/${this.props.params.id}`)
        };

        const headersBuilder = (file)=> {
            return ({
                token: cookie.get('qiNiuToken'),
                key: 'photo/' + file.name
            });
        };

        return (
            <div className="detail">
                <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
                <div style={{marginLeft: '16px', marginBottom: '12px'}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>影集管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/studioListOther">影集列表</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link
                            to={`/studioDetailOther/${this.props.params.id}`}>影集详情</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="detailContent" style={{height: '500px'}}>
                    <div className="btn" onClick={change}>修 改</div>
                    <div className="btn" onClick={del}>删 除</div>
                    <div className="btn" onClick={this.showModal}>上传识别资源</div>
                    <div style={{
                        width: '952px',
                        margin: 'auto',
                        height: '514px',
                        marginTop: '60px',
                        position: 'relative'
                    }}>
                        <div className="textContent">
                            <span>影集名称</span>
                            <div id="albumName"
                                 style={{borderTop: 'solid 1px #fafafa'}}>{this.state.data.albumName}</div>
                            <span>作者</span>
                            <div id="author">{this.state.data.author}</div>
                            <span>创建日期</span>
                            <div
                                id="createTime">{new Date(parseInt(this.state.data.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</div>
                            <span>浏览次数</span>
                            <div id="browseCount">{this.state.data.browseCount}</div>
                            <span>资源大小</span>
                            <div id="resourceSize">{this.state.data.resourceSize}Mb</div>
                            <span>影集描述</span>
                            <div id="description " style={{height: '80px',lineHeight:'20px',overflow:'auto'}}>{this.state.data.description}</div>
                            <span>联系电话</span>
                            <div id="contactName">{this.state.data.contactName}</div>
                            <span>联系地址</span>
                            <div id="address">{this.state.data.address}</div>
                        </div>
                        <div className="imgContent">
                            <Carousel autoplay>
                                {
                                    this.state.data.photoList.map((item, index)=> {
                                        return (
                                            <div key={index}><img src={`${item.imageUrl}?imageView2/1/w/348/h/348`}/>
                                            </div>
                                        )
                                    })}
                            </Carousel>
                        </div>
                    </div>
                </div>
                <Modal title="上传识别资源" visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    <div style={{margin: 'auto', width: '300px'}}>
                        <Upload
                            className="avatar-uploader"
                            name="file"
                            showUploadList={false}
                            action={qiNiu}
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}
                            data={headersBuilder}
                            multiple={true}
                        >
                            <Icon type="plus" className="avatar-uploader-trigger"/>
                        </Upload>
                    </div>
                </Modal>
            </div>
        )
    }
}

