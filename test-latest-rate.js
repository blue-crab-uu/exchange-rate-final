// Test script to check the latest-rate-date API endpoint
const fetch = require('node-fetch');

async function testLatestRateDate() {
    try {
        const response = await fetch('http://localhost:3000/latest-rate-date');
        const data = await response.json();
        console.log('API Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testLatestRateDate();