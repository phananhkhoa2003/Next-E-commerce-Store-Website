import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,        // Number of virtual users
  duration: '30s', // Test duration
};

export default function () {
  http.get('http://localhost:3000');       // Home page
  sleep(1);
  http.get('http://localhost:3000/search'); // Search page
  sleep(1);
  http.get('http://localhost:3000/product/polo-sporting-stretch-shirt'); // Product page
  sleep(1);
}