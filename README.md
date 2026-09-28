# Third-party AI vendor risk management
## Wawasan InsurTech - Case Study

---

### Problem statement

Wawasan InsurTech runs GenAI-powered claims processing, fraud detection, and customer service across conventional insurance and takaful - all dependent on five third-party AI vendor APIs. When one vendor pushed an unannounced model update, the claims system immediately spiked false claim denials, triggering customer complaints and urgent questions from the CRO about accountability and decision ownership.

The incident exposed a governance gap: no formal mechanism existed to detect or respond to changes inside a vendor's model. AI systems require scrutiny beyond traditional vendor reviews - covering training data provenance, model update notification, bias testing, and exit strategy, none of which were contractually enforced.

Under BNM RMiT, licensed financial institutions are directly accountable for outsourced AI behaviour. Under PDPA 2024, vendors processing personal data carry direct liability up to RM1,000,000. For takaful, IFSA 2013 adds a further requirement: AI models must produce auditable, Shariah-compliant outputs.

---

### Objective

Build a structured AI vendor risk management framework for Wawasan InsurTech that:

- Scores five vendors across seven governance dimensions
- Monitors 30-day SLA performance against BNM RMiT thresholds
- Identifies concentration and lock-in risk across the portfolio
- Maps obligations to BNM RMiT, AIGE, PDPA 2024, and IFSA 2013
- Generates actionable recommendations for contract enforcement and contingency planning

---

### Deliverables

| Deliverable | Tool | Description |
|---|---|---|
| Vendor risk scorecard | Excel | 5 vendors scored across 7 dimensions |
| SLA compliance tracker | Excel | 10 metrics with thresholds, penalties, escalation paths |
| Contingency plan | Excel | 8 risk scenarios with mitigation and migration timelines |
| Regulatory mapping | Excel | BNM RMiT, AIGE, PDPA 2024, IFSA 2013 per governance area |
| Risk scoring analysis | Python / Jupyter | Weighted scoring, SLA monitoring, radar charts, sensitivity analysis |
| Governance dashboard | React / Vercel | Interactive CISO-level presentation of findings and recommendations |

> Full result analysis, findings, and recommendations are presented interactively in the [Vercel dashboard](https://ai-vendor-risk-casestudy.vercel.app)
---

### Findings

**PrismLogic AI is the critical risk.** Only vendor in active SLA breach (99.51% vs 99.9% BNM RMiT threshold). Low model transparency is incompatible with takaful Shariah audit requirements under IFSA 2013. Weighted score of 60.8 - lowest in the portfolio by a wide margin.

**Two vendors are Highly Recommended.** ArcVault AI (88.3) and NexaScale AI (88.8) hold SOC2 and ISO27001, conduct full bias testing, and have strong exit strategies.

**Model update notification risk is unmitigated.** No contractual update notification clause is enforced across any vendor. Sensitivity analysis shows PrismLogic AI's tier flips to Not Recommended with a 10-point drop in any single criterion.

**AIGE is still voluntary.** Vendors with Low transparency are technically compliant today but will face binding requirements expected by 2027.

---

### Results

- Weighted risk scoring model classifying all five vendors into governance tiers
- 30-day SLA monitoring confirming one active breach and four compliant vendors
- Contingency plan covering 8 scenarios with designated backup vendors and migration timelines
- Regulatory mapping identifying binding vs voluntary obligations and two key gaps vs global standards
- Sensitivity analysis showing PrismLogic AI's risk tier is fragile and requires immediate action

---

### Recommendations

**0-30 days**
- Suspend PrismLogic AI for all takaful workloads - Low transparency fails Shariah audit requirements
- Invoke SLA penalty clause and begin parallel testing on ArcVault AI
- Issue formal remediation notice to PrismLogic AI covering transparency, bias testing, and exit strategy

**30-90 days**
- Enforce 14-day model update notification clause across all five vendor contracts
- Audit ClarityCore API and ArcVault AI for PDPA 2024 data processor compliance
- Validate PrismLogic AI exit plan with a live failover test before contract renewal

**Ongoing**
- Quarterly vendor risk reviews using the weighted scoring framework
- Monthly SLA review across uptime, latency, and model update logs
- Monitor AIGE for transition to binding legislation by 2027

**Strategic:** Maintain a minimum of two active vendor relationships per critical workload per BNM RMiT operational resilience principles. Current portfolio has excessive concentration risk, with PrismLogic AI as a single point of governance failure across the takaful product line.

---

### Regulatory context

| Framework | Binding | Key obligation |
|---|---|---|
| BNM RMiT | Yes | AI outsourcing risk management |
| PDPA 2024 | Yes | Vendor direct liability, 72h breach notification |
| Cybersecurity Act 2024 | Yes | Incident reporting for critical AI systems |
| AIGE Guidelines | Voluntary | Fairness, transparency, accountability in AI |
| IFSA 2013 | Yes | Shariah governance of AI for takaful operators |

Key gap: No binding explainability law yet and no automated decision-making rights for consumers, unlike EU GDPR. Both expected by 2027.

---

*Wawasan InsurTech is a fictional company created for portfolio and educational purposes. All vendor names, scores, and scenarios are simulated.*
