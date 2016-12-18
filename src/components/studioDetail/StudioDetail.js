import React from 'react'
import {Breadcrumb, Input, Carousel, Modal, Button} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import {getSingleData, delSingleData} from '../../services/service'
import './studioDetail.css'

const confirm = Modal.confirm;

export default class StudioDetail extends React.Component {


  state = {
    data: {
      photoList: []
    },
  };

  componentWillMount() {
    getSingleData(this.props.params.id)
      .then(({jsonResult}) => {
        // console.log(jsonResult);
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
          delSingleData(that)
            .then(({jsonResult})=> {
              if (jsonResult.success) {
                hashHistory.push('/app')
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

    return (
      <div className="detail">
        <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
        <div style={{marginLeft: '16px', marginBottom: '32px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>影集管理</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/app">影集列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={`/change/${this.props.params.id}`}>影集详情</Link></Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="detailContent">
          <div className="btn" onClick={change}>修 改</div>
          <div className="btn" onClick={del}>删 除</div>
          <div style={{width: '952px', margin: 'auto', height: '514px', marginTop: '80px', position: 'relative'}}>
            <div className="textContent">
              <span>影集名称</span>
              <div id="albumName" style={{borderTop: 'solid 1px #fafafa'}}>{this.state.data.albumName}</div>
              <span>作者</span>
              <div id="author">{this.state.data.author}</div>
              <span>创建日期</span>
              <div
                id="createTime">{new Date(parseInt(this.state.data.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</div>
              <span>浏览次数</span>
              <div id="browseCount">{this.state.data.browseCount}</div>
              <span>资源大小</span>
              <div id="resourseSize">{this.state.data.resourseSize}</div>
              <span>影集描述</span>
              <div id="description " style={{height: '120px'}}>{this.state.data.description}</div>
              <span>联系电话</span>
              <div id="contactName">{this.state.data.contactName}</div>
              <span>联系地址</span>
              <div id="address">{this.state.data.address}</div>
            </div>
            <div className="imgContent">
              <Carousel autoplay>
                <div key='999' style={{
                  width: '300px',
                  margin: "auto",
                  fontSize: '38px',
                  textAlign: 'center',
                  paddingTop: '30px',
                  lineHeight:'48px'
                }}>{this.state.data.albumName}
                </div>
                {
                  this.state.data.photoList.map((item, index)=> {
                    return (
                      <div key={index}><img src={`${item.imageUrl}?imageView2/1/w/348/h/400`}/></div>
                    )
                  })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
