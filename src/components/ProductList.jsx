import { useEffect, useState } from "react";
import React from "react";
import "./productstyle.css";
import Product from "./Product";
import Cartitem from "./Cart";
import { useCallback } from "react";

const debouncing = (fnname, delay) => {
  let timer;
  return function (...args) {
    console.log("set debounce");
    clearTimeout(timer);
    timer = setTimeout(() => {
      fnname(args);
    }, delay);
  };
};

const ProductList = () => {
  const [listitems, setListItems] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("");
  const [loadStats, setLoadStats] = useState({
    loading: true,
    error: "",
    data: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const categories = ["beauty", "fragrances", "furniture", "groceries"];
  const [sortKey, setSortKey] = useState("asc");

  const revampedInitApiCall = (url) => {
    try {
      fetch(url)
        .then((data) => data.json())
        .then((res) => {
          setLoadStats((prev) => {
            const newLoadStats = {
              loading: false,
              error: "",
              data: res.products,
            };
            setListItems(newLoadStats.data);
            return newLoadStats;
          });
        })
        .catch((err) => {
          setLoadStats({ loading: false, error: err, data: [] });
        });
    } catch (err) {
      setLoadStats({ loading: false, error: "", data: [] });
    }
  };
  useEffect(() => {
    revampedInitApiCall("https://dummyjson.com/products");
  }, []);

  useEffect(() => {
    let res = 0;
    cartitems.map((ele) => (res = res + ele?.count * ele.price));
    setTotal(Math.floor(res));
  }, [cartitems]);

  const handleCount = (id, operation) => {
    const doOperation = (val) =>
      operation === "add" ? val + 1 : val > 1 ? val - 1 : val;
    setCartItems((pre) =>
      pre.map((el) =>
        id === el.id ? { ...el, count: doOperation(el?.count || 1) } : el
      )
    );
  };

  const handleCartItems = (item) => {
    setCartItems((pre) => {
      let updated = false;
      let newArr = pre.map((ele) => {
        if (ele.id === item.id) {
          updated = true;
          return { ...ele, count: ele.count + 1 };
        }
        return ele;
      });
      if (!updated) {
        newArr.push({ ...item, count: 1 });
      }
      return newArr;
    });
  };

  const handleRemoveCart = (index) => {
    setCartItems((pre) => pre.filter(({ id }) => id != index));
  };
  const handleSelectChange = (e) => {
    setSearchKey("");
    setSelectedCategory(e.target.value);

    setListItems([
      ...loadStats.data.filter((item) => item.category === e.target.value),
    ]);
  };
  const handleSearch = (e) => {
    let searchString = e.target.value.toLowerCase();
    setSelectedCategory("");
    setSearchKey(searchString);
    delayedSearchResults(searchString);
  };
  const delayedSearchResults = useCallback(
    debouncing((value) => {
      console.log("deb");
      setListItems([
        ...loadStats.data.filter((item) =>
          item.title.toLowerCase().includes(value)
        ),
      ]);
    }, 1000),
    [loadStats.data]
  );

  const resetFilter = () => {
    setListItems(loadStats.data);
    setSearchKey("");
    setSelectedCategory("");
  };

  const sortByprice = (type) => {
    if (type == "asc") {
      const newProductList = [...listitems];
      newProductList.sort((a, b) => a.price - b.price);
      setListItems(newProductList);
    } else {
      const newProductList = [...listitems];
      newProductList.sort((a, b) => b.price - a.price);
      setListItems(newProductList);
    }
  };
  return (
    <>
      {loadStats.loading ? (
        <div class="loader">Loading .... </div>
      ) : err ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Something went Wrong!
          <img src="oopss.png" width="50%" height="50%" />
        </div>
      ) : (
        <div>
          <div>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={handleSelectChange}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace(/-/g, " ")}
                </option>
              ))}
            </select>
            <input
              type="search"
              value={searchKey}
              style={{
                marginLeft: "10px",
                padding: "5px",
              }}
              placeholder="Enter name to search"
              onChange={handleSearch}
            />{" "}
            Sort by price:
            <>
              <button className="resetBtn" onClick={() => sortByprice("asc")}>
                Asc
              </button>
              <button className="resetBtn" onClick={() => sortByprice("desc")}>
                Desc
              </button>
            </>
            <button className="resetBtn" role="button" onClick={resetFilter}>
              Reset Filter
            </button>
          </div>
          <div
            style={{
              display: "flex",
              width: "90vw",
              height: "90vh",
            }}
          >
            <div
              style={{
                width: "55vw",
                overflowY: "auto",
              }}
            >
              Product List:
              <div className="ProductsPanel">
                {listitems.length ? (
                  listitems.map((item, index) => (
                    <Product
                      key={`product${index}`}
                      title={item.title}
                      id={item.id}
                      imagesrc={item.images[0]}
                      price={item.price}
                      handleCart={() => handleCartItems(item)}
                    />
                  ))
                ) : (
                  <div>No items</div>
                )}
              </div>
            </div>
            <div
              style={{
                width: "30vw",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginLeft: "1rem",
              }}
            >
              Cart Total: ${total}
              {cartitems.length ? (
                cartitems.map((item, index) => (
                  <Cartitem
                    title={item.title}
                    id={item.id}
                    imagesrc={item.images[0]}
                    price={item?.price}
                    index={index}
                    count={item?.count || 1}
                    handleRemoveCart={handleRemoveCart}
                    handleCount={handleCount}
                  />
                ))
              ) : (
                <div>Cart is empty</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
