import { SET_AUTH } from "./mutations.type";
import { LOGIN } from "../graphql/quries";

const state = {
  errors: null,
  user: {}
};

const getters = {};

const actions = {};

const mutations = {
  [SET_AUTH](state, payload) {
    state.user = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
