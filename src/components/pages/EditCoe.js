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
    if (this.props.role !== 1) this.props.history.push("/");
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSalaryChange = (e) => {
    let min_sal = this.state.min_sal;
    let max_sal = this.state.max_sal;
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
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
  }

  componentWillMount = (e) => {
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

const validFloat = (num) => {
  let count_dot = 0;
  for (let i = 0; i < num.length; i++){
    if (num.charAt(i) === '.') {
      if (count_dot === 1) return false;
      count_dot ++;
      continue;
    }
    if (isNaN(parseFloat(num.charAt(i)))) return false;
  }
  return true;
}

const valid_coe = (coe) => {
  if (validFloat(coe)) {
    const coe_num = parseFloat(coe);
    console.log(coe_num);
    if (coe_num >= 0.0 && coe_num <= 1.0) return true;
  }
  return false;
}

const valid_area_salary = (sal) => {
  if (validFloat(sal)) {
    const sal_num = parseFloat(sal);
    if (sal_num >= 0.0) return true;
  }
  return false;
}

const valid_area_salaries = (min_sal, max_sal) => {
  for (let i = 1; i <= 4; i++){
    if (! valid_area_salary(toString(max_sal[i])) 
      || ! valid_area_salary(toString(min_sal[i]))) return false;
    
    if (parseFloat(min_sal[i]) > parseFloat(max_sal[i])) return false;
  }
  return true;
}


