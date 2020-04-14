import API from "../config";

export const signup = user => {
  //console.log(name, email, password, password2);
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(error => console.log(error));
};

export const signin = user => {
  //console.log(name, email, password, password2);
  return fetch(`${API}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(error => console.log(error));
};

export const authenticate = (data, next) => {
  if (typeof window !== undefined) {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = next => {
  if (typeof window !== undefined) {
    localStorage.removeItem("jwt");
    next();

    return fetch(`{API}/signout`, {
      method: "GET"
    })
      .then(response => {
        console.log("sign out test:", response);
      })
      .catch(err => console.log(err));
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
