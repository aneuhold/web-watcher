import fetch from 'node-fetch';

console.log('This is a test');

async function testFunction() {
  const googleSite = await fetch('https://www.google.com');
  console.log(googleSite.body);
}

testFunction();
