import axiosInstance from "./axiosInstance";

export const loginApi = async (email: string, password: string) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerApi = async (
  fullName: string,
  email: string,
  password: string,
  role: string
) => {
  const response = await axiosInstance.post("/api/auth/register", {
    fullName,
    email,
    password,
    role,
  });
  return response.data;
};