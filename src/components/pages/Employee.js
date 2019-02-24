import React, { Component } from 'react'

export default class Employee extends Component {
  componentDidMount = () => {
    const role = this.props.role;
    if (role !== 2) this.props.history.push('/');
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}
