import wx from 'labrador-immutable';

async function request({
    url,
    method = 'GET',
    data,
    dataType = 'json',
    header = {},
    resolveWithFullResponse = false
} = {}) {
    const optionsConverted = {
        url,
        data,
        method: method.toUpperCase(),
        header,
        dataType
    };

    return wx.request(optionsConverted)
        .then(res => {
            if (res.statusCode >= 400) {
                return resolveWithFullResponse ?
                    Promise.reject(res) :
                    Promise.reject(res.data);
            } else {
                return resolveWithFullResponse ?
                    res : 
                    res.data;
            }
        }, err => {
            return Promise.reject({
                msg: err.message,
                code: 0,
                request: `${optionsConverted.method} ${url}`
            });
        });
}

export default request;
