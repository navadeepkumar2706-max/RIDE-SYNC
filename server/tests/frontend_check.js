import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser from server/tests/frontend_check.js...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const consoleMessages = [];
  const pageErrors = [];
  const requestFailures = [];

  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.log('PAGE CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
    console.log('PAGE ERROR (EXCEPTION):', err.toString());
  });

  page.on('requestfailed', req => {
    requestFailures.push({ url: req.url(), errorText: req.failure()?.errorText });
    console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText);
  });

  const routesToTest = [
    '/',
    '/find-rides',
    '/login',
    '/register'
  ];

  for (const route of routesToTest) {
    console.log(`\n--- Navigating to ${route} ---`);
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Nav error:', e.message));
    await new Promise(r => setTimeout(r, 1000));
  }

  // Now test Login flow with Driver demo button
  console.log('\n--- Testing Demo Login on /login ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  
  // Look for Driver demo button
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} buttons on /login`);
  for (const btn of buttons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text.includes('Driver') || text.includes('Arjun')) {
      console.log('Clicking demo driver button:', text.replace(/\n/g, ' '));
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  console.log('Current URL after login click:', page.url());

  // Test authenticated routes
  const authRoutes = [
    '/dashboard',
    '/offer-ride',
    '/my-rides',
    '/my-bookings',
    '/profile'
  ];

  for (const route of authRoutes) {
    console.log(`\n--- Navigating to authenticated route ${route} ---`);
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Nav error:', e.message));
    await new Promise(r => setTimeout(r, 1000));
  }

  // Check ride details page
  console.log('\n--- Navigating to /find-rides and checking ride details ---');
  await page.goto('http://localhost:5173/find-rides', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  const rideLinks = await page.$$eval('a[href*="/rides/"]', links => links.map(a => a.href));
  console.log('Found ride links count:', rideLinks.length);
  if (rideLinks.length > 0) {
    console.log('Navigating to first ride:', rideLinks[0]);
    await page.goto(rideLinks[0], { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Ride nav error:', e.message));
    await new Promise(r => setTimeout(r, 1500));
  }

  // Now test Admin login
  console.log('\n--- Testing Admin Login ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  const adminButtons = await page.$$('button');
  for (const btn of adminButtons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text.includes('Admin')) {
      console.log('Clicking demo Admin button:', text.replace(/\n/g, ' '));
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));
  console.log('Navigating to /admin ---');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log('Admin nav error:', e.message));
  await new Promise(r => setTimeout(r, 1500));

  await browser.close();

  console.log('\n================ SUMMARY ================');
  console.log('Total console messages:', consoleMessages.length);
  const errorsOnly = consoleMessages.filter(m => m.type === 'error');
  console.log('Console errors count:', errorsOnly.length);
  errorsOnly.forEach((e, i) => console.log(`  [${i+1}] ${e.text}`));

  console.log('Page exceptions count:', pageErrors.length);
  pageErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));

  console.log('Failed network requests:', requestFailures.length);
  requestFailures.forEach((e, i) => console.log(`  [${i+1}] ${e.url} : ${e.errorText}`));
}

run().catch(console.error);
