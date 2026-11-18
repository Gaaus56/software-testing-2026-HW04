# Chạy bộ test HW04: 3 feature × 3 trình duyệt = 9 lần chạy, mỗi lần một báo cáo HTML riêng.
# Cách dùng (PowerShell, ở thư mục gốc repo; Web :5173 và Admin :5174 phải đang chạy):
#   .\scripts\run-reports.ps1                         # chạy đủ 9 lần
#   .\scripts\run-reports.ps1 -Features FR09          # chỉ FR-09 trên 3 trình duyệt
#   .\scripts\run-reports.ps1 -Browsers webkit        # chỉ WebKit cho cả 3 feature
param(
  [string[]]$Features = @('FR02', 'FR09', 'FR16'),
  [string[]]$Browsers = @('chromium', 'firefox', 'webkit')
)

$specs = @{ FR02 = 'tests/fr02-login.spec.ts'; FR09 = 'tests/fr09-coupon.spec.ts'; FR16 = 'tests/fr16-import.spec.ts' }
$repo = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repo

Write-Host "Run by: $env:USERNAME @ $env:COMPUTERNAME — $(Get-Date -Format o)"
$summary = @()
foreach ($f in $Features) {
  foreach ($b in $Browsers) {
    $dir = "reports/$f-$b"
    if (Test-Path $dir) { Remove-Item $dir -Recurse -Force }
    $env:REPORT_DIR = $dir
    Write-Host "`n===== $f / $b → $dir =====" -ForegroundColor Cyan
    npx playwright test $specs[$f] --project=$b
    $json = Join-Path $dir 'results.json'
    if (Test-Path $json) {
      $s = (Get-Content $json -Raw -Encoding utf8 | ConvertFrom-Json).stats
      $summary += [pscustomobject]@{ Run = "$f-$b"; Passed = $s.expected; Failed = $s.unexpected; Flaky = $s.flaky; Skipped = $s.skipped; Seconds = [math]::Round($s.duration / 1000) }
    }
  }
}
Remove-Item Env:REPORT_DIR -ErrorAction SilentlyContinue
Write-Host "`n===== Tổng hợp =====" -ForegroundColor Cyan
$summary | Format-Table -AutoSize
