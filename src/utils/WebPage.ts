import cheerio, { CheerioAPI } from 'cheerio';
import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';

export default class WebPage {
  private cheerioSelector?: CheerioAPI;

  constructor(private siteUrl: string) {}

  /**
   * Refreshes the data on the site by retrieving it's latest HTML.
   */
  async refresh() {
    const response = await fetch(this.siteUrl);
    const siteHtml = await response.text();
    await writeFile('./webPage.html', siteHtml, {
      flag: 'w+',
    });
    this.cheerioSelector = cheerio.load(siteHtml);
  }

  querySelectorAll(selector: Parameters<CheerioAPI>[0]) {
    if (this.cheerioSelector) {
      return this.cheerioSelector(selector).toArray();
    }
    throw new Error(
      'WebPage was not initialized. Please use ".refresh()" before ' +
        'calling functions on this class.'
    );
  }
}
