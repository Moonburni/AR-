import React from 'react'
import {Breadcrumb, Upload, Icon, message, Input, notification, Select} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import './creat.css'
import {qiNiu, qiNiuDomain} from '../../../config'
import {postDataImg} from '../../services/service'
import cookie from 'js-cookie';
const InputGroup = Input.Group;
const Option = Select.Option;

export default class Create extends React.Component {

    state = {
        imageUrl: '',
        imageUrl1: '',
        coverImageUrl: '',
        data: '',
        fileList: [],
        photoList: [],
        lastList: [],
        lastWeight: '',
        fileWeight: 0,
        loading: false
    };

    beforeUploadOther = (file)=> {
        const isLt20MB = ()=> {
            if (file.type.indexOf('image/') === -1 && file.size / 1024 / 1024 > 100) {
                return false
            } else {
                return true
            }
        };

        const isLt2MB = ()=> {
            if (file.type.indexOf('video/mp4') === -1 && file.size / 1024 / 1024 > 2) {
                return false
            } else {
                return true
            }
        };

        const isType = ()=> {
            if (file.type.indexOf('image/') === -1 && file.type.indexOf('video/mp4') === -1) {
                return false
            } else {
                return true
            }
        };
        if (!isType()) {
            this.openNotificationWithIcon('error', '只能上传图片或者Mp4格式的视频');
        }
        if (!isLt2MB()) {
            this.openNotificationWithIcon('error', '图片必须小于200k!');
        }

        if (!isLt20MB()) {
            this.openNotificationWithIcon('error', '视频必须小于20MB!');
        }
        return isType() && isLt2MB() && isLt20MB();
    };

    handleChange = (info) => {
        if (info.file.status === 'done') {
        this.setState({
        coverImageUrl: qiNiuDomain + '/' + info.file.response.key,
        imageUrl: qiNiuDomain + '/' + info.file.response.key
    })
    } else if (info.file.status === 'error') {
        message.error('该文件名已存在，请重命名文件', 3)
    }
    };

