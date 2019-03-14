import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.logout();
  }

  const logout = props.role !== 0 ? (<Link to="/" onClick={ handleClick }>Đăng xuất</Link>) : (<span></span>);

  const navs = () => {
    switch (props.role) {
      case 1:
        return <Link to="/edit_coe">Sửa hệ số</Link>;
      default:
        return <span></span>
    }
  }

  const my_info = props.role === 1 ? (
    <Link to={`/user_info/${props.id}`}>Thông tin của tôi</Link>
  ) : (<span></span>)

  const edit_password = props.role !== 0 ? (
    <Link to={`/edit_password`}>Đổi mật khẩu</Link>
  ) : (<span></span>)

  return (
    <div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="conatiner-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Trang chủ</Link>
          </div>
          <ul className="nav navbar-nav">
            <li>{my_info}</li>
            <li>{ navs() }</li>
            <li>{edit_password}</li>
            <li>{ logout }</li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
