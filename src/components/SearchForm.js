import React, { Component } from 'react'

export default class SearchForm extends Component {
  state = {
    keyword: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.searchUser(this.state.keyword);
  }

  render() {
    return (
      <div className="container">
        <h3>Search</h3>
        <form onSubmit={ this.handleSubmit }>
          <div className="input-group">
            <input type="text" 
              className="form-control"
              placeholder="Search customer by id here ...."
              name="keyword"
              onChange={ this.handleChange }
            />
            <div className="input-group-btn">
              <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
