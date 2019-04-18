import React, { Component } from 'react'
import Axios from 'axios';
import cf from "../../Config";

export default class Register extends Component {
  state = {
    is_handling: false,
    email: "",
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
    towns_list: [],
    alert: {
      email: "",
      full_name: "",
      id_person: "",
      is_male: "",
      date_of_birth: "",
      phone: "",
      province: "",
      district: "",
      town: "",
      area: "",
      is_vol: "",
      career: "",
      is_free: "",
      free_detail: "",
      main_sal: "",
      position_allowrance: "",
      res_allowrance: "",
    }
  }

  componentDidMount = () => {
    // check role
    if (this.props.role !== 0) this.props.history.push('/');
    else {
      Axios.get(`${cf.host_name}/location/province`).then(res => {
        if (res.data) {
          this.setState({
            provinces_list: res.data
          })
        } else {
          alert("Không thể kết nối đến server");
        }
      }).catch(() => {
        alert("Không thể kết nối đến server");
      })
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
              district: "00"
            });
          }
        })
      } else {
        this.setState({
          districts_list: [],
          district: "00",
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

    //handle is_free change
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

    // init validating variable
    const {full_name, id_person, main_sal, phone, province,
        district, town, date_of_birth, email} = this.state;

    let {res_allowrance, position_allowrance} = this.state;

    if (full_name.length === 0 ||
      id_person.length === 0 ||
      email.length === 0 ||
      main_sal.length === 0 ||
      phone.length === 0 ||
      province === "00" ||
      district === "00" ||
      town === "00" ||
      ! date_of_birth) {
      alert("Chưa nhập đủ thông tin");
      return 0;
    }
    
    if ( ! validate_email(email) ) {
      alert("Nhập sai định dạng email");
      return 0;
    }

    const full_name_test = change_alias(full_name);
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

    if (phone.length !== 10 || phone.charAt(0) !== '0' || ! (phone.charAt(1) === '9' || 
        phone.charAt(1) === '8' || phone.charAt(1) === '3')) {
      alert('Số điện thoại phải bao gồm 10 ký tự số và bắt đầu bởi "09" hoặc "03" hoặc "08"');
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

    if (isNaN(parseFloat(main_sal))) {
      alert("Nhập sai định dạng lương chính");
      return 0;
    }

    if (isNaN(parseFloat(position_allowrance))) {
      alert("Nhập sai định dạng phụ cấp chức vụ");
      return 0;
    }

    if (isNaN(parseFloat(res_allowrance))) {
      alert("Nhập sai định dạng phụ cấp trách nhiệm");
      return 0;
    }

    const send_user = this.state;

    // init data to send request
    const user = {
      ...send_user,
      free_detail: this.state.is_free ? this.state.free_detail : "",
      role_id: 3,
      addressDTO: {
        province: {matp: send_user.province},
        district: {maqh: send_user.district},
        town: {xaid: send_user.town}
      },
      accountDTO: {
        username: this.state.username,
        password: this.state.password
      },
      salaryDTO: {
        main_sal: parseFloat(this.state.main_sal),
        position_allowrance: parseFloat(position_allowrance),
        res_allowrance: parseFloat(res_allowrance)
      }      
    }

    this.setState({is_handling: true});

    // Axios.get(`${cf.host_name}/users`)

    // send
    Axios.post(`${cf.host_name}/users/register`, user).then(res => {
      console.log(res.status);
      if (res.status === 201) {
        alert("Đăng ký thành công, thông tin đăng nhập và mật khẩu đã được gửi về email của bạn");
        this.props.history.push("/");
      } else {
        alert('Email này đã được đăng ký, vui lòng lập lại email');
        this.setState({is_handling: false});
      }
    }).catch(err => {
      console.log(err);
      this.setState({is_handling: false});
    });
    
  } // handingSubmit

  render() {
    const provinces_select = (
      <div className="form-group">
        <label htmlFor="province">Tỉnh/Thành phố: <span style={{color:"red"}}>{this.state.alert.province}</span></label>
        <select 
          className="form-control" 
          id="province" 
          name="province" 
          onChange={this.handleChange}
          required
        >
          <option value="00">Chưa chọn</option>
          {
            this.state.provinces_list.map(province => 
              (<option value={province.matp} id={province.matp} key={province.matp}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    const districts_select = (
      <div className="form-group">
        <label htmlFor="district">Quận/Huyện: <span style={{color:"red"}}>{this.state.alert.district}</span></label>
        <select 
          className="form-control" 
          id="district" 
          name="district" 
          onChange={this.handleChange}
          value={this.state.district}
          required
        >
          <option value="00">Chưa chọn</option>
          {
            this.state.districts_list.map(province => 
              (<option value={province.maqh} id={province.maqh} key={province.maqh}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    const towns_select = (
      <div className="form-group">
        <label htmlFor="town">Xã/Phường/Thị trấn: <span style={{color:"red"}}>{this.state.alert.town}</span></label>
        <select 
          className="form-control" 
          id="town" 
          name="town" 
          onChange={this.handleChange}
          value={this.state.town}
          required
        >
          <option value="00" id="00">Chưa chọn</option>
          {
            this.state.towns_list.map(province => 
              (<option value={province.xaid} id={province.xaid} key={province.xaid}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    const display_btn_name = this.state.is_handling ? "Đang xử lý..." : "Đăng ký";

    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Đăng ký</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="email">Email: <span style={{color:"red"}}>{this.state.alert.email}</span></label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              value={this.state.email}
              onChange={ this.handleChange }
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="full_name">Tên đầy đủ: <span style={{color:"red"}}>{this.state.alert.full_name}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="full_name" 
              name="full_name" 
              value={this.state.full_name}
              onChange={ this.handleChange }
              required
            />
          </div>   

          <div className="form-group">
            <label htmlFor="id_person">Số chứng minh nhân dân: <span style={{color:"red"}}>{this.state.alert.id_person}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="id_person" 
              name="id_person" 
              value={this.state.id_person}
              onChange={ this.handleChange }
              required
            />
          </div>  

          <div className="form-group">
            <label htmlFor="is_male">Giới tính: <span style={{color:"red"}}>{this.state.alert.is_male}</span></label>
            <select 
              className="form-control" 
              id="is_male" 
              name="is_male" 
              onChange={this.handleChange}
              required
            >
              <option id="male">Nam</option>
              <option id="female">Nữ</option>
            </select>
          </div>
           
          <div className="form-group">
            <label htmlFor="date_of_birth">Ngày sinh: <span style={{color:"red"}}>{this.state.alert.date_of_birth}</span></label>
            <input 
              type="date" 
              className="form-control" 
              id="date_of_birth" 
              name="date_of_birth" 
              value={this.state.date_of_birth}
              onChange={ this.handleChange }
              required
            />
          </div>    

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại: <span style={{color:"red"}}>{this.state.alert.phone}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="phone" 
              name="phone" 
              value={this.state.phone}
              onChange={ this.handleChange }
              required
            />
          </div>  

          {provinces_select}

          {districts_select} 

          {towns_select} 

          <div className="form-group">
            <label htmlFor="area">Vùng lương tối thiểu: </label>    
            <p>{this.state.area}</p>        
          </div>

          <div className="form-group">
            <label htmlFor="is_vol">Hình thức tham gia bảo hiểm: <span style={{color:"red"}}>{this.state.alert.is_vol}</span></label>
            <select 
              className="form-control" 
              id="is_vol" 
              name="is_vol" 
              onChange={this.handleChange}
              required
            >
              <option id="not_vol">Bắt buộc</option>
              <option id="vol">Tự nguyện</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="career">Nghề nghiệp: <span style={{color:"red"}}>{this.state.alert.career}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="career" 
              name="career" 
              value={this.state.career}
              onChange={ this.handleChange }
              required
            />
          </div>  

          <div className="form-group">
            <label htmlFor="is_free">Miễn giảm: <span style={{color:"red"}}>{this.state.alert.is_free}</span></label>
            <select 
              className="form-control" 
              id="is_free" 
              name="is_free" 
              onChange={this.handleChange}
              required
            >
              <option id="not_free">Không</option>
              <option id="free">Có</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="free_detail">Chi tiết miễn giảm: <span style={{color:"red"}}>{this.state.alert.free_detail}</span></label>
            <select 
              className="form-control" 
              id="free_detail" 
              name="free_detail" 
              disabled={ ! this.state.is_free }
              onChange={this.handleChange}
              required
            >
              <option id="fd1">Đang nhận lương hưu</option>
              <option id="fd2">Cán bộ xã/phường/thị trấn</option>
              <option id="fd3">Quân nhân, công an</option>
              <option id="fd4">Đang hưởng trợ cấp do mất sức lao động</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="main_sal">Lương chính: <span style={{color:"red"}}>{this.state.alert.main_sal}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="main_sal" 
              name="main_sal" 
              value={this.state.main_sal}
              onChange={ this.handleChange }
              required
            />
          </div> 

          <div className="form-group">
            <label htmlFor="position_allowrance">Phụ cấp chức vụ: <span style={{color:"red"}}>{this.state.alert.position_allowrance}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="position_allowrance" 
              name="position_allowrance" 
              value={this.state.position_allowrance}
              onChange={ this.handleChange }
              required
            />
          </div> 

          <div className="form-group">
            <label htmlFor="res_allowrance">Phụ cấp trách nhiệm: <span style={{color:"red"}}>{this.state.alert.res_allowrance}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="res_allowrance" 
              name="res_allowrance" 
              value={this.state.res_allowrance}
              onChange={ this.handleChange }
              required
            />
          </div> 

          <button id="submitBtn" type="submit" className="btn btn-default" disabled={this.state.is_handling}>{display_btn_name}</button>
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

const validate_email = (mail) => {
  return /^[a-z][a-z0-9]{5,29}@gmail.com$/gm.test(mail);
}
