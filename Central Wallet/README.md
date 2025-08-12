# Central Wallet Disbursement & Approval Flow – k6 Load Test

## 📌 Overview
This k6 script automates the **end-to-end disbursement process** in the Central Wallet platform, including:
1. **User Login** – Get an access token to perform transactions.
2. **Disbursement Creation** – Create a new disbursement request.
3. **Disbursement Confirmation** – Confirm the created disbursement.
4. **Approval Request Retrieval** – Fetch the approval request ID.
5. **Approver Login** – Authenticate as an approver.
6. **Approval Execution** – Approve the pending disbursement.
7. **HTML Reporting** – Generate a detailed execution report.
