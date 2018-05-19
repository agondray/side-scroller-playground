import update from 'immutability-helper';
import { createAction } from 'redux-actions';

// Actions
const UPDATE_CONTEXT = 'canvas/UPDATE_CONTEXT';
const UPDATE_POINTER_COORDS = 'canvas/UPDATE_POINTER_COORDS';

// Reducer
const initialState = {
  context: null,
  pointerX: 0,
  pointerY: 0,
};

export default function canvasReducer(state = initialState, action = {}) {
  // not yet necessary... may need separate ducks for various canvas uses (stage, map maker, etc...)


  // const { payload } = action;
  //   switch (action) {
  //     case UPDATE_CONTEXT: {
  //       return update(state.context, { $merge: payload }
  //     }
  //     case UPDATE_POINTER_COORDS: {
  //       return update(state.context, { $merge: payload }
  //     }
  //   }
  // }
}

// Action Creators
const updateContext = createAction(UPDATE_CONTEXT);
const updatePointerCoords = createAction(UPDATE_POINTER_COORDS);
