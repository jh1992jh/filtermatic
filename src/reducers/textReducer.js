const initalState = {
    top: '',
    middle: '',
    bottom: ''
}

export default function textReducer(state = initalState, action) {
    switch(action) {
        default: 
            return {
                ...state
            }
    }
}