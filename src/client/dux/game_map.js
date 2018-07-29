import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const UPDATE_GAME_MAP = 'game_map/UPDATE_GAME_MAP';
const UPDATE_MAP_GRID = 'game_map/UPDATE_MAP_GRID';
const UPDATE_MAP_X = 'game_map/UPDATE_MAP_X';
const UPDATE_MAP_Y = 'game_map/UPDATE_MAP_Y';

// Reducer
const initialState = {
  gridObject: {},
  gridArray: [],
  x: 0,
  y: 0,
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
    case UPDATE_MAP_X: {
      return update(state, { x: { $set: payload } });
    }
    case UPDATE_MAP_Y: {
      return update(state, { y: { $set: payload } });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const updateGameMap = createAction(UPDATE_GAME_MAP);
export const updateMapGrid = createAction(UPDATE_MAP_GRID);
export const updateMapX = createAction(UPDATE_MAP_X);
export const updateMapY = createAction(UPDATE_MAP_Y);
