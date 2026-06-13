param(
  [string]$SourcePath = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$DestinationPath = "G:\opt\matrixsite\my-site",
  [switch]$Mirror,
  [switch]$IncludeDatabase
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command robocopy -ErrorAction SilentlyContinue)) {
  throw "robocopy is required but was not found."
}

if (-not (Test-Path -LiteralPath $SourcePath)) {
  throw "Source path not found: $SourcePath"
}

if (-not (Test-Path -LiteralPath $DestinationPath)) {
  throw "Destination path not found: $DestinationPath"
}

Write-Host "Deploying from '$SourcePath' to '$DestinationPath'..." -ForegroundColor Cyan

$excludeDirs = @(
  ".git",
  ".github",
  ".vscode",
  "node_modules",
  "dist",
  "coverage"
)

$excludeFiles = @(
  "wiki.db",
  "wiki.db-shm",
  "wiki.db-wal",
  "*.log",
  "npm-debug.log*",
  "yarn-error.log*",
  ".DS_Store"
)

if ($IncludeDatabase) {
  $excludeFiles = $excludeFiles | Where-Object {
    $_ -notin @("wiki.db", "wiki.db-shm", "wiki.db-wal")
  }
}

$commonArgs = @(
  "`"$SourcePath`"",
  "`"$DestinationPath`"",
  "/E",
  "/Z",
  "/R:2",
  "/W:2",
  "/MT:16",
  "/FFT",
  "/XA:SH",
  "/XD"
) + $excludeDirs + @(
  "/XF"
) + $excludeFiles

if ($Mirror) {
  # /MIR deletes files at destination that do not exist at source.
  $commonArgs[2] = "/MIR"
}

& robocopy @commonArgs
$code = $LASTEXITCODE

# Robocopy exit codes < 8 are success/warnings. >= 8 means failure.
if ($code -ge 8) {
  throw "Robocopy failed with exit code $code."
}

Write-Host "Sync complete (robocopy exit code: $code)." -ForegroundColor Green
if (-not $IncludeDatabase) {
  Write-Host "Database files (wiki.db, wiki.db-shm, wiki.db-wal) were excluded to protect persistent server data." -ForegroundColor Yellow
}
Write-Host "Next steps on Linux: npm ci ; npm run build ; rsync dist ; restart services" -ForegroundColor Yellow
