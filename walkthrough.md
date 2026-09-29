# Vendor Governance Framework Walkthrough
## Wawasan InsurTech - AI Vendor Risk Management

---

### Scenario brief

Wawasan InsurTech is an insurance and InsurTech company with 3,000 employees, 18 data scientists, and five AI vendor relationships. They use GenAI for automated claims processing, fraud detection, and underwriting. The regulatory landscape includes BNM RMiT, PDPA 2024, AIGE Guidelines, and IFSA 2013 for takaful operations. Key stakeholders are the Chief Risk Officer, VP of Claims, Head of AI/ML, and the Vendor Management Director.

The task is to evaluate all five AI vendors, define 10 SLA metrics with enforcement mechanisms, and create contingency plans for eight risk scenarios.

**Risk scoring scale:** 1 (lowest) to 5 (highest)
- Security: 25%
- Data handling: 20%
- Transparency: 15%
- Financial stability: 10%
- SLA compliance: 10%
- Exit strategy: 10%
- AI model governance: 10%

---

### Vendor assessment

Five vendors are evaluated across 13 columns.

**ClarityCore API** is a GenAI API with full data access, SOC2 certification, high transparency, US/EU data processing, full bias testing, 99.9% uptime, 500ms response time, 30-day retention, full exit strategy, risk score 2, and AI model governance score 85.

**ArcVault AI** is a GenAI platform with full data access, dual SOC2 and ISO27001 certification, medium transparency, multi-region processing, full bias testing, 99.95% uptime, 400ms response time, 90-day retention, and risk score 2. AI model governance is 80.

**NexaScale AI** is a GenAI API with limited data access, dual SOC2 and ISO27001, medium transparency, multi-region processing, full bias testing, and the strongest SLA numbers of any vendor - 99.99% uptime and 300ms response time. Configurable retention is a plus because Wawasan controls it. Risk score is 2, AI model governance is 90.

**PrismLogic AI** is where it gets challenging. It is a GenAI platform with limited data access, but model transparency is rated Low at just 45. Data processing is US-only. Bias testing is partial, uptime is 99.5% - the only vendor in SLA breach - and exit strategy is only partial. Risk score is 3, the highest among the five vendors, and AI model governance is just 60. For an insurance company handling sensitive policyholder and takaful participant data, those security and governance gaps are significant. Under IFSA 2013, PrismLogic AI's low transparency makes it directly incompatible with takaful Shariah audit requirements.

**SentinelIQ AI** rounds things out as a GenAI API with limited data access, SOC2 and ISO27001 certification, high transparency, US/EU processing, full bias testing, 99.9% uptime, 450ms response time, 30-day retention, and risk score 2. AI model governance is 85 - the highest alongside NexaScale.

> Which vendor would you flag as the biggest governance risk? PrismLogic AI - and what would you do about it? Suspend it for takaful workloads immediately and issue a formal remediation notice. The tip reminds us that for insurance, model transparency is critical because regulators increasingly demand explainability for claims decisions - a requirement that is binding under BNM RMiT and expected to extend further under AIGE by 2027.

---

### SLA requirements

10 metrics are defined across uptime, latency, throughput, error rate, data processing time, support response, incident resolution, backup/recovery RPO, compliance reporting, and model update notification.

**Uptime** has a minimum threshold of 99.0%, target of 99.95%, automated monitoring, continuous frequency, 1% monthly credit per 0.1% below threshold, and Tier 1-3 escalation.

**Response latency** sets a minimum of 1,000ms, target of 500ms, real-time monitoring through a latency tracking API, service credits for P95 breaches, and Tier 2 escalation.

**Throughput** has a minimum of 500 req/s and a target of 1,000 req/s, measured by load testing and APM tooling on an hourly basis, with rate limit credits and Tier 2 escalation.

**Error rate** goes from a 2% minimum to a 0.5% target, monitored real-time through automated log analysis, with service credits escalating by breach severity and Tier 1-2 escalation.

**Data processing time** allows up to 24 hours minimum but targets 4 hours, tracked through transaction logs daily, with extended SLA plus penalty multiplier and Tier 3 escalation.

**Support response time** sets an 8-hour minimum and 2-hour target, measured by helpdesk log timestamps per incident, with service credits for P1/P2 breaches and Tier 2 escalation.

**Incident resolution** targets 1 hour against a 4-hour minimum, tracked per incident with Tier 3 executive escalation.

**Backup/recovery RPO** targets 4 hours against a 24-hour minimum with quarterly DR testing.

**Compliance reporting** targets monthly against a quarterly minimum with audit log review.

**Model update notification** requires a 14-day minimum advance notice with a 7-day target, tracked per update with downtime credits and Tier 2 escalation. This last metric is particularly relevant for insurance because unannounced model updates could affect claims decisions without proper validation - exactly the incident that triggered this governance review.

---

### Contingency plan

Eight risk scenarios are covered.

**Vendor shutdown** is low probability, critical impact, with redundant vendor maintenance and quarterly DR testing, ArcVault AI as backup, 7-day migration, full API export plus model weights, and executive briefing with 24-hour notification.

**Data breach** is medium probability, critical impact, with incident response and forensic analysis, NexaScale AI as backup, 24-hour migration, encrypted dump plus validation, and immediate BNM/PDPA 2024 notification within 72 hours.

**SLA violation (>1 week)** is medium probability, high impact, handled through SLA penalty clause activation and parallel testing on ArcVault AI. 3-day migration with API export and full audit trail, VP of Claims and CRO notified within 2 hours.

**Price increase (>20%)** is medium probability, medium impact, handled through contract renegotiation and RFP to competing vendors. ClarityCore API as backup, 30-day timeline, fine-tuning dataset export, and Vendor Management Director leads negotiation.

**API deprecation** is high probability, high impact, mitigated through 90-day migration clause in contract and version pinning. NexaScale AI as backup, 14-day timeline, full API docs plus code migration, and technical team coordination.

**Regulatory non-compliance** is low probability, critical impact, requiring vendor access suspension, General Counsel engagement, and BNM notification within 72 hours. SentinelIQ AI as backup, 7-day migration, encrypted audit trail plus data map, and PDPA 2024 consumer notification if PII is affected.

**Vendor acquisition** is medium probability, medium impact, managed through contract review and due diligence on the acquirer. Multi-vendor strategy, 10-day timeline, and data sovereignty validation.

**Performance degradation** is high probability, medium impact, handled through performance tuning and parallel testing on backup vendor. Secondary failover, 1-day migration, cached outputs with rollback capability, and daily monitoring updates.

> What would happen if you had a contingency plan for vendor shutdown but never actually tested the failover? The plan itself is not worth much without regular validation. BNM RMiT requires documented and tested exit plans for all material outsourcing arrangements.

---

### Summary

What ties this all together is that vendor governance in insurance is not just procurement. It is a regulatory and operational risk management discipline. Every SLA metric connects back to claims processing reliability. Every contingency plan maps to a specific failure mode. And the vendor assessments give you the data to make defensible decisions about who to trust with your policyholder and takaful participant data.

Under the Malaysian regulatory framework, the stakes are higher than in many other markets. BNM RMiT holds licensed institutions directly accountable for vendor behaviour. PDPA 2024 extends direct liability to the vendors themselves. And IFSA 2013 adds a Shariah governance layer that has no equivalent in US or EU frameworks.

---

*Wawasan InsurTech is a fictional company created for portfolio and educational purposes. All vendor names, scores, and scenarios are simulated.*
