import dotenv from 'dotenv';
import delay from './utils/delay';
import WebPage from './utils/WebPage';

dotenv.config();

async function watch() {
  const upsWebPage = new WebPage(
    'https://www.ups.com/track?loc=en_US&tracknum=1Z2A37W90307710533&src=&requester=/trackdetails',
    true
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await upsWebPage.refresh();
    console.log(upsWebPage.querySelectorAll('track-details-estimation'));

    await delay(20);
  }
}

watch();
