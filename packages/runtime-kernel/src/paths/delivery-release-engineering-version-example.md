# Release candidate version example

For a hypothetical Steward release:

```text
1.4.0-rc.1  first candidate built from reviewed source
1.4.0-rc.2  new candidate after a code/config-input correction
1.4.0       accepted stable release
```

`rc.2` is not `rc.1` with files silently replaced. It is a new candidate identity with its own source revision, CI evidence and artifact digest.

The exact ecosystem syntax can vary, but the engineering property is constant: distinct content requires distinct identity.
