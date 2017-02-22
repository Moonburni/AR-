import React from 'react'
import {Breadcrumb, Input, Carousel, Modal, Button} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import {getSingleDataImg, delSingleDataImg} from '../../services/service'
import {host} from "../../../config"
import './studioDetail.css'

const confirm = Modal.confirm;

export default class StudioDetail extends React.Component {


    state = {
        data: {
            photoList: [{
                imageUrl: ''
            }],
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

    // componentDidMount(){
    //   console.log(this.state.data.photoList);
    // }

    render = () => {
        const del = ()=> {
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

        const change = () => {
            hashHistory.push(`/change/${this.props.params.id}`)
        };

        const carouselBuild =()=>{
            if(this.state.data.photoList[0].imageUrl === ''){
                return ''
            }else{
                if(this.state.data.photoList.length > 1){
                    return(
                        <Carousel autoplay>
                            {
                                this.state.data.photoList.map((item, index)=> {
                                    return (
                                        <div key={index}><img src={`${item.imageUrl}?imageView2/1/w/348/h/348`}/>
                                        </div>
                                    )
                                })}
                        </Carousel>
                    )
                }else if(this.state.data.photoList.length === 1){
                    return(
                        <div><img src={`${this.state.data.photoList[0].imageUrl}?imageView2/1/w/348/h/348`}/></div>
                    )
                }
            }
        };

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
                    <div className="btn" onClick={change}>更 新</div>
                    <div className="btn" onClick={del}>删 除</div>
                    <div style={{
                        width: '952px',
                        margin: 'auto',
                        height: '514px',
                        marginTop: '60px',
                        position: 'relative'
                    }}>
                        <div className="textContent">
                            <span>公司名称</span>
                            <div id="companyName "
                                 style={{borderTop: 'solid 1px #fafafa'}}>{this.state.data.companyName}</div>
                            <span>创建日期</span>
                            <div
                                id="createTime">{new Date(parseInt(this.state.data.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</div>
                            <span>浏览次数</span>
                            <div id="browseCount">{this.state.data.browseCount}</div>
                            <span>资源大小</span>
                            <div id="resourceSize">{this.state.data.resourceSize}Mb</div>
                            <span>公司详情</span>
                            <div id="description " style={{height: '80px',lineHeight:'20px',overflow:'auto'}}>{this.state.data.description}</div>
                            <span>联系电话</span>
                            <div id="contactNum">{this.state.data.contactNum}</div>
                            <span>联系地址</span>
                            <div id="address">{this.state.data.address}</div>
                            <span>链接1</span>
                            <div id="contact1">{this.state.data.linkList[0].linkName}:<a href={`${this.state.data.linkList[0].linkUrl}`}>{this.state.data.linkList[0].linkUrl}</a></div>
                            <span>链接2</span>
                            <div id="contact2">{this.state.data.linkList[1].linkName}:<a href={`${this.state.data.linkList[1].linkUrl}`}>{this.state.data.linkList[1].linkUrl}</a></div>
                            <span>链接3</span>
                            <div id="contact3">{this.state.data.linkList[2].linkName}:<a href={`${this.state.data.linkList[2].linkUrl}`}>{this.state.data.linkList[2].linkUrl}</a></div>
                        </div>
                        <div className="imgContent">
                            {
                                carouselBuild()
                            }
                        </div>
                        <div className="imgContent" style={{marginTop:'220px'}}>
                            <img src={`${host}/api/QRCode/cloudImage?id=${this.props.params.id}`}/>
                            <p style={{textAlign:'center'}}>扫描获取名片资源<br/>*右键另存为图片可保存该二维码</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
