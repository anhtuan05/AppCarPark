import axios from "axios";

const HOST = "https://anhtuan05.pythonanywhere.com"

export const endpoints = {
    'login': '/o/token/',
    'register': '/user/',
    'current_user': '/user/current-user/',
    'login_with_face': '/user/login-with-face/',
    'vehicle_management': '/vehicle/',
    'parkinglot': '/parkinglot/',
    'parkingspot': '/parkingspot/',
    'booking': '/booking/',
    'subscription_type': '/subscription-type/',
    'subscription': '/subscription/',
    'renew-subscription': (sub_Id) => `/subscription/${sub_Id}/renew-subscription/`,
}

//accesstoken
export const authApi = (accessToken) => axios.create({
    baseURL: HOST,
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
})

//none accesstoken
export default axios.create({
    baseURL: HOST
})