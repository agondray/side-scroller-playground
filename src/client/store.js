import { combineReducers } from 'redux';
import playerCharacterReducer from '@dux/player_character';
import mapBuilderReducer from '@dux/map_builder';
import gameMapReducer from '@dux/game_map';

const rootReducer = combineReducers({
  playerCharacter: playerCharacterReducer,
  mapBuilder: mapBuilderReducer,
  gameMap: gameMapReducer,
});

export default rootReducer;
