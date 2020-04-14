import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productBySell, setProductBySell] = useState([]);
  const [productByArrival, setProductByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductBySell = () => {
    getProducts("sold").then(data => {
      if (data.error_message) {
        setError(data.error_message);
      } else {
        setProductBySell(data.productList);
      }
    });
  };

  const loadProductByArrival = () => {
    getProducts("createdAt").then(data => {
      if (data.error_message) {
        setError(data.error_message);
      } else {
        setProductByArrival(data.productList);
      }
    });
  };

  useEffect(() => {
    loadProductByArrival();
    loadProductBySell();
  }, []);

  return (
    <Layout
      title="Home Page"
      description="E-autospare-anthox"
      className="container-fluid"
    >
      <Search />
      <h2 className="mb-4">Best Sellers</h2>
      <div className="row">
        {productBySell.map((product, index) => (
          <div key={index} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
      <h2 className="mb-4">New Arrival</h2>
      <div className="row">
        {productByArrival.map((product, index) => (
          <div key={index} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default Home;
