import { combineReducers } from 'redux';
import playerCharacterReducer from '@dux/player_character';
import mapBuilderReducer from '@dux/map_builder';
import gameMapReducer from '@dux/game_map';
import keysPressedReducer from '@dux/keys_pressed';
import canvasReducer from '@dux/canvas';

const rootReducer = combineReducers({
  playerCharacter: playerCharacterReducer,
  mapBuilder: mapBuilderReducer,
  gameMap: gameMapReducer,
  keysPressed: keysPressedReducer,
  canvas: canvasReducer,
});

export default rootReducer;
