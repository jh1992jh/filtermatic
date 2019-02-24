import { SELECT_STICKER, SELECT_STICKER_SIZE, ADD_STICKER, DELETE_STICKER, SAVE_NEW_STICKER_CORDINATES } from './types';

export const selectSticker = sticker => dispatch => {
    dispatch({
        type: SELECT_STICKER, 
        payload: sticker
    })
}

export const selectStickerSize = size => dispatch => {
    dispatch({
        type: SELECT_STICKER_SIZE,
        payload: size
    })
}

export const addSticker = sticker => dispatch => {
    dispatch({
        type: ADD_STICKER,
        payload: sticker
    })
}

export const deleteSticker = sticker => dispatch => {
    dispatch({
        type: DELETE_STICKER,
        payload: sticker
    })
}

export const saveNewStickerCordinates = stickerCordinates => dispatch => {
    dispatch({
        type: SAVE_NEW_STICKER_CORDINATES,
        payload: stickerCordinates
    })
}