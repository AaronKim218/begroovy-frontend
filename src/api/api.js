import { createUserApi } from "./userApi";
import { createAuthApi } from "./authApi";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const userApi = createUserApi(API_BASE_URL);
export const authApi = createAuthApi(API_BASE_URL);