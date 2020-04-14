import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, updateItem, removeItem } from "./cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = f => f,
  run = undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = showViewProductButton => {
    if (showViewProductButton) {
      return (
        showViewProductButton && (
          <button className="btn btn-outline-primary mt-2 mb-2">
            View product
          </button>
        )
      );
    }
  };

  const addToCart = () => {
    addItem(product, () => setRedirect(true));
  };

  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = showAddToCartButton => {
    if (showAddToCartButton) {
      return (
        showAddToCartButton && (
          <button
            onClick={addToCart}
            className="btn btn-outline-warning mt-2 mb-2 ml-2"
          >
            Add to cart
          </button>
        )
      );
    }
  };

  const showRemoveButton = showRemoveProductButton => {
    if (showRemoveProductButton) {
      return (
        showRemoveProductButton && (
          <button
            onClick={() => {
              removeItem(product._id);
              setRun(!run); //run useEffect in parent Cart
            }}
            className="btn btn-outline-danger mt-2 mb-2 ml-2"
          >
            Remove Product
          </button>
        )
      );
    }
  };

  const showStock = quantity => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">
        {quantity} In stock
      </span>
    ) : (
      <span className="badge badge-primary badge-pill">Out of stock!</span>
    );
  };

  const handleChange = productId => event => {
    setRun(!run); //run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = cartUpdate => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  return (
    <div className="card">
      <div className="card-header name"> {product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <p className="lead mt-2">{product.description.substring(0, 100)}</p>
        <p className="black-10">${product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">Added {moment(product.createdAt).fromNow()}</p>
        {showStock(product.quantity)}
        <br />
        <Link to={`/product/${product._id}`}>
          {showViewButton(showViewProductButton)}
        </Link>

        {showAddToCart(showAddToCartButton)}
        {showRemoveButton(showRemoveProductButton)}
        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
