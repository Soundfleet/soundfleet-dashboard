import axios, { Axios, AxiosRequestConfig, CancelToken } from "axios";
import { store } from "../redux/store";


interface AppLoadingType {
  type: "APP_LOADING",
  payload: number
}


function appLoading(loading: number): AppLoadingType {
  return {
    type: "APP_LOADING",
    payload: loading
  }
}


export interface Params {
  [key: string]: any
}


export interface Headers {
  [key: string]: any
}


export interface Options {
  [key: string]: any
}


class ApiClient {

  accessToken: string | undefined;
  axiosInstance: Axios;

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    })
  }

  async get(
    path: string, 
    params: Params,
    headers: Headers,
    cancelToken?: CancelToken,
    extraOptions?: Options
  ) {
    store.dispatch(appLoading(1))
    try {
      const response = await this.axiosInstance.get(
        path,
        this.getHttpOptions(
          params,
          {...this.getHeaders(), ...headers},
          cancelToken,
          extraOptions
        ),
      );
      store.dispatch(appLoading(-1));
      return response;
    } catch (error) {
      store.dispatch(appLoading(-1));
      throw error;
    }
  }

  async post(
    path: string, 
    payload: Params = {},
    headers: Headers = {},
    cancelToken?: CancelToken,
    extraOptions?: Options
  ) {
    store.dispatch(appLoading(1))
    try {
      const response = await this.axiosInstance.post(
        path,
        payload,
        this.getHttpOptions(
          {},
          {...this.getHeaders(), ...headers},
          cancelToken,
          extraOptions
        ),
      );
      store.dispatch(appLoading(-1));
      return response;
    } catch (error) {
      store.dispatch(appLoading(-1));
      throw error;
    }
  }

  private getHeaders() {
    const headers: {[Key: string]: any} = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  private getHttpOptions(
    params: Params = {},
    headers: Headers = {},
    cancelToken: CancelToken | undefined = undefined,
    extraOptions: {[key: string]: any} = {}
  ) {
    const httpOptions: AxiosRequestConfig = {
      cancelToken: cancelToken,
      headers: headers,
      params: params,
      ...extraOptions
    };
    return httpOptions;
  }
}


export default ApiClient;