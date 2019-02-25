import React, { Component } from 'react'

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
    area: 0,
    is_vol: false,
    career: "",
    is_free: false,
    free_detail: "",
    main_salary: 0,
    position_allowrance: 0,
    res_allowrance: 0
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

    const {username, password, full_name} = this.state;

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

    if (full_name.charAt(0) < 'A' || full_name.charAt(0) > 'Z') {
      alert('Invalid full name');
      return false;
    }

    let count = 0;

    for (let i = 0; i < full_name.length; i++) {
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
              onChange={ this.handleChange }
            />
          </div> 

          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    )
  }
}
