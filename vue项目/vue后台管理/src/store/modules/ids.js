const state = {
    ids: null,
    nextTimeDisplay: true,//默认为勾选 下次不再弹窗
    restUnRead: null,
}

const getters = {
    ids: state => state.ids,
    nextTimeDisplay: state => state.nextTimeDisplay,
    restUnRead: state => state.restUnRead,
}

const mutations = {
    // 更改用户的状态信息
    changeIds(state, ids) {
        state.ids = ids
    },
    changeReadNumber(state, restUnRead) {
        state.restUnRead = restUnRead
    },
    changeDialogState(state, nextTimeDisplay) {
        state.nextTimeDisplay = nextTimeDisplay
    },
}

const actions = {
    // 应用mutations
    changeIds({
        commit
    }, ids) {
        commit("changeIds", ids)
    },
    changeReadNumber({
        commit
    }, restUnRead) {
        commit("changeReadNumber", restUnRead)
    },
    changeDialogState({
        commit
    }, nextTimeDisplay) {
        commit("changeDialogState", nextTimeDisplay)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}