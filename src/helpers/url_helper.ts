
export const API_ENDPOINTS = {

    // Authentication
  LOGIN: '/api/auth/signin',
  REFRESH_TOKEN: '/api/auth/refresh',
  SIGNOUT: '/api/auth/signout',

  // Dashboard
  GET_DEVICES_URL: '/device',
  GET_ALERTS_URL: '/device/alarm/notifications',

  GET_USERS: '/user',
  CREATE_USER: '/api/auth/signup',
  UPDATE_USER: '/user',
  DELETE_USER: '/user' 

};