export const addText = data => () => {
    const canvas = document.getElementById('canvas');
    const ctx = data.ctx;

    const centerX = canvas.width / 2;
    const topY = canvas.height * 0.2;
    const centerY = canvas.height * 0.5;
    const bottomY = canvas.height * 0.9;

    ctx.font = "50px Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(250, 250, 250, 1)"
    
    
    if(data.top.length > 0) {
      ctx.fillText(data.top.toUpperCase(), centerX, topY);
    } 
    
    if (data.middle.length > 0) {
      ctx.fillText(data.middle.toUpperCase(), centerX, centerY)
    }
    
    if (data.bottom.length > 0) {
      ctx.fillText(data.bottom.toUpperCase(), centerX, bottomY)
    }
}