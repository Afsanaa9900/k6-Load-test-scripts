import http from 'k6/http';
import { check,sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '1m', target: 500 },    // ramp-up to 500 users in 1 minute
        { duration: '1m', target: 1000 },   // ramp-up to 1000 users in next 1 minute
        { duration: '1m', target: 1500 },   // ramp-up to 1500 users in next 1 minute
        { duration: '1m', target: 0 },      // ramp-down to 0 users in last minute
      ],
      vus: 1,
      duration: '1s',
      iterations: 1,
};

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


//add incident 


  const url_incident = 'https://stg-mdn-services.brac.net/api/cmd';

  const payload_incident = JSON.stringify({
    CorrelationId: uuidv4(),
    IncidentId: uuidv4(),
    IncidentInfo: {
      IncidentType: 'Maintenance',
      Date: '2012-07-04T18:00:00.000Z',
      RelationOfAccused: 'Wife',
      IsEmergencySupport: true,
      EmergencySupportType: 'Emergency cash support',
      EmergencyRemarks: null,
      ReportingDate: '2025-07-31T18:00:00.000Z'
    },
    SurvivorInfo: {
      Name: 'Load test',
      DateOfBirth: '2012-07-11T18:00:00.000Z',
      Religion: 'Islam',
      Age: 1,
      ContactNumber: '01678987654',
      Gender: 'Man',
      HasDisability: false,
      MaritalStatus: 'Married'
    },
    InformerInfo: {
      Type: 'Brac Staff',
      SubType: 'SDP',
      Name: 'Miftah',
      Gender: 'Man',
      ContactNumber: '01789876545'
    },
    LocationInfo: {
      Division: {
        LocationId: 'b47594cc-5809-40cb-a032-514ab9e6e31f',
        Name: 'Sylhet',
        Level: 1,
        LevelTitle: 'Division',
        ParentLocationId: null
      },
      District: {
        LocationId: '3ee6eab2-ee3e-4ab3-a337-32fd7caa46c6',
        Name: 'Habiganj',
        Level: 2,
        LevelTitle: 'District',
        ParentLocationId: 'b47594cc-5809-40cb-a032-514ab9e6e31f'
      },
      Upazilla: {
        LocationId: '196f0448-1748-4364-bb56-bf0895d22d82',
        Name: 'Habiganj Sadar',
        Level: 3,
        LevelTitle: 'Upazila',
        ParentLocationId: '3ee6eab2-ee3e-4ab3-a337-32fd7caa46c6'
      },
      Union: {
        LocationId: '50855a91-edd7-45ce-b112-242cd53a0c44',
        Name: 'Laskarpur',
        Level: 4,
        LevelTitle: 'Union',
        ParentLocationId: '196f0448-1748-4364-bb56-bf0895d22d82'
      },
      WardAddress: null,
      VillageAddress: null,
      PostOffice: null
    }
  });

  const headers_incident = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-command-type': 'Bits.Selp.Application.Commands.CreateIncidentRequestCommand',
    'x-service-id': 'selp',
    'Authorization': authHeader, // using token
  };

  const res = http.post(url_incident, payload_incident, { headers: headers_incident });

  if (res.status === 202) {
    console.log('✅ Incident created successfully');
  } else {
    console.error(`Incident creation failed ${res.status}: ${res.body}`);
  }
}
// HTML Report
export function handleSummary(data) {
    return {
      "Add Incident_report.html": htmlReport(data), 
    }
  }
