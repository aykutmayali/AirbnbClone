import React from "react";
import { Link } from "react-router-dom";
import { store } from "../../index.js";
import SignedinLinks from "./SignedinLinks";
import SignedoutLinks from "./SignedoutLinks";

const Navbar = () => {
  const userstore = store.getState().auth.user;
  console.log("Mevuct user", userstore);

  return (
    <nav className="nav-wrapper blue-grey lighten-3">
      <div className="container">
        <Link to="/" className="brand-logo left-align">
          Apartment Listings
        </Link>
        {userstore ? <SignedinLinks /> : <SignedoutLinks />}
      </div>
    </nav>
  );
};

export default Navbar;
