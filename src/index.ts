import dotenv from 'dotenv';
import fetch from 'node-fetch';
import delay from './utils/delay';

dotenv.config();

async function watch() {
  const upsApiUrl = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_US';
  const upsFetchPayload = {
    Locale: 'en_US',
    TrackingNumber: ['1z2a37w90307710533'],
    Requester: '/trackdetails',
    returnToValue: '',
  };

  console.log();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await fetch(upsApiUrl, {
      method: 'POST',
      body: JSON.stringify(upsFetchPayload),
    });
    console.log(response);

    await delay(20);
  }
}

watch();
