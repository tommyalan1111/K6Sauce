import {sleep} from 'k6';
import {testSauceDemoFlow} from '../apis/sauce-flow.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


// Configure the load test
export const options = {
    stages: [
        { duration: '10s', target: 5 }, // Increase target to 5 users in 10 seconds
        { duration: '20s', target: 10 }, // Increase target to 10 users in 20 seconds
        { duration: '10s', target: 0 }, // Reduce target to 0 users in 10 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be less than 500ms
    },
};

export default function() {
    // Run the Sauce demo flow
    testSauceDemoFlow();

    // Wait for a while
    sleep(1);
}

// Add this function to automatically create  HTML report
export function handleSummary(data) {
    // 1. Get original HTML createdd by library
    let htmlContent = htmlReport(data, {
        title: "Load Test Report - Saucedemo (Login & Inventory)",
    });

    const scenarioBox = `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #6366f1; padding: 20px; margin: 20px auto; max-width: 1200px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
                📋 Test Scenario Overview
            </h3>
            <p style="color: #475569; font-size: 14px; margin-bottom: 10px;">
                The system performs a performance test on the <strong>Login and Inventory Access (Saucedemo)</strong> flow over a total duration of <strong>40 seconds</strong> with progressive load milestones:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.6;">
                <li><strong>Stage 1 (0s - 10s):</strong> Linearly ramp up from 0 to <strong>5 concurrent Virtual Users (VUs)</strong>.</li>
                <li><strong>Stage 2 (10s - 30s):</strong> Continue ramping up and maintaining load from 5 to <strong>10 concurrent Virtual Users (VUs)</strong> for 20 seconds.</li>
                <li><strong>Stage 3 (30s - 40s):</strong> Ramp down gradually from 10 to <strong>0 users</strong> to complete the test.</li>
            </ul>
        </div>
    `;

    if (htmlContent.includes('<body')) {
        // Find the body tag and add the scenario box
        const bodyTagEnd = htmlContent.indexOf('>', htmlContent.indexOf('<body')) + 1;
        htmlContent = htmlContent.slice(0, bodyTagEnd) + scenarioBox + htmlContent.slice(bodyTagEnd);
    }

    return {
        "report.html": htmlContent,
    };
}