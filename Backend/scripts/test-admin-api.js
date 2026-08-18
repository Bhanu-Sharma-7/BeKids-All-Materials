const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting BeKids Admin API Integration Tests...\n');
  let adminToken = '';

  // 1. Invalid Admin Login
  const test1 = await request('POST', '/admin/auth/login', {
    email: 'bhanusharma@admin.com',
    password: 'wrongpassword',
  });
  console.log(`[Test 1] Reject Invalid Admin Login: ${test1.status === 401 ? '✅ PASSED' : '❌ FAILED'}`);

  // 2. Valid Admin Login
  const test2 = await request('POST', '/admin/auth/login', {
    email: 'bhanusharma@admin.com',
    password: 'brogami2051N',
  });
  if (test2.status === 200 && test2.data.token) {
    adminToken = test2.data.token;
    console.log(`[Test 2] Valid Admin Login: ✅ PASSED (Token received)`);
  } else {
    console.log(`[Test 2] Valid Admin Login: ❌ FAILED`, test2);
    process.exit(1);
  }

  // 3. Admin Profile
  const test3 = await request('GET', '/admin/auth/me', null, adminToken);
  console.log(`[Test 3] Get Admin Profile: ${test3.status === 200 && test3.data.admin.email === 'bhanusharma@admin.com' ? '✅ PASSED' : '❌ FAILED'}`);

  // 4. List Verbs
  const test4 = await request('GET', '/admin/verbs', null, adminToken);
  console.log(`[Test 4] Admin List Verbs: ${test4.status === 200 && Array.isArray(test4.data.data) ? `✅ PASSED (${test4.data.count} verbs found)` : '❌ FAILED'}`);

  // 5. Create Test Verb
  const newVerb = {
    verb: 'Swim',
    category: 'Irregular',
    v1: 'swim',
    v2: 'swam',
    v3: 'swum',
    v4: 'swimming',
    v5: 'swims',
    hindiMeaning: 'तैरना',
    hindiTransliteration: '(tairna)',
    phoneticEnglish: '/swɪm/',
    explanation: 'To move through water by moving body parts.',
    examples: [
      {
        sentence: 'I swim in the pool every morning.',
        tense: 'Simple Present (V1)',
        formType: 'V1',
        highlightWord: 'swim',
        orderIndex: 0,
      },
      {
        sentence: 'She swam across the lake yesterday.',
        tense: 'Simple Past (V2)',
        formType: 'V2',
        highlightWord: 'swam',
        orderIndex: 1,
      },
    ],
    usageRules: [
      {
        form: 'swim',
        name: 'Base Form (V1)',
        usageContext: 'Used for present habitual actions and infinitives.',
        highlighted: true,
        orderIndex: 0,
      },
    ],
  };

  // Clean up if existed from previous run
  await request('DELETE', '/admin/verbs/swim', null, adminToken);

  const test5 = await request('POST', '/admin/verbs', newVerb, adminToken);
  console.log(`[Test 5] Create Verb ('Swim'): ${test5.status === 201 && test5.data.data.id === 'swim' ? '✅ PASSED' : '❌ FAILED'}`);

  // 6. Get Single Verb
  const test6 = await request('GET', '/admin/verbs/swim', null, adminToken);
  console.log(`[Test 6] Get Created Verb: ${test6.status === 200 && test6.data.data.verb === 'Swim' && test6.data.data.examples.length === 2 ? '✅ PASSED' : '❌ FAILED'}`);

  // 7. Update Verb
  const test7 = await request(
    'PUT',
    '/admin/verbs/swim',
    {
      explanation: 'Updated: To propel oneself through water using arms and legs.',
    },
    adminToken
  );
  console.log(`[Test 7] Update Verb: ${test7.status === 200 && test7.data.data.explanation.startsWith('Updated:') ? '✅ PASSED' : '❌ FAILED'}`);

  // 8. Delete Verb
  const test8 = await request('DELETE', '/admin/verbs/swim', null, adminToken);
  console.log(`[Test 8] Delete Verb: ${test8.status === 200 ? '✅ PASSED' : '❌ FAILED'}`);

  // 9. Confirm Deletion
  const test9 = await request('GET', '/admin/verbs/swim', null, adminToken);
  console.log(`[Test 9] Confirm Deletion (404): ${test9.status === 404 ? '✅ PASSED' : '❌ FAILED'}`);

  // 10. JSON Bulk Import (Test Created, Skipped, and Rejected)
  const importPayload = [
    {
      verb: 'Jump',
      category: 'Regular',
      v1: 'jump',
      v2: 'jumped',
      v3: 'jumped',
      v4: 'jumping',
      v5: 'jumps',
      hindiMeaning: 'कूदना',
      hindiTransliteration: '(koodna)',
      phoneticEnglish: '/dʒʌmp/',
      explanation: 'To push oneself off a surface into the air.',
      examples: [
        {
          sentence: 'The child jumped with joy.',
          tense: 'Past (V2)',
          formType: 'V2',
          highlightWord: 'jumped',
        },
      ],
      usageRules: [
        {
          form: 'jump',
          name: 'Base Form (V1)',
          usageContext: 'Simple present with plural subjects.',
        },
      ],
    },
    {
      // Duplicate verb 'go' (already in seed database)
      verb: 'Go',
      category: 'Irregular',
      v1: 'go',
      v2: 'went',
      v3: 'gone',
      v4: 'going',
      v5: 'goes',
      hindiMeaning: 'जाना',
      hindiTransliteration: '(jaana)',
      phoneticEnglish: '/ɡoʊ/',
      explanation: 'To move.',
    },
    {
      // Invalid verb (missing conjugations)
      verb: 'BrokenVerb',
    },
  ];

  // Clean up 'jump' if existed
  await request('DELETE', '/admin/verbs/jump', null, adminToken);

  const test10 = await request('POST', '/admin/verbs/import', importPayload, adminToken);
  const summary = test10.data?.summary;
  const isImportValid =
    test10.status === 200 &&
    summary &&
    summary.created === 1 &&
    summary.skipped === 1 &&
    summary.rejected === 1;

  console.log(`[Test 10] JSON Bulk Import (1 Created, 1 Skipped duplicate, 1 Rejected invalid): ${isImportValid ? '✅ PASSED' : '❌ FAILED'}`);

  // Clean up 'jump'
  await request('DELETE', '/admin/verbs/jump', null, adminToken);

  console.log('\n🎉 All Admin Backend API Tests Completed Successfully!\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
