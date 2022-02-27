import cheerio, { CheerioAPI } from 'cheerio';
import fetch from 'node-fetch';

export default class WebPage {
  private cheerioSelector?: CheerioAPI;

  constructor(private siteUrl: string) {}

  async init() {
    const response = await fetch(this.siteUrl);
    const siteHtml = await response.text();
    this.cheerioSelector = cheerio.load(siteHtml);
  }

  querySelectorAll(selector: Parameters<CheerioAPI>[0]) {
    if (this.cheerioSelector) {
      return this.cheerioSelector(selector).toArray();
    }
    throw new Error(
      'WebPage was not initialized. Please use ".init()" before ' +
        'calling functions on this class.'
    );
  }
}
