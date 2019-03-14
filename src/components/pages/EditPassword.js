import React, { Component } from 'react'
import Axios from 'axios';
import cf from "../../Config";

export default class EditPassword extends Component {
  state={
    old_pass: "",
    new_pass: "",
    re_pass: ""
  }

  componentDidMount = () => {
    if (this.props.role === 0) this.props.history.push("/");
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {new_pass, re_pass, old_pass} = this.state;

    if (new_pass !== re_pass) {
      alert("Nhập lại mật khẩu không khớp");
      return 0;
    }

    for (let i = 0; i < new_pass.length; i++) {
      let k = new_pass.charAt(i);
      if ((k >= 'a' && k <= 'z') || (k >= 'A' && k <= 'Z') ) continue;
      if (k >= '0' && k <= '9') continue;
      if (k === '_' || k === '.') continue;
      alert("Mật khẩu không hợp lệ, mật khẩu chỉ được bao gồm số và chữ và ký tự '_' và '.'");
      return 0;
    }

    Axios.patch(`${cf.host_name}/users/update/password/${this.props.id}`, {
      old_pass,
      new_pass
    }).then(res => {
      if (res.status === 200) {
        alert("Đổi mật khẩu thành công");
        this.setState({  
          old_pass: "",
          new_pass: "",
          re_pass: ""
        })
      } else {
        alert("Nhập sai mật khẩu cũ");
        this.setState({  
          old_pass: "",
          new_pass: "",
          re_pass: ""
        })
      }
    }).catch(err => {
      alert("Không thể đổi mật khẩu, lỗi back-end");
    })
  }
  render() {
    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Đổi mật khẩu</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="old_pass">Mật khẩu cũ:</label>
            <input 
              type="password" 
              className="form-control" 
              id="old_pass" 
              name="old_pass" 
              value={this.state.old_pass}
              onChange={ this.handleChange }
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_pass">Mật khẩu cũ:</label>
            <input 
              type="password" 
              className="form-control" 
              id="new_pass" 
              name="new_pass" 
              value={this.state.new_pass}
              onChange={ this.handleChange }
            />
          </div>

          <div className="form-group">
            <label htmlFor="re_pass">Mật khẩu cũ:</label>
            <input 
              type="password" 
              className="form-control" 
              id="re_pass" 
              name="re_pass" 
              value={this.state.re_pass}
              onChange={ this.handleChange }
            />
          </div>

          <button type="submit" className="btn btn-default">Thay đổi</button>
        </form>
      </div>
    )
  }
}
