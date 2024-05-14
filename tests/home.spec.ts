import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:3000');

  await expect(page).toHaveTitle("CometChat React Sample App");
});

test('Check if cometchat text exist', async ({ page }) => {
  await page.goto('localhost:3000'); 

  // Check if the div with the specified style exists
  const divExists = await page.waitForSelector('div[style="font: 500 16px sans-serif, Inter;"]');

  // Check if the span with text 'comet' exists within the div
  const cometSpanExists = await divExists.$('span:has-text("comet")');

  // Check if the span with text 'chat' and bold style exists within the div
  const chatSpanExists = await divExists.$('span:has-text("chat"):above(span[style="font-weight: bold;"])');

  await expect(divExists).not.toBe(null);
  await expect(cometSpanExists).not.toBe(null);
});


test('Check if login text exists', async ({ page }) => {
  await page.goto('localhost:3000');

  // Check if the div with the specified style exists
  const divExists = await page.waitForSelector('div[style="font: 700 22px sans-serif, Inter; color: rgb(20, 20, 20);"]');

  await expect(divExists).not.toBe(null);
});

test('Check sample users text exist', async ({ page }) => {
  await page.goto('localhost:3000');

    // Check if the div with the specified style exists
    const divExists = await page.waitForSelector('div[style="font: 400 13px sans-serif, Inter; color: rgba(20, 20, 20, 0.58);"]');

    await expect(divExists).not.toBe(null);
});

test('Check if input element exists with specified placeholder', async ({ page }) => {
  await page.goto('localhost:3000');

  // Check if the input element with the specified placeholder exists
  const inputExists = await page.waitForSelector('input[placeholder="Enter UID here"]');

  await expect(inputExists).not.toBe(null);
});

test('Check if button element exists', async ({ page }) => {
  await page.goto('localhost:3000'); // Replace 'http://example.com' with your actual URL

  // Check if the button element with the specified style exists
  const buttonExists = await page.waitForSelector('button[style="flex-basis: 48%; padding: 8px; background-color: rgba(20, 20, 20, 0.08); border-radius: 8px; display: flex; align-items: center; column-gap: 8px; cursor: pointer; border: 1px solid rgba(20, 20, 20, 0.08);"]');

  await expect(buttonExists).not.toBe(null);
});

test('Check if image element exists', async ({ page }) => {
  await page.goto('localhost:3000');

  // Check all images
  const IrongManImageExist = await page.waitForSelector('img[src="/static/media/ironman_avatar.d4c8ef2420eddff98dc1.png"]');
  const CaptainAmericaImageExist = await page.waitForSelector('img[src="/static/media/captainamerica_avatar.4afcc47b8ab363bffde6.png"]');
  const SpiderManImageExist = await page.waitForSelector('img[src="/static/media/spiderman_avatar.dc2abed336ac03f64dbf.png"]');

  await expect(IrongManImageExist).not.toBe(null);
  await expect(CaptainAmericaImageExist).not.toBe(null);
  await expect(SpiderManImageExist).not.toBe(null);
});


test('Check if span element exists by text content', async ({ page }) => {
  await page.goto('localhost:3000');

  // Check if the span element with the specified text content exists
  const spanExistsIronMan = await page.waitForSelector('span:has-text("Iron Man")');
  const spanExistsCaptainAmerice = await page.waitForSelector('span:has-text("Captain America")');
  const spanExistsSpider = await page.waitForSelector('span:has-text("Spiderman")');
  const spanExistsCyclops = await page.waitForSelector('span:has-text("Cyclops")');

  await expect(spanExistsIronMan).not.toBe(null);
  await expect(spanExistsCaptainAmerice).not.toBe(null);
  await expect(spanExistsSpider).not.toBe(null);
  await expect(spanExistsCyclops).not.toBe(null);
});

test('Check if login button element exists', async ({ page }) => {
  await page.goto('localhost:3000');

  // Check if the button element exist
  const buttonExists = await page.waitForSelector('button:has-text("Login")');

  await expect(buttonExists).not.toBe(null);
});