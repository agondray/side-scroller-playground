import typeToReducer from 'type-to-reducer';

const UPDATE_FOO = "UPDATE_FOO";

const state = {
  foo: 'hello world! (╯°□°)╯︵ ┻━┻',
  fun: '(ノ^_^)ノ ︵┻━┻ ノ( ^_^ノ)',
  isFulfilled: false,
  isPending: false,
  error: false,
};

export default typeToReducer({
  [UPDATE_FOO]: {
    PENDING: () => {
      return {
        ...state,
        isPending: true
      }
    },
    REJECTED: (state, action) => {
      return {
        ...state,
        error: true
      }
    },
    FULFILLED: (state, action) => {
      return {
        ...state,
        isFulfilled: true,
        test: action.payload
      }
    }
  }
}, state);
