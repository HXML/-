const state = {
    currentUser: null,
    Sid: null,
}

const getters = {
    currentUser: state => state.currentUser,
    Sid: state => state.Sid
}

const mutations = {
    // 更改用户的状态信息
    userStatus(state, user) {
        state.currentUser = user
    },
    //sid
    changeSid(state, Sid) {
        state.Sid = Sid
    }
}

const actions = {
    // 应用mutations
    setUser({
        commit
    }, user) {
        commit("userStatus", user)
    },
    changeSid({
        commit
    }, Sid) {
        commit("changeSid", Sid)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}