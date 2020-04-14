import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { getCategories, updateProduct, getProduct } from "./apiAdmin";

const UpdateProduct = props => {
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
    updatedProduct: "",
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
    updatedProduct,
    redirectToProfile,
    formData
  } = values;

  // load categories and set formData

  const init = productId => {
    getProduct(productId).then(data => {
      if (data.error_message) {
        setValues({ ...values, error: data.error_message });
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          shipping: data.shipping,
          formData: new FormData()
        });
        initCategories();
      }
    });
  };

  const initCategories = () => {
    getCategories().then(data => {
      if (data.error_message) {
        setValues({ ...values, error: data.error_message });
      } else {
        setValues({
          categories: data.categories,
          formData: new FormData()
        });
      }
    });
  };

  useEffect(() => {
    init(props.match.params.productId);
  }, []);

  const handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(props.match.params.productId, user._id, token, formData).then(
      data => {
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
            redirectToProfile: true,
            updatedProduct: data.name
          });
        }
      }
    );
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

      <button className="btn btn-outline-primary">Update Product</button>
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
      style={{ display: updatedProduct ? "" : "none" }}
    >
      <h2>{`${updatedProduct}`} is updated.</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect />;
      }
    }
  };

  return (
    <Layout
      title="Add a new product"
      description={`Good day ${user.name.toUpperCase()}, ready to update a new product?`}
    >
      {showLoading()}
      {showSuccess()}
      {showError()}
      <div className="row">
        <div className="col-md-8 offset-md-2">{newForm()}</div>
      </div>
      {redirectUser()}
    </Layout>
  );
};

export default UpdateProduct;
