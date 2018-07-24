import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const UPDATE_GAME_MAP = 'game_map/UPDATE_GAME_MAP';
const UPDATE_MAP_GRID = 'game_map/UPDATE_MAP_GRID';

// Reducer
const initialState = {
  gridObject: {},
  gridArray: [],
};

export default function gameMapReducer(state = initialState, action = {}) {
  const { payload } = action;
  switch (action.type) {
    case UPDATE_GAME_MAP: {
      return update(state, { $merge: payload });
    }
    case UPDATE_MAP_GRID: {
      return update(state, { gridObject: { $merge: payload } });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const updateGameMap = createAction(UPDATE_GAME_MAP);
export const updateMapGrid = createAction(UPDATE_MAP_GRID);
