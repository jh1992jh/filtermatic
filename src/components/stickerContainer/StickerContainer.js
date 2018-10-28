import React, { Component } from 'react';
import { stickers } from './stickerSvgs';

class StickerContainer extends Component {
  render() {
      const { selectSticker, selectStickerSize, selectedSticker, secondaryClassname } = this.props;
      let outputStickers = stickers.map(sticker => (
          <img key={sticker.title} src={sticker.src} alt="sticker" onClick={() => selectSticker(sticker)} className={selectedSticker.title === sticker.title ? 'selected' : null}/>
      ))

    return (
      <div className={`stickerContainer ${secondaryClassname}`}>
      <div className="infoAndSelectors">
        <h3>Stickers</h3>
        <select name="stickerSize" onChange={selectStickerSize}>
          <option value="sm">Small</option>
          <option selected value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
          <option value="xxl">Extra extra Large</option>
        </select>
        </div>
        <div className="stickers">
        {outputStickers}
        </div>
      </div>
    )
  }
}

export default StickerContainer;