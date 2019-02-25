import React, { Component } from 'react';
import { withCookies } from "react-cookie";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import Navbar from './components/layouts/Navbar';
import LoginForm from './components/pages/LoginForm';
import Employee from "./components/pages/Employee";
import CustomerInfo from "./components/pages/CustomerInfo";
import Admin from './components/pages/Admin';
import Axios from 'axios';
import EditCoe from './components/pages/EditCoe';

class App extends Component {
  state = {
    username: "",
    password: "",
    role: 1, //if role == 0, user did not login
  }

  login = (username, password) => {
    console.log('logged in', username, password);

    const url = `${hostname}/login`;
    const account = {
      username,
      password
    };

    console.log(url);

    Axios.post(url, account).then(res => {
      if (res) {
        this.props.cookies.set('username', username);
        this.props.cookies.set('password', password);
        this.setState({
          username,
          password,
          role: res.data.role_id
        })
      } else alert("Login failed");
    }).catch(err => {
      alert("Login failed")
    });
  }

  logout = () => {
    this.props.cookies.set('username', '');
    this.props.cookies.set('password', '');

    this.setState({
      username: "",
      password: "",
      role: 0
    });
  }

  add_customer = (customer_info) => {

  } 

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar role={ this.state.role } logout={ this.logout }/>
          <div className="container" style={{marginTop: "50px"}}>
            <Switch>
              <Route 
                path="/login"
                render={(props) => 
                  <LoginForm {...props}
                    role={this.state.role}
                    login={this.login}
                  />
                }
              />

              <Route 
                path="/edit_coe"
                render = {props => 
                  <EditCoe {...props}
                    role={this.state.role}
                  />
                }
              />
              
              <Route path="/" 
                render={props => {
                  switch (this.state.role) {
                    case 0:
                      return <LoginForm {...props}
                        role={this.state.role}
                        login={this.login}
                      />
                    case 1:
                      return <Admin {...props}
                        role={this.state.role}
                      />
                    case 2:
                      return <Employee {...props}
                        role={this.state.role}
                        username={this.state.username}
                      />
                    case 3:
                      return <CustomerInfo {...props}
                        role={this.state.role}
                      />
                    default:
                      return <LoginForm {...props}
                        role={this.state.role}
                        login={this.login}
                      />
                  }
                  }                  
                }
              />

              

            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const hostname = "http://localhost:8080";

export default withCookies(App);
