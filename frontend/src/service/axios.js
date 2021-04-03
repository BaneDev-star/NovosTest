import axios from 'axios'
import { baseUrl } from '../configs'

export default() => {
  return axios.create({
    baseURL: baseUrl
  });
}
