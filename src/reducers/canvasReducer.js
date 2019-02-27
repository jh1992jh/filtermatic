import { SET_CANVAS_REF, HANDLE_MOUSE_MOVE, UPLOAD_MAIN_IMG, SAVE_IMAGE_STATE, DECREMENT_ACTIVE_IMAGE_STATE, INCREMENT_ACTIVE_IMAGE_STATE } from '../actions/types';

const initialState = {
    loading: true,
    mouseX: 0,
    mouseY: 0,
    ctx: null,
    imageState: [],
    activeImageState: 0
}

export default function canvasReducer(state = initialState, action) {
    switch(action.type) {
        case HANDLE_MOUSE_MOVE: 
           
            return {
                ...state
            }
        case SET_CANVAS_REF: 
            return {
                ...state,
                canvasRef: action.payload,
                loading: false
            }
        case UPLOAD_MAIN_IMG: 
        console.log(action.payload)
            return {
                ...state,
                ctx: action.payload
            }
        case SAVE_IMAGE_STATE: 
            return {
                ...state,
                imageState: state.imageState.concat(action.payload),
                activeImageState: state.activeImageState += 1
            }
        case DECREMENT_ACTIVE_IMAGE_STATE: 
            const decState = state.activeImageState;
            if(decState === 0) {
                return {
                    ...state,
                    activeImageState: 1
                }
            } else {
                return {
                    ...state,
                    activeImageState:state.activeImageState -= 1
                }
            }
        case INCREMENT_ACTIVE_IMAGE_STATE:
            return {
                ...state,
                activeImageState: state.activeImageState > state.imageState.length - 1 ? state.imageState.length : state.activeImageState + 1
            }            

        default: 
            return {
                ...state
            }
    }
}