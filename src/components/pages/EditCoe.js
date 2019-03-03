import React, { Component } from 'react'
import Axios from 'axios';
import cf from '../../Config';

export default class EditCoe extends Component {
  state = {
    coe: 0,
    min_sal: [0, 0, 0, 0, 0],
    max_sal: [0, 0, 0, 0, 0]
  }

  componentDidMount = () => {
    // check role
    if (this.props.role !== 1) this.props.history.push("/");
  }

  handleChange = (e) => {
    // handle change
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSalaryChange = (e) => {
    let min_sal = this.state.min_sal;
    let max_sal = this.state.max_sal;

    // get data from form
    switch (e.target.name) {
      case "area_1_min_salary":        
        min_sal[1] = e.target.value;
        break;
      
      case "area_2_min_salary":        
        min_sal[2] = e.target.value;
        break;

      case "area_3_min_salary":        
        min_sal[3] = e.target.value;
        break;
        
      case "area_4_min_salary":        
        min_sal[4] = e.target.value;
        break;

      case "area_1_max_salary":        
        max_sal[1] = e.target.value;
        break;
      
      case "area_2_max_salary":        
        max_sal[2] = e.target.value;
        break;

      case "area_3_max_salary":        
        max_sal[3] = e.target.value;
        break;
        
      case "area_4_max_salary":        
        max_sal[4] = e.target.value;
        break;
      default:
        break;
    } 

    this.setState({
      min_sal,
      max_sal
    })
  } // handleSalaryChange

  handleSubmit = (e) => {
    e.preventDefault();

    const coe = parseFloat(this.state.coe);
    const max_sal = this.state.max_sal.map(val => parseFloat(val));
    const min_sal = this.state.min_sal.map(val => parseFloat(val));

    // validate coe
    if (isNaN(coe)) {
      alert('Invalid coefficient');
      return 0;
    }
    
    // validate salary values
    for (let i = 1; i <= 4; i++) {
      if (isNaN(max_sal[i])) {
        alert(`Invalid maximum salary of area ${i}`);
        return 0;
      }

      if (isNaN(min_sal[i])) {
        alert(`Invalid minimum salary of area ${i}`);
        return 0;
      }

      if (max_sal[i] <= min_sal[i]) {
        alert(`Maximum salary have to greater than minimum salary in area ${i}`);
        return 0;
      }
    }

    // send min max salary values request
    for (let i = 1; i <= 4; i++) {
      Axios.put(`${cf.host_name}/areas/update`, {
        id: i,
        min_sal: min_sal[i],
        max_sal: max_sal[i]
      }).then(res => {

      }).catch(err => {
        console.log(err);
      })
    }
    
    // send coefficient value request
    Axios.put(`${cf.host_name}/coefficients/update`, {
      id: 1,
      coe
    }).then(res => {
      alert('edited');
    }).catch(err => {
      console.log(err);
    });
  }

  // init data
  componentWillMount = (e) => {
    // get coe
    Axios.get(`${cf.host_name}/coefficients`).then(res => {
      if (res.data[0]) {
        this.setState({
          coe: res.data[0].coe
        });
      } else {
        this.setState({ coe: '0' });
      }
    }).catch(err => {
      this.setState({
        coe: 0
      });
    });

    // get salary values
    Axios.get(`${cf.host_name}/areas`).then(res => {
      const areas = res.data;

      const max_sal = [0, ...areas.map(area => area.max_sal)];
      const min_sal = [0, ...areas.map(area => area.min_sal)];

      this.setState({
        max_sal,
        min_sal
      })
    }).catch(err => {
      this.setState({
        min_sal: [0, 0, 0, 0, 0],
        max_sal: [0, 0, 0, 0, 0]
      });
    })
  }

  render() {
    return (
      <div className="container">
        <h1 style={ {textAlign: "center"} }>Edit Coefficient</h1>
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group">
            <label htmlFor="coe">Coefficient:</label>
            <input 
              type="text" 
              className="form-control" 
              id="coe" 
              name="coe" 
              value={this.state.coe}
              onChange={ this.handleChange }
            />
          </div>

          <label htmlFor="area_1">Area 1</label>
          <div className="form-group row">            
            <div className="col-xs-6">
              <label htmlFor="area_1_min_salary">Minimum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_1_min_salary"
                name="area_1_min_salary"
                value={ this.state.min_sal[1] }
                onChange={ this.handleSalaryChange }
              />
            </div>

            <div className="col-xs-6">
              <label htmlFor="area_1_max_salary">Maximum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_1_max_salary"
                name="area_1_max_salary"
                value={ this.state.max_sal[1] }
                onChange={ this.handleSalaryChange }
              />
            </div>
          </div>

          <label htmlFor="area_2">Area 2</label>
          <div className="form-group row">            
            <div className="col-xs-6">
              <label htmlFor="area_2_min_salary">Minimum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_2_min_salary"
                name="area_2_min_salary"
                value={ this.state.min_sal[2] }
                onChange={ this.handleSalaryChange }
              />
            </div>

            <div className="col-xs-6">
              <label htmlFor="area_2_max_salary">Maximum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_2_max_salary"
                name="area_2_max_salary"
                value={ this.state.max_sal[2] }
                onChange={ this.handleSalaryChange }
              />
            </div>
          </div>

          <label htmlFor="area_3">Area 3</label>
          <div className="form-group row">            
            <div className="col-xs-6">
              <label htmlFor="area_3_min_salary">Minimum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_3_min_salary"
                name="area_3_min_salary"
                value={ this.state.min_sal[3] }
                onChange={ this.handleSalaryChange }
              />
            </div>

            <div className="col-xs-6">
              <label htmlFor="area_3_max_salary">Maximum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_3_max_salary"
                name="area_3_max_salary"
                value={ this.state.max_sal[3] }
                onChange={ this.handleSalaryChange }
              />
            </div>
          </div>

          <label htmlFor="area_4">Area 4</label>
          <div className="form-group row">            
            <div className="col-xs-6">
              <label htmlFor="area_4_min_salary">Minimum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_4_min_salary"
                name="area_4_min_salary"
                value={ this.state.min_sal[4] }
                onChange={ this.handleSalaryChange }
              />
            </div>

            <div className="col-xs-6">
              <label htmlFor="area_4_max_salary">Maximum Salary:</label>
              <input 
                className="form-control" 
                type="text" 
                id="area_4_max_salary"
                name="area_4_max_salary"
                disabled={this.state.count_load < 5}
                value={ this.state.max_sal[4] }
                onChange={ this.handleSalaryChange }
              />
            </div>
          </div>

          <button type="submit" className="btn btn-default">Save</button>
        </form>
      </div>
    )
  }
}
