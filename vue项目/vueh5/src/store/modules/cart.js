const state = {
    cartNumber: 0
}

const getters = {
    cartNumber: state => state.cartNumber
}

const mutations = {
    //
    changeCartNumber(state, num) {
        state.cartNumber = num
    }
}

const actions = {
    // 应用mutations
    setCartNumber({
        commit
    }, number) {
        commit("changeCartNumber", number)

    },

}

export default {
    state,
    getters,
    mutations,
    actions
}