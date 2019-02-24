import { SET_CANVAS_REF, HANDLE_MOUSE_MOVE, UPLOAD_MAIN_IMG, SAVE_IMAGE_STATE, DECREMENT_ACTIVE_IMAGE_STATE, INCREMENT_ACTIVE_IMAGE_STATE } from './types';

import { trimCanvas } from '../trimCanvas';

export const handleMouseMove = cordinates => dispatch => {
    dispatch({
        type: HANDLE_MOUSE_MOVE,
        payload: cordinates
    })
}

export const setCanvasRef = (canvasRef) => dispatch => {
    dispatch({
        type: SET_CANVAS_REF,
        payload: canvasRef
    })
}

export const uploadMainImg = data => dispatch => {
    const canvas = document.getElementById('canvas');

    
    let logoSVG = new Image();
    


        logoSVG.onload = () => {
            const mainImg = document.getElementById('mainImg');
            const ctx = canvas.getContext('2d');
            let aspectRatio;
              /*const width = canvas.width;
              const height = canvas.height;
      
              data.ctx.drawImage(logoSVG, 0,0, width, height)*/

              if(logoSVG.height > logoSVG.width) {
                aspectRatio =  mainImg.height / mainImg.width;
                const width = canvas.width;
                const height = canvas.width * aspectRatio;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(logoSVG, 0,0, width, height)
              } else if (logoSVG.width > logoSVG.height) {
                aspectRatio = mainImg.width / mainImg.height; 
                const width = canvas.width;
                const height = canvas.height  / aspectRatio;
                canvas.width = width;
                canvas.height = height;
                //ctx.drawImage(logoSVG, 0, canvas.height / 8, width, height)
                ctx.drawImage(logoSVG, 0, 0 / 8, width, height)
                canvas.style.top = `calc(50% - ${canvas.height / 2}px)`;
              }
            }
       
       logoSVG.src = data.imageData;
           

       dispatch({
           type: UPLOAD_MAIN_IMG,
           payload: data
        }) 
}

export const saveImage = (stickers) => () => {
    const canvas = document.getElementById('canvas');
    const ctx = stickers.ctx;
    let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;

    const addedStickers = stickers.addedStickers;

    const pixels = ctx.getImageData(0,0, canvas.width, canvas.height);

   for(let i = 0; i < addedStickers.length; i++) {
    const logoSvg = new Image();
    logoSvg.src = addedStickers[i].src;
    logoSvg.onload = () => {
     
         
            ctx.drawImage(logoSvg, addedStickers[i].x - canvasXbounding - (addedStickers[i].width / 2), addedStickers[i].y - canvasYbounding - (addedStickers[i].height / 2), addedStickers[i].width * addedStickers[i].size , addedStickers[i].height * addedStickers[i].size);
   }
  }



setTimeout(() => {
const link = document.createElement('a');
link.className = "modalSave"
const image = document.createElement('img');
const trimmedCanvas = trimCanvas(canvas);
image.src = trimmedCanvas.toDataURL();

link.innerHTML = 'Download image';
link.appendChild(image)

link.style.height = `${trimmedCanvas.height + 30}px`
link.addEventListener('click', function(ev) {
link.href = trimmedCanvas.toDataURL();
link.download = `FilterMatic${new Date().toISOString()}.png`
link.remove();
}, false);
document.body.appendChild(link); 
document.body.addEventListener('click', () => {
  ctx.putImageData(pixels, 0, 0);
  link.remove()
})
},300)
}

export const saveImageState = imageState => dispatch => {
    dispatch({
        type: SAVE_IMAGE_STATE,
        payload: imageState
    })
}

export const decrementActiveImageState = () => dispatch => {
    dispatch({
        type: DECREMENT_ACTIVE_IMAGE_STATE
    })
}

export const incrementActiveImageState = () => dispatch => {
    dispatch({
        type: INCREMENT_ACTIVE_IMAGE_STATE
    })
}