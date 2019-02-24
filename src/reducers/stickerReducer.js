import { SELECT_STICKER, SELECT_STICKER_SIZE, ADD_STICKER, DELETE_STICKER, SAVE_NEW_STICKER_CORDINATES } from '../actions/types';

import { stickers } from '../components/stickerContainer/stickerSvgs/';


const initialState = {
    stickers: stickers,
    stickerSize: 'md',
    selectedSticker: stickers[0],
    addedStickers: []
}

export default function stickerReducer(state = initialState, action) {
    switch(action.type) {
        case SELECT_STICKER: 
            return {
                ...state,
                selectedSticker: action.payload
            }
        case SELECT_STICKER_SIZE: 
            return {
                ...state,
                stickerSize: action.payload
            }
        case SAVE_NEW_STICKER_CORDINATES:
            const stickerData = action.payload;
            const newStickerData = state.addedStickers.map((sticker) => {
                if(stickerData.id === sticker.id) {
                    sticker.x = stickerData.x;
                    sticker.y = stickerData.y;
                    return sticker;
                } else {
                    return sticker
                }
            })
            return {
                ...state,
                addedStickers: newStickerData
            }
        case ADD_STICKER: 
            return {
                ...state,
                addedStickers: state.addedStickers.concat(action.payload)
            }
        case DELETE_STICKER:
            return {
                ...state,
                addedStickers: state.addedStickers.filter(sticker => sticker.id !== action.payload)
            }     
        default:
            return {
                ...state
            }
    }
}