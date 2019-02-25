import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setCanvasRef, handleMouseMove, uploadMainImg, saveImageState } from './actions/canvasActions';
import { togglePaintMode, applyPaint } from './actions/paintActions';

import StickerContainer from './components/stickerContainer/StickerContainer';
import FilterContainer from './components/filterContainer/FilterContainer';
import Buttons from './components/buttons/Buttons';
import PaintBrush from './components/paintBrush/PaintBrush';
import MobileToolbar from './components/mobileToolbar/MobileToolbar';
import './App.scss';
import StickerComp from './components/stickerContainer/StickerComp';



class App extends Component {
state = {
  mouseX: 0,
  mouseY: 0,
  canvasXbounding: null,
  canvasYbounding: null,
  canvasRightBounding: null,
  canvasBottomBounding: null,
  uploadedImage: null,
  orientationNumber: 0,
  originalPhoto: null,
  mobile: null
}
 componentDidMount() {
   
   //this.props.setCanvasRef(this.refs.canvas);
   const canvas = this.refs.canvas;
  const ctx = canvas.getContext('2d');

  let canvasXbounding = canvas.getBoundingClientRect().x;
  let canvasYbounding = canvas.getBoundingClientRect().y;
  let canvasRightBounding = canvas.getBoundingClientRect().right;
  let canvasBottomBounding = canvas.getBoundingClientRect().bottom;

  this.setState({mouseX: canvasXbounding + (canvas.width / 2), mouseY: canvasYbounding + (canvas.height / 2), canvasXbounding: canvasXbounding, canvasYbounding: canvasYbounding, canvasRightBounding: canvasRightBounding, canvasBottomBounding: canvasBottomBounding})
   
   const { mobile } = this.state;
  
   
   function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

  if(isMobileDevice() === true) {
    console.log('User is on a mobile device, adjusting the canvas size')
    this.setState({mobile: true});
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
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
}
  
  imageUploadHandler = e => {
    this.setState({uploadedImage: URL.createObjectURL(e.target.files[0])})
    setTimeout(() => this.uploadMainImg(), 100) 
  }
  
  handleMouseMove = e => {
    const { paint } = this.props;
    const { mouseY, mouseX } = this.state;

    if(paint.paint) {

      const paintData = {
        mouseX: mouseX,
        mouseY: mouseY,
        color: paint.color,
        width: paint.width,
        clientX: e.clientX,
        clientY: e.clientY
      }

      this.props.applyPaint(paintData);
    }
    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect()
    this.setState({mouseX: e.clientX - rect.left, mouseY: e.clientY - rect.y})
  }

  handleTouchPaint = e => {
    const { paint } = this.props;
    const { mouseY, mouseX } = this.state;


    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect()

    if(this.props.paint.paint) {
      this.setState({mouseX: e.touches[0].clientX - rect.left, mouseY: e.touches[0].clientY - rect.y})

      const paintData = {
        mouseX: mouseX,
        mouseY: mouseY,
        color: paint.color,
        width: paint.width,
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      }

      this.props.applyPaint(paintData);
    
      this.setState({mouseX: e.touches[0].clientX - rect.left, mouseY: e.touches[0].clientY - rect.y})
    }

  }

  togglePaintMobile = e => {

    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect()    
    this.props.togglePaintMode()
    this.setState({mouseX: e.touches[0].clientX - rect.left, mouseY: e.touches[0].clientY - rect.y})
  }
   
  setMouseCordinates = e => {
      this.setState({mouseX: e.clientX, mouseY: e.clientY})
      return;
  }
  
  async uploadMainImg () {
    const { uploadedImage } = this.state;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');

    const data = {
      ctx: ctx,
      imageData: uploadedImage
    }

    await this.props.uploadMainImg(data);
   
    try {
      let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.props.saveImageState(pixelsOriginal);
    } catch (err) {
      console.log(err);
    }
      
    


  }

  render() {
    const { uploadedImage, paintBrush, showTextForm, top, bottom, middle, mobile, mouseX, mouseY, canvasXbounding, canvasYbounding, canvasRightBounding, canvasBottomBounding } = this.state;
    const { addedStickers } = this.props.stickers;
    const canvas = React.createRef()


    
    return (
     
        <div className="App">
          <div className="topPart">
            <StickerContainer secondaryClassname="forDesktop"/>
            <PaintBrush togglePaintMode={this.togglePaintMode} setPaintBrushSettings={this.setPaintBrushSettings} paintBrush={paintBrush}  textSettings={this.textSettings} showTextForm={showTextForm} top={top} bottom={bottom} middle={middle} addText={this.addText} secondaryClassname="forDesktop" />
          <canvas ref="canvas" id="canvas" width={mobile ? window.innerWidth : 500} height={mobile ? window.innerHeight * 0.8 : 500} onMouseEnter={this.handleMouseMove} onMouseDown={this.props.togglePaintMode}  onMouseUp={this.props.togglePaintMode} /*onMouseMove={this.paint}*/ onMouseMove={this.handleMouseMove} onClick={this.setMouseCordinates}  onTouchEnd={this.props.togglePaintMode} onTouchStart={this.togglePaintMobile} onTouchMove={this.handleTouchPaint} className="canvas"></canvas>
          {addedStickers.length > 0 && addedStickers !== undefined ? addedStickers.map(sticker => (
            <StickerComp sticker={sticker} mouseX={mouseX} mouseY={mouseY} canvasXbounding={canvasXbounding} canvasYbounding={canvasYbounding} canvasRightBounding={canvasRightBounding} canvasBottomBounding={canvasBottomBounding}/>
          )): null }
          <FilterContainer  secondaryClassname="forDesktop"/>
          </div>
          <Buttons 
          adjustBrightness={this.adjustBrightness} 
          imageUploadHandler={this.imageUploadHandler}
          secondaryClassname="forDesktop"
          mouseX={mouseX}
          mouseY={mouseY}
          />
          {uploadedImage !== null ? <img src={uploadedImage} ref="mainImg" id="mainImg" alt="mainImg" style={{display: 'none'}}/> : null }
          <div className="forMobile">
           { <MobileToolbar
            imageUploadHandler={this.imageUploadHandler}
            mouseX={mouseX}
            mouseY={mouseY}
          />}
          </div>
        </div>
    
    );
  }
}

const mapStateToProps = state => ({
  canvas: state.canvas,
  stickers: state.stickers,
  paint: state.paint
})

export default connect(mapStateToProps, { setCanvasRef, handleMouseMove, uploadMainImg, togglePaintMode, applyPaint, saveImageState })(App);
