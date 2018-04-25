import { combineReducers } from 'redux';
import main from './main/main';

const rootReducer = combineReducers({
  main: main,
});

export default rootReducer;
