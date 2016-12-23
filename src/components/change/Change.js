import React from 'react'
import {Breadcrumb, Upload, Icon, message, Input, notification} from 'antd'
import {RouteHandler, hashHistory, Link} from "react-router"
import {qiNiu, qiNiuDomain, qiNiuBucket} from '../../../config'
import {changeDataImg, getSingleDataImg, getQiNiuData} from '../../services/service'
import cookie from 'js-cookie'
const InputGroup = Input.Group;
let init = 0;
export default class Change extends React.Component {


    state = {
        imageUrl: '',
        imageUrl1: '',
        coverImageUrl: '',
        data: {
            address: '',
            companyName: '',
            author: '',
            coverImageUrl: '',
            description: '',
            photoList: [],
            linkList:[
                {
                    linkName:'',
                    linkUrl:''
                },
                {
                    linkName:'',
                    linkUrl:''
                },
                {
                    linkName:'',
                    linkUrl:''
                }
            ]
        },
        fileList: [],
        photoList: [],
        lastList: [],
        lastWeight: '',
        fileWeight: 0,
        initList:[],
        loading:false,
    };

    componentWillMount = () => {
        let stringList = [];
        let dataSize = 0;
        getSingleDataImg(this.props.params.id)
            .then(({jsonResult}) => {
                // console.log(jsonResult.data);
                this.setState({
                    data: jsonResult.data,
                    coverImageUrl: jsonResult.data.coverImageUrl,
                    imageUrl: jsonResult.data.coverImageUrl,
                    fileWeight: jsonResult.data.resourceSize
                });
                jsonResult.data.photoList.forEach((item)=> {
                    stringList.push(item.imageUrl.substr(item.imageUrl.lastIndexOf('/') + 1, item.imageUrl.length));
                    stringList.push(item.videoUrl.substr(item.videoUrl.lastIndexOf('/') + 1, item.videoUrl.length));
                });
                console.log(stringList);

                Promise.all(stringList.map((item) => getQiNiuData(item)))
                    .then(jsonResults => {
                        console.log(jsonResults);
                        let datas = jsonResults.map(({jsonResult}, index) => ({
                            name: stringList[index],
                            size: jsonResult.data.fsize,
                            type: jsonResult.data.mimeType,
                            status: 'done',
                            uid: -index - 1,
                            url: qiNiuDomain + '/photo/' + stringList[index],
                            response:{
                                key:'photo/' + stringList[index]
                            }
                        }));
                        datas.forEach((item,index)=>{
                            if(item.type === 'video/mp4'){
                                dataSize += item.size
                            }
                        });
                        this.setState({
                            fileList: datas,
                            lastList:datas,
                            initList:datas,
                            fileWeight:dataSize / 1024 / 1024
                        })
                    });
            });
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

    handleChangeOther = (info) => {
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl1 => this.setState({imageUrl1}));
            // console.log(info);
            this.state.lastList = info.fileList.concat(this.state.fileList);
            // console.log(this.state.lastList);
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
        reader.readAsDataURL(img);
    };

