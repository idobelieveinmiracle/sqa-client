import React, { Component } from 'react';
import cf from "../../Config";
import Axios from 'axios';

export default class EditUser extends Component {
  // init state
  state = {
    id: 0,
    username: "",
    password: "",
    re_password: "",
    full_name: "",
    id_person: "",
    is_male: true,
    date_of_birth: "",
    phone: "",
    province: "",
    district: "",
    town: "",
    area: 1,
    is_vol: false,
    career: "",
    is_free: false,
    free_detail: "",
    main_sal: "",
    position_allowrance: "",
    res_allowrance: "",
    provinces_list: [],
    districts_list: [],
    towns_list: []
  }

  componentDidMount = () => {
    if (this.props.role !== 1) this.props.history.push('/'); // check role
    else {
      // get id in params url
      const id = parseInt(this.props.match.params.id);

      // get user information by id from server
      Axios.get(`${cf.host_name}/users/${id}`).then(res => {
        if(res.data) {
          const user = res.data;
          if (user.id !== id) {
            this.props.history.push('/')
          } else this.setState({
              ...user,
              username: user.accountDTO.username,
              password: user.accountDTO.password,
              re_password: user.accountDTO.password,
              province: user.addressDTO.province,
              district: user.addressDTO.district,
              town: user.addressDTO.town,
              main_sal: user.salaryDTO.main_sal,
              position_allowrance: user.salaryDTO.position_allowrance,
              res_allowrance: user.salaryDTO.res_allowrance
            });

          console.log(this.state.is_vol);
        } else {
          alert('không thể tìn được tài khoản với id là '+id);
          this.props.history.push('/');
        }
      }).catch(err => {
        alert('không thể kết nối');
        this.props.history.push('/');
      });
    }    
  }

