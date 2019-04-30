import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const UPDATE_CANVAS = 'canvas/UPDATE_CANVAS';

// Reducer
const initialState = {
  ctx: null,
  // pointerX: 0,
  // pointerY: 0,
};

export default function canvasReducer(state = initialState, action = {}) {
  // not yet necessary... may need separate ducks for various canvas uses (stage, map maker, etc...)

  const { payload, type } = action;
  switch (type) {
    case UPDATE_CANVAS: {
      return update(state, { $merge: payload });
    }
    default: {
      return state;
    }
  }
}

// Action Creators
export const updateCanvas = createAction(UPDATE_CANVAS);
