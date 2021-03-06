const state = {
  childsChanged: {
    status: false,
    parent: null
  },
  focusOnDate: false,
  acCodeFocus: false
};

const getters = {};

const actions = {
  changeInChildsDetected({ commit }, payload) {
    commit("changeChildrenState", payload);
  },
  changeFocusOnDate({ commit }, payload) {
    commit("changeFocusState", payload);
  },
  changeFocusOnAccInput({ commit }, payload) {
    commit("changeFocusAccCode", payload);
  }
};

const mutations = {
  changeChildrenState: (state, payload) => {
    (state.childsChanged.status = true), (state.childsChanged.parent = payload);
  },
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
