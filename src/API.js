import axios from "axios";

const HOST = "https://anhtuan05.pythonanywhere.com"

export const endpoints = {
    'login': '/o/token/',
    'register': '/user/',

    'current_user': '/user/current-user/',
    'put_user': '/user/',

    'login_with_face': '/user/login-with-face/',
    'faceRecognition': '/user/login-with-face/',

    'vehicle_management': '/vehicle/',

    'parkinglot': '/parkinglot/',
    'ratings': '/parkinglot/ratings/',

    'parkingspot': '/parkingspot/',

    'booking': '/booking/',

    'subscription_type': '/subscription-type/',
    'subscription': '/subscription/',
    'renew-subscription': (sub_Id) => `/subscription/${sub_Id}/renew-subscription/`,

    'entry_exit': '/parking-history/',

    'payment': '/payment/',
    'revenuedata': '/payment/revenue_statistics/',

    'reviews': '/reviews/'
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