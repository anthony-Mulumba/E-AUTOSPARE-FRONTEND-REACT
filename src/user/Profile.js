import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

const Profile = props => {
  const [values, setValues] = useState({
    name: "",
    password: "",
    error: false,
    success: false
  });

  const { token } = isAuthenticated();
  const { name, password, error, success } = values;

  const init = userId => {
    //console.log(userId);
    read(userId, token).then(data => {
      if (data.error_message) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name });
      }
    });
  };

  useEffect(() => {
    init(props.match.params.userId);
  }, []);

  const handleChange = name => e => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const clickSubmit = e => {
    e.preventDefault();
    update(props.match.params.userId, token, { name, password }).then(data => {
      if (data.error_message) {
        setValues({ ...values, error: true });
      } else {
        updateUser(data, () => {
          setValues({ ...values, name: data.name, success: true });
        });
      }
    });
  };

  const redirectUser = success => {
    if (success) {
      return <Redirect to="/cart" />;
    }
  };

  const profileUpdate = (name, password) => (
    <form className="form-group">
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange("name")}
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange("password")}
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <Layout
      title="Profile"
      description="Update your profile"
      className="container-fluid"
    >
      <h2 className="mb-4">Profile Update!</h2>
      {profileUpdate(name, password)}
      {redirectUser(success)}
    </Layout>
  );
};

export default Profile;
