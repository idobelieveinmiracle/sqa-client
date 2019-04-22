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
    alt: {
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

    let alt = {
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

    const {full_name, id_person, main_sal, phone, province,
        district, town, date_of_birth, email, career} = this.state;

    let {res_allowrance, position_allowrance} = this.state;
    let check = true;

    if (career.length === 0) {
      alt = {
        ...alt,
        career: "Không được để trống trường này"
      }
      check = false;
    }

    if (full_name.length === 0) {
      alt = {
        ...alt,
        full_name: "Chưa nhập đủ thông tin"
      }
      check = false;
    }

    if (id_person.length === 0) {
      alt = {
        ...alt,
        id_person: "Chưa nhập đủ thông tin"
      }
      check = false;
    } else {      
      if (id_person.length !== 12) {
        alt = {
          ...alt,
          id_person: "Số chứng minh nhân dân phải có 12 ký tự số"
        }
        check = false;
      }

      for (let i = 0; i < 12; i++) {
        if (id_person.charAt(i) < '0' || id_person.charAt(i) > '9') {        
          alt = {
            ...alt,
            id_person: "Số chứng minh nhân dân phải có 12 ký tự số"
          }
          check = false;
        }
      }
    }

    if (main_sal.length === 0) {
      alt = {
        ...alt,
        main_sal: "Chưa nhập đủ thông tin"
      }
      check = false;
    } else {
      if (isNaN(parseFloat(main_sal))) {
        alt = {
          ...alt,
          main_sal: "Nhập sai định dạng"
        }
        check = false;
      } else {
        if (parseFloat(main_sal) <= 0){
          alt = {
            ...alt,
            main_sal: "Lương chính phải lớn hơn hoặc bằng 0"
          }
          check = false;
        }      
      }
    }

    if (phone.length === 0) {
      alt = {
        ...alt,
        phone: "Chưa nhập đủ thông tin"
      }
      check = false;
    } else {
      if (! /(09|03|08)+([0-9]{8})\b/gm.test(phone)){   
        alt = {
          ...alt,
          phone: 'Số điện thoại phải bao gồm 10 ký tự số và bắt đầu bởi "09" hoặc "03" hoặc "08"'
        }
        check = false;
      }
    }
    
    if (email.length === 0) {
      alt = {
        ...alt,
        email: "Chưa nhập đủ thông tin"
      }
      check = false;
    } else {
      if ( ! validate_email(email) ) {
        alt = {
          ...alt,
          email: "Nhập sai định dạng email"
        }
        check = false;
      }
    }

    if (res_allowrance.length === 0) {
      alt = {
        ...alt,
        res_allowrance: "Chưa nhập đủ thông tin"
      }
      check = false;
    } else {
      if (isNaN(parseFloat(res_allowrance))) {
        alt = {
          ...alt,
          res_allowrance: "Nhập sai định dạng"
        }
        check = false;
      } else {
        if (parseFloat(res_allowrance) <= 0){
          alt = {
            ...alt,
            res_allowrance: "Phụ cấp trách nhiệm phải lớn hơn hoặc bằng 0"
          }
          check = false;
        }      
      }
    }

    if (position_allowrance.length === 0) {
      alt = {
        ...alt,
        position_allowrance: "Chưa nhập đủ thông tin"
      }
      check = false;
    } else {      
      if (isNaN(parseFloat(position_allowrance))) {
        alt = {
          ...alt,
          position_allowrance: "Nhập sai định dạng"
        }
        check = false;
      } else {
        if (parseFloat(position_allowrance) <= 0){
          alt = {
            ...alt,
            position_allowrance: "Phụ cấp chức vụ phải lớn hơn hoặc bằng 0"
          }
          check = false;
        }      
      }
    }

    if (province === "00") {
      alt = {
        ...alt,
        province: "Yêu cầu lựa chọn Tỉnh/Thành phố"
      }
      check = false;
    }

    if (district === "00") {
      alt = {
        ...alt,
        district: "Yêu cầu lựa chọn Quận/Huyện"
      }
      check = false;
    }
    
    if (town === "00") {
      alt = {
        ...alt,
        town: "Yêu cầu lựa chọn Xã/Phường/Thị trấn"
      }
      check = false;
    }

    //console.log(! date_of_birth);
    if (! date_of_birth) {
      //console.log("ádas");
      alt = {
        ...alt,
        date_of_birth: "Chưa nhập đủ thông tin"
      }
      check = false;
    }

    if (date_of_birth) {
      const dob = new Date(date_of_birth);
      const current_date = new Date();
      const age = current_date.getFullYear() - dob.getFullYear();
  
      if (age > 60 || age < 15) {
        alt = {
          ...alt,
          date_of_birth: "Không nằm trong độ tuổi đóng bảo hiểm"
        }
        check = false;
      };
  
      if (age === 60 || age === 15) {
        const month = current_date.getMonth() - dob.getMonth();
        if (month > 0) {
          alt = {
            ...alt,
            date_of_birth: "Không nằm trong độ tuổi đóng bảo hiểm"
          }
          check = false;
        }
  
        if (month === 0) {
          const date = current_date.getDate() - dob.getDate();
          if (date > 0) {
            alt = {
              ...alt,
              date_of_birth: "Không nằm trong độ tuổi đóng bảo hiểm"
            }
            check = false;
          }
        }
      }   
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

    Axios.get(`${cf.host_name}/users`).then(res => {
      if (res.status === 200) {
        const users = res.data;

        users.forEach(user => {
          if (user.phone === this.state.phone) {
            alt = {
              ...alt,
              phone: "Số điện thoại vừa nhập đã tồn tại"
            }
            check = false;
          }
          if (user.id_person === this.state.id_person) {
            alt = {
              ...alt,
              id_person: "Số chứng minh nhân dân đã tồn tại"
            }
            check = false;
          }
          if (user.email === this.state.email) {
            alt = {
              ...alt,
              email: "Địa chỉ email vừa nhập đã tồn tại"
            }
            check = false;
          }
        });

        if (check) {

          this.setState({is_handling: true});
          // send
          Axios.post(`${cf.host_name}/users/register`, user).then(res => {
            console.log(res.status);
            if (res.status === 201) {
              alert("Đăng ký thành công, thông tin đăng nhập và mật khẩu đã được gửi về email của bạn");
              this.props.history.push("/");
            } else {
              alt = {
                ...alt,
                email: "Email này đã được đăng ký, vui lòng lập lại email"
              }
              this.setState({alt, is_handling: false});
            }
          }).catch(err => {
            console.log(err);
            this.setState({is_handling: false});
          });
        } else {
          this.setState({alt});
        }
      }
    })

    
    
  } // handingSubmit

  render() {
    const provinces_select = (
      <div className="form-group">
        <label htmlFor="province">Tỉnh/Thành phố: <span id="province_alert" style={{color:"red"}}>{this.state.alt.province}</span></label>
        <select 
          className="form-control" 
          id="province" 
          name="province" 
          onChange={this.handleChange}
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
        <label htmlFor="district">Quận/Huyện: <span id="district_alert" style={{color:"red"}}>{this.state.alt.district}</span></label>
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
              (<option value={province.maqh} id={province.maqh} key={province.maqh}>{province.name}</option>)
            )
          }
        </select>
      </div>
    );

    const towns_select = (
      <div className="form-group">
        <label htmlFor="town">Xã/Phường/Thị trấn: <span id="town_alert" style={{color:"red"}}>{this.state.alt.town}</span></label>
        <select 
          className="form-control" 
          id="town" 
          name="town" 
          onChange={this.handleChange}
          value={this.state.town}
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
            <label htmlFor="email">Email: <span id="email_alert" style={{color:"red"}}>{this.state.alt.email}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="email" 
              name="email" 
              value={this.state.email}
              onChange={ this.handleChange }
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="full_name">Tên đầy đủ: <span id="full_name_alert" style={{color:"red"}}>{this.state.alt.full_name}</span></label>
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
            <label htmlFor="id_person">Số chứng minh nhân dân: <span id="id_person_alert" style={{color:"red"}}>{this.state.alt.id_person}</span></label>
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
            <label htmlFor="is_male">Giới tính: <span id="is_male_alert" style={{color:"red"}}>{this.state.alt.is_male}</span></label>
            <select 
              className="form-control" 
              id="is_male" 
              name="is_male" 
              onChange={this.handleChange}
            >
              <option id="male">Nam</option>
              <option id="female">Nữ</option>
            </select>
          </div>
           
          <div className="form-group">
            <label htmlFor="date_of_birth">Ngày sinh: <span id="date_of_birth_alert" style={{color:"red"}}>{this.state.alt.date_of_birth}</span></label>
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
            <label htmlFor="phone">Số điện thoại: <span id="phone_alert" style={{color:"red"}}>{this.state.alt.phone}</span></label>
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
            <label htmlFor="area">Vùng lương tối thiểu: </label>    
            <p>{this.state.area}</p>        
          </div>

          <div className="form-group">
            <label htmlFor="is_vol">Hình thức tham gia bảo hiểm: <span id="is_vol_alert" style={{color:"red"}}>{this.state.alt.is_vol}</span></label>
            <select 
              className="form-control" 
              id="is_vol" 
              name="is_vol" 
              onChange={this.handleChange}
            >
              <option id="not_vol">Bắt buộc</option>
              <option id="vol">Tự nguyện</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="career">Nghề nghiệp: <span id="career_alert" style={{color:"red"}}>{this.state.alt.career}</span></label>
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
            <label htmlFor="is_free">Miễn giảm: <span id="is_free_alert" style={{color:"red"}}>{this.state.alt.is_free}</span></label>
            <select 
              className="form-control" 
              id="is_free" 
              name="is_free" 
              onChange={this.handleChange}
            >
              <option id="not_free">Không</option>
              <option id="free">Có</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="free_detail">Chi tiết miễn giảm: <span id="free_detail_alert" style={{color:"red"}}>{this.state.alt.free_detail}</span></label>
            <select 
              className="form-control" 
              id="free_detail" 
              name="free_detail" 
              disabled={ ! this.state.is_free }
              onChange={this.handleChange}
            >
              <option id="fd1">Đang nhận lương hưu</option>
              <option id="fd2">Cán bộ xã/phường/thị trấn</option>
              <option id="fd3">Quân nhân, công an</option>
              <option id="fd4">Đang hưởng trợ cấp do mất sức lao động</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="main_sal">Lương chính: <span id="main_sal_alert" style={{color:"red"}}>{this.state.alt.main_sal}</span></label>
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
            <label htmlFor="position_allowrance">Phụ cấp chức vụ: <span id="position_allowrance_alert" style={{color:"red"}}>{this.state.alt.position_allowrance}</span></label>
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
            <label htmlFor="res_allowrance">Phụ cấp trách nhiệm: <span id="res_allowrance_alert" style={{color:"red"}}>{this.state.alt.res_allowrance}</span></label>
            <input 
              type="text" 
              className="form-control" 
              id="res_allowrance" 
              name="res_allowrance" 
              value={this.state.res_allowrance}
              onChange={ this.handleChange }
            />
          </div> 

          <button id="submitBtn" type="submit" className="btn btn-default" disabled={this.state.is_handling}>{display_btn_name}</button>
        </form>
      </div>
    )
  }
}

const validate_email = (mail) => {
  return /^[a-z][a-z0-9]{5,29}@gmail.com$/gm.test(mail);
}
