import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { signup } from "../auth";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    error: "",
    success: false
  });

  const { name, email, password, password2, success, error } = values;

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({
      name,
      email,
      password,
      password2
    }).then(data => {
      if (data.error_message) {
        setValues({
          ...values,
          error: data.error_message,
          success: false
        });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          password2: "",
          error: "",
          success: true
        });
      }
    });
  };
  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Confirmed Password</label>
        <input
          onChange={handleChange("password2")}
          type="password"
          className="form-control"
          name="password2"
          value={password2}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div class="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div class="alert alert-info" style={{ display: success ? "" : "none" }}>
      New account is created. Please <Link to="/signin">Signin</Link>
    </div>
  );

  return (
    <Layout
      title="Signup Page"
      description="Signup to E-autospare-anthox"
      className="container col-md-8 offset-md-2"
    >
      {showSuccess()}
      {showError()}
      {signUpForm()}
    </Layout>
  );
};

export default Signup;
