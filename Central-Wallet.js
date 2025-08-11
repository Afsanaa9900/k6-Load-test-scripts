import http from 'k6/http';
import { check,sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 1,
  duration: '1s',
};

export default function () {
  // Login by User
    const url_Login = 'https://loginstg.brac.net/realms/brac/protocol/openid-connect/token';
    const payload_Login = 
    'grant_type=password' +
    '&client_id=brac-sms' +
    '&scope=email' +
    '&username=00275342' +
    '&password=1qazZAQ!' +
    '&client_secret=oXJvl9JAYBVO9rQ7X3fwdioPBnse9Bfh';
    const params_Login = {
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'http://delivery.shohoz.com',
            'x-service-id': 'restaurants',
            'Cookie': 'delivery.shohoz.com=eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2NTA1ODQzMjgsImV4cCI6MTY1MDY3MDcyOCwiaXNzIjoiaHR0cDovL3RyYWluLWlhbS5zaG9ob3ouY29tIiwiYXVkIjoic2hvaG96LmlhbS50cmFpbiIsImNsaWVudF9pZCI6InRyYWluLXRpY2tldC11c2VyIiwiY2xpZW50X3RlbmFudF9pZCI6IjY3YTUxNjNjLTU2NWQtNGNhMC1iMTE3LTg3YzcwMWY2NTRmOSIsImNsaWVudF92ZXJ0aWNhbF9pZCI6IjA2OGU4MDRmLTJkYjctNDQ4OS05OTYzLTc4OWZiN2UwMmJkZiIsInN1YiI6Ijg2NzFkMjdmLWE3YTItNDQ0Yi1hODdhLTdiY2MxNThhZGU4MSIsImF1dGhfdGltZSI6MTY1MDU4NDMyOCwiaWRwIjoibG9jYWwiLCJwaG9uZV9udW1iZXIiOiIwMTcxMTA5MTExNyIsImVtYWlsIjoibW91c3VtZS5oYXF1ZUBzaG9ob3ouY29tIiwidXNlcm5hbWUiOiIwMTcxMTA5MTExNyIsImRpc3BsYXlfbmFtZSI6Ik1hcmNpYSBNZWRpbmEiLCJsb2NhbGUiOiJibi1CRCIsInJvbGUiOlsidXNlciIsImFub255bW91cyJdLCJzY29wZSI6WyJzaG9ob3ouaWFtLnRyYWluIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.jXTpkhdhIYvTMFBfYrHmrU3FlhJ_AVYj-0_MpPG3ys7-y7aQiLwpTp0c6DVlVegzHjOYTbBXrIj-oHb-xQi-nPue1T7CxKuYkV9LYW52qdjctJxHHpkcsfoCi8j7nPsdtWuVxfbi21vufZEAQJkruW7bifTSgjgK7yh2L7JUzvnUuqY9y77eNvGbe71345QbsJu1BlG_jdI7L4cnWQytkSvxGquQzohN9o2pC5zLCv1rtqzn_XpyRdd297RRB7TWHTwaSnFbgDW6YmWE2-epnEs8YlvxldZkPTUY8p3W8fC1PIW861C9yoOZv1Hbw7m5pGQ9oMa6i1gTAAhbQKkpQQ',

        }
    };
    const Login = http.post(url_Login , payload_Login , params_Login );
    let token_type = Login.json('token_type');
    let access_token = Login.json('access_token');
    let authHeader = `${token_type} ${access_token}`;  //Storing token
    check(Login, {
        'is status 200': (r) => r.status === 200,
        'Token type is present': (r) => token_type !== undefined,
        'Access Token is present': (r) => access_token !== undefined,
      });
      sleep(1)

    // Create Disbursment
  const url = 'https://mdn-services.bracits.com/api/cmd';

  const disbursementId = uuidv4(); // generation disbursementId

  const payload = JSON.stringify({
    DisbursementId: disbursementId,  // using disbursementId
    GroupId: 'c24ae4e4-1030-408d-b380-876f7d4e0486',
    MobileFinancialServiceId: '9D51F921-AE30-428F-A10D-267A7B0ADDFE',
    ProgramId: null,
    ProjectId: null,
    WalletId: '01736803384',
    DonorId: null,
    ApprovalWorkflowId: 'f0d04de0-aba5-4b20-a483-0b4c00f56067',
    TotalAmount: 300,
    PerPersonAmount: 100,
    Description: '',
    Note: '',
    CorrelationId: uuidv4(),      
  });

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
    'Origin': 'https://dev-wallet.bracits.com',
    'Referer': 'https://dev-wallet.bracits.com/',
    'x-command-type': 'Platform.CentralWallet.Application.Commands.Disbursement.CreateDisbursementCommand',
    'x-service-id': 'wallet',
    'Authorization': authHeader, //using token
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 202': (r) => r.status === 202,
  });
  sleep(1)

   // Confirm Disbursment
  const url_confirm = 'https://mdn-services.bracits.com/api/cmd';

  const payload_confirm = JSON.stringify({
    DisbursementId: disbursementId,   // useing disbursementId
    CorrelationId: uuidv4(),     
  });

  const headers_confirm = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
    'Origin': 'https://dev-wallet.bracits.com',
    'Referer': 'https://dev-wallet.bracits.com/',
    'x-command-type': 'Platform.CentralWallet.Application.Commands.Disbursement.ConfirmDisbursementCommand',
    'x-service-id': 'wallet',
    'Authorization': authHeader, // using token
  };

  const res_confirm = http.post(url_confirm, payload_confirm, { headers: headers_confirm });

  check(res_confirm, {
    'status is 202yes': (r) => r.status === 202,
  });

  // Get call for Approval Requet ID
  sleep(5)

  const url_ApproveID = 'https://mdn-services.bracits.com/api/qry?id=DisbursementQuery&values=[%22%24and%3A%20[{%27DisbursementSource.Value%27%3A%201}]%22,%22-CreatedDate%22,%2210%22,%220%22]&dynamicIndices=[1,1,1]';

  const headers_ApproveID = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Origin': 'https://dev-wallet.bracits.com',
    'Referer': 'https://dev-wallet.bracits.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'x-service-id': 'wallet',
    'Authorization': authHeader, //using token
  };

  const res_ApproveID = http.get(url_ApproveID, { headers: headers_ApproveID });
  console.log('📦 GET Response Body:', res_ApproveID.body); //generation log to ensure the response


  check(res_ApproveID, {
    'status is 200': (r) => r.status === 200,
  });

  const data = res_ApproveID.json();
  let approvalRequestId = null;
  
  if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 0) {
    approvalRequestId = data[0][0].ApprovalRequestId;     // storing approval request id
    console.log(`ApprovalRequestId: ${approvalRequestId}`);  // generating log to ensure
  } else {
    console.error('No ApprovalRequestId found in the response');
  }
  
      sleep(1);

      // Approver loging

      const url_Login_Approver = 'https://loginstg.brac.net/realms/brac/protocol/openid-connect/token';
      const payload_Login_Approver = 
      'grant_type=password' +
      '&client_id=brac-sms' +
      '&scope=email' +
      '&username=900008' +
      '&password=1qazZAQ!' +
      '&client_secret=oXJvl9JAYBVO9rQ7X3fwdioPBnse9Bfh';
      const params_Login_Approver = {
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded',
              'Origin': 'http://delivery.shohoz.com',
              'x-service-id': 'restaurants',
              'Cookie': 'delivery.shohoz.com=eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2NTA1ODQzMjgsImV4cCI6MTY1MDY3MDcyOCwiaXNzIjoiaHR0cDovL3RyYWluLWlhbS5zaG9ob3ouY29tIiwiYXVkIjoic2hvaG96LmlhbS50cmFpbiIsImNsaWVudF9pZCI6InRyYWluLXRpY2tldC11c2VyIiwiY2xpZW50X3RlbmFudF9pZCI6IjY3YTUxNjNjLTU2NWQtNGNhMC1iMTE3LTg3YzcwMWY2NTRmOSIsImNsaWVudF92ZXJ0aWNhbF9pZCI6IjA2OGU4MDRmLTJkYjctNDQ4OS05OTYzLTc4OWZiN2UwMmJkZiIsInN1YiI6Ijg2NzFkMjdmLWE3YTItNDQ0Yi1hODdhLTdiY2MxNThhZGU4MSIsImF1dGhfdGltZSI6MTY1MDU4NDMyOCwiaWRwIjoibG9jYWwiLCJwaG9uZV9udW1iZXIiOiIwMTcxMTA5MTExNyIsImVtYWlsIjoibW91c3VtZS5oYXF1ZUBzaG9ob3ouY29tIiwidXNlcm5hbWUiOiIwMTcxMTA5MTExNyIsImRpc3BsYXlfbmFtZSI6Ik1hcmNpYSBNZWRpbmEiLCJsb2NhbGUiOiJibi1CRCIsInJvbGUiOlsidXNlciIsImFub255bW91cyJdLCJzY29wZSI6WyJzaG9ob3ouaWFtLnRyYWluIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.jXTpkhdhIYvTMFBfYrHmrU3FlhJ_AVYj-0_MpPG3ys7-y7aQiLwpTp0c6DVlVegzHjOYTbBXrIj-oHb-xQi-nPue1T7CxKuYkV9LYW52qdjctJxHHpkcsfoCi8j7nPsdtWuVxfbi21vufZEAQJkruW7bifTSgjgK7yh2L7JUzvnUuqY9y77eNvGbe71345QbsJu1BlG_jdI7L4cnWQytkSvxGquQzohN9o2pC5zLCv1rtqzn_XpyRdd297RRB7TWHTwaSnFbgDW6YmWE2-epnEs8YlvxldZkPTUY8p3W8fC1PIW861C9yoOZv1Hbw7m5pGQ9oMa6i1gTAAhbQKkpQQ',
  
          }
      };
      const Login_Approver = http.post(url_Login_Approver , payload_Login_Approver , params_Login_Approver );
      let token_type_Approver = Login_Approver.json('token_type');
      let access_token_Approver = Login_Approver.json('access_token');
      let authHeader_Approver = `${token_type_Approver} ${access_token_Approver}`; // storing 2ns tokne
      console.log('📦 GET Response Body:', Login_Approver.body);
      check(Login_Approver, {
          'is status 200yes': (r) => r.status === 200,
          'Token type is presentyes': (r) => token_type_Approver !== undefined,
          'Access Token is presentyes': (r) => access_token_Approver !== undefined,
        });
        sleep(1)
// Approving Disbursment
        const url_approve = 'https://mdn-services.bracits.com/api/cmd';

  const payload_approve = JSON.stringify({
    ApprovalFlowId: "f0d04de0-aba5-4b20-a483-0b4c00f56067",
    ApprovalRequestId: approvalRequestId,  // using approval request id
    CorrelationId: uuidv4(),
    Reason: "",
    StepId: "5344b69f-aac2-4dec-a5be-f5545abf4479"
  });

  const  headers_approve= {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Origin': 'https://dev-wallet.bracits.com',
      'Referer': 'https://dev-wallet.bracits.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
      'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'x-command-type': 'Platform.Approval.Service.Application.Commands.ApproveStepCommand',
      'x-service-id': 'wallet',
      'Authorization': authHeader_Approver, //using 2nd token
    }

  const res_approve = http.post(url_approve, payload_approve, { headers: headers_approve });

  check(res_approve, {
    'is status 202yes yes': (r) => r.status === 202,
  });

}

// HTML Report
export function handleSummary(data) {
  return {
    "Central_wallet_report.html": htmlReport(data), 
  }
}

