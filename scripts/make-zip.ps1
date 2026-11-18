# Đóng gói bài nộp HW04: 23120017_HW04_AI_Automation_<Điểm>.zip (đặt cạnh thư mục repo)
# Chỉ lấy đúng các tài liệu cần nộp (không lấy node_modules, reports-video, reports-demo, test-results).
# Cách dùng (PowerShell, ở thư mục gốc repo):  .\scripts\make-zip.ps1 -Grade 087
param([Parameter(Mandatory = $true)][ValidatePattern('^\d{3}$')][string]$Grade)

$repo = Resolve-Path (Join-Path $PSScriptRoot '..')
$name = "23120017_HW04_AI_Automation_$Grade"
$stage = Join-Path $env:TEMP $name
$zip = Join-Path (Split-Path $repo -Parent) "$name.zip"

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory $stage | Out-Null

$items = @('README.md', 'git_log.txt', 'docs', 'pdf', 'reports', 'bugs', 'ai', 'tests', 'pages', 'helpers', 'data', 'scripts',
           '.claude', 'playwright.config.ts', 'package.json', 'package-lock.json', '.gitattributes', '.gitignore')
foreach ($i in $items) {
  $src = Join-Path $repo $i
  if (Test-Path $src) { Copy-Item $src -Destination $stage -Recurse -Force } else { Write-Warning "Thiếu: $i" }
}
if (-not (Test-Path (Join-Path $stage 'ai/prompt_logs'))) { Write-Warning 'Thiếu ai/prompt_logs (phụ lục AI Audit bắt buộc)' }

if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip
$mb = [math]::Round((Get-Item $zip).Length / 1MB, 2)
Write-Output "Đã tạo $zip ($mb MB)"
if ($mb -gt 20) { Write-Warning 'Vượt 20 MB — cần chia nhỏ theo quy định Moodle' }
