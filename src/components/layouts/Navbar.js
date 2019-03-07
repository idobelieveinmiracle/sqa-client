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
      case 2:
        return <Link to="/add_customer">Thêm khách hàng</Link>
      default:
        return <span></span>
    }
  }

  return (
    <div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="conatiner-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Trang chủ</Link>
          </div>
          <ul className="nav navbar-nav">
            <li><Link to={`/user_info/${props.id}`}>Thông tin của tôi</Link></li>
            <li>{ navs() }</li>
            <li>{ logout }</li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