  handleChange = (e) => {
    // handle is_vol change
    if (e.target.name === "is_vol") {
      this.setState({
        is_vol: e.target.value === "Tự nguyện"
      });
      return 0;
    }

    // handle is_free change
    if (e.target.name === "is_free") {
      this.setState({
        is_free: e.target.value === "Có"
      });
      return 0;
    }

    // handle is_male change
    if (e.target.name === "is_male") {
      this.setState({
        is_male: e.target.value === "Nam"
      });
      return 0;
    }

    // handle other field change
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {username, password, re_password, full_name, id_person, 
      phone, res_allowrance, position_allowrance, main_sal} = this.state;

    if (username.length > 30 || username.length < 8) {
      alert('Tên đăng nhập không hợp lệ, tên đăng nhập phải chứa ít nhất 8 ký tự và nhiểu nhất 30 ký tự');
      return 0;
    }

    for (let i = 0; i < username.length; i++) {
      if ((username.charAt(i) >= 'a' && username.charAt(i) <= 'z') ||
        (username.charAt(i) >= 'A' && username.charAt(i) <= 'Z') ||
        (username.charAt(i) >= '0' && username.charAt(i) <= '9') ||
        username.charAt(i) === '_' || username.charAt(i) === '.'
      ) continue;

      alert('Tên đăng nhập không hợp lệ, tên đăng nhập chỉ được chứa chữ, số hoặc các ký tự "_" hoặc "."')
      return 0;
    }

    if (password.length > 30 || password.length < 8) {
      alert('Mật khẩu không hợp lệ, mật khẩu phải chứa ít nhất 8 ký tự và nhiểu nhất 30 ký tự');
      return 0;
    }

    for (let i = 0; i < password.length; i++) {
      if ((password.charAt(i) >= 'a' && password.charAt(i) <= 'z') ||
        (password.charAt(i) >= 'A' && password.charAt(i) <= 'Z') ||
        (password.charAt(i) >= '0' && password.charAt(i) <= '9') ||
        password.charAt(i) === '_' || password.charAt(i) === '.'
      ) continue;

      alert('Mật khẩu không hợp lệ, mật khẩu chỉ được chứa chữ, số hoặc các ký tự "_" hoặc "."')
      return 0;
    }

    if (re_password !== password) {
      alert('Nhập lại mật khẩu không đúng');
      return 0;
    }

    if (full_name.charAt(0) < 'A' || full_name.charAt(0) > 'Z') {
      alert('Họ và tên không hợp lệ');
      return false;
    }

    let count = 0;

    for (let i = 1; i < full_name.length; i++) {
      const x = full_name.charAt(i);
      if (x === ' ') {
        count++;
        continue;
      }

      if (full_name.charAt(i-1) === ' ' && x >= 'A' && x <= 'Z') {
        continue;
      }

      if (x >= 'a' && x <= 'z') continue;

      alert('Họ và tên không hợp lệ');
      return 0;
    }

    if (count > 6) {
      alert('Tên của bạn nhập dài quá -.-');
      return 0;
    }

    if (id_person.length !== 12) {
      alert('Số chứng minh nhân dân phải có 12 ký tự số');
      return 0;
    }

    for (let i = 0; i < 12; i++) {
      if (id_person.charAt(i) < '0' || id_person.charAt(i) > '9') {
        alert('Số chứng minh nhân dân phải có 12 ký tự số');
        return 0;
      }
    }

    if (phone.length !== 10 || phone.charAt(0) !== '0' || phone.charAt(1) !== '9') {
      alert('Số điện thoại phải bao gồm 10 ký tự số và bắt đầu bởi "09"');
      return 0;
    }

    if (!isNaN(parseFloat(main_sal))) {
      if (parseFloat(main_sal) <= 0) {
        alert('Lương chính phải là số lớn hơn hoặc bằng 0');
        return 0;
      }
    } else {
      alert('Nhập sai lương chính');
      return 0;
    }

    if (!isNaN(parseFloat(position_allowrance))) {
      if (parseFloat(position_allowrance) <= 0) {
        alert('Phụ cấp chức vụ phải lớn hơn hoặc bằng 0');
        return 0;
      }
    } else {
      alert('Nhập sai phụ cấp chức vụ');
      return 0;
    }

    if (!isNaN(parseFloat(res_allowrance))) {
      if (parseFloat(res_allowrance) <= 0) {
        alert('Phụ cấp chức vụ phải lớn hơn hoặc bằng 0');
        return 0;
      }
    } else {
      alert('Nhập sai phụ cấp trách nhiệm');
      return 0;
    }

    const send_user = this.state;

    // set data user to send request
    const user = {
      ...send_user,
      free_detail: this.state.is_free ? this.state.free_detail : "",
      area_id: parseInt(this.state.area),
      addressDTO: {
        province: this.state.province,
        district: this.state.district,
        town: this.state.town
      },
      accountDTO: {
        username: this.state.username,
        password: this.state.password
      },
      salaryDTO: {
        main_sal: parseFloat(this.state.main_sal),
        position_allowrance: parseFloat(this.state.position_allowrance),
        res_allowrance: parseFloat(this.state.res_allowrance)
      }      
    }

    // console.log(user);

    // send update request
    Axios.patch(`${cf.host_name}/users/update`, user).then(res => {
      alert('Sửa thành công');
    }).catch(err => {
      alert('Không thể sửa');
    })
  }

