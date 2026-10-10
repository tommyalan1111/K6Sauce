import {testSauceDemoBrowserFlow} from '../apis/sauce-flow.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export  const options = {
    // Configuration options for the load test
    scenarios: {
        ui_flow: {
            executor: 'constant-vus',
            vus: 5,
            duration: '30s',
            options: {
                browser: {
                    type: 'chromium',
                }
            }
        }
    },
    thresholds: {
        // Mandatory thresholds
        'checks': ['rate == 1.00'], // Required 100% pass rate
    },
};

export default async function () {
    await testSauceDemoBrowserFlow();
}


// Add this function to automatically create  HTML report
export function handleSummary(data) {
    let htmlContent = htmlReport(data, {
        title: "Load Test Report - Saucedemo (Browser UI Flow)",
    });

    const scenarioBox = `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #6366f1; padding: 20px; margin: 20px auto; max-width: 1200px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
                📋 Test Scenario Overview (Browser UI Automation)
            </h3>
            <p style="color: #475569; font-size: 14px; margin-bottom: 10px;">
                The system performs a UI performance test on the <strong>Login and Inventory Access (Saucedemo)</strong> flow using a real Chromium browser engine.
            </p>
        </div>
    `;

    if (htmlContent.includes('<body')) {
        const bodyTagEnd = htmlContent.indexOf('>', htmlContent.indexOf('<body')) + 1;
        htmlContent = htmlContent.slice(0, bodyTagEnd) + scenarioBox + htmlContent.slice(bodyTagEnd);
    }

    return {
        "report.html": htmlContent,
    };
}