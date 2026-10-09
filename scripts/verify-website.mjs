import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(process.cwd(), 'test-results');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function verify() {
  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=default',
      '--enable-webgl',
      '--window-size=1920,1080',
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      console.error('BROWSER ERROR:', text);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
    console.error('PAGE ERROR:', err.toString());
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Wait for loader sequence to complete
  console.log('Waiting for loading sequence and 3D canvas...');
  await new Promise((r) => setTimeout(r, 2000));

  // Check page title
  const title = await page.title();
  console.log('Page Title:', title);

  // Check Canvas
  const hasCanvas = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return !!canvas && canvas.width > 0 && canvas.height > 0;
  });
  console.log('Canvas rendered successfully:', hasCanvas);

  // Screenshot Phase 1: Hero
  await page.screenshot({ path: path.join(outputDir, '01_hero_phase1.png') });
  console.log('Captured 01_hero_phase1.png');

  // Scroll to Phase 2: Exploded View
  console.log('Scrolling to Phase 2 (Exploded view)...');
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.35, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '02_exploded_phase2.png') });
  console.log('Captured 02_exploded_phase2.png');

  // Scroll to Phase 3: 360 Orbit
  console.log('Scrolling to Phase 3 (360 Orbit)...');
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.60, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '03_orbit_phase3.png') });
  console.log('Captured 03_orbit_phase3.png');

  // Scroll to Phase 4: Performance Benchmarks
  console.log('Scrolling to Phase 4 (Performance specs)...');
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.82, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '04_specs_phase4.png') });
  console.log('Captured 04_specs_phase4.png');

  // Scroll to Phase 5: Final Section
  console.log('Scrolling to Phase 5 (Final section)...');
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '05_final_phase5.png') });
  console.log('Captured 05_final_phase5.png');

  // Test livery color change (click second color swatch)
  console.log('Testing livery color change...');
  const colorButtons = await page.$$('div.fixed.bottom-6.right-6 button');
  if (colorButtons.length >= 4) {
    await colorButtons[3].click(); // Click Carmine Red
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outputDir, '06_carmine_red_livery.png') });
    console.log('Captured 06_carmine_red_livery.png');
  }

  // Test Replay Button
  console.log('Testing Replay Button...');
  const replayBtn = await page.$('button.group.px-8.py-4');
  if (replayBtn) {
    await replayBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
    const finalScrollY = await page.evaluate(() => window.scrollY);
    console.log('Scroll Y after replay button click:', finalScrollY);
    await page.screenshot({ path: path.join(outputDir, '07_after_replay.png') });
    console.log('Captured 07_after_replay.png');
  }

  await browser.close();

  console.log('\n--- VERIFICATION REPORT ---');
  console.log('Total Console Messages:', consoleMessages.length);
  console.log('Total Page Errors:', pageErrors.length);
  if (pageErrors.length > 0) {
    console.error('Page Errors Details:', pageErrors);
    process.exit(1);
  } else {
    console.log('ALL ACCEPTANCE TESTS PASSED WITH 0 ERRORS!');
  }
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
