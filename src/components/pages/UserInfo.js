import React, { Component } from 'react'
import Axios from 'axios';
import cf from "../../Config";
import { Link } from "react-router-dom";

export default class UserInfo extends Component {
  state = {
    user: {
      id: 0
    },
    coe: 0,
    max_sal: 0,
    min_sal: 0,
    err: false
  }

  componentDidMount = () => {
    let id = parseInt(this.props.match.params.id);
    if ((this.props.role === 3 && id !== this.props.id) ||
      this.props.role === 0) this.props.history.push('/');
    else {
      if (this.props.role === 3) id = this.props.id;
      Axios.get(`${cf.host_name}/users/${id}`).then(res => {
        if (res.data) {
          this.setState({
            user: res.data
          });
  
          Axios.get(`${cf.host_name}/coefficients/1`).then(r => {
            this.setState({
              coe: r.data.coe
            });
          });
  
          Axios.get(`${cf.host_name}/areas/${res.data.area_id}`).then(r => {
            this.setState({
              max_sal: r.data.max_sal,
              min_sal: r.data.min_sal
            });
          });
  
        } else {
          this.setState({
            err: true
          });
  
          alert('There is no user has id of '+id);
  
          this.props.history.push('/');
  
        }
      }).catch(err => {
        this.setState({
          err: true
        });
  
        alert('There is no user has id of '+id);
  
        this.props.history.push('/');
      });
    }

    
  }

  deleteUser = (e) => {
    if (alert('Are you sure to delete this user')) {
      console.log('motherfucker')
    }
  }

  render() {
    const {user} = this.state;
    console.log(user);

    if (user.id === 0) return (
      <div className="container">
        <h3>loading...</h3>
      </div>
    );

    const free_detail = user.free ? (      
      <div className="row">
        <p className="col-sm-2"><strong>Free detail:</strong></p>
        <p className="col-sm-10">{ user.free_detail }</p>
      </div>
    ) : (<span></span>);

    const display_buttons = this.props.role === 1 ? (
      <div>
        <Link to={`/edit_user/${user.id}`} type="button" className="btn btn-primary">Edit</Link>
        <button onClick={this.deleteUser} type="button" className="btn btn-danger">Delete</button>
      </div>      
    ) : (<span></span>);

    return (
      <div className="container">
        <h3>User Information</h3>

        <div className="container">
          <div className="row">
            <p className="col-sm-2"><strong>Username:</strong></p>
            <p className="col-sm-10">{ user.accountDTO.username }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Full name:</strong></p>
            <p className="col-sm-10">{ user.full_name }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Identify number:</strong></p>
            <p className="col-sm-10">{ user.id_person }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Phone number:</strong></p>
            <p className="col-sm-10">{ user.phone }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Date of birth:</strong></p>
            <p className="col-sm-10">{ user.date_of_birth }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Gender:</strong></p>
            <p className="col-sm-10">{ user.sex ? "Male" : "Female" }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Career:</strong></p>
            <p className="col-sm-10">{ user.carrer }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Address:</strong></p>
            <p className="col-sm-10">{ `${user.addressDTO.town} - ${user.addressDTO.district} - ${user.addressDTO.province}` }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Type:</strong></p>
            <p className="col-sm-10">{ user.is_vol ? "Volunteer" : "Obligatory" }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Free:</strong></p>
            <p className="col-sm-10">{ user.free ? "Yes" : "No" }</p>
          </div>
          { free_detail }    
          <div className="row">
            <p className="col-sm-2"><strong>Area:</strong></p>
            <p className="col-sm-10">{ "Area "+user.area_id }</p>
          </div>      
          <div className="row">
            <p className="col-sm-2"><strong>Main salary:</strong></p>
            <p className="col-sm-10">{ user.salaryDTO.main_sal + " VNĐ" }</p>
          </div>          
          <div className="row">
            <p className="col-sm-2"><strong>Position allowrance:</strong></p>
            <p className="col-sm-10">{ user.salaryDTO.position_allowrance + " VNĐ" }</p>
          </div>          
          <div className="row">
            <p className="col-sm-2"><strong>Responsibility allowrance:</strong></p>
            <p className="col-sm-10">{ user.salaryDTO.res_allowrance + " VNĐ" }</p>
          </div>
                 
          <div className="row">
            <p className="col-sm-2"><strong>Insurrance cost:</strong></p>
            <p className="col-sm-10">{ insurrance(user, this.state.coe, this.state.min_sal, this.state.max_sal) + " VNĐ" }</p>
          </div>
        </div>
        {display_buttons}
      </div>
    )
  }
}

const insurrance = (user, coe, min_sal, max_sal) => {
  if (user.free && ! user.is_vol) return 0;

  const total_salary = user.salaryDTO.main_sal + user.salaryDTO.position_allowrance 
    + user.salaryDTO.res_allowrance;

  if (total_salary > max_sal) return 0;

  if (total_salary < min_sal) return 0;

  if (user.is_vol) {
    if (total_salary < min_sal) {
      return parseInt(0.18 * min_sal);
    }    
  }

  return parseInt(coe * total_salary);
}
