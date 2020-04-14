import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getSingleProduct, listRelated } from "./apiCore";
import Card from "./Card";

const Product = props => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);
  const [relatedError, setRelatedError] = useState(false);

  const loadSingleProduct = productId => {
    getSingleProduct(productId)
      .then(data => {
        if (data.error_message) {
          setError(data.error_message);
        } else {
          setProduct(data);
          //Fetch the related product
          listRelated(data._id)
            .then(data => {
              if (data.error_message) {
                setRelatedError(data.error_message);
              } else {
                setRelatedProduct(data.relatedProduct);
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    //Getting productId from the URL
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <Layout
      title={product && product.name}
      description={
        product && product.description && product.description.substring(0, 100)
      }
      className="container-fluid"
    >
      <div className="row ml-2">
        <div className="col-8">
          {product && product.description && (
            <Card product={product} showViewProductButton={false} />
          )}
        </div>
        <div className="col-4">
          <h4>Related Product</h4>
          {relatedProduct &&
            relatedProduct.map((product, index) => (
              <div className="mb-3">
                <Card key={index} product={product} />
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
