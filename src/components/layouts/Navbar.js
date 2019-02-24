import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.logout();
  }

  const logout = props.role !== 0 ? (<Link to="/" onClick={ handleClick }>Logout</Link>) : (<span></span>);

  const navs = () => {
    if (props.role === 1) {
      return <Link to="/edit_coe">Edit</Link>
    }
  }

  return (
    <div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="conatiner-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Home</Link>
          </div>
          <ul className="nav navbar-nav">
            <li>{ navs() }</li>
            <li>{ logout }</li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
