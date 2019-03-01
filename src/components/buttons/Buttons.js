import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addSticker } from '../../actions/stickerActions';
import { addFilter, addBrightness, decreaseBrightness } from '../../actions/filterActions';
import { saveImage, saveImageState, decrementActiveImageState, incrementActiveImageState } from '../../actions/canvasActions';
import { icons } from '../../icons';

class Buttons extends Component {

  addSticker = (e) => {
   const  { mouseX, mouseY } = this.props;
   const { stickerSize, selectedSticker } = this.props.stickers;
  
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
  
      this.props.addSticker(sticker);
     //this.setState({ stickers: stickers.concat(sticker) });
    }

    async addFilter() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      
      let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = {
        filter: this.props.filters.selectedFilter,
        ctx: ctx
      }
      await this.props.addFilter(data)
     
      try {
        this.props.saveImageState(pixelsOriginal);
      } catch(err) {
        console.log(err);
      }
    }

    addBrightness = () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      this.props.addBrightness(ctx);
      let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.props.saveImageState(pixelsOriginal);
    }

    decreaseBrightness = () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      this.props.decreaseBrightness(ctx);
      let pixelsOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.props.saveImageState(pixelsOriginal);
    }

    saveImage = () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const data = {
        ctx: ctx,
        addedStickers: this.props.stickers.addedStickers
      }

      this.props.saveImage(data);
    }

   async undo () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    await this.props.decrementActiveImageState();
      try {
        ctx.putImageData(this.props.canvas.imageState[this.props.canvas.activeImageState], 0, 0);
      } catch(err) {
        console.log(err);
      }
    }

    async redo () {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      await this.props.incrementActiveImageState();
        try {
          ctx.putImageData(this.props.canvas.imageState[this.props.canvas.activeImageState - 1], 0, 0);
        } catch(err) {
          console.log(err);
        }
      }
  render() {
    const { imageUploadHandler, secondaryClassname } = this.props;

    return (
      <div className={`buttons ${secondaryClassname}`}>
      <button onClick={this.addBrightness} className="add">Brightness +</button>
      <button onClick={this.decreaseBrightness} className="decrease">Brightness -</button>
      <button onClick={this.addSticker}>Add a Sticker</button>
      <button onClick={this.undo.bind(this)} className="undo">Undo</button>
      <button onClick={this.redo.bind(this)} className="redo">Redo</button>
      <button onClick={this.saveImage} ref="save"> <img src={icons.save} alt="save"/> Save</button>
      <button onClick={this.addFilter.bind(this)}>Filter</button>
      <label className="fileContainer">
      <img src={icons.camera} alt="camera"/>
      Click to choose an image
      <input type="file" name="image" onChange={imageUploadHandler} accept="image/*" /> 
      </label>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stickers: state.stickers,
  filters: state.filters,
  canvas: state.canvas
})

export default connect(mapStateToProps, { addSticker, addFilter, addBrightness, decreaseBrightness, saveImage, saveImageState, decrementActiveImageState, incrementActiveImageState })(Buttons);