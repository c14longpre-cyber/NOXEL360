param(
  [Parameter(Mandatory=$true)]
  [string]$Slug,
  [string]$Title = ""
)

$Root = (Get-Location).Path
$Entries = Join-Path $Root "src\library\entries"
$TemplatePath = Join-Path $Root "src\library\TEMPLATE.md"

if (-not (Test-Path $Entries)) { New-Item -ItemType Directory -Force -Path $Entries | Out-Null }
if (-not (Test-Path $TemplatePath)) { Write-Error "Missing TEMPLATE.md at $TemplatePath"; exit 1 }

$OutFile = Join-Path $Entries "$Slug.md"
if (Test-Path $OutFile) { Write-Error "Entry already exists: $OutFile"; exit 1 }

$content = Get-Content $TemplatePath -Raw

if ($Title -ne "") {
  $content = $content -replace "\[Name of concept\]", $Title
}

Set-Content -Path $OutFile -Value $content -Encoding UTF8
Write-Host "✅ Created entry: $OutFile"
Write-Host "   Tip: open it and fill the sections."
