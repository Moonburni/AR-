import React from 'react'
import {Icon,Tooltip } from 'antd'
import './studioDetail.css'
import cookie from 'js-cookie'

export default class VideoBuild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoVisible: this.props.visible
        }
    }

    style = {
        videoBox: {
            margin: 'auto',
            marginTop: '20px',
            width: 'calc(100% - 48px)',
            display: 'flex',
            justifyContent: 'flex-start',
            flexFlow: 'row wrap'
        }
    };

    videoVisible(index) {
        let name = `video${index}`;
        let boxName = `videoBox${index}`;
        if (this.refs[boxName].style.display != 'none') {
            this.refs[boxName].style.display = 'none'
        } else {
            this.refs[boxName].style.display = 'block'
        }
        this.refs[name].pause();
    }

    ImgVisible(index) {
        let boxName = `ImgBox${index}`;
        if (this.refs[boxName].style.display != 'none') {
            this.refs[boxName].style.display = 'none'
        } else {
            this.refs[boxName].style.display = 'block'
        }
    }

    render() {
        const {photoList, videoDelete, videoUpdate} = this.props;
        return (
            <div style={this.style.videoBox}>
                {photoList ?
                    photoList.map((item, index)=> {
                        return (
                            <div key={index} className="videoLittleBox">
                                <div>
                                    <img onClick={this.ImgVisible.bind(this, index)} style={{cursor:'pointer'}} src={`${item.imageUrl}?imageView2/1/w/285/h/160`}/>
                                    {item.stateComment === null? '':
                                        <Tooltip title={<span>{item.stateComment}</span>}>
                                          <span className="stateComment">发布失败（查看原因)</span>
                                        </Tooltip>
                                    }
                                </div>
                                {
                                    cookie.get('roleId') === '2' ?
                                        <div className="videoAction">
                                            <span onClick={this.videoVisible.bind(this, index)}>查看视频资源</span>
                                            <span onClick={videoUpdate(item)}>更新</span>
                                            {videoDelete(item) === false?'':<span onClick={videoDelete(item)}>删除</span>}
                                        </div> :
                                        <div className="videoAction">
                                            <span onClick={this.videoVisible.bind(this, index)}>查看视频资源</span>
                                        </div>
                                }
                                <div className="videoBg" ref={`videoBox${index}`} style={{display: 'none'}}>
                                    <Icon type="close" className="videoClose"
                                          onClick={this.videoVisible.bind(this, index)}/>
                                    <div>
                                        <video style={{maxWidth: '50%'}} ref={`video${index}`} src={item.videoUrl}
                                               controls="controls"/>
                                    </div>
                                </div>
                                <div className="ImgBg" ref={`ImgBox${index}`} style={{display: 'none'}}>
                                    <Icon type="close" className="ImgClose"
                                          onClick={this.ImgVisible.bind(this, index)}/>
                                    <div>
                                        <img style={{maxWidth: '50%'}} ref={`Img${index}`} src={item.imageUrl}/>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <div>暂无</div>}
            </div>
        )
    }
}