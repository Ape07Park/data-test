import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터 추가하기
axiosInstance.interceptors.request.use(function (config) {
  // 요청이 전달되기 전에 작업 수행
  return config;
}, function (error) {
  // 요청 오류가 있는 작업 수행
  return Promise.reject(error);
});

// 응답 인터셉터 추가하기
axiosInstance.interceptors.response.use(function (response) {

  if (response.status === 200) {
    console.log('요청 성공');

  }
  return response;

}, function (error) {

  if (error.response.status === 401) {

    console.log('Unauthorized, redirect to login');
  }

  if (error.response.status === 404) {

    console.log('없는 페이지 입니다');
  }

  if (error.response.status === 500) {

    console.log('서버에서 에러가 발생했습니다.');
  }
  return Promise.reject(error);
});

export default axiosInstance;


// // 검색 조건에 맞게 모든 데이터 가져오기
// export async function fetchData(query) {
//     try {
//         const response = await axios.get(`http://localhost:3001/posts?${query}`);
//         const totalItems = response.headers['x-total-count']; // 헤더에서 총 아이템 수 가져오기
//         const res = response.data;
//         return { data: res, count: parseInt(totalItems) };

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // id로 데이터 1개 가져오기
// export async function fetchDataById(Id) {
//     try {
//         const response = await axios.get(`http://localhost:3001/posts?id=${Id}`);
//         const res = response.data;
//         return { data: res };

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }