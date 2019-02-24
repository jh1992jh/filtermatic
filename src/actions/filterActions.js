import { SELECT_FILTER } from './types';

export const selectFilter = filter => dispatch => {
    dispatch({
        type: SELECT_FILTER,
        payload: filter
    })
} 

export const addFilter = data => () => {

  
        const canvas = document.getElementById('canvas');
        const ctx = data.ctx;
        let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    
        
        for (let i = 0; i < pixels.data.length; i+=4) {
          pixels.data[i + 0] = pixels.data[i + 0] + data.filter.r; // RED
          pixels.data[i + 1] = pixels.data[i + 1] + data.filter.g; // GREEN
          pixels.data[i + 2] = pixels.data[i + 2] + data.filter.b; // Blue
        }
        
        
        ctx.putImageData(pixels, 0, 0);
}

export const addBrightness = ctx => () => {

    const canvas = document.getElementById('canvas');
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 10; // RED
        pixels.data[i + 1] = pixels.data[i + 1] + 10; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] + 10; // Blue
        // pixels.data[i + 3] = pixels.data[i + 3] + 10; */
    } 

    ctx.putImageData(pixels, 0, 0);
}

export const decreaseBrightness = ctx => ()  => {

    const canvas = document.getElementById('canvas');
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] - 10; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 10; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] - 10; // Blue
      } 

    ctx.putImageData(pixels, 0, 0);
}