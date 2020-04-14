import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error_message) {
        console.log(data.error_message);
      } else {
        setData({ ...data, categories: data.categories });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    if (search) {
      list({ search: search || undefined, category: category })
        .then(response => {
          if (data.error_message) {
            console.log(data.error_message);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        })
        .catch(err => console.log(err));
    }
  };

  const searchSubmit = event => {
    event.preventDefault();
    searchData();
  };

  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} Products.`;
    }
    if (searched && results.length < 1) {
      return `No products found.`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
        <div className="row">
          {results.map((product, index) => (
            <Card key={index} product={product} />
          ))}
        </div>
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select className="btn mr-2" onChange={handleChange("category")}>
              <option value="All">All Categories</option>
              {categories.map((c, index) => (
                <option key={index} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="search"
            onChange={handleChange("search")}
            className="form-control"
            placeholder="Search by name"
          />
        </div>
        <div className="btn input-group-append" style={{ border: "none" }}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  );

  return (
    <div className="row">
      <div className="container mb-3">{searchForm()}</div>
      <div className="container-fluid mb-3">{searchedProducts(results)}</div>
      <hr />
    </div>
  );
};

export default Search;
