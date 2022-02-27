import WebPage from './utils/WebPage';

console.log('This is a test');

async function testFunction() {
  const google = new WebPage('https://google.com');
  await google.init();
  console.log(google.querySelectorAll('div'));
}

testFunction();
