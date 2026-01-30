/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

interface HttpClientParams {
  url: string;
  config?: Omit<AxiosRequestConfig, 'url' | 'headers'>;
  version?: string;
  headers?: Record<string, string>;
}

interface HttpClientParamsWithData<T = any> extends HttpClientParams {
  config?: Omit<AxiosRequestConfig, 'url' | 'headers' | 'data'>;
  data?: T;
}

interface HttpClient {
  get<T = any>(params: HttpClientParams): AxiosPromise<T>;
  delete<T = any>(params: HttpClientParams): AxiosPromise<T>;
  head<T = any>(params: HttpClientParams): AxiosPromise<T>;
  post<T = any, D = any>(params: HttpClientParamsWithData<D>): AxiosPromise<T>;
  put<T = any, D = any>(params: HttpClientParamsWithData<D>): AxiosPromise<T>;
  patch<T = any, D = any>(params: HttpClientParamsWithData<D>): AxiosPromise<T>;
}

/**
 * Метод создает и возвращает объект axiosInstance
 * @param apiVersion - версия API
 * @returns - объект AxiosInstance
 */
export const createHttpClient = (apiVersion = 'v1'): HttpClient => {
  const axiosInstance = axios.create();

  /**
   * Метод для отправки GET-запроса
   * @param url - URL эндпоинта для отправки запроса
   * @param config - Настройки для запроса
   * @param version - Версия API эндпоинта
   * @param headers - Дополнительные заголовки
   * @returns - Результат ответа от сервера
   */
  const get = <T = any>({
    url,
    config,
    version = apiVersion,
    headers = {},
  }: HttpClientParams): AxiosPromise<T> => {
    const versionStr = version ? `api/${version}` : '';
    return axiosInstance.get<T>(`${versionStr}/${url}`, {
      headers: {
        ...headers,
      },
      ...config,
    });
  };

  /**
   * Метод для отправки DELETE-запроса
   * @param url - URL эндпоинта для отправки запроса
   * @param config - Настройки для запроса
   * @param version - Версия API эндпоинта
   * @param headers - Дополнительные заголовки
   * @returns - Результат ответа от сервера
   */
  const deleteReq = <T = any>({
    url,
    config,
    version = apiVersion,
    headers = {},
  }: HttpClientParams): AxiosPromise<T> => {
    const versionStr = version ? `api/${version}` : '';
    return axiosInstance.delete<T>(`${versionStr}/${url}`, {
      headers: {
        ...headers,
      },
      ...config,
    });
  };

  /**
   * Метод для отправки HEAD-запроса
   * @param url - URL эндпоинта для отправки запроса
   * @param config - Настройки для запроса
   * @param version - Версия API эндпоинта
   * @param headers - Дополнительные заголовки
   * @returns - Результат ответа от сервера
   */
  const head = <T = any>({
    url,
    config,
    version = apiVersion,
    headers = {},
  }: HttpClientParams): AxiosPromise<T> => {
    const versionStr = version ? `api/${version}` : '';
    return axiosInstance.head<T>(`${versionStr}/${url}`, {
      headers: {
        ...headers,
      },
      ...config,
    });
  };

  /**
   * Метод для отправки POST-запроса
   * @param url - URL эндпоинта для отправки запроса
   * @param data - данные запроса
   * @param config - Настройки для запроса
   * @param version - Версия API эндпоинта
   * @param headers - Дополнительные заголовки
   * @returns - Результат ответа от сервера
   */
  const post = <T = any, D = any>({
    url,
    data,
    config,
    version = apiVersion,
    headers = {},
  }: HttpClientParamsWithData<D>): AxiosPromise<T> => {
    const versionStr = version ? `api/${version}` : '';
    return axiosInstance.request<T>({
      url: `${versionStr}/${url}`,
      method: 'post',
      headers: {
        ...headers,
      },
      ...config,
      data,
    });
  };

  /**
   * Метод для отправки PUT-запроса
   * @param url - URL эндпоинта для отправки запроса
   * @param data - данные запроса
   * @param config - Настройки для запроса
   * @param version - Версия API эндпоинта
   * @param headers - Дополнительные заголовки
   * @returns - Результат ответа от сервера
   */
  const put = <T = any, D = any>({
    url,
    data,
    config,
    version = apiVersion,
    headers = {},
  }: HttpClientParamsWithData<D>): AxiosPromise<T> => {
    const versionStr = version ? `api/${version}` : '';
    return axiosInstance.request<T>({
      url: `${versionStr}/${url}`,
      method: 'put',
      headers: {
        ...headers,
      },
      ...config,
      data,
    });
  };

  /**
   * Метод для отправки PATCH-запроса
   * @param url - URL эндпоинта для отправки запроса
   * @param data - Данные запроса
   * @param config - Настройки для запроса
   * @param version - Версия API эндпоинта
   * @param headers - Дополнительные заголовки
   * @returns - Результат ответа от сервера
   */
  const patch = <T = any, D = any>({
    url,
    data,
    config,
    version = apiVersion,
    headers = {},
  }: HttpClientParamsWithData<D>): AxiosPromise<T> => {
    const versionStr = version ? `api/${version}` : '';
    return axiosInstance.request<T>({
      url: `${versionStr}/${url}`,
      method: 'patch',
      headers: {
        ...headers,
      },
      ...config,
      data,
    });
  };

  return {
    get,
    delete: deleteReq,
    head,
    post,
    put,
    patch,
  };
};

/** Общий экземпляр HTTP-клиента (без префикса версии API). */
export const request = createHttpClient('');
