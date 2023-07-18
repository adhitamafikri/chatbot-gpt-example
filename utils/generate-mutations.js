const defaultState = {
  loading: false,
  data: null,
  error: null,
}

/**
 * @Note - Consider using this for the new fragments OR if you want to refactor the tests
 * Using this version of generate-mutations helper will make it easier for unit testing because
 * you won't need to mock the store
 * @param {object[]} params
 * @param {string} params.action - action name, starts with a capital letter, example: RetrieveActiveComplaints
 * @param {string} params.state - vuex's state name, example: activeComplaints
 */
function generateMutations(params) {
  let result = {}
  if (!params) return result

  params.forEach((param) => {
    result = {
      ...result,
      [`begin${param.action}`](state) {
        state[param.state] = {
          ...state[param.state],
          ...defaultState,
          loading: true,
        }
      },
      [`success${param.action}`](state, { data }) {
        state[param.state] = {
          ...state[param.state],
          ...defaultState,
          data,
        }
      },
      [`error${param.action}`](state, { error }) {
        state[param.state] = {
          ...state[param.state],
          ...defaultState,
          error,
        }
      },
    }
  })

  return result
}

export default generateMutations
