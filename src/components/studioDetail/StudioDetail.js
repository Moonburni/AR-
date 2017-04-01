import React from 'react'
import {Icon, Breadcrumb, Input, Carousel, Upload, Modal, Button, notification, message} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import {qiNiu} from '../../../config'
import {
    getSingleDataImg,
    delSingleDataImg,
    verify,
    changeDataImg,
    postNewImg,
    changeSingleDataImg
} from '../../services/service'
import VideoBuild from './VideoBuild'
import {host, qiNiuDomain, qiNiuBucket} from "../../../config"
import './studioDetail.css'
import cookie from 'js-cookie'
const InputGroup = Input.Group;
const confirm = Modal.confirm;

export default class StudioDetail extends React.Component {


    state = {
        data: {
            admin: {},
            photoList: [{
                imageUrl: ''
            }],
            linkList: [
                {
                    linkName: '',
                    linkUrl: ''
                },
                {
                    linkName: '',
                    linkUrl: ''
                },
                {
                    linkName: '',
                    linkUrl: ''
                }
            ]

        },
        videoVisible: true,
        notInput: true,
        visible: false,
        newList: {},
        newKey: 0,
        update: false,
        refuse: ''
    };

    handleOk = (e) => {
        if (cookie.get('roleId') === '2') {
            if (this.state.newList.imageUrl.substring(0, this.state.newList.imageUrl.indexOf('.'))
                === this.state.newList.videoUrl.substring(0, this.state.newList.videoUrl.indexOf('.'))) {
                if (this.state.update) {
                    changeSingleDataImg(this.state.updateData.albumId, this.state.updateData.photoId, this.state.newList).then(
                        ()=>getSingleDataImg(this.props.params.id)
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
                    postNewImg(this.state.data.cloudImageId, this.state.newList).then(
                        ()=>getSingleDataImg(this.props.params.id)
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
                verify(this.state.data.cloudImageId, this.state.refuse).then(
                    ()=>getSingleDataImg(this.props.params.id)
                        .then(({jsonResult}) => {
                            // console.log(jsonResult.data);
                            this.setState({
                                data: jsonResult.data,
                                visible: false,
                                newKey: this.state.newKey + 1
                            },()=>message.success('操作成功'));
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

    openNotificationWithIcon = (type, text) => (
        notification[type]({
            message: '上传错误',
            description: text,
        })
    );

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

    beforeUpload = (file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            // message.error('图片必须小于2MB!');
            this.openNotificationWithIcon('error', '图片必须小于2MB!');
        }
        return isLt2M;
    };

    componentWillMount() {
        getSingleDataImg(this.props.params.id)
            .then(({jsonResult}) => {
                console.log(jsonResult.data);
                this.setState({
                    data: jsonResult.data
                });
            });
    }

    del = ()=> {
        let that = this.props.params.id;
        // console.log(this.props.params.id);
        confirm({
            title: '是否删除此影集?',
            content: '删除后将不可恢复',
            onOk() {
                delSingleDataImg(that)
                    .then(({jsonResult})=> {
                        if (jsonResult.success) {
                            hashHistory.push('/cloud')
                        }
                    });
            },
            onCancel() {
            },
        });
    };

    changePartOne = () => {
        if (this.state.notInput) {
            this.setState({
                notInput: !this.state.notInput
            })
        } else {
            let data = {
                adminId: cookie.get('adminId'),
                cloudImageId: this.state.data.cloudImageId,
                coverImageUrl: this.state.data.coverImageUrl,
                companyName: document.getElementById('companyName').value,
                description: document.getElementById('description').value,
                contactNum: document.getElementById('contactNum').value,
                address: document.getElementById('address').value,
                linkList: [
                    {
                        linkName: document.getElementById('linkName1').value,
                        linkUrl: document.getElementById('linkUrl1').value
                    },
                    {
                        linkName: document.getElementById('linkName2').value,
                        linkUrl: document.getElementById('linkUrl2').value
                    },
                    {
                        linkName: document.getElementById('linkName3').value,
                        linkUrl: document.getElementById('linkUrl3').value
                    }
                ]

            };
            // console.log(data);
            changeDataImg(data).then(({jsonResult})=> {
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

    refuse = (e)=> {
        this.setState({
            refuse: e.target.value
        })
    };

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

    pass = ()=> {
        let that = this.state.data.cloudImageId;
        let thatId = this.props.params.id;
        let _this = this;
        confirm({
            title: '审核',
            content: '确认通过审核？',
            onOk() {
                verify(that).then(()=>{
                    message.success('操作成功');
                        getSingleDataImg(thatId)
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

    videoDel = (value)=> {
        return ()=> {
            // console.log(value);
            confirm({
                title: '是否删除此影集?',
                content: '删除后将不可恢复',
                onOk() {
                    delSingleDataImg(value.albumId, value.photoId)
                        .then(({jsonResult})=> {
                            if (jsonResult.success) {
                                message.success('删除成功');
                                getSingleDataImg(this.props.params.id)
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
                        <div style={{color: 'green'}}>审核成功（发布成功）</div>
                        {cookie.get('roleId') === '2' ? <div>您可以使用APP进行AR体验啦</div> : ''}
                    </div>
                )
            }else if(this.state.data.state === 2){
                return (
                    <div>
                        <div style={{color: 'green'}}>审核成功（发布失败）</div>
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
                        <Breadcrumb.Item>云图管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/cloud">云图列表</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/change/${this.props.params.id}`}>云图详情</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="detailContent">
                    <div style={this.style.titleBox}>
                        {
                            cookie.get('roleId') === '2' ?
                                <div style={this.style.title}>名片详情</div> :
                                <div>
                                    <div className="btn" onClick={this.changePartTwo}>拒绝</div>
                                    <div className="btn" onClick={this.pass}>通过</div>
                                </div>
                        }
                        {cookie.get('roleId') === '2' ? <div className="deleteTitle" onClick={this.del}>删除</div> : ''}
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
                            <div>联系电话:{this.state.data.contactNum}</div>
                        </div>}
                    <div className="littleTitle">信息详情
                        {cookie.get('roleId') === '2' ? <div className="spot1"/> : <div className="spot"/>}
                        {cookie.get('roleId') === '2' ? <div className="changeTitle"
                                                             onClick={this.changePartOne}>{this.state.notInput ? '修改' : '保存'}</div> : ''}
                    </div>
                    <div style={{
                        width: 'calc(100% - 48px)',
                        margin: 'auto',
                        height: '514px',
                        marginTop: '24px',
                        position: 'relative'
                    }}>
                        {
                            this.state.notInput ?
                                <div className="textContent">
                                    <span className="greyTitle">公司名称</span>
                                    <div className="firstBorder">{this.state.data.companyName}</div>
                                    <span className="greyTitle">创建日期</span>
                                    <div>{new Date(parseInt(this.state.data.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</div>
                                    <span className="greyTitle">浏览次数</span>
                                    <div>{this.state.data.browseCount}</div>
                                    <span className="greyTitle">资源大小</span>
                                    <div>{this.state.data.resourceSize}Mb</div>
                                    <span className="greyTitle">公司详情</span>
                                    <div style={{
                                        height: '80px',
                                        lineHeight: '20px',
                                        overflow: 'auto'
                                    }}>{this.state.data.description}</div>
                                    <span className="greyTitle">联系电话</span>
                                    <div>{this.state.data.contactNum}</div>
                                    <span className="greyTitle">联系地址</span>
                                    <div>{this.state.data.address}</div>
                                    <span className="greyTitle">链接1</span>
                                    <div>{this.state.data.linkList[0].linkName}:<a
                                        href={`${this.state.data.linkList[0].linkUrl}`}>{this.state.data.linkList[0].linkUrl}</a>
                                    </div>
                                    <span className="greyTitle">链接2</span>
                                    <div>{this.state.data.linkList[1].linkName}:<a
                                        href={`${this.state.data.linkList[1].linkUrl}`}>{this.state.data.linkList[1].linkUrl}</a>
                                    </div>
                                    <span className="greyTitle">链接3</span>
                                    <div>{this.state.data.linkList[2].linkName}:<a
                                        href={`${this.state.data.linkList[2].linkUrl}`}>{this.state.data.linkList[2].linkUrl}</a>
                                    </div>
                                </div> :
                                <div className="textContent">
                                    <span className="greyTitle">公司名称</span>
                                    <input defaultValue={this.state.data.companyName} id="companyName"
                                           style={{borderTop: 'solid 1px #fafafa'}}/>
                                    <span className="greyTitle">公司详情</span>
                                    <Input type="textarea" rows={4} defaultValue={this.state.data.description}
                                           id="description"
                                           style={{height: '80px', lineHeight: '20px', overflow: 'auto'}}/>
                                    <span className="greyTitle">联系电话</span>
                                    <input defaultValue={this.state.data.contactNum} id="contactNum"/>
                                    <span className="greyTitle">联系地址</span>
                                    <input defaultValue={this.state.data.address} id="address"/>
                                    <span className="greyTitle">链接1</span>
                                    <InputGroup>
                                        <Input id='linkName1' defaultValue={this.state.data.linkList[0].linkName}
                                               placeholder="链接名"/>
                                        <Input id="linkUrl1" defaultValue={this.state.data.linkList[0].linkUrl}
                                               placeholder="链接地址"/>
                                    </InputGroup>
                                    <span className="greyTitle">链接2</span>
                                    <InputGroup>
                                        <Input id='linkName2' defaultValue={this.state.data.linkList[1].linkName}
                                               placeholder="链接名"/>
                                        <Input id="linkUrl2" defaultValue={this.state.data.linkList[1].linkUrl}
                                               placeholder="链接地址"/>
                                    </InputGroup>
                                    <span className="greyTitle">链接3</span>
                                    <InputGroup>
                                        <Input id='linkName3' defaultValue={this.state.data.linkList[2].linkName}
                                               placeholder="链接名"/>
                                        <Input id="linkUrl3" defaultValue={this.state.data.linkList[2].linkUrl}
                                               placeholder="链接地址"/>
                                    </InputGroup>
                                </div>
                        }
                        <div className="imgContent">
                            {this.coverImageBuilder()}
                        </div>
                        <div className="imgContent" style={{marginTop: '220px'}}>
                            <img src={`${host}/api/QRCode/cloudImage?id=${this.props.params.id}`}/>
                            <p style={{textAlign: 'center'}}>扫描获取名片资源<br/>*右键另存为图片可保存该二维码</p>
                        </div>
                    </div>
                    <div className="littleTitle">资源详情
                       <div className="spot"/>
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
                           onOk={this.handleOk} onCancel={this.handleCancel}>
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
