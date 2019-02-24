import React, { Component } from 'react'
import SearchForm from '../SearchForm';

export default class Admin extends Component {
  componentDidMount = () => {
    const role = this.props.role;
    if (role !== 1) this.props.history.push('/');
  }

  render() {
    return (
      <div className="container">
        <SearchForm />
      </div>
    )
  }
}
