import React, { Component } from 'react';
import StickerContainer from '../stickerContainer/StickerContainer';
import FilterContainer from '../filterContainer/FilterContainer';
import MobileTools from './MobileTools';
import PaintBrush from '../paintBrush/PaintBrush';
import { stickers } from '../stickerContainer/stickerSvgs/';
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
  render() {
    const { selectSticker, selectStickerSize, selectedSticker, stickerSize, selectFilter, selectedFilter, addImg, filter,imageUploadHandler, adjustBrightness, undoRedo, saveImage, setPaintBrushSettings, paintBrush, textSettings, showTextForm, top, bottom, middle, addText, togglePaintMode } = this.props;
    const { showFilters, showStickers, showMobileTools} = this.state;
    let outputMenu;

    if(showStickers) {
      outputMenu = <StickerContainer 
      selectSticker={selectSticker} 
      selectStickerSize={selectStickerSize} 
      selectedSticker={selectedSticker} 
      stickerSize={stickerSize}
      stickers={stickers}
      />;
    } else if (showFilters) {
      outputMenu = <FilterContainer selectFilter={selectFilter} selectedFilter={selectedFilter} /> 
    } else if (showMobileTools) {
      outputMenu = (
        <MobileTools>
        <button onClick={adjustBrightness} className="add">Brightness +</button>
        <button onClick={adjustBrightness} className="decrease">Brightness -</button>
        <button onClick={undoRedo} className="undo">Undo</button>
        <button onClick={undoRedo} className="redo">Redo</button>
        <button onClick={saveImage}> <img src={icons.save} alt="save"/> Save</button>
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
        <button onClick={addImg}>Add Sticker</button>
        <button onClick={this.toggleMenus} className="showFilters">Filters</button>
        <button onClick={filter}>Add Filter</button>
        <label className="fileContainer">
      <img src={icons.camera} alt="camera"/>
      Click to choose an image
      <input type="file" name="image" onChange={imageUploadHandler} accept="image/png" /> 
      </label>
      </div>
    )
  }
}

export default MobileToolbar;