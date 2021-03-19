const state = {
  focusOnDate: false,
  acCodeFocus: false,

  filterVoucherByDate: ""
};

const getters = {};

const actions = {
  changeFocusOnDate({ commit }, payload) {
    commit("changeFocusState", payload);
  },
  changeFocusOnAccInput({ commit }, payload) {
    commit("changeFocusAccCode", payload);
  },
  changeVouchersFilterDate({ commit }, payload) {
    commit("changeFilterDate", payload);
  }
};

const mutations = {
  changeFocusState: (state, payload) => {
    state.focusOnDate = payload;
  },
  changeFocusAccCode: (state, payload) => {
    state.acCodeFocus = payload;
  },
  changeFilterDate: (state, payload) => {
    state.filterVoucherByDate = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
