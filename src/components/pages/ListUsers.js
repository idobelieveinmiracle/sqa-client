import React, { Component } from 'react'
import SearchForm from '../SearchForm';
import Axios from 'axios';
import cf from "../../Config";
import { Link } from "react-router-dom";

export default class ListUsers extends Component {
  state = {
    list_user: []
  }

  componentDidMount = () => {
    console.log('Mounted');
    // check role
    if (this.props.role !== 1) this.props.history.push('/');

    // get list users
    else Axios.get(`${cf.host_name}/users`).then(res => {
      if (res.data) {
        console.log(res.data);
        this.setState({
          list_user: res.data.filter(user => user.role_id !== 1)
        });
      }
    });
  }

  // handling search user function
  searchUser = (keyword) => {
    if (keyword) { // get user with keyword
      Axios.get(`${cf.host_name}/users/${keyword}`).then(res => {
        if (res.data) {
          this.setState({
            list_user: [res.data]
          });
        } else alert('Không thể tìm thấy tài khoản có mã là '+keyword);
      }).catch(err => {
        alert('Không thể tìm thấy tài khoản có mã là '+keyword);
      })
    } else { // get all users if not thing is imported
      Axios.get(`${cf.host_name}/users`).then(res => {
        if (res.data) {
          this.setState({
            list_user: res.data
          });
        }
      });
    }
  }

  render() {
    
    const list_user = this.state.list_user.map(user => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.id_person}</td>
        <td>{user.full_name}</td>
        <td>{user.date_of_birth}</td>
        <td>{user.addressDTO.province.name}</td>
        <td><Link to={`/user_info/${user.id}`}>Chi tiết</Link></td>
      </tr>
    ));
    return (
      <div className="container">
        <SearchForm searchUser={this.searchUser} />
        <div className="container">
          <h3 id="title">Danh sách khách hàng</h3>
          <table className="table"> 
            <thead>
              <tr>
                <th className="col-md-1">Id</th>
                <th className="col-md-2">Số CMND</th>
                <th className="col-md-3">Họ và tên</th>
                <th className="col-md-2">Ngày sinh</th>
                <th className="col-md-2">Tỉnh/Thành phố</th>
                <th className="col-md-2">Xem</th>
              </tr>
            </thead>
            <tbody>
              {list_user}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
