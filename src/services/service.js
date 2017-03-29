import {xFetch} from './xFetch';

export async function getQiNiuData(url) {
    return xFetch('/api/qiNiuFileInfo?key=photo/'+url);
}
export async function login(user,roleId) {
  return xFetch(
    '/api/admin/token',
    {
      method: 'POST',
      body: JSON.stringify({...user,roleId})
    },
  );
}

export async function postAdmin(id,data) {
    return xFetch(
        `/api/admin/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}


export async function getAdmin(adminName='',trueName=''){
    return xFetch('/api/admin?all=true&adminName='+adminName+'&trueName='+trueName)
}

export async function getData(data='',adminId='',verifyState='',albumName='') {
    return xFetch('/api/album?pageNum='+data+'&pageSize=8&adminId='+adminId+'&verifyState='+verifyState+'&albumName='+albumName);
}
export async function postData(data) {
  return xFetch(
    '/api/album',
    {
      method: 'POST',
      body: JSON.stringify(data)
    },
  );
}
export async function changeData(data) {
  return xFetch(
    '/api/album',
    {
      method: 'PUT',
      body: JSON.stringify(data)
    },
  );
}
export async function getSingleData(data) {
  return xFetch(`/api/album/${data}`);
}
export async function delSingleData(id,value) {
    if(value){
        return xFetch(
            `/api/album/${id}/${value}`,
            {
                method: 'DELETE'
            },
        );
    }else {
        return xFetch(
            `/api/album/${id}`,
            {
                method: 'DELETE'
            },
        );
    }
}
export async function getDataImg(data='',adminId='',verifyState='',companyName='') {
    return xFetch('/api/cloudImage?pageNum='+data+'&pageSize=8&adminId='+adminId+'&verifyState='+verifyState+'&companyName='+companyName);
}

export async function postNewImg(id,data) {
    return xFetch(
        `/api/cloudImage/${id}`,
        {
            method: 'POST',
            body: JSON.stringify(data)
        },
    );
}

export async function postNew(id,data) {
    return xFetch(
        `/api/album/${id}`,
        {
            method: 'POST',
            body: JSON.stringify(data)
        },
    );
}

export async function postDataImg(data) {
    return xFetch(
        '/api/cloudImage',
        {
            method: 'POST',
            body: JSON.stringify(data)
        },
    );
}

export async function verifyOther(id,data) {
    if(data){
        return xFetch(
            `/api/album/${id}/verify`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    verifyComment:data,
                    verifyState:2
                })
            },
        );
    }else{
        return xFetch(
            `/api/album/${id}/verify`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    verifyState:3
                })
            },
        );
    }
}

export async function verify(id,data) {
    if(data){
        return xFetch(
            `/api/cloudImage/${id}/verify`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    verifyComment:data,
                    verifyState:2
                })
            },
        );
    }else{
        return xFetch(
            `/api/cloudImage/${id}/verify`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    verifyState:3
                })
            },
        );
    }
}

export async function changeDataImg(data) {
    return xFetch(
        '/api/cloudImage',
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}
export async function getSingleDataImg(data) {
    return xFetch(`/api/cloudImage/${data}`);
}

export async function changeSingleData(id,value,data) {
    return xFetch(
        `/api/album/${id}/${value}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}

export async function changeSingleDataImg(id,value,data) {
    return xFetch(
        `/api/cloudImage/${id}/${value}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}


export async function delSingleDataImg(id,value) {
    if(value){
        return xFetch(
            `/api/cloudImage/${id}/${value}`,
            {
                method: 'DELETE'
            },
        );
    }else {
        return xFetch(
            `/api/cloudImage/${id}`,
            {
                method: 'DELETE'
            },
        );
    }
}
