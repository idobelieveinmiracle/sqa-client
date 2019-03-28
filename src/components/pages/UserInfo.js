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
    // get id from params
    let id = parseInt(this.props.match.params.id);
    
    // check role
    if (id) {
      if (this.props.role === 3 && id !== this.props.id) {
        id = this.props.id;        
      }
    } else {
      id = this.props.id;
    }

    if (this.props.role === 0) this.props.history.push('/');
    else { // if role is valid, get user information from server 
      Axios.get(`${cf.host_name}/users/${id}`).then(res => {
        if (res.data) { // if user with the id in params is found, set state to display info
          this.setState({
            user: res.data
          });
  
          // get coe
          Axios.get(`${cf.host_name}/coefficients/1`).then(r => {
            this.setState({
              coe: r.data.coe
            });
          });

          console.log(res.data.addressDTO.district.areaDTO.id);
  
          // get max salary and min salary
          Axios.get(`${cf.host_name}/areas/${res.data.addressDTO.district.areaDTO.id}`).then(r => {
            this.setState({
              max_sal: r.data.max_sal,
              min_sal: r.data.min_sal
            });
          });
  
        } else { // if can not find any user have id at params
          alert('There is no user has id of '+id);  
          this.props.history.push('/');  
        }
      }).catch(err => {  
        alert('There is no user has id of '+id);  
        this.props.history.push('/');
      });
    }

    
  }

  deleteUser = (e) => {
    if (this.props.role === 1)
      Axios.delete(`${cf.host_name}/users/delete/${this.state.user.id}`).then(res => {
        alert('Deleted user');
        this.props.history.push('/');
      }).catch(err => {
        alert('This user was already deleted');
        this.props.history.push('/');
      });
    else alert("Bạn chỉ admin mới được quyền xóa");
  }

  render() {
    const {user} = this.state;
    console.log(user);

    if (user.id === 0) return (
      <div className="container">
        <h3>đang tải...</h3>
      </div>
    );

    const free_detail = user.free ? (      
      <div className="row">
        <p className="col-sm-2"><strong>Chi tiết miễn giảm:</strong></p>
        <p className="col-sm-10">{ user.free_detail }</p>
      </div>
    ) : (<span></span>);

    console.log(parseInt(this.props.id) + " " + user.id );

    const display_buttons = this.props.role === 1 ? (
      <div style={{marginTop: "30px"}}>
        <Link to={`/edit_user/${user.id}`} style={{marginRight:"20px", width:"70px"}} type="button" className="btn btn-primary">Sửa</Link>
        {parseInt(this.props.match.params.id) === user.id ? (
          <button type="button" className="btn btn-danger" style={{width:"70px"}}  data-toggle="modal" data-target="#myModal">Xóa</button>
        ):(<span></span>)}        
      </div>      
    ) : (<span></span>);

    return (
      <div className="container">
        <h3 id="title">Thông tin người dùng</h3>

        <div className="container">
          <div className="row">
            <p className="col-sm-2"><strong>Tên đăng nhập:</strong></p>
            <p className="col-sm-10">{ user.accountDTO.username }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Họ và tên:</strong></p>
            <p className="col-sm-10">{ user.full_name }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Số chứng minh nhân dân:</strong></p>
            <p className="col-sm-10">{ user.id_person }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Số điện thoại:</strong></p>
            <p className="col-sm-10">{ user.phone }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Ngày sinh:</strong></p>
            <p className="col-sm-10">{ user.date_of_birth }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Giới tính:</strong></p>
            <p className="col-sm-10">{ user.is_male ? "Nam" : "Nữ" }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Nghề nghiệp:</strong></p>
            <p className="col-sm-10">{ user.career }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Địa chỉ:</strong></p>
            <p className="col-sm-10">{ `${user.addressDTO.town.name} - ${user.addressDTO.district.name} - ${user.addressDTO.province.name}` }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Hình thức tham gia:</strong></p>
            <p className="col-sm-10">{ user.is_vol ? "Tự nguyện" : "Bắt buộc" }</p>
          </div>
          <div className="row">
            <p className="col-sm-2"><strong>Miễn giảm:</strong></p>
            <p className="col-sm-10">{ user.is_free ? "Có" : "Không" }</p>
          </div>
          { free_detail }    
          <div className="row">
            <p className="col-sm-2"><strong>Vùng lương tối thiểu:</strong></p>
            <p className="col-sm-10">{ "Vùng "+user.addressDTO.district.areaDTO.id }</p>
          </div>      
          <div className="row">
            <p className="col-sm-2"><strong>Lương chính:</strong></p>
            <p className="col-sm-10">{ user.salaryDTO.main_sal + " VNĐ" }</p>
          </div>          
          <div className="row">
            <p className="col-sm-2"><strong>Trợ cấp chức vụ:</strong></p>
            <p className="col-sm-10">{ user.salaryDTO.position_allowrance + " VNĐ" }</p>
          </div>          
          <div className="row">
            <p className="col-sm-2"><strong>Trợ cấp trách nhiệm:</strong></p>
            <p className="col-sm-10">{ user.salaryDTO.res_allowrance + " VNĐ" }</p>
          </div>
                 
          <div style={{color: "red"}} className="row">
            <p className="col-sm-2"><strong>Tiền bảo hiểm phải đóng:</strong></p>
            <p style={{fontSize:"25px"}} className="col-sm-10">{ this.state.user.insurance + " VNĐ" }</p>
          </div>
        </div>
        {display_buttons}

        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Alert</h4>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc là muốn xóa tài khoản này không</p>
              </div>
              <div className="modal-footer">
                <button onClick={this.deleteUser} type="button" className="btn btn-primary" data-dismiss="modal">Sure vl</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Đóng</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
