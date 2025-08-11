import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '30s', target: 500 },   // ramp up to 500 users
        { duration: '1m', target: 1000 },  // ramp up to 1000 users
        { duration: '1m', target: 1500 },  // ramp up to 1500 users
        { duration: '1m', target: 2000 },  // ramp up to 2000 users
        { duration: '30s', target: 0 },     // ramp down to 0 users
      ],
      vus: 1,
      duration: '1s',
      iterations: 1,
};

export default function () {
  const url = 'https://loginstg.brac.net/realms/brac/protocol/openid-connect/token';

  const payload = 
    'grant_type=password' +
    '&client_id=selp-bracit' +
    '&client_secret=oXJvl9JAYBVO9rQ7X3fwdioPBnse9Bfh' +
    '&scope=email' +
    '&username=900004' +
    '&password=1qazZAQ!';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-service-id': 'selp',
  };

  const response = http.post(url, payload, { headers });

  if (response.status === 200) {
    console.log('✅ Login successful');
  } else {
    console.error(`Login failed with status ${response.status}: ${response.body}`);
  }
  sleep(1);
}

// HTML Report
export function handleSummary(data) {
  return {
    "Selp_Login_report.html": htmlReport(data), 
  }
}
