# ==========================================================
# NOXEL360 — Pricing Page Generator (from module-pricing.json)
#
# Supports TWO JSON shapes:
# 1) SIMPLE ARRAY (your current file):
#    [{ "Name":"Core Platform","PriceUSD":49,"Unit":"per month" }, ...]
#
# 2) RICH ARRAY (recommended for "complete" module pages):
#    [{
#      "Id":"core",
#      "Name":"Noxel360 Core",
#      "Tag":"Core Platform",
#      "PriceUSD":59,
#      "Unit":"per month",
#      "Subtitle":"...",
#      "Description":"...",
#      "Highlights":[...],
#      "Features":[{"Title":"...","Text":"..."}],
#      "UseCases":[{"Title":"...","Text":"..."}],
#      "Tiers":[{"Name":"Gold","PriceUSD":59,"Note":"..."}],
#      "Faq":[{"Q":"...","A":"..."}],
#      "Cta":{"PrimaryLabel":"Activate","PrimaryHref":"/app","SecondaryLabel":"Back","SecondaryHref":"../index.html"}
#    }]
#
# Output:
#   .\landing\pricing\index.html
#   .\landing\pricing\<id>\index.html   (one per module)
# ==========================================================

$root = Get-Location
$jsonPath = Join-Path $root "module-pricing.json"
$landingRoot = Join-Path $root "landing"
$pricingRoot = Join-Path $landingRoot "pricing"

if (!(Test-Path $jsonPath)) { throw "module-pricing.json not found: $jsonPath" }

New-Item -ItemType Directory -Path $pricingRoot -Force | Out-Null

function HtmlEscape([string]$s){
  if ($null -eq $s) { return "" }
  return [System.Net.WebUtility]::HtmlEncode($s)
}

function Slug([string]$s){
  $t = ($s ?? "").ToLowerInvariant().Trim()
  $t = [Text.RegularExpressions.Regex]::Replace($t,'[^a-z0-9]+','-')
  $t = $t.Trim('-')
  if ([string]::IsNullOrWhiteSpace($t)) { $t = "module" }
  return $t
}

