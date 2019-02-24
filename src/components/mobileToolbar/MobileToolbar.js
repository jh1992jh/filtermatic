import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSticker } from '../../actions/stickerActions';
import { addFilter, addBrightness, decreaseBrightness } from '../../actions/filterActions';
import { saveImage, saveImageState, decrementActiveImageState, incrementActiveImageState } from '../../actions/canvasActions';

import StickerContainer from '../stickerContainer/StickerContainer';
import FilterContainer from '../filterContainer/FilterContainer';
import MobileTools from './MobileTools';
import PaintBrush from '../paintBrush/PaintBrush';
import { icons } from '../../icons';

class MobileToolbar extends Component {
  state = {
    showFilters: false,
    showStickers: false,
    showMobileTools: false
  }

  toggleMenus = (e) => {
    const { showFilters, showStickers, showMobileTools } = this.state;
    if(e.target.className === "showStickers") {
      this.setState({showStickers: !showStickers, showFilters: false, showMobileTools: false})
    }

    if(e.target.className === "showFilters") {
      this.setState({showFilters: !showFilters, showStickers: false, showMobileTools: false})
    }

    if(e.target.className === "showMobileTools") {
      this.setState({showMobileTools: !showMobileTools, showStickers: false, showFilters: false})
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

  async undo () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
      try {
        await this.props.decrementActiveImageState();
        ctx.putImageData(this.props.canvas.imageState[this.props.canvas.activeImageState - 1], 0, 0);
      } catch(err) {
        console.log(err);
      }
    }

    async redo () {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
        try {
          await this.props.incrementActiveImageState();
          ctx.putImageData(this.props.canvas.imageState[this.props.canvas.activeImageState - 1], 0, 0);
        } catch(err) {
          console.log(err);
        }
      }

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
         }
         
    addFilter = () => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const data = {
        filter: this.props.filters.selectedFilter,
        ctx: ctx
      }

      this.props.addFilter(data)
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
  render() {
    const { imageUploadHandler, setPaintBrushSettings, paintBrush, textSettings, showTextForm, top, bottom, middle, addText, togglePaintMode } = this.props;
    const { showFilters, showStickers, showMobileTools} = this.state;
    let outputMenu;

    if(showStickers) {
      outputMenu = <StickerContainer 
      />;
    } else if (showFilters) {
      outputMenu = <FilterContainer /> 
    } else if (showMobileTools) {
      outputMenu = (
        <MobileTools>
        <button onClick={this.addBrightness} className="add">Brightness +</button>
        <button onClick={this.decreaseBrightness} className="decrease">Brightness -</button>
        <button onClick={this.undo.bind(this)} className="undo">Undo</button>
        <button onClick={this.redo.bind(this)} className="redo">Redo</button>
        <button onClick={this.saveImage}> <img src={icons.save} alt="save"/> Save</button>
        <PaintBrush togglePaintMode={togglePaintMode} setPaintBrushSettings={setPaintBrushSettings} paintBrush={paintBrush}  textSettings={textSettings} showTextForm={showTextForm} top={top} bottom={bottom} middle={middle} addText={addText} secondaryClassname="forMobile" />
        </MobileTools>
      )
    }else {
      outputMenu = null;
    }
    return (
      <div className="mobileToolbar">
        {outputMenu}
        <button onClick={this.toggleMenus} className="showMobileTools">Tools</button>
        <button onClick={this.toggleMenus} className="showStickers">Stickers</button>
        <button onClick={this.addSticker}>Add Sticker</button>
        <button onClick={this.toggleMenus} className="showFilters">Filters</button>
        <button onClick={this.addFilter}>Add Filter</button>
        <label className="fileContainer">
      <img src={icons.camera} alt="camera"/>
      Click to choose an image
      <input type="file" name="image" onChange={imageUploadHandler} accept="image/png" /> 
      </label>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  canvas: state.canvas,
  stickers: state.stickers,
  filters: state.filters
})

export default connect(mapStateToProps, { addSticker, addFilter, addBrightness, decreaseBrightness, saveImage, saveImageState, decrementActiveImageState, incrementActiveImageState  })(MobileToolbar);