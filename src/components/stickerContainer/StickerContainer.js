import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectSticker, selectStickerSize } from '../../actions/stickerActions';

class StickerContainer extends Component {
  render() {
      const { secondaryClassname } = this.props;
      const { selectedSticker, stickers} = this.props.stickers;
      let outputStickers = stickers.map(sticker => (
          <img key={sticker.title} src={sticker.src} alt="sticker" onClick={() => this.props.selectSticker(sticker)} className={selectedSticker.title === sticker.title ? 'selected' : null}/>
      ))

    return (
      <div className={`stickerContainer ${secondaryClassname}`}>
      <div className="infoAndSelectors">
        <h3>Stickers</h3>
        <select name="stickerSize" onChange={(e) => this.props.selectStickerSize(e.target.value)}>
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

const mapStateToProps = state => ({
  stickers: state.stickers
})

export default connect(mapStateToProps, { selectSticker, selectStickerSize })(StickerContainer);