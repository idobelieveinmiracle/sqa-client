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
    // check role
    if (this.props.role !== 2) this.props.history.push('/');

    // get list users
    Axios.get(`${cf.host_name}/users`).then(res => {
      if (res.data) {
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
        <td>{user.addressDTO.province}</td>
        <td><Link to={`/user_info/${user.id}`}>Chi tiết</Link></td>
      </tr>
    ));
    return (
      <div className="container">
        <SearchForm searchUser={this.searchUser} />
        <div className="container">
          <h3>Danh sách khách hàng</h3>
          <table className="table"> 
            <thead>
              <tr>
                <th>Id</th>
                <th>Số chứng minh nhân dân</th>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Tỉnh</th>
                <th>Xem</th>
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
