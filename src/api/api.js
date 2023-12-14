import { createUserApi } from "./userApi";
import { createAuthApi } from "./authApi";
import { createSongApi } from "./songApi";
import { createPostApi } from "./postApi";
import { createGroupApi } from "./groupApi";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const userApi = createUserApi(API_BASE_URL);
export const authApi = createAuthApi(API_BASE_URL);
export const songApi = createSongApi(API_BASE_URL);
export const postApi = createPostApi(API_BASE_URL);
export const groupApi = createGroupApi(API_BASE_URL);