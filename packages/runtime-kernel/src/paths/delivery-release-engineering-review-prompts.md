# Release Engineering reviewer prompts

Use these during milestone review:

- Show me the exact bytes/artifact identity that were approved and the exact identity now running.
- Show me where a rebuild between UAT and production would be detected.
- Which gate requires human judgment, and what judgment is being made?
- What is the first piece of evidence that tells you a deployment should be considered failed?
- Which migration would make application rollback unsafe?
- Can you retrieve the last-known-good release without rebuilding it?
- If the pipeline reports success but the representative client path fails, what state is the release in?
- What would another engineer still need to ask you personally before releasing Steward?
