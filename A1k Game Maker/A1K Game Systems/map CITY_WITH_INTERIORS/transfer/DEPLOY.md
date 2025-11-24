# Deployment Notes

- Serve `transfer/` over HTTPS or file:// for local demos.
- Use cache-busting (`?v=1.0.0`) for CSS/JS and manifests.
- Consider a strict CSP and subresource integrity for third-party scripts.
- For CDN, pin versions and mirror `i18n/` and `tests/` only if needed.

Example snippet:
```html
<link rel="stylesheet" href="./transfer/transfer-styles.css?v=1.0.0" />
<script src="./transfer/transfer-loader.js?v=1.0.0" defer></script>
```


