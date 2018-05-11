import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const ADD_ACTIVE_KEYS = 'player_character/ADD_ACTIVE_KEYS';
const REMOVE_ACTIVE_KEY = 'player_character/REMOVE_ACTIVE_KEY';

// Reducer
export const initialState = {
  activeKeys: {},
  player: null, // #here - this will eventually be an array of players
};

export default function playerCharacterReducer(state = initialState, action = {}) {
  const { payload } = action;
  switch (action) {
    case ADD_ACTIVE_KEYS: {
      return update(state.activeKeys, { $merge: payload });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const addActiveKey = createAction(ADD_ACTIVE_KEYS);
export const removeActiveKey = createAction(REMOVE_ACTIVE_KEY);
