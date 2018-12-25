import React, { Component } from 'react';
import StickerContainer from './components/stickerContainer/StickerContainer';
import FilterContainer from './components/filterContainer/FilterContainer';
import Buttons from './components/buttons/Buttons';
import PaintBrush from './components/paintBrush/PaintBrush';
import MobileToolbar from './components/mobileToolbar/MobileToolbar';
import Modal from './components/modal/Modal';
import { stickers } from './components/stickerContainer/stickerSvgs/';
import { filters } from './components/filterContainer/';
import { trimCanvas } from './trimCanvas';
import './App.scss';

class App extends Component {
state = {
  mouseX: 0,
  mouseY: 0,
  uploadedImage: null,
  orientationNumber: 0,
  mainImgWidth: 500,
  mainImgHeight: 500,
  selectedSticker: stickers[0],
  stickerSize: 'md',
  stickers: [],
  dragging: false,
  selectedFilter: filters[0],
  originalPhoto: null,
  imageState: [],
  activeImageState: 0,
  showModal: {},
  paintBrush: {paint: false, color: '#00a6fb', width: 5},
  showTextForm: false,
  top: '',
  middle: '',
  bottom: '',
  mobile: null
}
 componentDidMount() {
   const canvas = this.refs.canvas;
   const ctx = canvas.getContext('2d');
   const { mobile, imageState, selectedSticker } = this.state;
  
   
   function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if(isMobileDevice() === true) {
  console.log('User is on a mobile device, adjusting the canvas size')
  this.setState({mobile: true});
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
} 

let canvasX = canvas.width / 2;
let canvasY = canvas.height / 2;
let canvasXmobile = canvas.width / 2 - 60;

const welcomeText = (font, x, y) => {
  ctx.font = `${font}px Arial`;
 ctx.textAlign = "center";
 ctx.fillStyle = "rgba(150, 150, 150, 1)"
 ctx.fillText("Choose An Image To Edit", x, canvasY); 
 }

window.onload = () => {
  if(mobile) {
    welcomeText(20, canvasXmobile);
  } else {
    welcomeText(30, canvasX);
  }
}

const canvasPosY = canvas.getBoundingClientRect().y;
const canvasPosX = canvas.getBoundingClientRect().x;

let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
this.setState({imageState: imageState.concat(pixelsOriginal)})

this.setState({mouseX: canvasPosX + canvas.width / 2 - selectedSticker.width / 2 , mouseY: canvasPosY + canvas.height / 2 - selectedSticker.width / 2 });
  }
  
  imageUploadHandler = e => {
    this.setState({uploadedImage: URL.createObjectURL(e.target.files[0])})
    setTimeout(() => this.uploadMainImg(), 100) 
  }
  
  handleMouseMove = e => {
    
    const canvas = this.refs.canvas;
    
    if(e.touches) {
      const rect = canvas.getBoundingClientRect()
     
      this.setState({mouseX: e.touches[0].clientX - rect.left, mouseY: e.touches[0].clientY - rect.y})
    }
  }
  
  togglePaintMode = (e) => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const { paintBrush } = this.state;
    let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;
    let mouseXposition = e.clientX - canvasXbounding;
    let mouseYposition = e.clientY - canvasYbounding;
 
    this.setState({mouseX: mouseXposition, mouseY: mouseYposition})
    this.setState((prevState) => {
      return {
        paintBrush: {
          paint: !paintBrush.paint,
          color: prevState.paintBrush.color,
          width: prevState.paintBrush.width
        }
      }
    })

