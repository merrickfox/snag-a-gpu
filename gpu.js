import puppeteer from 'puppeteer-extra'
import alerter from "./alerter.js";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

export default async (url, selectors) => {
  puppeteer.use(StealthPlugin())
  // puppeteer.use(AdblockerPlugin({
  //   blockTrackers: true,
  // }))

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 2000, height: 1000});

  const response = await page.goto(url)
  try {
    await page.waitForSelector("body > div.container > div.main > div.categoryPage.productFilterHidden > div > div.masterCategory > div.masterCategoryTitle.expanded > div.masterCategoryHeading", { timeout: 15000 });

  } catch(e) {
    await page.screenshot({ path: 'listing_error.png' });
    console.log("Could not load listing page ", e)
  }

  try {
    const buyButton = await page.evaluate(() => Array.from(document.getElementsByClassName('buyButton'), element => element.textContent));
    const preOrderButton = await page.evaluate(() => Array.from(document.getElementsByClassName('preOrder'), element => element.textContent));

    if (buyButton.length > 0 || preOrderButton.length > 0) {
      await alerter(`POSSIBLE 3080ti STOCK! buy buttons: ${buyButton.length}, preorder buttons: ${preOrderButton.length}\n${url}`)
    }
  } catch(e) {
    //await page.screenshot({ path: 'buttons_error.png' });
    console.log("Could not get buttons ", e)
  }


  await page.waitForTimeout(3000)
  await page.close()
  await browser.close();
  //await page.screenshot({ path: 'screenshot.png' });
}
