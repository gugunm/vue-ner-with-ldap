import qs from 'qs';
import axios from 'axios';

let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login'
    });
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup'
    });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    // let url =
    //   'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBvOcmh_Avvu08bFdUHdmJzA06c6vV4h0E';

    let url = 'https://map.bpkp.go.id/api/v3/login'

    if (mode === 'signup') {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBvOcmh_Avvu08bFdUHdmJzA06c6vV4h0E';
    }

    // const response = await fetch(url, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     "username": payload.username,
    //     "password": payload.password,
    //     "kelas_user": 0
    //     // returnSecureToken: true
    //   }),
    //   headers: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   }
    // });

    const response = await axios({
      method: 'POST',
      url: url,
      data: qs.stringify({
        "username": payload.username,
        "password": payload.password,
        "kelas_user": 0
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })

    const responseData = await  response.data;

    if (response.status != 200) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }

    // ini kalo api nya ngasih property expiresIn
    // const expiresIn = +responseData.expiresIn * 1000;

    // expire login dalam 1 jam
    const expiresIn = 3600000;
    const expirationDate = new Date().getTime() + expiresIn;
    
    localStorage.setItem('token', responseData.api_token);
    localStorage.setItem('userId', responseData.message.user_nip);
    localStorage.setItem('imageLink', responseData.broadcast.images);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(function() {
      context.dispatch('autoLogout');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.api_token,
      userId: responseData.message.user_nip,
      imageLink: responseData.broadcast.images
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const imageLink = localStorage.getItem('imageLink');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function() {
      context.dispatch('autoLogout');
    }, expiresIn);

    if (token && userId && imageLink) {
      context.commit('setUser', {
        token: token,
        userId: userId,
        imageLink: imageLink
      });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('imageLink');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
      imageLink: null
    });
  },
  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  }
};
