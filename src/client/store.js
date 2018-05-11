import { combineReducers } from 'redux';
import playerCharacterReducer from './dux/player_character';

const rootReducer = combineReducers({
  playerCharacter: playerCharacterReducer,
});

export default rootReducer;
