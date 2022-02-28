import cheerio, { CheerioAPI } from 'cheerio';
import { access, appendFile, mkdir, writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import puppeteer, { Browser, Page, WaitForOptions } from 'puppeteer';
import delay from './delay';

async function prepDebugFolder() {
  try {
    await access('debug');
  } catch (err) {
    await mkdir('debug');
  }
}

/**
 * Represents a web page on the internet that can be scraped for data.
 */
export default class WebPage {
  private cheerioSelector?: CheerioAPI;

  private puppeteerBrowser?: Browser;

  private puppeteerPage?: Page;

  constructor(
    private siteUrl: string,
    private needsJsToRender: boolean = false
  ) {}

  /**
   * Refreshes the data on the site by retrieving it's latest HTML.
   */
  async refresh() {
    let siteHtml = '';
    if (this.needsJsToRender) {
      siteHtml = await this.getJsRequiredHtml();
    } else {
      const response = await fetch(this.siteUrl);
      siteHtml = await response.text();
    }
    this.cheerioSelector = cheerio.load(siteHtml);
    await writeFile('debug/page.html', siteHtml);
  }

  /**
   * Works the same as a normal `querySelectorAll` on the web page.
   */
  querySelectorAll(selector: Parameters<CheerioAPI>[0]) {
    if (this.cheerioSelector) {
      return this.cheerioSelector(selector).toArray();
    }
    throw new Error(
      'WebPage was not initialized. Please use ".refresh()" before ' +
        'calling functions on this class.'
    );
  }

  /**
   * Gets the HTML content of a page that requires JavaScript to be loaded first
   * before the content will render.
   *
   * Whenever it gets a page, a screenshot is also put in a local debug folder
   * for debugging purposes.
   */
  private async getJsRequiredHtml() {
    await prepDebugFolder();
    const loadOptions: WaitForOptions = {
      waitUntil: 'networkidle0',
    };
    if (!this.puppeteerBrowser) {
      this.puppeteerBrowser = await puppeteer.launch();
    }
    if (!this.puppeteerPage) {
      this.puppeteerPage = await this.puppeteerBrowser.newPage();
      this.puppeteerPage.on('console', async (message) => {
        await appendFile('debug/console.txt', `${message.text()}\n`);
      });
      this.puppeteerPage.on('requestfailed', (request) => {
        console.log(
          `url: ${request.url()}, errText: ${
            request.failure()?.errorText
          }, method: ${request.method()}`
        );
      });
      await this.puppeteerPage.goto(this.siteUrl, loadOptions);
    } else {
      await this.puppeteerPage.reload(loadOptions);
    }
    delay(2);
    await this.puppeteerPage.screenshot({ path: 'debug/screenshot.png' });
    return this.puppeteerPage.content();
  }
}
