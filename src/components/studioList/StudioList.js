import React from 'react'
import {Breadcrumb, BackTop, Select, Input} from 'antd';
import {RouteHandler, hashHistory, Link} from "react-router"
import './list.css'
import cookie from 'js-cookie'
import {getDataImg} from '../../services/service'

const Option = Select.Option;

export default class StudioList extends React.Component {

    state = {
        data: [],
        display: 0,
        loading: 1,
        new: true,
        choose:'',
        search:'',
        ver:''
    };

    componentDidMount() {
        let scrollNum = 1;
        if (cookie.get('roleId') === '2') {
            getDataImg(scrollNum, cookie.get('adminId'))
                .then(({jsonResult})=> {
                    // console.log(jsonResult);
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
        } else {
            getDataImg(scrollNum, '', 1)
                .then(({jsonResult})=> {
                    // console.log(jsonResult);
                    this.setState({
                        data: this.unique(this.state.data.concat(jsonResult.data.list))
                    });
                    if (jsonResult.data.isLastPage === true) {
                        this.setState({
                            display: 1,
                            loading: 0,
                            choose:1,
                        });
                    }
                });
        }
        scrollNum = scrollNum + 1;
        document.onscroll = ()=> {
            if (this.state.display === 0 &&
                document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight &&
                (location.hash.indexOf('studioList') != -1 || location.hash.indexOf('cloud') != -1)) {
                if (cookie.get('roleId') === '2') {
                    getDataImg(scrollNum, cookie.get('adminId'))
                        .then(({jsonResult})=> {
                            // console.log(jsonResult);
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
                } else {
                    getDataImg(scrollNum, '', 1)
                        .then(({jsonResult})=> {
                            // console.log(jsonResult);
                            this.setState({
                                data: this.unique(this.state.data.concat(jsonResult.data.list))
                            });
                            if (jsonResult.data.isLastPage === true) {
                                this.setState({
                                    display: 1,
                                    loading: 0,
                                    choose:1,
                                });
                            }
                        });
                }
                scrollNum = scrollNum + 1;
            }
        }
    };

    handleChange = (value)=> {
        if (cookie.get('roleId') === '2') {
            switch (value) {
                case 'all':
                    getDataImg('', cookie.get('adminId'),'',this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose: ''
                    }));
                    break;
                case 'ing':
                    getDataImg('', cookie.get('adminId'), 1,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:1
                    }));
                    break;
                case 'ed':
                    getDataImg('', cookie.get('adminId'), 3,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:3
                    }));
                    break;
                case 'false':
                    getDataImg('', cookie.get('adminId'), 2,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:2
                    }));
                    break;
            }
        } else {
            switch (value) {
                case 'all':
                    getDataImg('','','',this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:''
                    }));
                    break;
                case 'ing':
                    getDataImg('', '', 1,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:1
                    }));
                    break;
                case 'ed':
                    getDataImg('', '', 3,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:3
                    }));
                    break;
                case 'false':
                    getDataImg('', '', 2,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        choose:2
                    }));
                    break;
            }
        }
    };

    handleChangeVer = (value)=> {
        if (cookie.get('roleId') === '2') {
            switch (value) {
                case 'all':
                    getDataImg('', cookie.get('adminId'),this.state.choose,this.state.search,'').then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        ver: ''
                    }));
                    break;
                case 'ed':
                    getDataImg('', cookie.get('adminId'),this.state.choose,this.state.search,3).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        ver:3
                    }));
                    break;
                case 'false':
                    getDataImg('', cookie.get('adminId'),this.state.choose,this.state.search,2).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        ver:2
                    }));
                    break;
            }
        } else {
            switch (value) {
                case 'all':
                    getDataImg('','',this.state.choose,this.state.search,this.state.ver).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        ver:''
                    }));
                    break;
                case 'ed':
                    getDataImg('', '',this.state.choose,this.state.search,3).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        ver:3
                    }));
                    break;
                case 'false':
                    getDataImg('', '',this.state.choose,this.state.search,2).then(({jsonResult})=>this.setState({
                        data: jsonResult.data.list,
                        display: 1,
                        loading: 0,
                        new: false,
                        ver:2
                    }));
                    break;
            }
        }
    };

    unique = (array)=> {
        let n = [];
        for (let i = 0; i < array.length; i++) {
            if (n.some(item => item.cloudImageId.indexOf(array[i].cloudImageId) != -1) === false) n.push(array[i]);
        }
        return n;
    };

    search = (e)=> {
        this.setState({
            search:e.target.value
        });
        console.log(e.target.value);
        if (cookie.get('roleId') === '2') {
            getDataImg('', cookie.get('adminId'), this.state.choose, e.target.value,this.state.ver).then(({jsonResult})=>this.setState({
                data: jsonResult.data.list,
                display: 1,
                loading: 0,
                new: false,
            }));
        } else {
            getDataImg('', '', this.state.choose, e.target.value,this.state.ver).then(({jsonResult})=>this.setState({
                data: jsonResult.data.list,
                display: 1,
                loading: 0,
                new: false,
            }));
        }
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
                    if (item.verifyState  === 1) {
                        return (
                            <div className="something" key={index} onClick={detail(item.cloudImageId)}>
                                <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                <p style={{color: '#3e9cdc', fontSize: '14px'}}>审核中</p>
                                <div className="gray">{item.companyName}</div>
                            </div>
                        )
                    }
                    if (item.verifyState  === 2) {
                        return (
                            <div className="something" key={index} onClick={detail(item.cloudImageId)}>
                                <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                <p style={{color: '#fa5a5f', fontSize: '14px'}}>审核失败，请重新提交</p>
                                <div className="gray">{item.companyName}</div>
                            </div>
                        )
                    }
                    if (item.verifyState  === 3) {
                        if(item.state === 3){
                            return (
                                <div className="something" key={index} onClick={detail(item.cloudImageId)}>
                                    <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                    <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                    <p style={{color: '#13a870', fontSize: '14px'}}>审核通过（发布成功）</p>
                                    <div className="gray">{item.albumName}</div>
                                </div>)
                        }else if(item.state === 2){
                            return (
                                <div className="something" key={index} onClick={detail(item.cloudImageId)}>
                                    <img src={`${item.coverImageUrl}?imageView2/1/w/200/h/240`}/>
                                    <p>{new Date(parseInt(item.updateTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')}</p>
                                    <p style={{color: '#fa5a5f', fontSize: '14px'}}>审核通过（发布失败）</p>
                                    <div className="gray">{item.albumName}</div>
                                </div>)
                        }
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
                        <Breadcrumb.Item>云图管理</Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/cloud">云图列表</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                {cookie.get('roleId') === '2' ? <Link to="/create">
                    <div className="btn">添加名片</div>
                </Link> : ''}
                <div style={{float: 'right', marginBottom: '30px'}}>
                    <span style={{marginRight: '10px'}}>发布状态</span>
                    <Select size="large" defaultValue='all' style={{width: 100}} onChange={this.handleChangeVer}>
                        <Option value="all">全部</Option>
                        <Option value="ed">发布成功</Option>
                        <Option value="false">发布失败</Option>
                    </Select>
                    <span style={{marginRight: '10px',marginLeft:'10px'}}>审核状态</span>
                    <Select size="large" defaultValue={cookie.get('roleId') === '2' ?'all':'ing'} style={{width: 100}} onChange={this.handleChange}>
                        <Option value="all">全部</Option>
                        <Option value="ing">审核中</Option>
                        <Option value="ed">已通过</Option>
                        <Option value="false">未通过</Option>
                    </Select>
                    <Input placeholder="输入名称，回车键检索" onPressEnter={this.search} style={{
                        marginLeft: '10px',
                        width: '200px',
                        height: '31px',
                        padding: '0',
                        paddingLeft: '2px'
                    }}/>
                </div>
                <div className="listContent">
                    {imgBuild(this.state.data)}
                </div>
                {this.state.data.length > 0 ? <p style={{opacity: this.state.loading}}><span/>正在加载...</p> : ''}
                {this.state.data > 0 ? <p style={{opacity: this.state.display}}><span/>刷到底了...</p> : ''}
                {this.state.data.length === 0 && this.state.new === true ? <div className="new"/> : ''}
                {this.state.data.length === 0 && this.state.new === false ? <div className="new blank"/> : ''}
            </div>
        )
    }
}
