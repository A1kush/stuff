# Build Information

## Offline Bundle Size Tracking

This file tracks the size of the offline bundle for regression detection.

### Current Build (2025-11-13)

| File | Size | Notes |
|------|------|-------|
| `offline/app.js` | ~38.1 KB | Minified bundle (all game code) |
| `offline/index.html` | ~1.0 KB | HTML entry point |
| **Total** | **~39.1 KB** | Complete offline package |

### Build Command

```bash
npm run build:offline
```

### Size Verification

To check current build size:
```bash
# Windows PowerShell
Get-ChildItem -Path "offline" -Recurse | Measure-Object -Property Length -Sum

# Linux/Mac
du -sh offline/
```

### Notes

- Bundle is minified but not gzipped
- Size may vary slightly between builds due to minification differences
- Significant size increases (>10%) should be investigated

