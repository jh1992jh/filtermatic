import React, { Component } from 'react'

class PaintBrush extends Component {
  render() {
      const { setPaintBrushSettings, paintBrush, showTextForm, top, bottom, middle, textSettings, addText, secondaryClassname } = this.props;
    return (
      <div className={`paintBrush ${secondaryClassname}`}>
      {showTextForm ? (
        <form className="textForm" onSubmit={addText}>
          <input type="text" name="top" value={top} onChange={textSettings}/>
          <input type="text" name="middle" value={middle} onChange={textSettings}/>
          <input type="text" name="bottom" value={bottom} onChange={textSettings}/>
          <button type="submit">Add Text</button>
        </form>
      ) : null }
      {/*  <button onClick={togglePaintMode}>Paint</button> */}
      <button className="textButton" onClick={textSettings}>T</button>
      <input type="range" name="width" min="3" max="100" value={paintBrush.width} step="1" className="strokeWidth" onChange={setPaintBrushSettings} />
        <input type="color" name="color" value={paintBrush.color}  onChange={setPaintBrushSettings} className="strokeColor" />
      </div>
    )
  }
}

export default PaintBrush;