import React, { Component } from 'react'

class MobileTools extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="mobileTools">
        {children}
      </div>
    )
  }
}

export default MobileTools;
