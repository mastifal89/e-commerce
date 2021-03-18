import React, { useState, useEffect } from "react";
import BasicLayout from "../layouts/BasicLayout";
import { getGameByUrlapi } from "../api/game";
import useCart from "../hooks/useCart";
import SummaryCart from "../components/Cart/SummaryCart";
import ShippingAddress from "../components/Cart/ShippingAddress";
import Payment from "../components/Cart/Payment";

export default function cart() {
  const { getProductsCart } = useCart();
  const products = getProductsCart();

  return !products ? <EmptyCart /> : <FullCart products={products} />;
}

function EmptyCart() {
  return (
    <BasicLayout className="empty-cart">
      <h2>No hay elementos en el carrito</h2>
    </BasicLayout>
  );
}

function FullCart(props) {
  const { products } = props;
  const [productsData, setProductsData] = useState(null);
  const [reloadCart, setReloadCart] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      const productsTemp = [];
      for await (const product of products) {
        const data = await getGameByUrlapi(product);
        productsTemp.push(data);
      }
      setProductsData(productsTemp);
    })();
    setReloadCart(false);
  }, [reloadCart]);

  return (
    <BasicLayout className="empty-cart">
      <SummaryCart
        products={productsData}
        setReloadCart={setReloadCart}
        reloadCart={reloadCart}
      />
      <ShippingAddress setAddress={setAddress} />
      {address && <Payment products={productsData} address={address} />}
    </BasicLayout>
  );
}
