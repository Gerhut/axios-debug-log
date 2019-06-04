import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Debugger } from "debug";

interface UserOptions {
  request(debug: Debugger, config: AxiosRequestConfig): void;
  response(debug: Debugger, response: AxiosResponse): void;
  error(debug: Debugger, error: AxiosError): void;
}

export default function(userOptions: UserOptions): void;
export function addLogger(instance: AxiosInstance, debug: Debugger): void;
