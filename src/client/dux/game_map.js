import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const UPDATE_GAME_MAP = 'game_map/UPDATE_GAME_MAP';
const UPDATE_MAP_OBJECT = 'game_map/UPDATE_MAP_OBJECT';
const SET_MAP_ARRAY = 'game_map/SET_MAP_ARRAY';
const UPDATE_WALLS = 'game_map/UPDATE_WALLS';
const UPDATE_MAP_X = 'game_map/UPDATE_MAP_X';
const UPDATE_MAP_Y = 'game_map/UPDATE_MAP_Y';
const UPDATE_CELL_SIZE = 'game_map/UPDATE_CELL_SIZE';

// Reducer
const initialState = {
  gridObject: {},
  gridArray: [],
  walls: {},
  x: 96,
  y: 96,
  cellSize: 0,
  playerCoordinates: { // row and column cartesian coordinates
    x: null,
    y: null,
  },
};

export default function gameMapReducer(state = initialState, action = {}) {
  const { payload, type } = action;
  switch (type) {
    case UPDATE_GAME_MAP: {
      return update(state, { $merge: payload });
    }
    case UPDATE_MAP_OBJECT: {
      return update(state, { gridObject: { $merge: payload } });
    }
    case SET_MAP_ARRAY: {
      return update(state, { gridArray: { $set: payload } });
    }
    case UPDATE_WALLS: {
      return update(state, { walls: { $set: payload } });
    }
    case UPDATE_MAP_X: {
      return update(state, { x: { $set: payload } });
    }
    case UPDATE_MAP_Y: {
      return update(state, { y: { $set: payload } });
    }
    case UPDATE_CELL_SIZE: {
      return update(state, { cellSize: { $set: payload } });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const updateGameMap = createAction(UPDATE_GAME_MAP);
export const updateMapObject = createAction(UPDATE_MAP_OBJECT);
export const setMapArray = createAction(SET_MAP_ARRAY);
export const updateWalls = createAction(UPDATE_WALLS);
export const updateMapX = createAction(UPDATE_MAP_X);
export const updateMapY = createAction(UPDATE_MAP_Y);
export const updateCellSize = createAction(UPDATE_CELL_SIZE);
