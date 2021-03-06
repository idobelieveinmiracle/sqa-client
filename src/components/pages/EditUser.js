import React, { Component } from 'react';
import cf from "../../Config";
import Axios from 'axios';

export default class EditUser extends Component {
  // init state
  state = {
    id: 0,
    username: "",
    full_name: "",
    id_person: "",
    is_male: true,
    date_of_birth: "",
    phone: "",
    province: "00",
    district: "00",
    town: "00",
    area: "Chưa chọn",
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
          } else {
            this.setState({
              ...user,
              username: user.accountDTO.username,
              main_sal: user.salaryDTO.main_sal,
              area: user.addressDTO.district.areaDTO.id,
              position_allowrance: user.salaryDTO.position_allowrance,
              res_allowrance: user.salaryDTO.res_allowrance
            });

            Axios.get(`${cf.host_name}/location/province`).then(r => {
              if (r.data) {
                console.log(user.addressDTO.province.matp);
                this.setState({
                  provinces_list: r.data,
                  province: user.addressDTO.province.matp
                })
              } else {
                alert("Không thể kết nối đến server");
              }
            }).catch(() => {
              alert("Không thể kết nối đến server");
            });

            Axios.get(`${cf.host_name}/location/province/${user.addressDTO.province.matp}`).then(r => {
              if (r.data) {
                console.log(r.data);
                this.setState({
                  districts_list: r.data.quanHuyenDTOs,
                  district: user.addressDTO.district.maqh
                });
              }
            });

            Axios.get(`${cf.host_name}/location/district/${user.addressDTO.district.maqh}`).then(r => {
              if (r.data) {
                console.log(r.data);
                this.setState({
                  towns_list: r.data.xaPhuongThiTranDTOs,
                  area: `Vùng ${r.data.areaDTO.id}`,
                  town: user.addressDTO.town.xaid
                });
              }
            });

          }

