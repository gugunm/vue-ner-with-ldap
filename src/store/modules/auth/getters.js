export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
  imageLink(state) {
    return state.imageLink;
  },
  isAuthenticated(state) {
    return !!state.token;
  },
  didAutoLogout(state) {
    return state.didAutoLogout;
  }
};