import React, { Component } from 'react'

export default class Admin extends Component {
  componentDidMount = () => {
    const role = this.props.role;
    if (role !== 1) this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <h1>Admin</h1>
      </div>
    )
  }
}
