import { TOGGLE_PAINT, CHANGE_BRUSH_WIDTH, CHANGE_BRUSH_COLOR } from './types';

export const changeBrushWidth = width => dispatch => {
    dispatch({
        type: CHANGE_BRUSH_WIDTH,
        payload: width
    })
}

export const changeBrushColor = color => dispatch => {
    dispatch({
        type: CHANGE_BRUSH_COLOR,
        payload: color
    })
}

export const togglePaintMode = () => dispatch => {
    dispatch({
        type: TOGGLE_PAINT
    })
}

export const applyPaint = paintData => () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;
    let mouseXposition = paintData.clientX - canvasXbounding;
    let mouseYposition = paintData.clientY - canvasYbounding;
    
    ctx.strokeStyle = paintData.color;
    ctx.lineWidth = paintData.width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    ctx.moveTo(paintData.mouseX, paintData.mouseY);
    ctx.lineTo(mouseXposition, mouseYposition );

    ctx.stroke();

}