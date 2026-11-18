# Chạy bộ test HW04 theo feature × trình duyệt, mỗi lần một báo cáo HTML riêng.
# Cách dùng (PowerShell, ở thư mục gốc repo; Web :5173 và Admin :5174 phải đang chạy):
#   .\scripts\run-reports.ps1                                  # 3 feature × 3 trình duyệt = 9 lần chạy
#   .\scripts\run-reports.ps1 -Features FR09                   # chỉ FR-09 trên 3 trình duyệt
#   .\scripts\run-reports.ps1 -Browsers webkit                 # chỉ WebKit cho cả 3 feature
#   .\scripts\run-reports.ps1 -Features FR09 -OutRoot reports-video   # ghi ra thư mục khác (không đè báo cáo chính thức)
# Spec của mỗi feature được tìm theo tên: tests/<fr>-*.spec.ts (ví dụ FR09 → tests/fr09-coupon.spec.ts)
param(
  [string[]]$Features = @('FR02', 'FR09', 'FR16'),
  [string[]]$Browsers = @('chromium', 'firefox', 'webkit'),
  [string]$OutRoot = 'reports'
)

$repo = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repo

Write-Host "Run by: $env:USERNAME @ $env:COMPUTERNAME — $(Get-Date -Format o)"
$summary = @()
foreach ($f in $Features) {
  $spec = Get-ChildItem -Path tests -Filter "$($f.ToLower())-*.spec.ts" | Select-Object -First 1
  if (-not $spec) { Write-Warning "Không tìm thấy tests/$($f.ToLower())-*.spec.ts — bỏ qua $f"; continue }
  foreach ($b in $Browsers) {
    $dir = "$OutRoot/$f-$b"
    if (Test-Path $dir) { Remove-Item $dir -Recurse -Force }
    $env:REPORT_DIR = $dir
    Write-Host "`n===== $f / $b → $dir =====" -ForegroundColor Cyan
    npx playwright test "tests/$($spec.Name)" --project=$b
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
