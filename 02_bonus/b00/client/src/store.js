import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedAvatar: '',
    messageError: '',
    messageSuccess: '',
    newTokenCreated: false,
  },
  mutations: {
    FILL_ERROR(state, data) {
      console.log('data', data);
      state.messageError = data;
    },
    FILL_SUCCESS(state, data) {
      state.messageSuccess = data;
    },
    FILL_SELECTEDAVATAR(state, data) {
      state.selectedAvatar = data;
    },
    NEW_TOKEN_CREATED(state, isTokenCreated) { state.newTokenCreated = isTokenCreated; },
  },
  actions: {
    new_token_created({ commit }, isTokenCreated) { commit('NEW_TOKEN_CREATED', isTokenCreated); },
  },
  getters: {
    messageSuccess(state) { return state.messageSuccess; },
    messageError(state) { return state.messageError; },
    selectedAvatar(state) { return state.selectedAvatar; },
    displayMovieInfo(state) { return state.displayMovieInfo; },
    movieInfo(state) { return state.movieInfo; },
    newTokenCreated(state) { return state.newTokenCreated; },
  },
});
