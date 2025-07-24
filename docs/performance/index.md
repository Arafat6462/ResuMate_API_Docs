<!--
---
title: Performance Load Test Results
description: Detailed performance and stability analysis of the ResuMate API under simulated production load. This report presents factual data from a Locust load test, showcasing system reliability and response time metrics.
---
-->

# 📊 Performance Load Test Results

<div class="performance-hero">
  <div class="hero-content">
    <h2>API Load Test Analysis</h2>
    <p>Factual performance metrics from a real-world load test simulating 25 concurrent users on a production environment.</p>
  </div>
  <div class="performance-stats">
    <div class="stat-card success">
      <div class="stat-number">100%</div>
      <div class="stat-label">Success Rate</div>
    </div>
    <div class="stat-card primary">
      <div class="stat-number">25</div>
      <div class="stat-label">Peak Users</div>
    </div>
    <div class="stat-card warning">
      <div class="stat-number">85ms</div>
      <div class="stat-label">Median Response</div>
    </div>
    <div class="stat-card info">
      <div class="stat-number">7.2</div>
      <div class="stat-label">Peak RPS</div>
    </div>
  </div>
</div>

---

## 🎯 Test Environment & Configuration

The load test was executed using Locust against a live production deployment to gather accurate performance data under real-world conditions.

<div class="premium-table devops-table">
  <table>
    <thead>
      <tr>
        <th>Configuration Parameter</th>
        <th>Value</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>🖥️ Host Environment</strong></td>
        <td><code>https://arafat2.me</code></td>
        <td>Production deployment endpoint</td>
      </tr>
      <tr>
        <td><strong>☁️ Cloud Platform</strong></td>
        <td>DigitalOcean Droplet ($6/mo)</td>
        <td>Basic tier virtual private server</td>
      </tr>
      <tr>
        <td><strong>💻 System Resources</strong></td>
        <td>1 vCPU, 1GB RAM</td>
        <td>Minimal hardware configuration</td>
      </tr>
      <tr>
        <td><strong>⏱️ Test Duration</strong></td>
        <td>3 minutes 53 seconds</td>
        <td>Total load testing execution time</td>
      </tr>
      <tr>
        <td><strong>📅 Test Date</strong></td>
        <td>July 24, 2025</td>
        <td>Performance analysis timestamp</td>
      </tr>
      <tr>
        <td><strong>🐛 Testing Tool</strong></td>
        <td>Locust Load Testing Framework</td>
        <td>Python-based load testing platform</td>
      </tr>
    </tbody>
  </table>
</div>

---

## 📈 Overall Performance Metrics

The API demonstrated exceptional stability and performance, processing **1,314 requests** with **zero failures**. The median response time was a swift **85ms**, showcasing the system's efficiency under significant load.

<div class="metrics-grid">
  <div class="metric-card">
    <h4>✅ Success & Throughput</h4>
    <div class="metric-breakdown">
      <div class="metric-row">
        <span>Total Requests:</span>
        <span class="value-info">1,314</span>
      </div>
      <div class="metric-row">
        <span>Failures:</span>
        <span class="value-good">0 (100% Success)</span>
      </div>
      <div class="metric-row">
        <span>Peak RPS:</span>
        <span class="value-good">7.2 req/s</span>
      </div>
    </div>
  </div>
  <div class="metric-card">
    <h4>⏱️ Response Time (ms)</h4>
    <div class="metric-breakdown">
      <div class="metric-row">
        <span>Average:</span>
        <span class="value-ok">800 ms</span>
      </div>
      <div class="metric-row">
        <span>Median (p50):</span>
        <span class="value-good">85 ms</span>
      </div>
      <div class="metric-row">
        <span>95th Percentile:</span>
        <span class="value-warning">7,100 ms</span>
      </div>
    </div>
  </div>
</div>

---

## 🔬 Endpoint-Specific Analysis

This section provides a detailed performance breakdown for each tested endpoint, categorized by functionality.

### 🔐 Authentication Endpoints

<div class="premium-table">
  <table>
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Requests</th>
        <th>Avg. Time</th>
        <th>Median</th>
        <th>95th %</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong><code>/api/auth/register/</code></strong></td>
        <td><code>POST</code></td>
        <td>74</td>
        <td><span class="value-warning">2,500ms</span></td>
        <td><span class="value-warning">1,300ms</span></td>
        <td><span class="value-error">8,700ms</span></td>
      </tr>
      <tr>
        <td><strong><code>/api/auth/token/</code></strong></td>
        <td><code>POST</code></td>
        <td>17</td>
        <td><span class="value-error">7,400ms</span></td>
        <td><span class="value-error">7,600ms</span></td>
        <td><span class="value-error">10,000ms</span></td>
      </tr>
    </tbody>
  </table>
</div>

### 🤖 AI-Powered Features

<div class="premium-table">
  <table>
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Requests</th>
        <th>Avg. Time</th>
        <th>Median</th>
        <th>95th %</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong><code>/api/ai/generate/</code></strong></td>
        <td><code>POST</code></td>
        <td>37</td>
        <td><span class="value-error">11,800ms</span></td>
        <td><span class="value-error">11,000ms</span></td>
        <td><span class="value-error">20,000ms</span></td>
      </tr>
      <tr>
        <td><strong><code>/api/ai/models/</code></strong></td>
        <td><code>GET</code></td>
        <td>392</td>
        <td><span class="value-good">274ms</span></td>
        <td><span class="value-good">81ms</span></td>
        <td><span class="value-ok">530ms</span></td>
      </tr>
    </tbody>
  </table>