    if(paintBrush.paint) { 
      let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(pixels, 0, 0);
    const { imageState, activeImageState } = this.state;
    this.setState({imageState: imageState.concat(pixels), activeImageState: activeImageState + 1})
  }
  }

  setPaintBrushSettings = (e) => {
    const value = e.target.value
    if(e.target.className === "strokeColor") {
      this.setState((prevState) => {
        return {
          paintBrush: {
            paint: prevState.paintBrush.paint,
            width: prevState.paintBrush.width,
            color: value,
          }
        }
      })
    } else if(e.target.className === "strokeWidth") {
      this.setState((prevState) => {
        return {
          paintBrush: {
            paint: prevState.paintBrush.paint,
            color: prevState.paintBrush.color,
            width: value
          }
        }
      })
    }

  }

  textSettings = (e) => {
    const value = e.target.value;

    const { showTextForm } = this.state;
    
    if(e.target.className === "textButton") {
      this.setState({showTextForm: !showTextForm})
    }

    this.setState({[e.target.name]: value})
    
  }

  addText = (e) => {
    e.preventDefault();
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    const { orientationNumber } = this.state;

    const centerX = canvas.width / 2;
    const topY = canvas.height * 0.1 + orientationNumber;
    const centerY = canvas.height * 0.5 + (orientationNumber / 2);
    const bottomY = canvas.height * 0.9 - (orientationNumber / 2) - 30;

    ctx.font = "50px Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(250, 250, 250, 1)"
    const { top, middle, bottom } = this.state;
    
    if(top.length > 0) {
      ctx.fillText(top, centerX, topY);
    } 
    
    if (middle.length > 0) {
      ctx.fillText(middle, centerX, centerY)
    }
    
    if (bottom.length > 0) {
      ctx.fillText(bottom, centerX, bottomY)
    } 
    
    const pixels = ctx.getImageData(0,0, canvas.width, canvas.height)
    ctx.putImageData(pixels, 0, 0);
    const { imageState, activeImageState } = this.state;
    this.setState({imageState: imageState.concat(pixels), activeImageState: activeImageState + 1})
  }

  paint = (e) => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    const { mouseX, mouseY,paintBrush } = this.state;
    
    const rect = canvas.getBoundingClientRect();
    let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;
    let mouseXposition = e.clientX - canvasXbounding;
    let mouseYposition = e.clientY - canvasYbounding;
   
    
    
    if(paintBrush.paint)  {
      if(!e.touches) {
        this.setState({mouseX: mouseXposition, mouseY: mouseYposition})
      } else {
       
        this.setState({mouseX: e.touches[0].clientX, mouseY: e.touches[0].clientY - rect.y })
      }
      ctx.strokeStyle = paintBrush.color;
      ctx.lineWidth = paintBrush.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      if(e.touches) {
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY - rect.y)
        
      } else {
        ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(mouseXposition, mouseYposition );
      }
      ctx.stroke();
    }

  }
  
  setMouseCordinates = e => {
      this.setState({mouseX: e.clientX, mouseY: e.clientY})
      return;
  }
  
  dragSticker = (e) => {
  
    const { stickers, mobile, dragging} = this.state;

    if(e.touches) this.setState({dragging: true});

    const filteredStickers = stickers.filter(sticker => {
     return sticker.id === e.target.id
     }) 

     if(dragging) {
      if(mobile) {
        filteredStickers[0].y = e.touches[0].clientY - (filteredStickers[0].height);
        filteredStickers[0].x = e.touches[0].clientX - (filteredStickers[0].width);
       } else {
         filteredStickers[0].y = e.clientY - (filteredStickers[0].height / 2);
         filteredStickers[0].x = e.clientX - (filteredStickers[0].width / 2);
          
      
         if(filteredStickers[0].x < e.clientX - (filteredStickers[0].width / 2)) {
          filteredStickers[0].x = filteredStickers[0].x + e.clientX - (filteredStickers[0].width / 2);
         } 
       
       
       }

       const canvas = this.refs.canvas;
       const canvasPosX = canvas.getBoundingClientRect().x;
       const canvasPosY = canvas.getBoundingClientRect().y;

       if(filteredStickers[0].x < canvasPosX + (filteredStickers[0].width / 2)) {
       filteredStickers[0].x = canvasPosX + (filteredStickers[0].width / 2) ;
       } else if (filteredStickers[0].x > canvasPosX + canvas.width - (filteredStickers[0].width * 1.5)) {
        filteredStickers[0].x = canvasPosX + canvas.width - (filteredStickers[0].width * 1.5);
       }     

       if(filteredStickers[0].y < canvasPosY + (filteredStickers[0].height / 2)) {
         filteredStickers[0].y = canvasPosY + (filteredStickers[0].height / 2)
       } else if (filteredStickers[0].y > canvasPosY + canvas.height - (filteredStickers[0].height)) {
         filteredStickers[0].y = canvasPosY + canvas.height - (filteredStickers[0].height);
       }
        // if it doesn't work properly divide the sticker witdth&height by 2 e.g. filteredStickers[0].width / 2
     const stickerIds = stickers.map(sticker => sticker.id) 
    
     const stickerIndex = stickerIds.indexOf(filteredStickers[0].id);

     const stickerArr = stickers.map(sticker => sticker);

     stickerArr[stickerIndex].x = filteredStickers[0].x;
     stickerArr[stickerIndex].y = filteredStickers[0].y;

     this.setState({stickers: stickerArr})
     } else return
  }

  deleteSticker = (e) => {
    const { stickers } = this.state;

    if(e.touches) this.setState({dragging: true});

    const filteredStickers = stickers.filter(sticker => {
     return sticker.id === e.target.id
     }) 

  
    
     const stickerIds = stickers.map(sticker => sticker.id) 
    
     const stickerIndex = stickerIds.indexOf(filteredStickers[0].id);

     const stickerArr = stickers.map(sticker => sticker);

     stickerArr.splice(stickerIndex, 1);
     this.setState({stickers: stickerArr})
    
  }

  uploadMainImg = () => {
    const { uploadedImage, imageState, activeImageState } = this.state;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const logoSvg = new Image();
    ctx.clearRect(0,0, canvas.width, canvas.height)
    const mainImg = this.refs.mainImg;
    let aspectRatio;
    logoSvg.onload = () => {
      if(logoSvg.height > logoSvg.width) {
        const mainImg = this.refs.mainImg;
        aspectRatio =  mainImg.height / mainImg.width;
        const width = canvas.width;
        const height = canvas.width * aspectRatio;

        ctx.drawImage(logoSvg, 0,0, width, height)
     
        this.setState({mainImgWidth: width, mainImgHeight: height, orientationNumber: canvas.width / 10})
      } else if (logoSvg.width > logoSvg.height) {
        aspectRatio = mainImg.width / mainImg.height; 
        const width = canvas.width;
        const height = canvas.height  / aspectRatio;
     
        this.setState({mainImgWidth: width, mainImgHeight: height, orientationNumber: canvas.height / 8})
        ctx.drawImage(logoSvg, 0, canvas.height / 8, width, height)
      }
      
      
    
      let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.setState({originalPhoto: pixelsOriginal, imageState:imageState.concat(pixelsOriginal), activeImageState: activeImageState + 1})
    }
    
    
    logoSvg.src = uploadedImage;
    
    this.setState({mainImgWidth: mainImg.width, mainImgHeight: mainImg.height})
}

