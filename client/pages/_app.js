import "../scss/global.scss";
import "semantic-ui-css/semantic.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import React, { useMemo, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { setToken, getToken, removeToken } from "../api/token";
import {
  getProductsCart,
  addProductCart,
  countProductCart,
  removeProductCart,
  removeAllProductsCart,
} from "../api/cart";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState(undefined);
  const [reloadUser, setReloadUser] = useState(false);
  const [totalProductsCart, setTotalProductsCart] = useState(0);
  const [reloadCart, setReloadCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("Entro token: ", token)
      setAuth({
        token,
        idUser: jwtDecode(token).id,
      });
    } else {
      setAuth(null);
    }
    setReloadUser(false);
  }, [reloadUser]);

  useEffect(() => {
    setTotalProductsCart(countProductCart());
    setReloadCart(false);
  }, [reloadCart, auth]);

  const login = (token) => {
    setToken(token);
    setAuth({
      token,
      idUser: jwtDecode(token).id,
    });
  };

  const logout = () => {
    if (auth) {
      removeToken();
      setAuth(null);
      router.push("/");
    }
  };

  const addProduct = (product) => {
    console.log(auth)
    if (getToken()) {
      
      addProductCart(product);
      setReloadCart(true);
    } else {
      toast.warning("Para comprar un juego tienes que iniciar sesion");
    }
  };

  const authData = useMemo(
    () => ({
      auth,
      login,
      logout,
      setReloadUser,
    }),
    [auth]
  );

  const removeProduct = (product) => {
    removeProductCart(product);
    setReloadCart(true);
  };

  const cartData = useMemo(
    () => ({
      productsCart: totalProductsCart,
      addProductCart: (product) => addProduct(product),
      getProductsCart: getProductsCart,
      removeProductCart: (product) => removeProduct(product),
      removeAllProductsCart: removeAllProductsCart,
    }),
    [totalProductsCart]
  );

  if (auth === undefined) return null;

  return (
    <AuthContext.Provider value={authData}>
      <CartContext.Provider value={cartData}>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
