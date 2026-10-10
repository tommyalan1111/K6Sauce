import http from 'k6/http';
import { check } from 'k6';

export function testSauceDemoFlow() {
    // 1. Call login page to get cookies
    // Note: Saucedmo uses client-side rouuting, we could test main pages directly
    let loginHome = http.get('https://www.saucedemo.com/');
    check(loginHome, {
        'status is 200': (r) => r.status === 200,
    });

    // 2. Call log in POST request
    const loginPayload = {
        user: 'standard_user',
        password: 'secret_sauce'
    };
    
    let loginRes = http.post('https://www.saucedemo.com/', loginPayload, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        redirect: 0 // Disable automatic redirect,
    });
    
    check(loginRes, {
        'status is 200': (r) => r.status === 200,
    });

    // 3. After get session id, access inventory page
    let inventoryRes = http.get('https://www.saucedemo.com/inventory.html', {
        jar: http.cookieJar(), // Automatically add cookies from previous step
    });
    check(inventoryRes, {
        'status is 200': (r) => r.status === 200,
        'time is less than 1s': (r) => r.timings.duration < 1000,
    });
  

}