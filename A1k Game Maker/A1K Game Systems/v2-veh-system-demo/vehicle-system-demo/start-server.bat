@echo off
echo Starting local development server...
echo.
echo Opening http://localhost:3000 in your browser...
echo Press Ctrl+C to stop the server
echo.

REM Try Node.js serve first
where npx >nul 2>&1
if %ERRORLEVEL% == 0 (
    npx serve . -p 3000 --cors
    goto :end
)

REM Fallback to Python
where python >nul 2>&1
if %ERRORLEVEL% == 0 (
    python -m http.server 3000
    goto :end
)

REM Fallback to PowerShell
echo No Node.js or Python found. Using PowerShell HTTP server...
powershell -Command "& {Add-Type -AssemblyName System.Net.HttpListener; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:3000/'); $listener.Start(); Write-Host 'Server running at http://localhost:3000/'; Write-Host 'Press Ctrl+C to stop'; while ($listener.IsListening) { $context = $listener.GetContext(); $response = $context.Response; $localPath = $context.Request.Url.LocalPath; if ($localPath -eq '/') { $localPath = '/index.html' }; $filePath = Join-Path $PWD $localPath.TrimStart('/'); if (Test-Path $filePath) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length) } else { $response.StatusCode = 404 }; $response.Close() }}"

:end

