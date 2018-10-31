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
  mainImgWidth: 500,
  mainImgHeight: 500,
  selectedSticker: stickers[0],
  stickerSize: 'md',
  selectedFilter: filters[0],
  originalPhoto: null,
  imageState: [],
  activeImageState: 0,
  showModal: {},
  paintBrush: {paint: false, color: '#00a6fb', width: 5},
  showTextForm: false,
  top: '',
  middle: '',
  bottom: ''

}
 componentDidMount() {
   const canvas = this.refs.canvas;
   const ctx = canvas.getContext('2d');
   let canvasX = canvas.width / 2;
   let canvasY = canvas.height / 2;
   
   ctx.font = "30px Arial";
   ctx.textAlign = "center";
   ctx.fillStyle = "rgba(150, 150, 150, 1)"
   ctx.fillText("Choose An Image To Edit", canvasX, canvasY); 

   let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
   const { imageState } = this.state;
   this.setState({imageState: imageState.concat(pixelsOriginal)})
  }
  
  imageUploadHandler = e => {
    this.setState({uploadedImage: URL.createObjectURL(e.target.files[0])})
    setTimeout(() => this.uploadMainImg(), 100) 
  }
  
  handleMouseMove = e => {
    //return;
    const canvas = this.refs.canvas;
    
 // FOR MAKING THE PAINTING WORK ON MOBILE
   console.log(e.touches)
    console.log(e.touches[0].clientX) 

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
    } else if(e.target.className = "strokeWidth") {
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

    /* if(e.target.className = "strokeWidth") {
      this.setState((prevState) => {
        return {
          paintBrush: {
            paint: prevState.paintBrush.paint,
            color: prevState.paintBrush.color,
            width: value
          }
        }
      })
    } */
  }

  textSettings = (e) => {
    const value = e.target.value;

    const { showTextForm } = this.state;
    console.log(e.target.className)
    if(e.target.className === "textButton") {
      this.setState({showTextForm: !showTextForm})
    }

    this.setState({[e.target.name]: value})
    
  }

  addText = (e) => {
    e.preventDefault();
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const topY = canvas.height * 0.1;
    const centerY = canvas.height * 0.5;
    const bottomY = canvas.height * 0.9;

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
        console.log(e.touches[0])
        console.log(rect)
        this.setState({mouseX: e.touches[0].clientX + rect.y , mouseY: e.touches[0].clientY - rect.y })
      }
      ctx.strokeStyle = paintBrush.color;
      ctx.lineWidth = paintBrush.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      if(e.touches) {
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(e.touches[0].clientX + rect.y, e.touches[0].clientY - rect.y)
      } else {
        ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(mouseXposition, mouseYposition );
      }
      ctx.stroke();
    }

    //this.setState({mouseX: mouseXposition, mouseY: mouseYposition});

  }
  
  setMouseCordinates = e => {
    const canvas = this.refs.canvas;
    let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;
    
    const modalCordinates = {
      x: e.clientX - canvasXbounding,
      y: e.clientY - canvasYbounding
    }
    this.setState({mouseX: e.clientX, mouseY: e.clientY, showModal: modalCordinates }); 
    setTimeout(() => this.setState({showModal: {}}), 2000) 
    let rect = canvas.getBoundingClientRect();
    console.log(e)
    if(rect.x === 0) {
      this.setState({mouseX: e.clientX + rect.y, mouseY: e.clientY})
    }
  }
  
  
  uploadMainImg = () => {
    const { uploadedImage, imageState, activeImageState, mainImgWidth, mainImgHeight } = this.state;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const logoSvg = new Image();
    ctx.clearRect(0,0, canvas.width, canvas.height)
    const mainImg = this.refs.mainImg;
    logoSvg.onload = () => {
      if(logoSvg.height > logoSvg.width) {
        const width = canvas.height / 1.91;
        const height = width * 1.91
       // canvas.width = width;
      // canvas.height = height;
        ctx.drawImage(logoSvg, canvas.width / 4,0, width, height)
        console.log(width, height)
        this.setState({mainImgWidth: width, mainImgHeight: height})
      } else if (logoSvg.width > logoSvg.height) {
        const width = canvas.width;
        const height = canvas.height  - (canvas.height / 4)
      // canvas.width = width;
      //  canvas.height = height;
        this.setState({mainImgWidth: width, mainImgHeight: height})
        ctx.drawImage(logoSvg, 0, canvas.height / 8, width, height)
      }
      
      
      
      // IDEA ROTATE CANVAS IF IMG HEIGHT > WIDTH 
      console.log(logoSvg.width)
      console.log(logoSvg)
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

var link = document.createElement('a');
link.className = "modalSave"
const image = document.createElement('img');
//const test = document.createElement('p');
const trimmedCanvas = trimCanvas(canvas);
image.src = trimmedCanvas.toDataURL();
console.log(image.height)
link.innerHTML = 'download image';
console.log(this.state.imageState)
//test.innerText = 'test'
link.appendChild(image)
console.log(trimmedCanvas.height )
link.style.height = `${trimmedCanvas.height + 30}px`
link.addEventListener('click', function(ev) {
link.href = trimmedCanvas.toDataURL();
link.download = `FilterMatic${new Date().toISOString()}.png`
link.remove();
}, false);
document.body.appendChild(link); 
document.body.addEventListener('click', () => link.remove())
}

selectStickerSize = e => {
  this.setState({stickerSize: e.target.value })
}

addImg = () => {

  // IDEA HOW REMOVING A STICKER MIGHT WORK, BEFORE EACH STICKER ADD SAVE THE IMAGE DATA TimPREVIMAGESTATE, MAKE IT AN ARRAY THEN THE REMOVE FUNCTION JUST DELETES ONE OBJECT FRim PREVIMAGESTATE(array of objects) FILTERING AND RETURNING THE NEW ARRAY WHICH DOESEN'T HAVE THE STICKER
  const { mouseX, mouseY, selectedSticker, stickerSize, imageState, activeImageState } = this.state;
  const canvas = this.refs.canvas;
  const ctx = canvas.getContext('2d');
    const logoSvg = new Image();
    // FOR GETTING THE POSITION OF THE CANVAS ON THE SCREEN, NEEDED FOR BEING ABLE TO PLACE THE STICKERS TO CORRECT PLACES
    let canvasXbounding = canvas.getBoundingClientRect().x;
    let canvasYbounding = canvas.getBoundingClientRect().y;
    let size;
    switch(stickerSize) {
      case 'sm':
        size = 1;
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
    
    logoSvg.onload = () => {
      //ctx.drawImage(logoSvg, mouseX - 86, mouseY, 200, 200);
      // FOR IMAGES WHERE YOU WANT TO DETERMINE THE POSITION YOURSELF LIKE STICKERS ETC...
      ctx.drawImage(logoSvg, mouseX - canvasXbounding - (selectedSticker.width * size) / 2, mouseY - canvasYbounding - (selectedSticker.height * size) / 2, selectedSticker.width * size , selectedSticker.height * size);
      let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.setState({originalPhoto: pixelsOriginal, imageState:imageState.concat(pixelsOriginal), activeImageState: activeImageState + 1})
    }

    
    logoSvg.src = selectedSticker.src;
    console.log(canvas.getBoundingClientRect().x)
  }
  
  filter = () => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
   // let pixelsOriginal = ctx.getImageData(0, 0, 500, 500);
    //this.setState({originalPhoto: pixelsOriginal})
    
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(pixels)
    
    const { selectedFilter, originalPhoto, imageState, activeImageState } = this.state;
    // pixels = rgbSplit(pixels);
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + selectedFilter.r; // RED
      pixels.data[i + 1] = pixels.data[i + 1] + selectedFilter.g; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] + selectedFilter.b; // Blue
      // TRY ADDING AN ALPHA HERE E.g [i + 4]
    }
    
    if(selectedFilter.title === 'No Filter') {
      ctx.putImageData(originalPhoto, 0, 0)
      console.log(originalPhoto)
    } else {
      ctx.putImageData(pixels, 0, 0);
    }
    
    let pixelsAfterFilter = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //ctx.globalAlpha = 0.1;
    //return pixels;
    if(imageState.length === activeImageState + 1) {
      this.setState({ imageState: imageState.concat(pixelsAfterFilter), activeImageState: activeImageState + 1 })
    }
    
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
       /* pixels.data[i + 0] = pixels.data[i + 0] + 10; // RED
        pixels.data[i + 1] = pixels.data[i + 1] + 10; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] + 10; // Blue
        // pixels.data[i + 3] = pixels.data[i + 3] + 10; */

       /* 
        // RGB SPLIT FILTER TESTING
        pixels.data[i - 100] = pixels.data[i + 0] + 100;
        pixels.data[i + 100] = pixels.data[i + 1] + 100;
        pixels.data[i - 100] = pixels.data[i + 2] + 100; */
      } 
      console.log(pixels.data[0])
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
    
    
      
      console.log(imageState[activeImageState])
  } 

  render() {
    const { uploadedImage, selectedSticker, stickerSize, selectedFilter, showModal, paintBrush, showTextForm, top, bottom, middle, mainImgHeight, mainImgWidth } = this.state;
    return (
      <div className="App">
        <div className="topPart">
          <StickerContainer selectSticker={this.selectSticker} selectStickerSize={this.selectStickerSize} selectedSticker={selectedSticker} stickerSize={stickerSize} secondaryClassname="forDesktop"/>
          <Modal showModal={showModal} />
          <PaintBrush togglePaintMode={this.togglePaintMode} setPaintBrushSettings={this.setPaintBrushSettings} paintBrush={paintBrush}  textSettings={this.textSettings} showTextForm={showTextForm} top={top} bottom={bottom} middle={middle} addText={this.addText} secondaryClassname="forDesktop" />
         <canvas ref="canvas" width="500" height="500" onMouseEnter={this.handleMouseEnter} onMouseDown={this.togglePaintMode} onMouseUp={this.togglePaintMode} onMouseMove={this.paint} onClick={this.setMouseCordinates}  onTouchStart={this.togglePaintMode} onTouchMove={this.paint}  onTouchEnd={this.togglePaintMode} onTouch={this.setMouseCordinates} className="canvas"></canvas>
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
