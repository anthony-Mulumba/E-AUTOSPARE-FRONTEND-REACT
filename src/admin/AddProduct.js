import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createProduct, getCategories } from "./apiAdmin";

const AddProduct = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    shipping: "",
    photo: "",
    categories: [],
    category: "",
    quantity: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: ""
  });

  const { user, token } = isAuthenticated();

  const {
    name,
    description,
    price,
    shipping,
    categories,
    category,
    quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData
  } = values;

  // load categories and set formData

  const init = () => {
    getCategories().then(data => {
      if (data.error_message) {
        setValues({ ...values, error: data.error_message });
      } else {
        setValues({
          ...values,
          categories: data.categories,
          formData: new FormData()
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    createProduct(formData, user._id, token).then(data => {
      if (data.error_message) {
        setValues({ ...values, error: data.error_message, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          photo: "",
          price: "",
          quantity: "",
          loading: false,
          createdProduct: data.name
        });
      }
    });
  };

  const newForm = () => (
    <form className="mb-2" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          type="text"
          value={description}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          value={price}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please select</option>
          {categories &&
            categories.map((category, index) => (
              <option key={index} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange("shipping")} className="form-control">
          <option>Please select</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          value={quantity}
          className="form-control"
        />
      </div>

      <button className="btn btn-outline-primary">Create Product</button>
    </form>
  );

  const showError = () => (
    <div class="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      class="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct}`} is created.</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <Layout
      title="Add a new product"
      description={`Good day ${user.name.toUpperCase()}, ready to add a new product?`}
    >
      {showLoading()}
      {showSuccess()}
      {showError()}
      <div className="row">
        <div className="col-md-8 offset-md-2">{newForm()}</div>
      </div>
    </Layout>
  );
};

export default AddProduct;
