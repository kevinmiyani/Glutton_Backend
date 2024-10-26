
import Axios from "axios";

// export const baseURL = process.env.REACT_APP_API_URL;
// export const baseURL = `https://solar-project-delta.vercel.app`;
// export const baseURL = `http://192.168.29.228:8000`;
// export const baseURL = `http://localhost:8000`;
export const baseURL = `https://solar-project-9v3q.onrender.com/`;
// export const baseURL = `http://139.59.3.78/`;

const api = Axios.create({ baseURL });

api.interceptors.request.use(async (request) => {

  request.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  return request;
});

api.interceptors.response.use(
  async (response) => {
    if (response?.status === 201 || response?.status === 200) {
      return response;
    } else if (response?.status === 204) {
      return Promise.reject("");
    } else {
      return Promise.reject(response?.data ?? "Something Went Wrong");
    }
  },
  async (error) => {
    if (error?.response?.status === 401) {
      return Promise.reject(error?.response?.data || "Authorization Error");
    }
    if (error?.response?.status > 400) {
      return Promise.reject("Authorization Error");
    }

    return Promise.reject(
      error?.response?.data?.message ??
      error?.toString() ??
      "Something Went Wrong"
    );
  }
);

export default api;
