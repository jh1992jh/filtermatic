import React from 'react'

const Modal = ({showModal}) => {
  return (
    Object.keys(showModal).length > 0 ? (
        <div className="modal">
          <p>Sticker cordinates set <br /> X: {showModal.x} Y: {showModal.y}</p>
        </div>    
      ): null
  )
}

export default Modal;