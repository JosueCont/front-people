import React, { Component } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";
import axiosApi, {
  setConfigAxios,
  resetConfig,
  domainApi,
  typeHttp,
} from "./axiosApi";
import _ from "lodash";

export const auth = (ctx) => {
  // console.log('Aqui en al auth', ctx);
  const { token } = nextCookie(ctx);

  if (ctx.req && !token) {
    // console.log('Sin Token!!', token)
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return;
  }

  if (!token) {
    Router.push("/");
  }

  return token;
};

const setInitialProps = (component) => {
  //console.log('PASO 1 (SERVER): Asignando initial props al componente')
  component.getInitialProps = async (ctx) => {
    // We use `nextCookie` to get the cookie and pass the token to the
    // frontend in the `props`.
    const { token } = nextCookie(ctx);

    const redirectOnError = (msg = "") => {
      console.log("Redireccionando error", msg);
      //console.log('Redireccionando')
      if (process.browser) {
        //console.log('Es cliente')
        Router.push("/security/auth/login");
      } else {
        //console.log('Es server')
        ctx.res.writeHead(302, { Location: "/security/auth/login" });
        ctx.res.end();
        return;
      }
    };

    try {
      if (token) {
        // console.log('INICANDO')
        // await setConfigAxios(token.token);
        axiosApi.defaults.headers.common[
          "Authorization"
        ] = `JWT ${token.token}`;
        // console.log('FINALIZADO')
      } else {
        axiosApi.defaults.headers.common["Authorization"] = "";
      }
    } catch (error) {
      // Implementation or Network error
      // console.log('Error en authentificación', error);
      return await redirectOnError(error);
    }
  };
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component) =>
  Component.displayName || Component.name || "Component";

// Aqui empieza todo el flujo de sesiones
export const withAuthSync = (WrappedComponent) =>
  class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      setInitialProps(WrappedComponent);
      console.log("PASO 2 DESDE EL SERVER: Se verifica que haya token");
      const token = auth(ctx);
      console.log("----Token regresado", token);

      //console.log('PASO 3: Se ejecuta el inital props')
      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));
      // console.log('withAuthSync props', componentProps, token)
      return { ...componentProps, token };
    }

    render() {
      // console.log('Props finales', this.props);
      return <WrappedComponent {...this.props} />;
    }
  };

export const loginAuth = async (token) => {
  await cookie.remove("token");
  await cookie.set("token", token, { expires: 1 });
  // await setConfigAxios(token.token);
  // Router.push("/");
};

export const logoutAuth = async () => {
  cookie.remove("token");
  //console.log("Logout");
  await Router.push("/");
};
