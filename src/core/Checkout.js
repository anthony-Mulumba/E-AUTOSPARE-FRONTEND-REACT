import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import Layout from "./Layout";
import { emptyCart } from "./cartHelpers";
import {
  // getProducts,
  getBraintreeClientToken,
  processPayment,
  createOrder
} from "./apiCore";
//import Card from "./Card";
import { isAuthenticated } from "../auth";
import DropIn from "braintree-web-drop-in-react";

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: ""
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token)
      .then(data => {
        if (data.error) {
          setData({ ...data, error: data.error });
        } else {
          setData({ clientToken: data.clientToken });
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);
  //currentValue is the accumulator and initialize to Zero as Reduce second parameter
  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to check out</button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    setData({ loading: true });
    //Send nonce to your server
    //nonce = data.instance.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        //console.log(data);
        nonce = data.nonce;
        //once you have nonce(card type, card number) send nonce as 'paymentMethodNonce'
        //and also total to be charged
        /* console.log(
          "send nonce and total to be charged",
          nonce,
          getTotal(products)
        );*/

        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products)
        };

        processPayment(userId, token, paymentData)
          .then(response => {
            //console.log(response);
            setData({ ...data, success: response.success });
            //empty the cart
            //create Order
            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress
            };

            createOrder(userId, token, createOrderData)
              .then(response => {
                emptyCart(() => {
                  setData({ loading: false, success: true });
                  setRun(!run);
                  // console.log("payment Success and empty Cart");
                });

                //console.log(resp);
              })
              .catch(err => console.log(err));
          })
          .catch(error => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch(error => {
        //console.log("Nonce Error", error);
        setData({ ...data, error: error.message });
      });
  };

  const handleAddress = event => {
    setData({ ...data, address: event.target.value });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault"
              }
            }}
            onInstance={instance => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showSuccess = success => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks. Your payment was successful!!
    </div>
  );

  const showLoading = loading => loading && <h2>Loading...</h2>;
  const showError = error => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  return (
    <div>
      <h2>Total :${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
