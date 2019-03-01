import React, { Component } from 'react'
import SearchForm from '../SearchForm';
import Axios from 'axios';
import cf from "../../Config";
import { Link } from "react-router-dom";

export default class Employee extends Component {
  state = {
    list_user: []
  }

  componentDidMount = () => {
    const role = this.props.role;
    if (role !== 2) this.props.history.push('/');

    Axios.get(`${cf.host_name}/users`).then(res => {
      if (res.data) {
        this.setState({
          list_user: res.data
        });
      }
    });
  }

  searchUser = (keyword) => {
    if (keyword) {
      console.log(keyword);
      Axios.get(`${cf.host_name}/users/${keyword}`).then(res => {
        if (res.data) {
          this.setState({
            list_user: [res.data]
          });
        } else alert('Can not find any user has id of '+keyword);
      }).catch(err => {
        alert('Can not find any user has id of '+keyword);
      })
    } else {
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
        <td><Link to={`/user_info/${user.id}`}>view</Link></td>
      </tr>
    ));
    return (
      <div className="container">
        <SearchForm searchUser={this.searchUser} />
        <div className="container">
          <h3>List users</h3>
          <table className="table"> 
            <thead>
              <tr>
                <th>Id</th>
                <th>Identify number</th>
                <th>Full name</th>
                <th>Birth</th>
                <th>Province</th>
                <th>Link</th>
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
