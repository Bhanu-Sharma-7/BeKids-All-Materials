const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('🚀 Starting Comprehensive BeKids Backend API Verification...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // 1. Health Check
  const health = await request('/health');
  assert(health.status === 200 && health.data.status === 'ok', 'Health check endpoint returns 200 OK');

  // 2. Verbs List
  const verbsRes = await request('/verbs');
  assert(verbsRes.status === 200 && verbsRes.data.data.length >= 10, 'GET /api/verbs returns list with >= 10 verbs');

  // 3. Verb Search
  const searchRes = await request('/verbs?search=went');
  assert(searchRes.status === 200 && searchRes.data.data.some(v => v.id === 'go'), 'GET /api/verbs?search=went matches verb "go"');

  // 4. Single Verb Details
  const verbDetails = await request('/verbs/go');
  assert(
    verbDetails.status === 200 &&
    verbDetails.data.data.examples.length === 5 &&
    verbDetails.data.data.usageRules.length === 5,
    'GET /api/verbs/go returns full verb details with 5 examples and 5 usage rules'
  );

  // 5. Seeded User Login
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: { username: 'AlexStudent', password: 'password123' },
  });
  assert(loginRes.status === 200 && loginRes.data.devOtp, 'POST /api/auth/login returns dev OTP');

  // 6. Verify OTP for Seeded User
  const verifyRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { target: 'AlexStudent', code: loginRes.data.devOtp, flow: 'login' },
  });
  assert(verifyRes.status === 200 && verifyRes.data.token, 'POST /api/auth/verify-otp returns valid JWT session token');
  const token = verifyRes.data.token;

  // 7. GET /api/auth/me
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(meRes.status === 200 && meRes.data.user.username === 'AlexStudent', 'GET /api/auth/me returns authenticated user');

  // 8. User Registration
  const testUsername = `user_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: { username: testUsername, email: testEmail, password: 'password123', fullName: 'Test User' },
  });
  assert(regRes.status === 201 && regRes.data.devOtp, 'POST /api/auth/register creates user and generates dev OTP');

  // 9. Duplicate Registration Rejection
  const dupRes = await request('/auth/register', {
    method: 'POST',
    body: { username: testUsername, email: 'different@example.com', password: 'password123' },
  });
  assert(dupRes.status === 400, 'POST /api/auth/register rejects duplicate username');

  // 10. Complete Registration OTP
  const regVerifyRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { target: testEmail, code: regRes.data.devOtp, flow: 'register' },
  });
  assert(regVerifyRes.status === 200 && regVerifyRes.data.token, 'POST /api/auth/verify-otp completes registration session');
  const testUserToken = regVerifyRes.data.token;

  // 11. Profile Update
  const updateRes = await request('/users/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${testUserToken}` },
    body: { fullName: 'Updated Full Name', password: 'newpassword123' },
  });
  assert(updateRes.status === 200 && updateRes.data.user.fullName === 'Updated Full Name', 'PATCH /api/users/me updates profile & password');

  // 12. Login with New Password
  const newLoginRes = await request('/auth/login', {
    method: 'POST',
    body: { username: testUsername, password: 'newpassword123' },
  });
  assert(newLoginRes.status === 200, 'POST /api/auth/login succeeds with updated password');

  // 13. Account Deactivation
  const deactRes = await request('/users/me/deactivate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${testUserToken}` },
  });
  assert(deactRes.status === 200 && deactRes.data.success, 'POST /api/users/me/deactivate deactivates account');

  // 14. Deactivated Account Login Attempt
  const blockedLogin = await request('/auth/login', {
    method: 'POST',
    body: { username: testUsername, password: 'newpassword123' },
  });
  assert(blockedLogin.status === 403, 'Deactivated account cannot log in (returns 403 Forbidden)');

  // 15. Unauthorized Request
  const unauthRes = await request('/auth/me');
  assert(unauthRes.status === 401, 'Protected endpoint returns 401 Unauthorized without token');

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
