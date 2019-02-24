import { TOGGLE_PAINT, CHANGE_BRUSH_WIDTH, CHANGE_BRUSH_COLOR } from '../actions/types';

const initialState = {
    paint: false,
    color: '#00a6fb',
    width: 5
}

export default function paintReducer(state = initialState, action) {
    switch(action.type) {
        case CHANGE_BRUSH_WIDTH: 
            return {
                ...state,
                width: action.payload
            }
        case CHANGE_BRUSH_COLOR:
            return {
                ...state,
                color: action.payload
            }
        case TOGGLE_PAINT: 
            return {
                ...state,
                paint: !state.paint
            }    
        default:
            return {
                ...state
            }
    }
}