import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const UPDATE_ACTIVE_KEYS = 'keys_pressed/UPDATE_ACTIVE_KEYS';
const CLEAR_ACTIVE_KEYS = 'keys_pressed/CLEAR_ACTIVE_KEYS';

// Reducer
const initialState = {
  activeKeys: {},
};

export default function keysPressedReducer(state = initialState, action = {}) {
  const { payload } = action;
  switch (action.type) {
    case UPDATE_ACTIVE_KEYS: {
      return update(state, { activeKeys: { $merge: payload } });
    }
    case CLEAR_ACTIVE_KEYS: {
      return update(state, { activeKeys: { $set: {} } });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const updateActiveKeys = createAction(UPDATE_ACTIVE_KEYS);
export const clearActiveKeys = createAction(CLEAR_ACTIVE_KEYS);
