import React from 'react'
import {Breadcrumb, Upload, Icon, message, Input, notification} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import './creat.css'
import {qiNiu, qiNiuDomain} from '../../../config'
import {postData} from '../../services/service'
import cookie from 'js-cookie';

export default class Create extends React.Component {

  state = {
    imageUrl: '',
    imageUrl1: '',
    coverImageUrl: '',
    data: '',
    fileList: [],
    photoList:[],
    lastList:[],
    lastWeight:'',
    fileWeight:0
  };

  handleChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({
        coverImageUrl: qiNiuDomain + '/' + info.file.response.key,
        imageUrl:qiNiuDomain + '/' + info.file.response.key
      })
    }
  };

  handleChangeOther = (info) => {
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, imageUrl1 => this.setState({imageUrl1}));
      console.log(info);
      this.state.lastList = info.fileList.concat(this.state.fileList);
      if(info.file.type === 'video/mp4'){
        console.log(this.state.fileWeight);
        this.state.fileWeight = parseFloat(this.state.fileWeight) + parseFloat(info.file.size / 1024 /1024);
        console.log(this.state.fileWeight);
      }
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
      this.openNotificationWithIcon('error', '图片必须小于2MB!');
    }
    return isLt2M;
  };


  beforeUploadOther = (file)=> {
    const isLt200K = ()=> {
      if (file.type.indexOf('image/') === -1 && file.size / 1024 / 100 < 2) {
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
    if (!isLt200K()) {
      this.openNotificationWithIcon('error', '图片必须小于200k!');
    }
    return isType() && isLt200K();
  };

  openNotificationWithIcon = (type, text) => (
    notification[type]({
      message: '上传错误',
      description: text,
    })
  );

  unique =(array)=>
  {
    var n = [];
    for(var i = 0; i < array.length; i++)
    {
      if (n.indexOf(array[i].imageUrl) == -1) n.push(array[i]);
    }
    return n;
  };

  render = () => {

    const imageUrl = this.state.imageUrl;
    const imageUrl1 = this.state.imageUrl1;

    const move = () => {
      let data = {
        address: document.getElementById('address').value,
        albumName: document.getElementById('albumName').value,
        author: document.getElementById('author').value,
        coverImageUrl: this.state.coverImageUrl,
        description: document.getElementById('description').value,
      };
      if (data.address && data.albumName && data.author && data.coverImageUrl && data.description != '') {
        this.state.data = data;
        document.getElementById('createContent').className = 'createContent move';
        document.documentElement.scrollTop = document.body.scrollTop = 0;
      } else {
        message.error('请填写所有信息', 3)
      }
    };
    const moveOther = () => {
      this.state.fileList = this.state.lastList;
      let img = this.state.lastList.filter((item, index)=> {
        return (item.type.indexOf('image/') != -1)
      });
      let video = this.state.lastList.filter((item, index)=> {
        return (item.type.indexOf('video/mp4') != -1)
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
              videoUrl: qiNiuDomain + '/' + name + '.mp4'
            }
          )
        }
      });

      if(lost.length > 0){
        console.log(lost);
        let lostName = '';
        lost.forEach((item)=>{
          lostName +=(''+ item + '')
        });
        console.log(lostName);
        message.error('请提交'+lostName+'的对应文件',3);
        lost = [];
      }else if(video.length > img.length){
        message.error('请提交与视频的对应的图片',3);
      }
      else{
        if(this.state.fileList.length === 0){
          message.error('请上传图片与视频',3)
        }else{
          let upData ={
            address: document.getElementById('address').value,
            albumName: document.getElementById('albumName').value,
            author: document.getElementById('author').value,
            coverImageUrl: this.state.coverImageUrl,
            description: document.getElementById('description').value,
            photoList:this.unique(data),
            resourceSize:this.state.fileWeight.toFixed(2)
          };
          console.log(upData);
          postData(upData).then(({jsonResult})=>{
            console.log(jsonResult);
            if(jsonResult.success === true){
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

    return (
      <div className="create">
        <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
        <div style={{marginLeft: '16px', marginBottom: '32px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>影集管理</Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/app">影集列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/create">创建影集</Link></Breadcrumb.Item>
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
                <p>上传封面<span>（图片建议比例 8:15）</span></p>
                <div style={{width: '300px', height: '160px', marginTop: '24px'}}>
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
                        <img src={`${imageUrl}?imageView2/1/w/300/h/160`} role="presentation" className="avatar"/> :
                        <Icon type="plus" className="avatar-uploader-trigger"/>
                    }
                  </Upload>
                </div>
                <p>影集名称</p>
                <Input placeholder="请输入影集名称" id="albumName"/>
                <p>作者</p>
                <Input placeholder="请输入作者名称" id="author"/>
                <p>影集描述</p>
                <Input type="textarea" rows={2} placeholder="请输入影集描述" id="description"/>
                <p>联系电话</p>
                <Input placeholder="请输入联系电话" id="contactName"/>
                <p>联系地址</p>
                <Input placeholder="请输入联系地址" id="address"/>
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
                <p>批量上传资源<span>（图片建议比例 15:8）</span></p>
                <div style={{width: '300px', height: '160px', marginTop: '24px'}}>
                  <Upload
                    className="avatar-uploader"
                    name="file"
                    showUploadList={true}
                    action={qiNiu}
                    beforeUpload={this.beforeUploadOther}
                    onChange={this.handleChangeOther}
                    data={headersBuilderOther}
                    multiple={true}
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
                  marginLeft:'350px',
                  marginTop:'-160px',
                  borderRadius:'5px 0 0 5px'
                }}/>
                <span>*请图片对应视频，并且名字相同</span>
                <div className="btn" onClick={moveOther} style={{marginLeft: 'calc(50% - 76px)'}}>下一步</div>
              </div>
            </div>
            <div className="box">
              <div className="createTitle">
                <div/>
                <div/>
                <div/>
              </div>
              <div className="box1Content" style={{marginLeft: '350px'}}>
                <p>内容已提交，请等待审核</p>
                <div style={{width: '300px', height: '160px', marginTop: '24px'}}>

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

