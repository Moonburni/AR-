import {xFetch} from './xFetch';

export async function getQiNiuData(url) {
    return xFetch('/api/qiNiuFileInfo?key=photo/'+url);
}
export async function login(user) {
  return xFetch(
    '/api/admin/token',
    {
      method: 'POST',
      body: JSON.stringify(user)
    },
  );
}
export async function getData(data) {
    return xFetch('/api/album?pageNum='+data+'&pageSize=8');
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
export async function delSingleData(id) {
  return xFetch(
    `/api/album/${id}`,
    {
      method: 'DELETE'
    },
  );
}
export async function getDataImg(data) {
    return xFetch('/api/cloudImage?pageNum='+data+'&pageSize=8');
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
export async function delSingleDataImg(id) {
    return xFetch(
        `/api/cloudImage/${id}`,
        {
            method: 'DELETE'
        },
    );
}
