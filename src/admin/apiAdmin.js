import API from "../config";

export const createCategory = (categoryName, adminId, token) => {
  return fetch(`${API}/category/create/${adminId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `${token}`
    },
    body: JSON.stringify(categoryName)
  })
    .then(response => {
      return response.json();
    })
    .catch(error => console.log(error));
};

export const createProduct = (product, adminId, token) => {
  return fetch(`${API}/product/create/${adminId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `${token}`
    },
    body: product
  })
    .then(response => {
      return response.json();
    })
    .catch(error => console.log(error));
};

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: "GET"
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const listOrders = (userId, token) => {
  return fetch(`${API}/order/list/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${token}`
    }
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const getStatusValues = (userId, token) => {
  return fetch(`${API}/order/status-values/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${token}`
    }
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const updateOrderStatus = (userId, token, orderId, status) => {
  return fetch(`${API}/order/${orderId}/status/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `${token}`
    },
    body: JSON.stringify({ status, orderId })
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

/*
 * Perform CRUD on PRODUCTS
 *
 */

export const getProducts = () => {
  return fetch(`${API}/products?limit=undefined`, {
    method: "GET"
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const deleteProduct = (productId, userId, token) => {
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `${token}`
    }
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const getProduct = productId => {
  return fetch(`${API}/product/${productId}`, {
    method: "GET"
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const updateProduct = (productId, userId, token, product) => {
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `${token}`
    },
    body: product
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};
