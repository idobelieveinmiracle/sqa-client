import React, { Component } from 'react';
import { withCookies } from "react-cookie";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import Navbar from './components/layouts/Navbar';
import LoginForm from './components/pages/LoginForm';
import ListUsers from "./components/pages/ListUsers";
import Axios from 'axios';
import EditCoe from './components/pages/EditCoe';
import Register from './components/pages/Register';
import UserInfo from "./components/pages/UserInfo";
import EditUser from './components/pages/EditUser';
import EditPassword from './components/pages/EditPassword';

class App extends Component {
  state = {
    id: 0,
    username: "",
    password: "",
    role: 0,
    done: false
  }

  componentDidMount = () => {
    const {cookies} = this.props;
    const user = {
      username: cookies.cookies.username,
      password: cookies.cookies.password
    }

    Axios.post(`${hostname}/login`, user).then(res => {
      if (res.data) {
        this.props.cookies.set('username', user.username);
        this.props.cookies.set('password', user.password);
        this.setState({
          username: user.username,
          password: user.password,
          role: res.data.role_id,
          id: res.data.id
        })
      }

      this.setState({done: true});
    })
  }

  login = (username, password) => {
    console.log('logged in', username, password);

    const url = `${hostname}/login`;
    const account = {
      username,
      password
    };

    Axios.post(url, account).then(res => {
      if (res.data) {
        this.props.cookies.set('username', username);
        this.props.cookies.set('password', password);
        this.setState({
          username,
          password,
          role: res.data.role_id,
          id: res.data.id
        })
      } else {
        alert("Đăng nhập thất bại");
        this.logout();
      }
    }).catch(err => {
      alert("Đăng nhập thất bại");
      this.logout();
    });
  }

  logout = () => {
    this.props.cookies.set('username', '');
    this.props.cookies.set('password', '');

    this.setState({
      username: "",
      password: "",
      role: 0,
      id: 0
    });
    window.location.reload();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar role={ this.state.role } logout={ this.logout } id={ this.state.id }/>
          <div className="container" style={{marginTop: "50px", marginBottom: "50px"}}>
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
                    done={this.state.done}
                  />
                }
              />

              <Route 
                path="/edit_password"
                render = {props => 
                  <EditPassword {...props}
                    role={this.state.role}
                    id={this.state.id}
                  />
                }
              />

              <Route 
                path="/register"
                render={props => 
                  <Register {...props} 
                    role={this.state.role}
                  />
                }
              />

              <Route 
                path="/user_info/:id"
                render={props => 
                  <UserInfo {...props}
                    role={this.state.role}
                    id={this.state.id}
                    done={this.state.done}
                  />
                }
              />

              <Route 
                path="/edit_user/:id"
                render={props =>
                  <EditUser {...props}
                    role={this.state.role}
                    id={this.state.id}
                    done={this.state.done}
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
                      return <ListUsers {...props}
                        role={this.state.role}
                        done={this.state.done}
                      />
                    case 3:
                      return <UserInfo {...props}
                        id={this.state.id}
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
