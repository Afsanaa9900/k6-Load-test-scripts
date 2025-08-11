import http from 'k6/http';
import { check,sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    //stages: [
        //{ duration: '30s', target: 500 },    // ramp-up to 500 users in 1 minute
        //{ duration: '1m', target: 1000 },   // ramp-up to 1000 users in next 1 minute
       // { duration: '30s', target: 0 },      // ramp-down to 0 users in last minute
      //]
      vus: 1,
      duration: '1s',
      iterations: 1,
};
function getRandomContactNumber() {
    const validOperators = ['3', '4', '5', '6', '7', '8', '9']; // after 01
    const operator = validOperators[Math.floor(Math.random() * validOperators.length)];
    const numberBody = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    return `+8801${operator}${numberBody}`;
  }
  function getRandomEmail() {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    return `user${randomNum}@test.com`;
  }
// User Login
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
  let token_type = response.json('token_type');
  let access_token = response.json('access_token');
  let authHeader = `${token_type} ${access_token}`;  //Storing token

  if (response.status === 200) {
    console.log('✅ Login successful');
  } else {
    console.error(`Login failed with status ${response.status}: ${response.body}`);
  }
  sleep(1);


//Create Lawyer 

const url_lawyer = 'https://stg-mdn-services.brac.net/api/cmd';

  const payload_lawyer = JSON.stringify({
    Name: 'Load test lawyer',
    ContactNo: getRandomContactNumber(),
    Email: getRandomEmail(),
    Gender: {
      Key: '1',
      Label: 'Man',
      Meta: null
    },
    LocationInfo: {
      Name: 'Comilla',
      Level: 2,
      LevelTitle: 'District',
      Parents: ['a8bed4d0-badc-4084-b40b-9301a4edada3'],
      ParentLocationId: 'a8bed4d0-badc-4084-b40b-9301a4edada3',
      ParentLocationName: 'Chittagong',
      Id: '3e308ef0-4e7a-4a51-b3ab-30d1e1845328',
      LocationId: '3e308ef0-4e7a-4a51-b3ab-30d1e1845328'
    },
    LawyerId: uuidv4(),
    CorrelationId: uuidv4()
  });

  const headers_lawyer = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-command-type': 'Bits.Selp.Application.Commands.CreateLawyerCommand',
    'x-service-id': 'selp',
    'Authorization': authHeader, //using token
  };

  const res = http.post(url_lawyer, payload_lawyer, { headers: headers_lawyer });

  if (res.status === 202) {
    console.log('✅ Lawyer profile created successful');
  } else {
    console.error(`LLawyer profile creation failed ${res.status}: ${res.body}`);
  }
  
}
// HTML Report
export function handleSummary(data) {
    return {
      "Add Incident_report.html": htmlReport(data), 
    }
  }
