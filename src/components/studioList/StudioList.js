import React from 'react'
import {Breadcrumb, BackTop} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import './list.css'
import {getData} from '../../services/service'


export default class StudioList extends React.Component {

    state = {
        data: [],
        display: 0,
        loading: 1
    };

    componentDidMount = () => {
        // document.body.scrollTop = document.body.scrollHeight - document.body.clientHeight;
        let scrollNum = 1;
        console.log(scrollNum);
        getData(scrollNum)
            .then(({jsonResult})=> {
                console.log(jsonResult);
                this.setState({
                    data: this.unique(this.state.data.concat(jsonResult.data.list))
                });
                if (jsonResult.data.isLastPage === true) {
                    this.setState({
                        display: 1,
                        loading: 0
                    });
                }
            });
        scrollNum = scrollNum + 1;
        document.onscroll = ()=> {
            if (
                this.state.display === 0 &&
                document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight &&
                location.hash.indexOf('app') != -1) {
                console.log(scrollNum);
                console.log(this.state.display);
                getData(scrollNum)
                    .then(({jsonResult})=> {
                        console.log(jsonResult);
                        this.setState({
                            data: this.unique(this.state.data.concat(jsonResult.data.list))
                        });
                        if (jsonResult.data.isLastPage === true) {
                            this.setState({
                                display: 1,
                                loading: 0
                            });
                        }
                    });
                scrollNum = scrollNum + 1;
            }
        }
    };

    unique = (array)=> {
        let n = [];
        for (let i = 0; i < array.length; i++) {
            if (n.some(item => item.albumId.indexOf(array[i].albumId) != -1) === false) n.push(array[i]);
        }
        return n;
    };

    render = () => {

        const detail = (id)=> {
            return (
                ()=> {
                    hashHistory.push(`/studioDetail/${id}`)
                }
            )
        };

        const imgBuild = (data)=> {
            return (
                data.map((item, index)=> {
                    if (item.state === 1) {
                        return (
                            <div key={index} onClick={detail(item.albumId)}>
                                <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                <p style={{color: '#3e9cdc', fontSize: '14px'}}>审核中</p>
                            </div>
                        )
                    }
                    if (item.state === 2) {
                        return (
                            <div key={index} onClick={detail(item.albumId)}>
                                <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                <p style={{color: '#fa5a5f', fontSize: '14px'}}>审核未通过</p>
                            </div>
                        )
                    }
                    if (item.state === 3) {
                        return (
                            <div key={index} onClick={detail(item.albumId)}>
                                <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                <p style={{color: '#13a870', fontSize: '14px'}}>审核通过</p>
                            </div>
                        )
                    }
                })
            )
        };

        return (
            <div className="list">
                <BackTop>
                    <div className="backTopDe"/>
                </BackTop>
                <span style={{position: 'absolute', width: '4px', height: '24px', backgroundColor: '#333333'}}/>
                <div style={{marginLeft: '16px', marginBottom: '12px'}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>影集管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/app">影集列表</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="btn"><Link to="/create">创 建</Link></div>
                <div className="listContent">
                    {imgBuild(this.state.data)}
                </div>
                <p style={{opacity: this.state.loading}}><span/>正在加载...</p>
                <p style={{opacity: this.state.display}}><span/>刷到底了...</p>
            </div>
        )
    }
}
