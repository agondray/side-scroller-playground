import update from 'immutability-helper';
import { createAction } from 'redux-actions';

import { cellTypes } from '@utils/constants';

// Actions
const UPDATE_SELECTED_TILE = 'map_builder/UPDATE_SELECTED_TILE';
const UPDATE_IMPASSABLE_COORDINATE_MATRIX = 'map_builder/UPDATE_IMPASSABLE_COORDINATE_MATRIX';
const UPDATE_IMAGE_BLOB = 'map_builder/UPDATE_IMAGE_BLOB';
const UPDATE_HOVERED_CELL = 'map_builder/UPDATE_HOVERED_CELL';
const INITIALIZE_GRID_OBJECT = 'map_builder/INITIALIZE_GRID_OBJECT';
const UPDATE_GRID_OBJECT = 'map_builder/UPDATE_GRID_OBJECT';

// Reducer
const initialState = {
  gridObject: {},
  hoveredCell: {},
  lastClickedCell: null,
  selectedTile: {},
  selectedCellType: cellTypes.floor,
  impassableCoordinateObject: {},
  imageBlob: null, // FILE (IMAGE BLOB)
};

export default function mapBuilderReducer(state = initialState, action = {}) {
  const { payload } = action;
  switch (action.type) {
    case INITIALIZE_GRID_OBJECT: {
      return update(state, { gridObject: { $merge: payload } });
    }
    case UPDATE_GRID_OBJECT: {
      return update(state, {
        gridObject: {
          [payload.cellKey]: { $merge: payload.data },
        },
      });
    }
    case UPDATE_HOVERED_CELL: {
      return update(state, { hoveredCell: { $merge: payload } });
    }
    case UPDATE_SELECTED_TILE: {
      return update(state, { selectedTile: { $set: payload } });
    }
    case UPDATE_IMPASSABLE_COORDINATE_MATRIX: {
      return update(state, { impassableCoordinateMatrix: { $set: payload } });
    }
    case UPDATE_IMAGE_BLOB: {
      return update(state, { imageBlob: { $set: payload } });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const updateSelectedTile = createAction(UPDATE_SELECTED_TILE);
export const updateImpassableCoordinateMatrix = createAction(UPDATE_IMPASSABLE_COORDINATE_MATRIX);
export const updateImageBlob = createAction(UPDATE_IMAGE_BLOB);
export const updateHoveredCell = createAction(UPDATE_HOVERED_CELL);
export const initializeGridObject = createAction(INITIALIZE_GRID_OBJECT);
export const updateGridObject = createAction(UPDATE_GRID_OBJECT);
