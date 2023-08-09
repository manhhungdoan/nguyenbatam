import api from "./utils/services/api.js";

export const actionGetListUsers = (params) => {
    return api({
        method: 'get',
        url: '/manager/customer-profile',
        params,
    })
}
export const actionAddUsers = (data) => {
    return api({
        method: 'post',
        url: '/manager/customer-profile',
        data,
    })
}

export const actionUpdateUsers = (customerId, data) => {
    return api({
        method: 'put',
        url: `/manager/customer-profile/${customerId}`,
        data,
    })
}
export const actionDeleteUsers = (id) => {
    return api({
        method: 'delete',
        url: `/manager/customer-profile/${id}`,
    })
}