  // render interface
  render() {
    return (
      <div className="container">
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="username">Tên đang nhập:</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username" 
              value={this.state.username}
              onChange={ this.handleChange }
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input 
              type="text" 
              className="form-control" 
              id="password" 
              name="password" 
              value={this.state.password}
              onChange={ this.handleChange }
            />
          </div>

          <div className="form-group">
            <label htmlFor="re_password">Nhập lại mật khẩu:</label>
            <input 
              type="text" 
              className="form-control" 
              id="re_password" 
              name="re_password" 
              value={this.state.re_password}
              onChange={ this.handleChange }
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="full_name">Họ và tên:</label>
            <input 
              type="text" 
              className="form-control" 
              id="full_name" 
              name="full_name" 
              value={this.state.full_name}
              onChange={ this.handleChange }
            />
          </div>   

          <div className="form-group">
            <label htmlFor="id_person">Số chứng minh nhân dân:</label>
            <input 
              type="text" 
              className="form-control" 
              id="id_person" 
              name="id_person" 
              value={this.state.id_person}
              onChange={ this.handleChange }
            />
          </div>  

          <div className="form-group">
            <label htmlFor="is_male">Giới tính:</label>
            <select 
              className="form-control" 
              id="is_male" 
              name="is_male" 
              onChange={this.handleChange}
            >
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
           
          <div className="form-group">
            <label htmlFor="date_of_birth">Ngày sinh:</label>
            <input 
              type="date" 
              className="form-control" 
              id="date_of_birth" 
              name="date_of_birth" 
              value={this.state.date_of_birth}
              onChange={ this.handleChange }
            />
          </div>    

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại:</label>
            <input 
              type="text" 
              className="form-control" 
              id="phone" 
              name="phone" 
              value={this.state.phone}
              onChange={ this.handleChange }
            />
          </div>  

          <div className="form-group">
            <label htmlFor="province">Tỉnh/Thành phố:</label>
            <input 
              type="text" 
              className="form-control" 
              id="province" 
              name="province" 
              value={this.state.province}
              onChange={ this.handleChange }
            />
          </div>  

          <div className="form-group">
            <label htmlFor="district">Quận/Huyện:</label>
            <input 
              type="text" 
              className="form-control" 
              id="district" 
              name="district" 
              value={this.state.district}
              onChange={ this.handleChange }
            />
          </div>  

          <div className="form-group">
            <label htmlFor="town">Xã/Phường/Thị trấn:</label>
            <input 
              type="text" 
              className="form-control" 
              id="town" 
              name="town" 
              value={this.state.town}
              onChange={ this.handleChange }
            />
          </div>  

          <div className="form-group">
            <label htmlFor="area">Vùng lương tối thiểu:</label>
            <select 
              className="form-control" 
              id="area" 
              name="area" 
              value={this.state.area_id}
              onChange={this.handleChange}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="is_vol">Hình thức tham gia:</label>
            <select 
              className="form-control" 
              id="is_vol" 
              name="is_vol" 
              value={this.state.is_vol ? "Tự nguyện" : "Bắt buộc"}
              onChange={this.handleChange}
            >
              <option>Bắt buộc</option>
              <option>Tự nguyện</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="career">Nghề nghiệp:</label>
            <input 
              type="text" 
              className="form-control" 
              id="career" 
              name="career" 
              value={this.state.career}
              onChange={ this.handleChange }
            />
          </div>  

          <div className="form-group">
            <label htmlFor="is_free">Miễn giảm:</label>
            <select 
              className="form-control" 
              id="is_free" 
              name="is_free" 
              value={this.state.is_free ? "Có" : "Không"}
              onChange={this.handleChange}
            >
              <option>Không</option>
              <option>Có</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="free_detail">Chi tiết miễn giảm:</label>
            <select 
              className="form-control" 
              id="free_detail" 
              name="free_detail" 
              value={this.state.free_detail}
              disabled={ ! this.state.is_free }
              onChange={this.handleChange}
            >
              <option>Đang nhận lương hưu</option>
              <option>Đang nhận trợ cấp do mất sức lao động</option>
              <option>Quân nhân, công an</option>
              <option>Cán bộ xã/phường/thị trấn</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="main_sal">Lương chính:</label>
            <input 
              type="text" 
              className="form-control" 
              id="main_sal" 
              name="main_sal" 
              value={this.state.main_sal}
              onChange={ this.handleChange }
            />
          </div> 

          <div className="form-group">
            <label htmlFor="position_allowrance">Trợ cấp chức vụ:</label>
            <input 
              type="text" 
              className="form-control" 
              id="position_allowrance" 
              name="position_allowrance" 
              value={this.state.position_allowrance}
              onChange={ this.handleChange }
            />
          </div> 

          <div className="form-group">
            <label htmlFor="res_allowrance">Trợ cấp trách nhiệm:</label>
            <input 
              type="text" 
              className="form-control" 
              id="res_allowrance" 
              name="res_allowrance" 
              value={this.state.res_allowrance}
              onChange={ this.handleChange }
            />
          </div> 

          <button type="submit" className="btn btn-default">Lưu</button>
        </form>
      </div>
    )
  }
}
