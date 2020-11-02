import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Debugger } from "debug";

declare interface UserOptions {
  request?(debug: Debugger, config: AxiosRequestConfig): void;
  response?(debug: Debugger, response: AxiosResponse): void;
  error?(debug: Debugger, error: AxiosError): void;
}

declare const config: ((userOptions: UserOptions) => void) & {
  addLogger(instance: AxiosInstance, debug?: Debugger): void;
}

export = config;
