import React, { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setCheckbox] = useState([]);

  const handleToggle = cat_Id => () => {
    // return the first index or -1
    const currentCategoryId = checked.indexOf(cat_Id);
    const newCheckedCategoryId = [...checked];
    //if currently checked was not already in check state > push
    //else pull/take off
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(cat_Id);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }

    //console.log(newCheckedCategoryId);
    setCheckbox(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((category, index) => (
    <li key={index} className="list-unstyled">
      <input
        onChange={handleToggle(category._id)}
        value={checked.indexOf(category._id === -1)}
        type="checkbox"
        className="form-check-input"
      />
      <label className="form-check-label">{category.name}</label>
    </li>
  ));
};

export default Checkbox;
