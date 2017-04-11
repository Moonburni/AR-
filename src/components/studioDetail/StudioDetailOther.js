import React from 'react'
import {Breadcrumb, Input, Carousel, Modal, Button, Upload, Icon, notification, message} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import {getSingleData, delSingleData, changeData, postNew, verifyOther, changeSingleData} from '../../services/service'
import {qiNiu, qiNiuDomain, qiNiuBucket} from '../../../config'
import VideoBuild from './VideoBuild'
import './studioDetail.css'
import cookie from 'js-cookie'
import {host} from "../../../config"


const confirm = Modal.confirm;

export default class StudioDetailOther extends React.Component {


    state = {
        data: {
            admin:{},
            photoList: [{
                imageUrl: ''
            }],
        },
        state: '',
        videoVisible: true,
        notInput: true,
        visible: false,
        newList: {},
        newKey: 0,
        update: false,
        refuse: '',
    };

    refuse = (e)=> {
        this.setState({
            refuse: e.target.value
        })
    };

    handleOk = (e) => {
        if (cookie.get('roleId') === '2') {
            if (this.state.newList.imageUrl.substring(0, this.state.newList.imageUrl.indexOf('.'))
                === this.state.newList.videoUrl.substring(0, this.state.newList.videoUrl.indexOf('.'))) {
                if (this.state.update) {
                    changeSingleData(this.state.updateData.albumId, this.state.updateData.photoId, this.state.newList).then(
                        ()=>getSingleData(this.props.params.id)
                            .then(({jsonResult}) => {
                                // console.log(jsonResult.data);
                                this.setState({
                                    data: jsonResult.data,
                                    visible: false,
                                    newKey: this.state.newKey + 1,
                                    update: false
                                });
                            })
                    ).catch((e)=>message.error(e));
                } else {
                    postNew(this.state.data.albumId, this.state.newList).then(
                        ()=>getSingleData(this.props.params.id)
                            .then(({jsonResult}) => {
                                // console.log(jsonResult.data);
                                this.setState({
                                    data: jsonResult.data,
                                    visible: false,
                                    newKey: this.state.newKey + 1
                                });
                            })
                    ).catch((e)=>message.error(e));
                }
            } else {
                message.error('图片与视频数量不符或名字不相同')
            }
        } else {
            if (this.state.refuse != '') {
                verifyOther(this.state.data.albumId, this.state.refuse).then(
                    ()=>getSingleData(this.props.params.id)
                        .then(({jsonResult}) => {
                            // console.log(jsonResult.data);
                            this.setState({
                                data: jsonResult.data,
                                visible: false,
                                newKey: this.state.newKey + 1
                            }, ()=>message.success('操作成功'));
                        }))
            } else {
                message.error('请填写拒绝理由')
            }
        }

    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
            newKey: this.state.newKey + 1
        });
    };

    handleChange = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                data: {
                    ...this.state.data,
                    coverImageUrl: qiNiuDomain + '/' + info.file.response.key,
                }
            })
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };

    openNotificationWithIcon = (type, text) => (
        notification[type]({
            message: '上传错误',
            description: text,
        })
    );


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

    beforeUpload = (file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            // message.error('图片必须小于2MB!');
            this.openNotificationWithIcon('error', '图片必须小于2MB!');
        }
        return isLt2M;
    };

    changePartOne = () => {
        if (this.state.notInput) {
            this.setState({
                notInput: !this.state.notInput
            })
        } else {
            let data = {
                adminId: cookie.get('adminId'),
                albumId: this.state.data.albumId,
                coverImageUrl: this.state.data.coverImageUrl,
                albumName: document.getElementById('albumName').value,
                description: document.getElementById('description').value,
                contactName: document.getElementById('contactName').value,
                address: document.getElementById('address').value,
            };
            // console.log(data);
            changeData(data).then(({jsonResult})=> {
                this.setState({
                    notInput: !this.state.notInput,
                    data: jsonResult.data
                })
            });
        }
    };

    headersBuilder = (file)=> {
        return ({
            token: cookie.get('qiNiuToken'),
            key: 'coverImage/' + file.name
        });
    };

    changePartTwo = ()=> {
        this.setState({
            visible: true,
        });
    };

    beforeUploadOther = (file)=> {
        const isLt20MB = ()=> {
            return !(file.type.indexOf('image/') === -1 && file.size / 1024 / 1024 > 100);
        };

        const isLt2MB = ()=> {
            return !(file.type.indexOf('video/mp4') === -1 && file.size / 1024 / 1024 > 2);
        };

        const isType = ()=> {
            return !(file.type.indexOf('image/') === -1 && file.type.indexOf('video/mp4') === -1);
        };
        if (!isType()) {
            this.openNotificationWithIcon('error', '只能上传图片或者Mp4格式的视频');
        }
        if (!isLt2MB()) {
            this.openNotificationWithIcon('error', '图片必须小于2M!');
        }

        if (!isLt20MB()) {
            this.openNotificationWithIcon('error', '视频必须小于100MB!');
        }
        return isType() && isLt2MB() && isLt20MB();
    };

    handleChangeOther = (info) => {
        if (info.file.status === 'done') {
            // console.log(info);
            if (info.file.type === 'video/mp4') {
                this.setState({
                    newList: {
                        ...this.state.newList,
                        videoUrl: qiNiuDomain + '/' + info.file.response.key
                    }
                })
            } else {
                this.setState({
                    newList: {
                        ...this.state.newList,
                        imageUrl: qiNiuDomain + '/' + info.file.response.key
                    }
                })
            }
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };

    headersBuilderOther = (file)=> {
        return ({
            token: cookie.get('qiNiuToken'),
            key: 'photo/' + file.name
        });
    };

    del = ()=> {
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

    coverImageBuilder() {
        if (this.state.data.coverImageUrl) {
            if (this.state.notInput) {
                return (
                    <div><img src={`${this.state.data.coverImageUrl}?imageView2/1/w/348/h/348`}/></div>
                )
            } else {
                return (
                    <div style={{width: '174px', height: '174px'}}>
                        <Upload
                            className="avatar-uploader"
                            name="file"
                            showUploadList={false}
                            action={qiNiu}
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}
                            data={this.headersBuilder}
                        >
                            {
                                this.state.data.coverImageUrl ?
                                    <img src={`${this.state.data.coverImageUrl}?imageView2/1/w/174/h/174`}
                                         role="presentation"
                                         className="avatar"/> :
                                    <Icon type="plus" className="avatar-uploader-trigger"/>
                            }
                        </Upload>
                    </div>
                )
            }
        } else {
            return ''
        }
    }

    removeFile = (file)=> {
        if (file.type === 'video/mp4') {
            this.setState({
                newList: {
                    ...this.state.newList,
                    videoUrl: ''
                }
            })
        } else {
            this.setState({
                newList: {
                    ...this.state.newList,
                    imageUrl: ''
                }
            })
        }
    };

    videoDel = (value)=> {
        return ()=> {
            // console.log(value);
            confirm({
                title: '是否删除此影集?',
                content: '删除后将不可恢复',
                onOk() {
                    delSingleData(value.albumId, value.photoId)
                        .then(({jsonResult})=> {
                            if (jsonResult.success) {
                                message.success('删除成功');
                                getSingleData(this.props.params.id)
                                    .then(({jsonResult}) => {
                                        console.log(jsonResult.data);
                                        this.setState({
                                            data: jsonResult.data
                                        });
                                    });
                            }
                        });
                },
                onCancel() {
                },
            });
        };

    };

    pass = ()=> {
        let that = this.state.data.albumId;
        let thatId = this.props.params.id;
        let _this = this;
        confirm({
            title: '审核',
            content: '通过之后就要发布了哦？',
            onOk() {
                verifyOther(that).then(()=>{
                    message.success('操作成功');
                        getSingleData(thatId)
                            .then(({jsonResult}) => {
                                console.log(jsonResult.data);
                                _this.setState({
                                    data: jsonResult.data
                                });
                            });
                }
                )
            },
            onCancel() {
            },
        });

    };

    videoUpdate = (value)=> {
        return ()=> {
            console.log(value);
            this.setState({
                visible: true,
                update: true,
                updateData: value
            });
        };
    };

    stateBuilder = (state)=> {
        if (state === 1) {
            return (
                <div>
                    <div style={{color: 'blue'}}>审核中</div>
                    {cookie.get('roleId') === '2' ? <div>还未审核，请耐心等待，给您带来的不便，我们感到非常抱歉</div> : <div>请尽快审核</div>}
                </div>
            )
        } else if (state === 2) {
            return (
                <div>
                    <div style={{color: 'red'}}>审核未通过</div>
                    {cookie.get('roleId') === '2' ? <div>拒绝理由:{this.state.data.verifyComment}，审核失败，给您带来的不便，我们感到非常抱歉</div> : ''}
                </div>
            )
        } else {
            if(this.state.data.state === 3){
                return (
                    <div>
                        <div style={{color: 'green'}}>审核通过（发布成功）</div>
                        {cookie.get('roleId') === '2' ? <div>您可以使用APP进行AR体验啦</div> : ''}
                    </div>
                )
            }else if(this.state.data.state === 2){
                return (
                    <div>
                        <div style={{color: 'green'}}>审核通过（发布失败）</div>
                        {cookie.get('roleId') === '2' ? <div>发布失败，请检查图片，未知、无法解决的问题请联系系统管理员：15602321739</div> : ''}
                    </div>
                )
            }
        }

    };

    style = {
        title: {
            color: '#333333',
            fontSize: '24px',
        },
        titleBox: {
            margin: 'auto',
            marginTop: '20px',
            width: 'calc(100% - 48px)',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '40px'
        },
    };

    render = () => {
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
                <div className="detailContent">
                    <div style={this.style.titleBox}>
                        {
                            cookie.get('roleId') === '2' ?
                                <div style={this.style.title}>影集详情</div> :
                                <div>
                                    {
                                        this.state.data.verifyState === 1?
                                            <button className="btn" onClick={this.changePartTwo}>拒绝</button>:
                                            <button disabled={true} style={{backgroundColor:'grey'}} className="btn" onClick={this.changePartTwo}>拒绝</button>
                                    }
                                    {
                                        this.state.data.verifyState === 1?
                                            <button className="btn" onClick={this.pass}>通过</button>:
                                            <button
                                                disabled={this.state.data.state === 3}
                                                style={this.state.data.state === 3?{backgroundColor:'grey'}:{}}
                                                className="btn"
                                                onClick={this.pass}>
                                                {this.state.data.state === 3?'通过':'重新提交'}
                                            </button>
                                    }
                                </div>
                        }
                        {
                            cookie.get('roleId') === '2' ? <div className="deleteTitle" onClick={this.del}>删除</div> : ''
                        }
                    </div>
                    <div className="littleTitle">审核进度
                        <div className="spot"/>
                    </div>
                    <div className="checkBody">{this.stateBuilder(this.state.data.verifyState)}</div>
                    {cookie.get('roleId') === '2' ? '' : <div className="littleTitle">提交人
                        <div className="spot"/>
                    </div>}
                    {cookie.get('roleId') === '2' ? '' :
                        <div className="infoBody">
                            <div>账号:{this.state.data.admin.adminName}</div>
                            <div>姓名:{this.state.data.admin.trueName}</div>
                            <div>联系电话:{this.state.data.contactName}</div>
                        </div>}
                    <div className="littleTitle">信息详情
                        {cookie.get('roleId') === '2' ? <div className="spot1"/> : <div className="spot"/>}
                        {cookie.get('roleId') === '2' ? <div className="changeTitle"
                                                             onClick={this.changePartOne}>{this.state.notInput ? '修改' : '保存'}</div> : ''}
                    </div>
                    <div style={{
                        width: '952px',
                        margin: 'auto',
                        height: '514px',
                        marginTop: '60px',
                        position: 'relative'
                    }}>
                        {
                            this.state.notInput ?
                                <div className="textContent">
                                    <span className="greyTitle">影集名称</span>
                                    <div className="firstBorder">{this.state.data.albumName}</div>
                                    <span className="greyTitle">创建日期</span>
                                    <div>{new Date(parseInt(this.state.data.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</div>
                                    <span className="greyTitle">浏览次数</span>
                                    <div>{this.state.data.browseCount}</div>
                                    <span className="greyTitle">资源大小</span>
                                    <div>{this.state.data.resourceSize}Mb</div>
                                    <span className="greyTitle">影集描述</span>
                                    <div style={{
                                        height: '80px',
                                        lineHeight: '20px',
                                        overflow: 'auto'
                                    }}>{this.state.data.description}</div>
                                    <span className="greyTitle">联系电话</span>
                                    <div>{this.state.data.contactName}</div>
                                    <span className="greyTitle">联系地址</span>
                                    <div>{this.state.data.address}</div>
                                </div> :
                                <div className="textContent">
                                    <span className="greyTitle">影集名称</span>
                                    <input id="albumName" defaultValue={this.state.data.albumName}
                                           style={{borderTop: 'solid 1px #fafafa'}}/>
                                    <span className="greyTitle">影集描述</span>
                                    <Input type="textarea" rows={4} defaultValue={this.state.data.description}
                                           id="description"
                                           style={{height: '80px', lineHeight: '20px', overflow: 'auto'}}/>
                                    <span className="greyTitle">联系电话</span>
                                    <input defaultValue={this.state.data.contactName} id="contactName"/>
                                    <span className="greyTitle">联系地址</span>
                                    <input defaultValue={this.state.data.address} id="address"/>
                                </div>
                        }
                        <div className="imgContent">
                            {this.coverImageBuilder()}
                        </div>
                        <div className="imgContent" style={{marginTop: '180px'}}>
                            <img src={`${host}/api/QRCode/album?id=${this.props.params.id}`}/>
                            <p style={{textAlign: 'center'}}>扫描获取影集资源<br/>*右键另存为图片可保存该二维码</p>
                        </div>
                    </div>
                    <div className="littleTitle">资源详情
                        {cookie.get('roleId') === '2' ? <div className="spot2"/> : <div className="spot"/>}
                        {cookie.get('roleId') === '2' ?
                            <div className="addTitle" onClick={this.changePartTwo}>再加一组</div> : ''}
                    </div>
                    <VideoBuild
                        photoList={this.state.data.photoList}
                        visible={this.state.videoVisible}
                        videoDelete={this.videoDel}
                        videoUpdate={this.videoUpdate}
                    />
                </div>
                {cookie.get('roleId') === '2' ?
                    <Modal key={this.state.newKey} title="添加一组" visible={this.state.visible}
                           onOk={this.handleOk} onCancel={this.handleCancel}
                    >
                        <Upload
                            className="avatar-uploader"
                            name="file"
                            showUploadList={true}
                            action={qiNiu}
                            beforeUpload={this.beforeUploadOther}
                            onChange={this.handleChangeOther}
                            data={this.headersBuilderOther}
                            multiple={true}
                            onRemove={this.removeFile}
                        >
                            <Icon type="plus" className="avatar-uploader-trigger"/>
                            *请上传一组，并且图片与视频名字相同
                        </Upload>
                    </Modal> :
                    <Modal key={this.state.newKey} title="拒绝理由" visible={this.state.visible}
                           onOk={this.handleOk} onCancel={this.handleCancel}>
                        <Input onChange={this.refuse} autosize={{minRows: 4, maxRows: 6}} type="textarea"
                               placeholder="客户说，拒绝的话要给个说法"/>
                    </Modal>
                }
            </div>
        )
    }
}

