import React, { Component } from 'react'

export default class LoginForm extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Login</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Enter username" 
              name="username" 
              onChange={ this.handleChange }
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Enter password" 
              name="password"
              onChange={ this.handleChange }
            />
          </div>
          <button type="submit" className="btn btn-default">Login</button>
        </form>
      </div>
    )
  }
}
