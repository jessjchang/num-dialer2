import axios from "axios"

const baseURL ='http://localhost:5001'

export const fetchNumbers = async () => {
  const response = await axios.get(`${baseURL}`);

  return response.data
}

export const commenceDial = async () => {
  await axios.get(`${baseURL}/dial`)
  return
}

// const add = async (id) => {
//   const response = await axios.post(`${baseURL}/add-to-cart`, id);
//   return response.data
// }

