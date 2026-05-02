Write-Host ""
Write-Host "🚀 Starting NOXEL360..." -ForegroundColor Cyan
Write-Host ""

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 2

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Start-Sleep -Seconds 4

# Open browser
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ NOXEL360 launched" -ForegroundColor Green
Write-Host ""