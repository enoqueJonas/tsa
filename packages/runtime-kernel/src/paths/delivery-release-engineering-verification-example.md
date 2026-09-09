# Representative Steward verification example

A release check should go beyond `/health`.

Example flow:

1. authenticate with a permitted test identity;
2. retrieve an existing Service record;
3. verify ownership/lifecycle/criticality fields expected by the release;
4. exercise one changed behavior when the release introduced one;
5. confirm the API response and persisted state are coherent.

Use safe test data and the environment's established access policy. Quality Steward later develops much deeper automated coverage; this check exists to decide whether the deployed release is acceptable.
