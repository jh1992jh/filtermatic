import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addText } from '../../actions/textActions';
import { changeBrushWidth, changeBrushColor } from '../../actions/paintActions';

class PaintBrush extends Component {
  state = {
    showTextForm: false,
    top: '',
    middle: '',
    bottom: ''
  }

  toggleTextForm = () => {
    const { showTextForm } = this.state;
    this.setState({showTextForm: !showTextForm})
  }

  inputText = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  addText = e => {
    e.preventDefault();

    const { top, bottom, middle } = this.state;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const data = {
      ctx: ctx,
      top: top,
      middle: middle,
      bottom: bottom
    }

    this.props.addText(data);
  }
  render() {
      const { secondaryClassname } = this.props;
      const { showTextForm, top, bottom, middle } = this.state;
    return (
      <div className={`paintBrush ${secondaryClassname}`}>
      {showTextForm ? (
        <form className="textForm" onSubmit={this.addText}>
          <input type="text" name="top" value={top} onChange={this.inputText}/>
          <input type="text" name="middle" value={middle} onChange={this.inputText}/>
          <input type="text" name="bottom" value={bottom} onChange={this.inputText}/>
          <button type="submit">Add Text</button>
        </form>
      ) : null }
      {/*  <button onClick={togglePaintMode}>Paint</button> */}
      <button className="textButton" onClick={this.toggleTextForm}>T</button>
      <input type="range" name="width" min="3" max="100" value={this.props.paint.width} step="1" className="strokeWidth" onChange={(e) => this.props.changeBrushWidth(e.target.value)} />
        <input type="color" name="color" value={this.props.paint.color}  onChange={(e) => this.props.changeBrushColor(e.target.value)} className="strokeColor" />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  paint: state.paint
})

export default connect(mapStateToProps, { addText, changeBrushWidth, changeBrushColor })(PaintBrush);