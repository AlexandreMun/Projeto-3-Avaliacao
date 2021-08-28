import "./Logo.css";
import React from "react";
import Logo from "../../assets/images/logo.png";

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => (
  <aside className="logo">
    <a href="/" className="logo">
      <img src={Logo} alt="logo" />
    </a>
  </aside>
);

