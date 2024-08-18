import React from "react";
import "./productstyle.css";
const Product = (props) => {
  const { title, price, imagesrc, id, handleCart } = props;
  return (
    <div className="ProductWrapper">
      <div className="TitleWrapper">{title}</div>
      <div className="ProductImage">
        <img src={imagesrc} alttext="dummyimage" />
      </div>
      <div className="footer">
        <div className="PriceWrapper">{"$" + price}</div>
        <button onClick={() => handleCart(id)}>🛒</button>
      </div>
    </div>
  );
};

export default Product;
