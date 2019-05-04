import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
  state = {
    username: "",
    password: ""
  }

  componentDidMount = () => {
    // check role
    if (this.props.role !== 0) this.props.history.push('/');
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    if (this.state.password.length === 0 && this.state.username.length !== 0) {
      alert("Bạn chưa nhập password");
      return 0;
    }

    if (this.state.username.length === 0 && this.state.password.length !== 0) {
      alert("Bạn chưa nhập email");
      return 0;
    }

    if (this.state.username.length === 0 && this.state.password.length === 0) {
      alert("Bạn chưa nhập email và password");
      return 0;
    }

    this.props.login(this.state.username, this.state.password); // call login function from props
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Đăng nhập</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="username">Email:</label>
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
            <label htmlFor="password">Mật khẩu:</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Enter password" 
              name="password"
              onChange={ this.handleChange }
            />
          </div>
          <button id="submitBtn" type="submit" className="btn btn-default">Đăng nhập</button><br/><br/>
          <Link to="/register" >Đăng ký</Link>
        </form>
      </div>
    )
  }
}