selectSticker = (sticker) => {
  this.setState({selectedSticker: sticker})
}
//FOR SAVING THE IMAGE
saveImage = () => {
const canvas = this.refs.canvas;
const ctx = canvas.getContext('2d');
let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;
const { stickers } = this.state;

const pixels = ctx.getImageData(0,0, canvas.width, canvas.height);

   for(let i = 0; i < stickers.length; i++) {
    const logoSvg = new Image();
    logoSvg.src = stickers[i].src;
    logoSvg.onload = () => {
     
         
            ctx.drawImage(logoSvg, stickers[i].x - canvasXbounding - (stickers[i].width / 2), stickers[i].y - canvasYbounding - (stickers[i].height / 2), stickers[i].width * stickers[i].size , stickers[i].height * stickers[i].size);
   }
  }



setTimeout(() => {
const link = document.createElement('a');
link.className = "modalSave"
const image = document.createElement('img');
const trimmedCanvas = trimCanvas(canvas);
image.src = trimmedCanvas.toDataURL();

link.innerHTML = 'download image';
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

selectStickerSize = e => {
  this.setState({stickerSize: e.target.value })
}

addImg = (e) => {
  const { mouseX, mouseY, selectedSticker, stickerSize, stickers } = this.state;

    let size;
    switch(stickerSize) {
      case 'sm':
        size = 1.5;
        break;
        case 'md':
        size = 2;
        break;
        case 'lg':
        size = 3;
        break;
        case 'xl':
        size = 4;
        break;
        case 'xxl':
        size = 5;
        break;
      default:
      size = 1
    }

    const sticker = {
      title: selectedSticker.title,
      src: selectedSticker.src,
      width: selectedSticker.width,
      height: selectedSticker.height,
      x: mouseX,
      y: mouseY,
      size,
      id: new Date().toISOString(),
      isDragging: false
    }

    this.setState({ stickers: stickers.concat(sticker) });
  }
  
  filter = () => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    
    const { selectedFilter, imageState, activeImageState } = this.state;
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + selectedFilter.r; // RED
      pixels.data[i + 1] = pixels.data[i + 1] + selectedFilter.g; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] + selectedFilter.b; // Blue
    }
    
    
    ctx.putImageData(pixels, 0, 0);
    let pixelsAfterFilter = ctx.getImageData(0, 0, canvas.width, canvas.height);

    this.setState({ imageState: imageState.concat(pixelsAfterFilter), activeImageState: activeImageState + 1 })
  }

  selectFilter = (filter) => {
    this.setState({selectedFilter: filter})
  }

  adjustBrightness = (e) => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    if(e.target.className === 'add') {
      for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 10; // RED
        pixels.data[i + 1] = pixels.data[i + 1] + 10; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] + 10; // Blue
        // pixels.data[i + 3] = pixels.data[i + 3] + 10; */
    } 

    } else {
      for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] - 10; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 10; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] - 10; // Blue
      }
    }

    
    ctx.putImageData(pixels, 0, 0);
    const { imageState, activeImageState } = this.state;
    this.setState({imageState: imageState.concat(pixels), activeImageState: activeImageState + 1})
  }
  
  undoRedo = (e) => {
    const { imageState, activeImageState } = this.state;

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    if(e.target.className === 'undo')  {
      if(activeImageState === 0) return;
      this.setState({activeImageState: activeImageState - 1})
      ctx.putImageData(imageState[activeImageState - 1], 0, 0);
      if(imageState.length === activeImageState + 2) {
        this.setState({ imageState: imageState.slice(0, imageState.length - 1)})
      }
    } else {
      if(activeImageState + 1 === imageState.length) return
      this.setState({activeImageState: activeImageState + 1})
      ctx.putImageData(imageState[activeImageState + 1], 0, 0);
    }
  } 

  render() {
    const { uploadedImage, selectedSticker, stickerSize, selectedFilter, showModal, paintBrush, showTextForm, top, bottom, middle, stickers, dragging, mobile } = this.state;
    return (
      <div className="App">
        <div className="topPart">
          <StickerContainer selectSticker={this.selectSticker} selectStickerSize={this.selectStickerSize} selectedSticker={selectedSticker} stickerSize={stickerSize} secondaryClassname="forDesktop"/>
          <Modal showModal={showModal} />
          <PaintBrush togglePaintMode={this.togglePaintMode} setPaintBrushSettings={this.setPaintBrushSettings} paintBrush={paintBrush}  textSettings={this.textSettings} showTextForm={showTextForm} top={top} bottom={bottom} middle={middle} addText={this.addText} secondaryClassname="forDesktop" />
         <canvas ref="canvas" width={mobile ? window.innerWidth : 500} height={mobile ? window.innerHeight : 500} onMouseEnter={this.handleMouseEnter} onMouseDown={this.togglePaintMode} onMouseUp={this.togglePaintMode} onMouseMove={this.paint} onClick={this.setMouseCordinates}  onTouchStart={this.togglePaintMode} onTouchMove={this.paint}  onTouchEnd={this.togglePaintMode} className="canvas"></canvas>
         {stickers.length > 0 && stickers !== undefined ? stickers.map(sticker => (
           <img key={sticker.id} src={sticker.src} alt="sticker" style={{position: 'absolute', width: `${sticker.width * sticker.size}px`, height: `${sticker.height * sticker.size}`,  top: `${sticker.y - sticker.height / 2}px`, left: `${sticker.x - sticker.width / 2}px`}} id={sticker.id}  onMouseMove={this.dragSticker} onTouchMove={this.dragSticker} onClick={() => this.setState({dragging: !dragging})} onMouseLeave={() => this.setState({dragging: false})} onDoubleClick={this.deleteSticker} draggable="true" />
         )): null }
         <FilterContainer selectFilter={this.selectFilter} selectedFilter={selectedFilter} secondaryClassname="forDesktop"/>
         </div>
         <Buttons 
         adjustBrightness={this.adjustBrightness} 
         addImg={this.addImg} 
         undoRedo={this.undoRedo} 
         saveImage={this.saveImage} 
         filter={this.filter} 
         imageUploadHandler={this.imageUploadHandler}
         secondaryClassname="forDesktop"
         />
         {uploadedImage !== null ? <img src={uploadedImage} ref="mainImg" alt="mainImg" style={{display: 'none'}}/> : null }
         <div className="forMobile">
          <MobileToolbar
          selectSticker={this.selectSticker} 
          selectStickerSize={this.selectStickerSize} 
          selectedSticker={selectedSticker} 
          stickerSize={stickerSize}
          addImg={this.addImg}
          selectFilter={this.selectFilter} 
          selectedFilter={selectedFilter}
          filter={this.filter}  
          imageUploadHandler={this.imageUploadHandler}
          adjustBrightness={this.adjustBrightness}
          undoRedo={this.undoRedo} 
          saveImage={this.saveImage} 
          setPaintBrushSettings={this.setPaintBrushSettings} 
          paintBrush={paintBrush}
          textSettings={this.textSettings} 
          showTextForm={showTextForm} 
          top={top} 
          bottom={bottom} 
          middle={middle} 
          addText={this.addText} 
          togglePaintMode={this.togglePaintMode}
          />
         </div>
      </div>
    );
  }
}

export default App;
