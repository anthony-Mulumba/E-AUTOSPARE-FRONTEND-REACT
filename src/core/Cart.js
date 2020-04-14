import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = item => {
    return (
      <div>
        <h2>Your Cart has {`${item.length}`} Items.</h2>
        <hr />
        {item.map((product, index) => (
          <Card
            key={index}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <h2>
      Your Cart is empty. <br /> <Link to="/shop">Continue Shopping</Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart item. Add remove checkout or continue shopping!"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>
        <div className="col-6">
          <h2 className="mb-4">Your Cart Summary</h2>
          <hr />
          <Checkout setRun={setRun} products={items} />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
