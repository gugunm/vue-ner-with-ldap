export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.imageLink = payload.imageLink;
    state.didAutoLogout = false;
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  }
};