import React, { Component } from 'react'
import Axios from 'axios';
import cf from "../../Config";

export default class AddCustomer extends Component {
  state = {
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
    if (this.props.role !== 2) this.props.history.push('/');

    
  }

  handleChange = (e) => {
    if (e.target.name === "is_vol") {
      this.setState({
        is_vol: e.target.value === "Voluntary"
      });
      return 0;
    }

    if (e.target.name === "is_free") {
      this.setState({
        is_free: e.target.value === "Yes"
      });

      return 0;
    }

    if (e.target.name === "is_male") {
      this.setState({
        is_male: e.target.value === "Male"
      });

      return 0;
    }

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {username, password, re_password, full_name, id_person} = this.state;

    if (username.length > 30 || username.length < 8) {
      alert('Invalid username, username have to contain greater than 7 characters and lesser than 31 characters');
      return 0;
    }

    for (let i = 0; i < username.length; i++) {
      if ((username.charAt(i) >= 'a' && username.charAt(i) <= 'z') ||
        (username.charAt(i) >= 'A' && username.charAt(i) <= 'Z') ||
        (username.charAt(i) >= '0' && username.charAt(i) <= '9') ||
        username.charAt(i) === '_' || username.charAt(i) === '.'
      ) continue;

      alert('Invalid username, username have to only contain English characters, digitals, "_" and "."')
      return 0;
    }

    if (username.length > 30 || username.length < 8) {
      alert('Invalid username, username have to contain greater than 7 characters and lesser than 31 characters');
      return 0;
    }

    for (let i = 0; i < password.length; i++) {
      if ((password.charAt(i) >= 'a' && password.charAt(i) <= 'z') ||
        (password.charAt(i) >= 'A' && password.charAt(i) <= 'Z') ||
        (password.charAt(i) >= '0' && password.charAt(i) <= '9') ||
        password.charAt(i) === '_' || password.charAt(i) === '.'
      ) continue;

      alert('Invalid password, password have to only contain English characters, digitals, "_" and "."')
      return 0;
    }

    if (re_password !== password) {
      alert('Invalid repeat password');
      return 0;
    }

    if (full_name.charAt(0) < 'A' || full_name.charAt(0) > 'Z') {
      alert('Invalid full name');
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

      alert('Invalid full name');
      return 0;
    }

    if (count > 6) {
      alert('Your name is so long, it does not make sense');
      return 0;
    }

    if (id_person.length !== 12) {
      alert('Your Id must have 12 digitals');
      return 0;
    }

    for (let i = 0; i < 12; i++) {
      if (id_person.charAt(i) < '0' || id_person.charAt(i) > '9') {
        alert('Your ID must have 12 digitals');
        return 0;
      }
    }

    const {phone} = this.state;

    if (phone.length !== 10 || phone.charAt(0) !== '0' || phone.charAt(1) !== '9') {
      alert('Phone number must have 10 digitals and start by "09"');
      return 0;
    }

    const {main_sal} = this.state;

    if (!isNaN(parseFloat(main_sal))) {
      if (parseFloat(main_sal) <= 0) {
        alert('Main salary must greater than 0');
        return 0;
      }
    } else {
      alert('Invalid salary input');
      return 0;
    }

    const {position_allowrance} = this.state;

    if (!isNaN(parseFloat(position_allowrance))) {
      if (parseFloat(position_allowrance) <= 0) {
        alert('Position allowrance must greater than 0');
        return 0;
      }
    } else {
      alert('Invalid position allowrance input');
      return 0;
    }
    
    const {res_allowrance} = this.state;

    if (!isNaN(parseFloat(res_allowrance))) {
      if (parseFloat(res_allowrance) <= 0) {
        alert('Responsibility allowrance must greater than 0');
        return 0;
      }
    } else {
      alert('Invalid responsibility allowrance input');
      return 0;
    }

    const user = {
      full_name: this.state.full_name,
      id_person: this.state.id_person,
      date_of_birth: this.state.date_of_birth,
      sex: this.state.is_male,
      is_vol: this.state.is_vol,
      carrer: this.state.career,
      free: this.state.is_free,
      free_detail: this.state.is_free ? this.state.free_detail : "",
      phone: this.state.phone,
      role_id: 3,
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

    console.log(user);

    Axios.post(`${cf.host_name}/users/register`, user).then(res => {
      if (res.status === 201) {
        alert('Created user');
        this.setState({
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
        });
      } else alert('Username was taken, please use other username')
    }).catch(err => console.log(err));
    
  }

  render() {
    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Register</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
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
            <label htmlFor="password">Password:</label>
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
            <label htmlFor="re_password">Repeat your password:</label>
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
            <label htmlFor="full_name">Full name:</label>
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
            <label htmlFor="id_person">Person Id:</label>
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
            <label htmlFor="is_male">Gender:</label>
            <select 
              className="form-control" 
              id="is_male" 
              name="is_male" 
              onChange={this.handleChange}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
           
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of birth:</label>
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
            <label htmlFor="phone">Phone number:</label>
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
            <label htmlFor="province">Province:</label>
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
            <label htmlFor="district">District:</label>
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
            <label htmlFor="town">Town or Street:</label>
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
            <label htmlFor="area">Area:</label>
            <select 
              className="form-control" 
              id="area" 
              name="area" 
              onChange={this.handleChange}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="is_vol">Participation type:</label>
            <select 
              className="form-control" 
              id="is_vol" 
              name="is_vol" 
              onChange={this.handleChange}
            >
              <option>Obligatory</option>
              <option>Voluntary</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="career">Career:</label>
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
            <label htmlFor="is_free">Free:</label>
            <select 
              className="form-control" 
              id="is_free" 
              name="is_free" 
              onChange={this.handleChange}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="free_detail">Free Detail:</label>
            <select 
              className="form-control" 
              id="free_detail" 
              name="free_detail" 
              disabled={ ! this.state.is_free }
              onChange={this.handleChange}
            >
              <option>Receiving pension</option>
              <option>Receiving incapability labor subsidize</option>
              <option>Military, Police</option>
              <option>Town manager</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="main_sal">Main salary:</label>
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
            <label htmlFor="position_allowrance">Position allowrance:</label>
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
            <label htmlFor="res_allowrance">Responsibility allowrance:</label>
            <input 
              type="text" 
              className="form-control" 
              id="res_allowrance" 
              name="res_allowrance" 
              value={this.state.res_allowrance}
              onChange={ this.handleChange }
            />
          </div> 

          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    )
  }
}

// const location_url = 'https://thongtindoanhnghiep.co/api';
