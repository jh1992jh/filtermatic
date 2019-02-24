import { combineReducers } from 'redux';
import stickerReducer from './stickerReducer';
import canvasReducer from './canvasReducer';
import filterReducer from './filterReducer';
import textReducer from './textReducer';
import paintReducer from './paintReducer';

export default combineReducers({
    stickers: stickerReducer,
    canvas: canvasReducer,
    filters: filterReducer,
    text: textReducer,
    paint: paintReducer
});

