const state = {
  focusOnDate: false,
  acCodeFocus: false
};

const getters = {};

const actions = {
  changeFocusOnDate({ commit }, payload) {
    commit("changeFocusState", payload);
  },
  changeFocusOnAccInput({ commit }, payload) {
    commit("changeFocusAccCode", payload);
  }
};

const mutations = {
  changeFocusState: (state, payload) => {
    state.focusOnDate = payload;
  },
  changeFocusAccCode: (state, payload) => {
    state.acCodeFocus = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
