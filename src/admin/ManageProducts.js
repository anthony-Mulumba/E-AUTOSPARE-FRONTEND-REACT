import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./apiAdmin";
import { getPurchaseHistory } from "../user/apiUser";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const loadProduct = () => {
    getProducts().then(data => {
      if (data.error_message) {
        console.log(data.error_message);
      } else {
        setProducts(data.productList);
      }
    });
  };

  const destroy = productId => {
    deleteProduct(productId, user._id, token).then(data => {
      if (data.error_message) {
        console.log(data.error_message);
      } else {
        loadProduct();
      }
    });
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <Layout
      title="Manage Products"
      description="Perform CRUD on Products"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Total : {products.length} products.</h2>
          <ul className="list-group">
            {products.map((p, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{p.name}</strong>
                <Link to={`/admin/product/update/${p._id}`}>
                  <span className="badge badge-warning badge-pill">Update</span>
                </Link>
                <span
                  onClick={() => destroy(p._id)}
                  className="badge badge-danger badge-pill"
                >
                  Delete
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
