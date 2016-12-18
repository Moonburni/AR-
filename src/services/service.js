import xFetch from './xFetch';

export async function getData(data) {
  return xFetch('/api/album?pageNum='+data+'&pageSize=8');
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