</div>

### 💼 Job Application Management

<div class="premium-table">
  <table>
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Requests</th>
        <th>Avg. Time</th>
        <th>Median</th>
        <th>95th %</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong><code>/api/job-applications/</code></strong></td>
        <td><code>POST</code></td>
        <td>93</td>
        <td><span class="value-good">185ms</span></td>
        <td><span class="value-good">86ms</span></td>
        <td><span class="value-ok">550ms</span></td>
      </tr>
      <tr>
        <td><strong><code>/api/job-applications/</code></strong></td>
        <td><code>GET</code></td>
        <td>309</td>
        <td><span class="value-good">247ms</span></td>
        <td><span class="value-good">87ms</span></td>
        <td><span class="value-good">160ms</span></td>
      </tr>
    </tbody>
  </table>
</div>

---

## ⏳ Response Time Distribution

This table provides a detailed breakdown of the response time distribution across all requests, highlighting the latency experienced by different percentiles of users.

<div class="premium-table">
  <table>
    <thead>
      <tr>
        <th>Percentile</th>
        <th>Response Time (ms)</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>50% (Median)</strong></td>
        <td><span class="value-good">85 ms</span></td>
        <td>Half of the requests were completed in 85ms or less.</td>
      </tr>
      <tr>
        <td><strong>66%</strong></td>
        <td><span class="value-good">120 ms</span></td>
        <td>Two-thirds of requests were faster than 120ms.</td>
      </tr>
      <tr>
        <td><strong>75%</strong></td>
        <td><span class="value-good">150 ms</span></td>
        <td>Three-quarters of requests finished within 150ms.</td>
      </tr>
      <tr>
        <td><strong>80%</strong></td>
        <td><span class="value-good">180 ms</span></td>
        <td>80% of requests were completed in 180ms or less.</td>
      </tr>
      <tr>
        <td><strong>90%</strong></td>
        <td><span class="value-warning">8,100 ms</span></td>
        <td>90% of users experienced a response time of 8.1 seconds or less.</td>
      </tr>
      <tr>
        <td><strong>95%</strong></td>
        <td><span class="value-warning">10,000 ms</span></td>
        <td>95% of requests were completed within 10 seconds.</td>
      </tr>
      <tr>
        <td><strong>98%</strong></td>
        <td><span class="value-error">18,000 ms</span></td>
        <td>98% of requests were handled in 18 seconds or less.</td>
      </tr>
      <tr>
        <td><strong>99%</strong></td>
        <td><span class="value-error">20,000 ms</span></td>
        <td>The top 1% of requests took 20 seconds or longer.</td>
      </tr>
      <tr>
        <td><strong>100% (Max)</strong></td>
        <td><span class="value-error">21,000 ms</span></td>
        <td>The slowest request took 21 seconds to complete.</td>
      </tr>
    </tbody>
  </table>
</div>

---

## 📉 Scalability & Response Time Over Load

The data shows a direct correlation between the number of concurrent users and the API's response time. As the user load increased, latency grew significantly.

```mermaid
graph TD
    subgraph User Ramp-Up
        A[Start<br>**8 Users**] --> B[+30s<br>**18 Users**] --> C[+15s<br>**25 Users**];
    end
    subgraph Median Response Time
        D[1,200 ms] --> E[2,800 ms] --> F[8,000 ms];
    end
    A -- 1.0 RPS --> D;
    B -- 1.3 RPS --> E;
    C -- 2.3 RPS --> F;

    style A fill:#c8e6c9
    style B fill:#fff9c4
    style C fill:#ffccbc

    style D fill:#c8e6c9
    style E fill:#fff9c4
    style F fill:#ffccbc
```

### Response Time Degradation

The following table illustrates how response times increased as more users were added to the test.

<div class="premium-table">
  <table>
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>Concurrent Users</th>
        <th>RPS</th>
        <th>Median Response</th>
        <th>95th Percentile</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>02:07:56Z</code></td>
        <td>8</td>
        <td>1.0</td>
        <td><span class="value-ok">1,200ms</span></td>
        <td><span class="value-ok">1,500ms</span></td>
      </tr>
      <tr>
        <td><code>02:08:01Z</code></td>
        <td>18</td>
        <td>1.3</td>
        <td><span class="value-warning">2,800ms</span></td>
        <td><span class="value-warning">4,400ms</span></td>
      </tr>
      <tr>
        <td><code>02:08:16Z</code></td>
        <td>25</td>
        <td>2.3</td>
        <td><span class="value-error">8,000ms</span></td>
        <td><span class="value-error">10,000ms</span></td>
      </tr>
      <tr>
        <td><code>02:09:01Z</code></td>
        <td>25</td>
        <td>0.5</td>
        <td><span class="value-error">19,000ms</span></td>
        <td><span class="value-error">19,000ms</span></td>
      </tr>
    </tbody>
  </table>
</div>

---

!!! info "ℹ️ Test Report Details"
    **📊 Test Report Generated**: July 24, 2025 • **🔬 Testing Framework**: Locust v2.x • **🏗️ Environment**: Production (DigitalOcean)