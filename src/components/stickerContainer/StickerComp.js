import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteSticker, saveNewStickerCordinates } from '../../actions/stickerActions';

class StickerComp extends Component {
    state = {
        dragging: false,
        cordinatesX: window.innerWidth / 2,
        cordinatesY: window.innerHeight / 2
    }

    dragSticker = (e) => {
        const { sticker, canvasXbounding, canvasYbounding, canvasRightBounding, canvasBottomBounding } = this.props;
        const { dragging } = this.state;
        

        if(dragging) {
        
    
            if(e.clientX - sticker.width < canvasXbounding) {
                this.setState({cordinatesX: canvasXbounding});
            } else if(e.clientX + sticker.width > canvasRightBounding) {
                this.setState({cordinatesX: canvasRightBounding - (sticker.width * 2)});
            } else if(e.clientY - sticker.height < canvasYbounding) {
                this.setState({cordinatesY: canvasYbounding})
            } else if(e.clientY + sticker.height > canvasBottomBounding) {
                this.setState({cordinatesY: canvasBottomBounding - (sticker.height * 2)})
            }

            
            else {
                this.setState({cordinatesX: e.clientX - sticker.width / 2, cordinatesY: e.clientY - sticker.height / 2});
            }
            
        }

        if(e.touches) {
            if(e.touches[0].clientX - sticker.width < canvasXbounding) {
                this.setState({cordinatesX: canvasXbounding});
            } else if(e.touches[0].clientX + sticker.width > canvasRightBounding) {
                this.setState({cordinatesX: canvasRightBounding - (sticker.width * 2)});
            } else if(e.touches[0].clientY - sticker.height < canvasYbounding) {
                this.setState({cordinatesY: canvasYbounding})
            } else if(e.touches[0].clientY + sticker.height > canvasBottomBounding) {
                this.setState({cordinatesY: canvasBottomBounding - (sticker.height * 2)})
            }

            
            else {
                this.setState({cordinatesX: e.touches[0].clientX - sticker.width / 2, cordinatesY: e.touches[0].clientY - sticker.height / 2});
            }
        }

    }

    saveNewCordinates = () => {
        const { sticker } = this.props;
        const { cordinatesX, cordinatesY } = this.state;

        const stickerData = {
            id: sticker.id,
            x: cordinatesX,
            y: cordinatesY
        }

        this.setState({ dragging: false});

        this.props.saveNewStickerCordinates(stickerData)
    }

    toggleDrag = () => {
        const { dragging } = this.state;
        this.setState({dragging: !dragging });
    }

    render() {
        const { dragging, cordinatesX, cordinatesY } = this.state;
        const {sticker, deleteSticker } = this.props;  

  return (
    <div>
        <img key={sticker.id} src={sticker.src} alt="sticker" style={{position: 'absolute', width: `${sticker.width * sticker.size}px`, height: `${sticker.height * sticker.size}px`,  top: `${cordinatesY}px`, left: `${cordinatesX}px`, zIndex: '1050', border: `${dragging ? '1px solid red' : '1px solid black'}`}} id={sticker.id}  onClick={this.toggleDrag} onMouseMove={this.dragSticker} onMouseLeave={this.saveNewCordinates} onDoubleClick={() => deleteSticker(sticker.id)} draggable="true"
        onTouchMove={this.dragSticker} onTouchEnd={this.saveNewCordinates}/>
    </div>
  )
    }
}
export default connect(null, { deleteSticker, saveNewStickerCordinates })(StickerComp);