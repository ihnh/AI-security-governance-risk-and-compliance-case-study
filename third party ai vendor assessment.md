# Third Party AI Vendor Risk Management

## Problem Statement Overview
AI-powered fraud detection systems often depend on third-party vendor APIs rather than fully in-house models. This creates a **critical governance challenge: when an external vendor updates its model without notice, system behavior can change immediately**, even if the organization’s own codebase remains unchanged. In this scenario, a fraud detection model experiences a sudden spike in *false positives* after a vendor-side model update, leading to *customer complaints*, *operational disruption*, and urgent questions from the risk team about **accountability** and **decision ownership**.

The core problem is a **lack of transparency and control across the AI supply chain**. The production system may involve multiple layers, including a *foundation model provider*, a *vendor’s fine-tuned or integrated model*, and the *organization’s own application layer*. Because any of these components can change independently, traditional vendor risk management practices are no longer sufficient. Standard security reviews typically focus on software provenance, access controls, and infrastructure security, but AI systems **require additional scrutiny around training data provenance, model update frequency, foundation model dependencies, and governance safeguards**.

This case study addresses the need for a **structured third-party AI vendor risk management framework**. 

## Objective 
Evaluate external AI vendors for an insurance technology firm, classify them using a numerical risk scale, assess compliance with service level agreements such as uptime and latency, and generate governance recommendations based on security, data handling, and AI-specific risk factors. The broader goal is to improve accountability, reduce operational risk, and strengthen trust in AI-enabled customer-facing systems.