function Ensure-UniqueDir([string]$baseDir){
  if (!(Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir | Out-Null
    return $baseDir
  }
  $i = 1
  do { $cand = "$baseDir-$i"; $i++ } while (Test-Path $cand)
  New-Item -ItemType Directory -Path $cand | Out-Null
  return $cand
}

function GetOr($value, $fallback){
  if ($null -eq $value) { return $fallback }
  if ($value -is [string] -and [string]::IsNullOrWhiteSpace($value)) { return $fallback }
  return $value
}

$mods = Get-Content $jsonPath -Raw | ConvertFrom-Json
if ($mods -isnot [System.Collections.IEnumerable]) { throw "Expected an array in module-pricing.json" }

# Shared CSS (keeps the look consistent)
$css = @"
:root{
  --bg:#070a10;
  --card:#101827;
  --border:#1f2937;
  --text:#e5e7eb;
  --muted:#9ca3af;
  --g:#3CDE6A;
  --p:#702AA5;
  --radius:18px;
}
*{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
body{margin:0;background:linear-gradient(180deg,var(--bg),#0b0f18);color:var(--text);}
a{color:inherit}
header{padding:66px 20px 36px;text-align:center;}
header h1{margin:0;font-size:clamp(28px,4vw,46px);letter-spacing:-.02em;}
header p{margin:14px auto 0;max-width:900px;color:var(--muted);line-height:1.6;}
.wrap{max-width:1160px;margin:0 auto 80px;padding:0 20px;}
.kicker{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;}
.heroRow{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.pill{border:1px solid var(--border);background:rgba(255,255,255,.02);color:var(--muted);padding:10px 14px;border-radius:999px;font-size:13px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;}
.card{background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border:1px solid var(--border);border-radius:var(--radius);padding:24px;overflow:hidden;}
.card h2{margin:0 0 10px;font-size:18px}
.card p{margin:0;color:var(--muted);line-height:1.55;font-size:14px}
.section{margin-top:24px}
.sectionTitle{margin:26px 0 12px;color:var(--muted);text-transform:uppercase;font-size:12px;letter-spacing:.06em;font-weight:700}
.list{margin:0;padding-left:18px}
.list li{margin:0 0 8px;color:var(--text);font-size:14px}
.price{font-size:38px;font-weight:800;letter-spacing:-.02em;margin:10px 0 0}
.price span{font-size:14px;color:var(--muted);font-weight:450}
.btnRow{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.btn{display:inline-block;padding:12px 16px;border-radius:14px;text-decoration:none;font-weight:800;background:var(--g);color:#0b0f18}
.btn:hover{filter:brightness(1.06)}
.btn.alt{background:transparent;color:var(--text);border:1px solid var(--border);font-weight:750}
.btn.alt:hover{border-color:rgba(60,222,106,.7)}
.table{width:100%;border-collapse:separate;border-spacing:0;margin-top:10px;overflow:hidden;border-radius:14px;border:1px solid var(--border);background:rgba(255,255,255,.02)}
.table th,.table td{padding:12px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.06);font-size:14px}
.table th{color:var(--muted);font-weight:750;background:rgba(0,0,0,.18)}
.table tr:last-child td{border-bottom:none}
.qa{border:1px solid var(--border);border-radius:14px;padding:14px 14px;background:rgba(255,255,255,.02)}
.q{font-weight:800;margin:0 0 8px}
.a{margin:0;color:var(--muted);line-height:1.55}
.footer{padding:30px 20px;color:var(--muted);text-align:center;border-top:1px solid rgba(255,255,255,.06);font-size:13px}
.small{font-size:12px;color:var(--muted)}
"@

# Build per-module pages
$index = @()

foreach ($m in $mods) {
  $nameRaw = GetOr $m.Name "Module"
  $name = HtmlEscape $nameRaw
  $price = [int](GetOr $m.PriceUSD 0)
  $unit = HtmlEscape (GetOr $m.Unit "per month")

  $idRaw = $m.Id
  if ([string]::IsNullOrWhiteSpace($idRaw)) { $idRaw = Slug $nameRaw }
  $dir = Ensure-UniqueDir (Join-Path $pricingRoot $idRaw)
  $leaf = Split-Path $dir -Leaf

  # If rich fields missing, use safe defaults
  $tag = HtmlEscape (GetOr $m.Tag "Module")
  $subtitle = HtmlEscape (GetOr $m.Subtitle "Module pricing page generated from module-pricing.json.")
  $desc = HtmlEscape (GetOr $m.Description "Add a full description for this module in module-pricing.json (field: Description).")

  $high = ""
  foreach ($h in ($m.Highlights ?? @())) { $high += "<li>$(HtmlEscape $h)</li>`n" }
  if ([string]::IsNullOrWhiteSpace($high)) {
    $high = "<li>Add Highlights[] in module-pricing.json for this module.</li>"
  }

  $featureCards = ""
  foreach ($f in ($m.Features ?? @())) {
    $featureCards += @"
<div class="card">
  <h2>$(HtmlEscape (GetOr $f.Title "Feature"))</h2>
  <p>$(HtmlEscape (GetOr $f.Text "Describe the feature in module-pricing.json."))</p>
</div>
"@
  }
  if ([string]::IsNullOrWhiteSpace($featureCards)) {
    $featureCards = @"
<div class="card">
  <h2>Features</h2>
  <p>Add Features[] (Title/Text) in module-pricing.json to generate real feature cards.</p>
</div>
"@
  }

  $useCards = ""
  foreach ($u in ($m.UseCases ?? @())) {
    $useCards += @"
<div class="card">
  <h2>$(HtmlEscape (GetOr $u.Title "Use case"))</h2>
  <p>$(HtmlEscape (GetOr $u.Text "Describe the use case in module-pricing.json."))</p>
</div>
"@
  }
  if ([string]::IsNullOrWhiteSpace($useCards)) {
    $useCards = @"
<div class="card">
  <h2>Use cases</h2>
  <p>Add UseCases[] (Title/Text) in module-pricing.json to generate use case cards.</p>
</div>
"@
  }

  $tierRows = ""
  foreach ($t in ($m.Tiers ?? @())) {
    $tierRows += "<tr><td>$(HtmlEscape $t.Name)</td><td>`$$(HtmlEscape $t.PriceUSD)</td><td>$(HtmlEscape $t.Note)</td></tr>`n"
  }
  if ([string]::IsNullOrWhiteSpace($tierRows)) {
    $tierRows = "<tr><td>Gold</td><td>`$$price</td><td>Default tier (add Tiers[] to customize)</td></tr>"
  }

  $faqBlocks = ""
  foreach ($q in ($m.Faq ?? @())) {
    $faqBlocks += @"
<div class="qa">
  <p class="q">$(HtmlEscape $q.Q)</p>
  <p class="a">$(HtmlEscape $q.A)</p>
</div>
"@
  }
  if ([string]::IsNullOrWhiteSpace($faqBlocks)) {
    $faqBlocks = @"
<div class="qa">
  <p class="q">FAQ</p>
  <p class="a">Add Faq[] (Q/A) in module-pricing.json to generate real questions.</p>
</div>
"@
  }

  $pLabel = HtmlEscape (GetOr $m.Cta.PrimaryLabel "Open in App")
  $pHref  = HtmlEscape (GetOr $m.Cta.PrimaryHref "/app")
  $sLabel = HtmlEscape (GetOr $m.Cta.SecondaryLabel "Back to pricing")
  $sHref  = HtmlEscape (GetOr $m.Cta.SecondaryHref "../index.html")

  $page = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>$name — Pricing</title>
<style>$css</style>
</head>
<body>

<header>
  <div class="kicker">Noxel360 / Pricing</div>
  <h1>$name</h1>
  <p>$subtitle</p>

  <div class="heroRow">
    <div class="pill">$tag</div>
    <div class="pill">ID: <code>$leaf</code></div>
    <div class="pill small">Path: <code>/landing/pricing/$leaf/</code></div>
  </div>

  <div class="price">`$$price <span>$unit</span></div>

  <div class="btnRow">
    <a class="btn" href="$pHref" target="_blank" rel="noopener">$pLabel</a>
    <a class="btn alt" href="$sHref">$sLabel</a>
  </div>
</header>

<div class="wrap">

  <div class="section">
    <div class="sectionTitle">Overview</div>
    <div class="card">
      <h2>What this module does</h2>
      <p>$desc</p>
    </div>
  </div>

  <div class="section">
    <div class="sectionTitle">Key highlights</div>
    <div class="card">
      <ul class="list">
        $high
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="sectionTitle">Features</div>
    <div class="grid">
      $featureCards
    </div>
  </div>

  <div class="section">
    <div class="sectionTitle">Use cases</div>
    <div class="grid">
      $useCards
    </div>
  </div>

  <div class="section">
    <div class="sectionTitle">Tiers</div>
    <table class="table">
      <thead><tr><th>Tier</th><th>Price</th><th>Notes</th></tr></thead>
      <tbody>
        $tierRows
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="sectionTitle">FAQ</div>
    <div class="grid">
      $faqBlocks
    </div>
  </div>

  <div class="section">
    <div class="sectionTitle">Next steps</div>
    <div class="card">
      <p>Tip: enrich <code>module-pricing.json</code> with Description, Highlights, Features, UseCases, Tiers and Faq to make this page fully production-ready.</p>
    </div>
  </div>

</div>

<div class="footer">© 2026 Noxel360 — Generated from module-pricing.json</div>
</body>
</html>
"@

  $page | Set-Content -Path (Join-Path $dir "index.html") -Encoding UTF8

  $index += [pscustomobject]@{
    Id = $leaf
    Name = $nameRaw
    PriceUSD = $price
    Unit = $m.Unit
    Tag = $m.Tag
    Subtitle = $m.Subtitle
  }
}

# Global pricing index page
$cards = ""
foreach ($x in $index) {
  $name = HtmlEscape $x.Name
  $sub = HtmlEscape (GetOr $x.Subtitle "Click to view module pricing details.")
  $tag = HtmlEscape (GetOr $x.Tag "Module")
  $price = [int]$x.PriceUSD
  $unit = HtmlEscape (GetOr $x.Unit "per month")
  $href = "./$($x.Id)/index.html"

  $cards += @"
<div class="card">
  <h2>$name</h2>
  <p>$sub</p>
  <p class="small" style="margin-top:10px">$tag</p>
  <div class="price" style="font-size:30px;margin-top:10px">`$$price <span>$unit</span></div>
  <div style="margin-top:14px">
    <a class="btn" href="$href">View module page</a>
  </div>
</div>
"@
}

$pricingHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Noxel360 — Pricing</title>
<style>$css</style>
</head>
<body>
<header>
  <div class="kicker">Noxel360</div>
  <h1>Module Pricing</h1>
  <p>Each module has a complete page with highlights, features, tiers, and FAQ. Enrich the JSON to make the pages fully production-ready.</p>
  <div class="heroRow">
    <div class="pill">Global: <code>/landing/pricing/</code></div>
    <div class="pill">Modules: <code>/landing/pricing/&lt;id&gt;/</code></div>
  </div>
</header>

<div class="wrap">
  <div class="grid">
    $cards
  </div>
</div>

<div class="footer">© 2026 Noxel360 — Generated from module-pricing.json</div>
</body>
</html>
"@

$pricingHtml | Set-Content -Path (Join-Path $pricingRoot "index.html") -Encoding UTF8

Write-Host "`n✅ Generated pricing pages:"
Write-Host " - $pricingRoot\index.html"
Write-Host " - $($index.Count) module pages under $pricingRoot\<id>\index.html`n"

Start-Process (Join-Path $pricingRoot "index.html")
