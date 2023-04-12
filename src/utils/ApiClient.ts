import axios, { Axios, AxiosRequestConfig, CancelToken } from "axios";
import { toast } from "react-hot-toast";
import { setSession } from "../auth/redux/actions";
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
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    });
    this.axiosInstance.interceptors.request.use(
      function (config) {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (exception) => {
        if (exception.response && exception.response.status === 401) {
          localStorage.removeItem("SESSION");
          store.dispatch(setSession(undefined));
          toast.error(
              "Your session has expired, please log in again.",
          );
        }
        throw exception;
      }
    )
  }

  async get(
    path: string, 
    params: Params = {},
    headers: Headers = {},
    cancelToken?: CancelToken,
    extraOptions?: Options
  ) {
    store.dispatch(appLoading(1))
    try {
      const response = await this.axiosInstance.get(
        path,
        this.getHttpOptions(
          params,
          headers,
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
          headers,
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

  async patch(
    path: string, 
    payload: Params = {},
    headers: Headers = {},
    cancelToken?: CancelToken,
    extraOptions?: Options
  ) {
    store.dispatch(appLoading(1))
    try {
      const response = await this.axiosInstance.patch(
        path,
        payload,
        this.getHttpOptions(
          {},
          headers,
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

  async delete(
    path: string, 
    headers: Headers = {},
    cancelToken?: CancelToken,
    extraOptions?: Options
  ) {
    store.dispatch(appLoading(1))
    try {
      const response = await this.axiosInstance.delete(
        path,
        this.getHttpOptions(
          {},
          headers,
          cancelToken,
          extraOptions
        ),
      );
      store.dispatch(appLoading(-1));
      return response;
    } catch (exception: any) {
      store.dispatch(appLoading(-1));
      throw exception;
    }
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