    beforeUpload = (file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
        this.openNotificationWithIcon('error', '图片必须小于2MB!');
    }
        return isLt2M;
    };

    openNotificationWithIcon = (type, text) => (
        notification[type]({
            message: '上传错误',
            description: text,
        })
    );

    removeFile = (file)=> {
        if (file.type === 'video/mp4') {
            // console.log(this.state.fileWeight);
            this.state.fileWeight = parseFloat(this.state.fileWeight) - parseFloat(file.size / 1024 / 1024);
            // console.log(this.state.fileWeight);
        }
    };

    unique = (array)=> {
        if (array[0].name != undefined) {
            let n = [];
            for (let i = 0; i < array.length; i++) {
                if (n.some(item => item.name.indexOf(array[i].name) != -1) === false) n.push(array[i]);
            }
            return n;
        } else {
            let n = [];
            for (let i = 0; i < array.length; i++) {
                if (n.some(item => item.imageUrl.indexOf(array[i].imageUrl) != -1) === false) n.push(array[i]);
            }
            return n;
        }
    };
    handleChangeOther = (info) => {
        if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl1 => this.setState({imageUrl1}));
        // console.log(info);
        this.state.lastList = info.fileList.concat(this.state.fileList);
        if (info.file.type === 'video/mp4') {
        // console.log(this.state.fileWeight);
        this.state.fileWeight = parseFloat(this.state.fileWeight) + parseFloat(info.file.size / 1024 / 1024);
        // console.log(this.state.fileWeight);
    }
    } else if (info.file.status === 'error') {
        message.error('该文件名已存在，请重命名文件', 3)
    }
    };

    getBase64 = (img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img)
    };

    render = () => {
        const imageUrl = this.state.imageUrl;
        const imageUrl1 = this.state.imageUrl1;
        const move = () => {
            let data = {
                address: document.getElementById('address').value,
                companyName: document.getElementById('companyName').value,
                coverImageUrl: this.state.coverImageUrl,
                description: document.getElementById('description').value,
                contactNum: document.getElementById('contactNum').value
            };
            if (data.contactNum && data.address && data.companyName  && data.coverImageUrl && data.description != '') {
                this.state.data = data;
                document.getElementById('createContent').className = 'createContent move';
                document.documentElement.scrollTop = document.body.scrollTop = 0;
            } else {
                message.error('请填写所有信息', 3)
            }
        };
        const moveOther = () => {
            // console.log(this.state.lastList);
            this.state.fileList = this.unique(this.state.lastList);
            let img = this.state.fileList.filter((item, index)=> {
                return (item.type.indexOf('image/') != -1 && item.status === "done")
            });
            let video = this.state.fileList.filter((item, index)=> {
                return (item.type.indexOf('video/mp4') != -1 && item.status === "done")
            });
            let data = [];
            let lost = [];
            img.map((item, index)=> {
                let name = item.name.substring(0, item.name.indexOf('.'));
                if (video.some(item => item.name.indexOf(name) != -1) === false) {
                    lost.push(name)
                } else {
                    data.push(
                        {
                            imageUrl: qiNiuDomain + '/' + item.response.key,
                            videoUrl: qiNiuDomain + '/photo/' + name + '.mp4'
                        }
                    )
                }
            });

            if (lost.length > 0) {
                console.log(lost);
                let lostName = '';
                lost.forEach((item)=> {
                    lostName += ('' + item + '')
                });
                console.log(lostName);
                message.error('请提交' + lostName + '的对应文件', 3);
                lost = [];
            } else if (video.length > img.length) {
                message.error('请提交与视频的对应的图片', 3);
            }
            else {
                if (this.state.fileList.length === 0) {
                    message.error('请上传图片与视频', 3)
                } else {
                    let upData = {
                        address: document.getElementById('address').value,
                        companyName: document.getElementById('companyName').value,
                        coverImageUrl: this.state.coverImageUrl,
                        description: document.getElementById('description').value,
                        photoList: this.unique(data),
                        resourceSize: this.state.fileWeight.toFixed(2),
                        contactNum: document.getElementById('contactNum').value,
                        linkList:[
                            {
                                linkName:document.getElementById('input-small1').value,
                                linkUrl:document.getElementById('input-big1').value
                            },
                            {
                                linkName:document.getElementById('input-small2').value,
                                linkUrl:document.getElementById('input-big2').value
                            },
                            {
                                linkName:document.getElementById('input-small3').value,
                                linkUrl:document.getElementById('input-big3').value
                            }
                        ]
                    };
                    // console.log(upData);
                    postDataImg(upData).then(({jsonResult})=> {
                        // console.log(jsonResult);
                        if (jsonResult.success === true) {
                            document.getElementById('createContent').className = 'createContent move moveOther';
                            document.documentElement.scrollTop = document.body.scrollTop = 0
                        }
                    })
                }
            }
        };

        const headersBuilder = (file)=> {
            return ({
                token: cookie.get('qiNiuToken'),
                key: 'coverImage/' + file.name
            });
        };

        const headersBuilderOther = (file)=> {
            return ({
                token: cookie.get('qiNiuToken'),
                key: 'photo/' + file.name
            });
        };

        // const selectBefore = (
        //     <Select defaultValue="Http://" style={{ width: 80 }}>
        //         <Option value="Http://">Http://</Option>
        //         <Option value="Https://">Https://</Option>
        //     </Select>
        // );

        return (
            <div className="create">
                <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
                <div style={{marginLeft: '16px', marginBottom: '12px'}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>云图管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/studioList">云图列表</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/create">创建云图</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="createBox">
                    <div className="createContent" id="createContent">
                        <div className="box">
                            <div className="createTitle">
                                <div/>
                                <div/>
                                <div/>
                            </div>
                            <div className="box1Content">
                                <p style={{width: '100%'}}>上传封面<span>（图片建议比例 8:15）</span></p>
                                <div style={{
                                    width: '300px',
                                    height: '160px',
                                    paddingTop: '18px',
                                    clear: 'both',
                                    marginBottom: '24px'
                                }}>
                                    <Upload
                                        className="avatar-uploader"
                                        name="file"
                                        showUploadList={false}
                                        action={qiNiu}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}
                                        data={headersBuilder}
                                    >
                                        {
                                            imageUrl ?
                                                <img src={`${imageUrl}?imageView2/1/w/300/h/160`} role="presentation"
                                                     className="avatar"/> :
                                                <Icon type="plus" className="avatar-uploader-trigger"/>
                                        }
                                    </Upload>
                                </div>
                                <p>公司名称</p>
                                <Input placeholder="请输入公司名称" id="companyName"/>
                                <p>公司介绍</p>
                                <Input type="textarea" rows={2} placeholder="请输入公司介绍" id="description"/>
                                <p>联系电话</p>
                                <Input placeholder="请输入联系电话" id="contactNum"/>
                                <p>联系地址</p>
                                <Input placeholder="请输入联系地址" id="address"/>
                                <p>链接1</p>
                                <InputGroup>
                                    <Input placeholder="链接名" className="input-small" id="input-small1"/>
                                    <Input placeholder="链接地址(选填),如www.xxx.com" className="input-big" id="input-big1"/>
                                </InputGroup>
                                <p>链接2</p>
                                <InputGroup>
                                    <Input placeholder="链接名" className="input-small" id="input-small2"/>
                                    <Input placeholder="链接地址(选填),如www.xxx.com" className="input-big" id="input-big2"/>
                                </InputGroup>
                                <p>链接3</p>
                                <InputGroup>
                                    <Input placeholder="链接名" className="input-small" id="input-small3"/>
                                    <Input placeholder="链接地址(选填),如www.xxx.com" className="input-big" id="input-big3"/>
                                </InputGroup>
                            </div>
                            <div className="btn" style={{marginLeft: 'calc(50% - 76px)'}} onClick={move}>下一步</div>
                        </div>
                        <div className="box">
                            <div className="createTitle">
                                <div/>
                                <div/>
                                <div/>
                            </div>
                            <div className="box1Content">
                                <p style={{width: '100%'}}>批量上传资源<span>（图片建议比例 15:8）</span></p>
                                <div style={{
                                    width: '300px',
                                    height: '160px',
                                    paddingTop: '18px',
                                    clear: 'both',
                                    marginBottom: '24px'
                                }}>
                                    <Upload
                                        className="avatar-uploader"
                                        name="file"
                                        showUploadList={true}
                                        action={qiNiu}
                                        beforeUpload={this.beforeUploadOther}
                                        onChange={this.handleChangeOther}
                                        data={headersBuilderOther}
                                        multiple={true}
                                        onRemove={this.removeFile}
                                    >
                                        {
                                            imageUrl1 ?
                                                <Icon type="plus" className="avatar-uploader-trigger"/> :
                                                <Icon type="plus" className="avatar-uploader-trigger"/>
                                        }
                                    </Upload>
                                </div>
                                <span style={{
                                    position: 'absolute',
                                    width: '300px',
                                    height: '160px',
                                    backgroundColor: '#fafafa',
                                    display: 'block',
                                    marginLeft: '350px',
                                    marginTop: '-160px',
                                    borderRadius: '5px 0 0 5px'
                                }}/>
                                <span>*请图片对应视频，并且名字相同</span>
                                <div className="btn" onClick={moveOther} style={{marginLeft: 'calc(50% - 76px)'}}>下一步
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="createTitle">
                                <div/>
                                <div/>
                                <div/>
                            </div>
                            <div className="box1Content" style={{marginLeft: '350px'}}>
                                <p style={{width: '100%'}}>内容已提交，请等待审核</p>
                                <div style={{width: '300px', height: '160px', marginTop: '24px', clear: 'both'}}>

                                </div>
                                <div className="btn" style={{marginLeft: '76px'}}><Link to="/cloud">返回影集列表</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
