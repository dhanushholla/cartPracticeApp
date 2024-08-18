import React from "react";
import "./productstyle.css";
const Cart = (props) => {
  const { title, price, imagesrc, handleRemoveCart, id, handleCount, count } =
    props;
  return (
    <div className="cardWrapper">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "70%" }}>{title}</div>
        <div>
          <img src={imagesrc} alttext="dummyimage" width="30px" height="30px" />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>{"$" + price}</div>
        <div style={{ flexDirection: "column" }}>
          <button onClick={() => handleCount(id, "sub")}>➖</button>
          <span>{count}</span>
          <button onClick={() => handleCount(id, "add")}>➕</button>
        </div>
        <button onClick={() => handleRemoveCart(id)}>🗑️</button>
      </div>
    </div>
  );
};

export default Cart;
