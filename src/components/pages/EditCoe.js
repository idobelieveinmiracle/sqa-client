import React, { Component } from 'react'

export default class EditCoe extends Component {
  state = {
    coe: 0,
    area_1: 0,
    area_2: 0,
    area_3: 0,
    area_4: 0,
  }

  componentDidMount = () => {
    if (this.props.role !== 1) this.props.history.push("/");
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    console.log(valid_coe(this.state.coe))
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

          <div className="form-group">
            <label htmlFor="area_1">Area 1:</label>
            <input 
              type="text" 
              className="form-control" 
              id="area_1" 
              name="area_1" 
              value={this.state.area_1}
              onChange={ this.handleChange }
            />
          </div>

          <div className="form-group">
            <label htmlFor="area_2">Area 2:</label>
            <input 
              type="text" 
              className="form-control" 
              id="area_2" 
              name="area_2" 
              value={this.state.area_2}
              onChange={ this.handleChange }
            />
          </div>

          <div className="form-group">
            <label htmlFor="area_3">Area 3:</label>
            <input 
              type="text" 
              className="form-control" 
              id="area_3" 
              name="area_3" 
              value={this.state.area_3}
              onChange={ this.handleChange }
            />
          </div>

          <div className="form-group">
            <label htmlFor="area_4">Area 4:</label>
            <input 
              type="text" 
              className="form-control" 
              id="area_4" 
              name="area_4" 
              value={this.state.area_4}
              onChange={ this.handleChange }
            />
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
