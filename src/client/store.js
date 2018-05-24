import { combineReducers } from 'redux';
import playerCharacterReducer from '@dux/player_character';
import mapBuilderReducer from '@dux/map_builder';

const rootReducer = combineReducers({
  playerCharacter: playerCharacterReducer,
  mapBuilder: mapBuilderReducer,
});

export default rootReducer;
