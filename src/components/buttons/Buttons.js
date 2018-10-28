import React, { Component } from 'react'
import { icons } from '../../icons';

class Buttons extends Component {
  render() {
    const { adjustBrightness, addImg, undoRedo, saveImage, filter, imageUploadHandler, secondaryClassname } = this.props;
    return (
      <div className={`buttons ${secondaryClassname}`}>
      <button onClick={adjustBrightness} className="add">Brightness +</button>
      <button onClick={adjustBrightness} className="decrease">Brightness -</button>
      <button onClick={addImg}>Add a Sticker</button>
      <button onClick={undoRedo} className="undo">Undo</button>
      <button onClick={undoRedo} className="redo">Redo</button>
      <button onClick={saveImage} ref="save"> <img src={icons.save} alt="save"/> Save</button>
      <button onClick={filter}>Filter</button>
      <label className="fileContainer">
      <img src={icons.camera} alt="camera"/>
      Click to choose an image
      <input type="file" name="image" onChange={imageUploadHandler} accept="image/*" /> 
      </label>
      </div>
    )
  }
}

export default Buttons;