          console.log(this.state);
        } else {
          alert('không thể tìm được tài khoản với id là '+id);
          this.props.history.push('/');
        }
      }).catch(err => {
        alert('không thể kết nối');
        this.props.history.push('/');
      });
    }    
  }

  handleChange = (e) => {
    if (e.target.name === "province"){
      // console.log(e.target.value);
      const val = e.target.value;
      if (val !== "00") {
        Axios.get(`${cf.host_name}/location/province/${val}`).then(res => {
          if (res.data) {
            console.log(res.data);
            this.setState({
              districts_list: res.data.quanHuyenDTOs,
              district: "00",
              towns_list: [],
              town: "00",
              area: "Chưa chọn"
            });
          }
        })
      } else {
        this.setState({
          districts_list: [],
          district: "00",
          towns_list: [],
          town: "00",
          area: "Chưa chọn"
        })
      }
    }

    if (e.target.name === "district") {
      const val = e.target.value;
      if (val !== "00") {
        Axios.get(`${cf.host_name}/location/district/${val}`).then(res => {
          if (res.data) {
            console.log(res.data);
            this.setState({
              towns_list: res.data.xaPhuongThiTranDTOs,
              area: `Vùng ${res.data.areaDTO.id}`,
              town: "00"
            });
          }
        })
      } else {
        this.setState({
          towns_list: [],
          area: "Chưa chọn",
          town: "00"
        });
      }
    }

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

    const {full_name, id_person, province, district, town, date_of_birth,
      phone, res_allowrance, position_allowrance, main_sal} = this.state;

    const full_name_test = change_alias(full_name);
    console.log(full_name_test);

    let count = 0;

    for (let i = 1; i < full_name_test.length; i++) {
      const x = full_name_test.charAt(i);
      if (x === ' ') {
        count++;
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
    
    const dob = new Date(date_of_birth);
    const current_date = new Date();
    const age = current_date.getFullYear() - dob.getFullYear();

    if (age > 60 || age < 15) {
      alert("Không nằm trong độ tuổi đóng bảo hiểm");
      return 0;
    };

    if (age === 60 || age === 15) {
      const month = current_date.getMonth() - dob.getMonth();
      if (month > 0) {
        alert("Không nằm trong độ tuổi đóng bảo hiểm");
        return 0;
      }

      if (month === 0) {
        const date = current_date.getDate() - dob.getDate();
        if (date > 0) {
          alert("Không nằm trong độ tuổi đóng bảo hiểm");
          return 0
        }
      }
    }   

    if (phone.length !== 10 || phone.charAt(0) !== '0' || phone.charAt(1) !== '9') {
      alert('Số điện thoại phải bao gồm 10 ký tự số và bắt đầu bởi "09"');
      return 0;
    }

    if (province === "00") {
      alert("Bạn chưa chọn tỉnh/thành");
      return 0;
    }

    if (district === "00") {
      alert("Bạn chưa chọn quận/huyện")
      return 0;
    }

    if (town === "00") {
      alert("Bạn chưa chọn xã/phường/thị trấn");
      return 0;
    }

    if (!isNaN(parseFloat(main_sal))) {
      if (parseFloat(main_sal) <= 0) {
        alert('Lương chính phải là số lớn hơn 0');
        return 0;
      }
    } else {
      alert('Nhập sai lương chính');
      return 0;
    }

    if (!isNaN(parseFloat(position_allowrance))) {
      if (parseFloat(position_allowrance) < 0) {
        alert('Phụ cấp chức vụ phải lớn hơn hoặc bằng 0');
        return 0;
      }
    } else {
      alert('Nhập sai phụ cấp chức vụ');
      return 0;
    }

    if (!isNaN(parseFloat(res_allowrance))) {
      if (parseFloat(res_allowrance) < 0) {
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
      addressDTO: {
        province: {matp: send_user.province},
        district: {maqh: send_user.district},
        town: {xaid: send_user.town}
      },
      salaryDTO: {
        main_sal: parseFloat(this.state.main_sal),
        position_allowrance: parseFloat(this.state.position_allowrance),
        res_allowrance: parseFloat(this.state.res_allowrance)
      }      
    }

    console.log(user.addressDTO.district);

    // send update request
    Axios.patch(`${cf.host_name}/users/update`, user).then(res => {
      console.log(res.status);
      if (res.status === 200) {
        alert("Sửa thông tin thành công");
        this.props.history.push("/");
      } else alert("Không thể sửa");
    }).catch(err => {
      alert('Không thể sửa');
    })
  }

  // render interface
  render() {
    const provinces_select = (
      <div className="form-group">
        <label htmlFor="province">Tỉnh/Thành phố:</label>
        <select 
          className="form-control" 
          id="province" 
          name="province" 
          value={this.state.province}
          onChange={this.handleChange}
        >
          <option value="00">Chưa chọn</option>
          {
            this.state.provinces_list.map(province => 
              (<option value={province.matp} key={province.matp}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    const districts_select = (
      <div className="form-group">
        <label htmlFor="district">Quận/Huyện:</label>
        <select 
          className="form-control" 
          id="district" 
          name="district" 
          onChange={this.handleChange}
          value={this.state.district}
        >
          <option value="00">Chưa chọn</option>
          {
            this.state.districts_list.map(province => 
              (<option value={province.maqh} key={province.maqh}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    const towns_select = (
      <div className="form-group">
        <label htmlFor="town">Xã/Phường/Thị trấn:</label>
        <select 
          className="form-control" 
          id="town" 
          name="town" 
          onChange={this.handleChange}
          value={this.state.town}
        >
          <option value="00">Chưa chọn</option>
          {
            this.state.towns_list.map(province => 
              (<option value={province.xaid} key={province.xaid}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Sửa thông tin cá nhân</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập/Email:</label>
            <p>{this.state.username}</p>
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

          {provinces_select}

          {districts_select}

          {towns_select}

          <div className="form-group">
            <label htmlFor="area">Vùng lương tối thiểu:</label>
            <p>{this.state.area}</p>
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

const change_alias = (alias) => {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/ + /g," ");
  str = str.trim(); 
  return str;
}
