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

const url_girl = 'https://stg-mdn-services.brac.net/api/cmd';
const RandomName = `User_${uuidv4().slice(0, 8)}`;

const payload_girl = JSON.stringify({
    CorrelationId: uuidv4(),
    GirlProfileId: uuidv4(),
    Name: RandomName,
    BirthDate: '2011-06-13T18:00:00.000Z',
    ContactNumber: '01747038949',
    NidOrBirthRegistration: '12345678',
    StudentShip: 1,
    Class: 2,
    InstitutionType: 1,
    HasDisability: true,
    DisabilityType: 1,
    DisabilityCardNumber: '123',
    Location: {
      Division: {
        LocationId: '17dd1f2e-9f3d-46dd-aa66-e3cdf9676e79',
        Name: 'Barisal',
        Level: 1,
        LevelTitle: 'Division',
        ParentLocationId: null,
      },
      District: {
        LocationId: 'de86dce4-8a0d-44ef-a580-7956a75b2ea2',
        Name: 'Barguna',
        Level: 2,
        LevelTitle: 'District',
        ParentLocationId: '17dd1f2e-9f3d-46dd-aa66-e3cdf9676e79',
      },
      Upazilla: {
        LocationId: '1b1584cc-09aa-44f0-a6d2-69eb3334e119',
        Name: 'Amtali',
        Level: 3,
        LevelTitle: 'Upazila',
        ParentLocationId: 'de86dce4-8a0d-44ef-a580-7956a75b2ea2',
      },
      Union: {
        LocationId: '18d58c45-1f67-4e77-bf72-292d097e2056',
        Name: 'Amtali',
        Level: 4,
        LevelTitle: 'Union',
        ParentLocationId: '1b1584cc-09aa-44f0-a6d2-69eb3334e119',
      },
      WardAddress: '12',
      VillageAddress: 'Village',
      PostOffice: '1212',
    },
    LandMark: 'Rajshahi',
    GuardianInfo: {
      FatherName: 'Rahim Mia',
      FatherContactNumber: '01567898765',
      FatherOccupation: 'Farmar',
      MotherName: 'Rahima Khatun',
      MotherContactNumber: '01789876542',
      MotherOccupation: 'Housewife',
      GuardianName: 'Student',
      GuardianContactNumber: '01787638734',
      GuardianOccupation: 'NA',
      NoOfHouseHoldMembers: 3,
      FatherIncome: 1200,
      MotherIncome: 3000,
      GuardianIncome: 1200,
      totalFamilyIncome: 5400,
    },
    IsFinancialSupportRecipient: true,
    FinancialSupportClass: 2,
  });

  const headers_girl = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-command-type': 'Bits.Selp.Application.Commands.SopnoSarothi.CreateGirlProfileCommand',
    'x-service-id': 'selp',
    'Authorization': authHeader, //using token
  };

  const res = http.post(url_girl, payload_girl, { headers: headers_girl });

  if (res.status === 202) {
    console.log('✅ Girl profile created successful');
  } else {
    console.error(`Girl profile creation failed ${res.status}: ${res.body}`);
  }
  
}
// HTML Report
export function handleSummary(data) {
    return {
      "Add Girl_report.html": htmlReport(data), 
    }
  }