    beforeUpload = (file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            // message.error('图片必须小于2MB!');
            this.openNotificationWithIcon('error', '图片必须小于2MB!');
        }
        return isLt2M;
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
            this.openNotificationWithIcon('error', '图片必须小于2M!');
        }

        if (!isLt20MB()) {
            this.openNotificationWithIcon('error', '视频必须小于100MB!');
        }
        return isType() && isLt2MB() && isLt20MB();
    };

    openNotificationWithIcon = (type, text) => (
        notification[type]({
            message: '上传错误',
            description: text,
        })
    );

    removeFile = (file)=> {
        if(file.type === 'video/mp4'){
            // console.log(this.state.fileWeight);
            this.state.fileWeight = parseFloat(this.state.fileWeight) - parseFloat(file.size / 1024 /1024);
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

    render = () => {

        const imageUrl = this.state.imageUrl;
        const imageUrl1 = this.state.imageUrl1;

        const move = () => {
            let data = {
                address: document.getElementById('address').value || this.state.data.address,
                companyName: document.getElementById('companyName').value || this.state.data.companyName,
                coverImageUrl: this.state.coverImageUrl,
                description: document.getElementById('description').value || this.state.data.description,
                contactNum: document.getElementById('contactNum').value || this.state.data.contactNum,
                linkList:[
                    {
                        linkName:document.getElementById('input-small1').value || this.state.data.linkList[0].linkName,
                        linkUrl:document.getElementById('input-big1').value || this.state.data.linkList[0].linkUrl
                    },
                    {
                        linkName:document.getElementById('input-small2').value || this.state.data.linkList[1].linkName,
                        linkUrl:document.getElementById('input-big2').value || this.state.data.linkList[1].linkUrl
                    },
                    {
                        linkName:document.getElementById('input-small3').value || this.state.data.linkList[2].linkName,
                        linkUrl:document.getElementById('input-big3').value || this.state.data.linkList[2].linkUrl
                    }
                ]
            };
            // console.log(data);
            if (data.contactNum && data.address && data.companyName &&  data.coverImageUrl && data.description != '') {
                // console.log(this.state);
                document.getElementById('createContent').className = 'createContent move';
                document.documentElement.scrollTop = document.body.scrollTop = 0;
            } else {
                message.error('请填写所有信息', 3)
            }
        };
        const moveOther = () => {
            // console.log(this.state.lastList);
            if(this.state.lastList.length > 0){
                this.state.fileList = this.unique(this.state.lastList);
                // console.log(this.state.fileList);
                let img = this.state.fileList.filter((item, index)=> {
                    return (item.type.indexOf('image/') != -1 && item.status === "done")
                });
                let video = this.state.fileList.filter((item, index)=> {
                    return (item.type.indexOf('video/mp4') != -1 && item.status === "done")
                });
                // console.log(img);
                // console.log(video);
                let data = [];
                let lost = [];
                img.map((item, index)=> {
                    let name = item.name.substring(0, item.name.indexOf('.'));
                    // console.log(name);
                    // console.log(video);
                    // video.forEach(item => console.log(item));
                    // console.log(video.some(item => item.name.indexOf(name) != -1));
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
                // console.log(img);
                // console.log(video);
                // console.log(data);
                // console.log(lost);
                if (lost.length > 0) {
                    // console.log(lost);
                    let lostName = '';
                    lost.forEach((item)=> {
                        lostName += ('' + item + '')
                    });
                    // console.log(lostName);
                    message.error('请提交' + lostName + '的对应文件', 3);
                    lost = [];
                } else if (video.length > img.length) {
                    message.error('请提交与视频的对应的图片', 3);
                }else if(data.length === 0){
                    message.error('视频和图片不能为空', 3);
                }
                else {
                    if (this.state.fileList.length === 0) {
                        let upData = {
                            cloudImageId: this.state.data.cloudImageId,
                            address: document.getElementById('address').value || this.state.data.address,
                            companyName: document.getElementById('companyName').value || this.state.data.companyName,
                            coverImageUrl: this.state.coverImageUrl,
                            description: document.getElementById('description').value || this.state.data.description,
                            photoList: this.state.data.photoList,
                            contactNum: document.getElementById('contactNum').value || this.state.data.contactNum,
                            resourceSize: this.state.fileWeight.toFixed(2),
                            linkList:[
                                {
                                    linkName:document.getElementById('input-small1').value || this.state.data.linkList[0].linkName,
                                    linkUrl:document.getElementById('input-big1').value || this.state.data.linkList[0].linkUrl
                                },
                                {
                                    linkName:document.getElementById('input-small2').value || this.state.data.linkList[1].linkName,
                                    linkUrl:document.getElementById('input-big2').value || this.state.data.linkList[1].linkUrl
                                },
                                {
                                    linkName:document.getElementById('input-small3').value || this.state.data.linkList[2].linkName,
                                    linkUrl:document.getElementById('input-big3').value || this.state.data.linkList[2].linkUrl
                                }
                            ]
                        };
                        // console.log(upData);
                        changeDataImg(upData).then(({jsonResult})=> {
                            // console.log(jsonResult);
                            if (jsonResult.success === true) {
                                document.getElementById('createContent').className = 'createContent move moveOther';
                                document.documentElement.scrollTop = document.body.scrollTop = 0
                            }
                        })
                    } else {
                        let upData = {
                            cloudImageId: this.state.data.cloudImageId,
                            address: document.getElementById('address').value || this.state.data.address,
                            companyName: document.getElementById('companyName').value || this.state.data.companyName,
                            coverImageUrl: this.state.coverImageUrl,
                            description: document.getElementById('description').value || this.state.data.description,
                            photoList: data,
                            resourceSize: this.state.fileWeight.toFixed(2),
                            linkList:[
                                {
                                    linkName:document.getElementById('input-small1').value || this.state.data.linkList[0].linkName,
                                    linkUrl:document.getElementById('input-big1').value || this.state.data.linkList[0].linkUrl
                                },
                                {
                                    linkName:document.getElementById('input-small2').value || this.state.data.linkList[1].linkName,
                                    linkUrl:document.getElementById('input-big2').value || this.state.data.linkList[1].linkUrl
                                },
                                {
                                    linkName:document.getElementById('input-small3').value || this.state.data.linkList[2].linkName,
                                    linkUrl:document.getElementById('input-big3').value || this.state.data.linkList[2].linkUrl
                                }
                            ]
                        };
                        // console.log(upData);
                        changeDataImg(upData).then(({jsonResult})=> {
                            // console.log(jsonResult);
                            if (jsonResult.success === true) {
                                document.getElementById('createContent').className = 'createContent move moveOther';
                                document.documentElement.scrollTop = document.body.scrollTop = 0
                            }
                        })
                    }
                }
            }else {
                message.error('请加入图片和视频',3)
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

        const upLoad = ()=> {
            let initList = this.state.initList;
            // console.log(initList);
            // console.log( this.state.fileList);
            if (initList.length > 0 || init === 1 ) {
                init = 1;
                return (
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
                        defaultFileList={initList}
                    >
                        {
                            imageUrl1 ?
                                <Icon type="plus" className="avatar-uploader-trigger"/> :
                                <Icon type="plus" className="avatar-uploader-trigger"/>
                        }
                    </Upload>
                )
            }
        };

        return (
            <div className="create">
                <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
                <div style={{marginLeft: '16px', marginBottom: '12px'}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>云图管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/studioList">云图列表</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link
                            to={`/studioDetail/${this.props.params.id}`}>云图详情</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/change/${this.props.params.id}`}>修改云图</Link></Breadcrumb.Item>
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
                                <p style={{width:'100%'}}>上传封面<span>（图片建议比例 8:15）</span></p>
                                <div style={{width: '300px', height: '160px', paddingTop: '18px',clear:'both',marginBottom:'24px'}}>
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
                                <Input placeholder={this.state.data.companyName} id="companyName"/>
                                <p>公司描述</p>
                                <Input type="textarea" rows={2} placeholder={this.state.data.description}
                                       id="description"/>
                                <p>联系电话</p>
                                <Input placeholder={this.state.data.contactNum} id="contactNum"/>
                                <p>联系地址</p>
                                <Input placeholder={this.state.data.address} id="address"/>
                                <p>链接1</p>
                                <InputGroup>
                                    <Input placeholder={this.state.data.linkList[0].linkName} className="input-small" id="input-small1"/>
                                    <Input placeholder={this.state.data.linkList[0].linkUrl} className="input-big" id="input-big1"/>
                                </InputGroup>
                                <p>链接2</p>
                                <InputGroup>
                                    <Input placeholder={this.state.data.linkList[1].linkName} className="input-small" id="input-small2"/>
                                    <Input placeholder={this.state.data.linkList[1].linkUrl} className="input-big" id="input-big2"/>
                                </InputGroup>
                                <p>链接3</p>
                                <InputGroup>
                                    <Input placeholder={this.state.data.linkList[2].linkName} className="input-small" id="input-small3"/>
                                    <Input placeholder={this.state.data.linkList[2].linkUrl} className="input-big" id="input-big3"/>
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
                                <p style={{width:'100%'}}>批量上传资源<span>（图片建议比例 15:8）</span></p>
                                <div style={{width: '300px', height: '160px', paddingTop: '18px',clear:'both',marginBottom:'24px'}}>
                                    {upLoad()}
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
                                <p style={{width:'100%'}}>影集更新成功</p>
                                <div style={{width: '300px', height: '160px', marginTop: '24px',clear:'both'}}>

                                </div>
                                <div className="btn" style={{marginLeft: '76px'}}><Link to="/app">返回影集列表</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
