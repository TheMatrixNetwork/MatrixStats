param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

function Convert-IdentifierList {
  param([string]$Text)

  return ([regex]::Replace($Text, '"([^"]+)"', '`$1`'))
}

function Convert-SqlLine {
  param([string]$Line)

  if ($Line -match '^CREATE CACHED TABLE "PUBLIC"\."([^"]+)"\(') {
    return "CREATE TABLE ``$($Matches[1])``("
  }

  if ($Line -match '^ALTER TABLE "PUBLIC"\."([^"]+)" ADD CONSTRAINT "PUBLIC"\."([^"]+)" PRIMARY KEY\((.*)\);\s*$') {
    $columns = Convert-IdentifierList $Matches[3]
    return "ALTER TABLE ``$($Matches[1])`` ADD CONSTRAINT ``$($Matches[2])`` PRIMARY KEY($columns);"
  }

  if ($Line -match '^INSERT INTO "PUBLIC"\."([^"]+)" VALUES\s*$') {
    return "INSERT INTO ``$($Matches[1])`` VALUES"
  }

  if ($Line -match '^\s+"([^"]+)"(.*)$') {
    return ('    ' + (Convert-IdentifierList ('"' + $Matches[1] + '"' + $Matches[2])))
  }

  return $Line
}

if (-not (Test-Path -LiteralPath $InputPath)) {
  throw "Input file not found: $InputPath"
}

if (-not $OutputPath) {
  $directory = Split-Path -Path $InputPath -Parent
  $name = [System.IO.Path]::GetFileNameWithoutExtension($InputPath)
  $ext = [System.IO.Path]::GetExtension($InputPath)
  $OutputPath = Join-Path $directory ("$name.mariadb$ext")
}

$lines = Get-Content -LiteralPath $InputPath

# Remove H2 header/user boilerplate and convert SQL structure line-by-line.
$processedLines = foreach ($line in $lines) {
  if ($line -match '^-- H2 ') { continue }
  if ($line -match '^;\s*$') { continue }
  if ($line -match '^CREATE USER IF NOT EXISTS ') { continue }

  Convert-SqlLine $line
}

$content = ($processedLines -join "`r`n")

# MariaDB import preamble.
$preamble = @(
  'SET NAMES utf8mb4;'
  'SET FOREIGN_KEY_CHECKS=0;'
  'SET sql_mode = "NO_AUTO_VALUE_ON_ZERO";'
  ''
) -join "`r`n"

# DDL/type conversions.
$content = $content.Replace('CREATE CACHED TABLE', 'CREATE TABLE')
$content = [regex]::Replace($content, '\bCHARACTER VARYING\((\d+)\)', 'VARCHAR($1)')
$content = [regex]::Replace($content, '\bCHARACTER\((\d+)\)', 'CHAR($1)')
$content = [regex]::Replace($content, '\bDOUBLE PRECISION\b', 'DOUBLE')
$content = [regex]::Replace($content, '\bUUID\b', 'CHAR(36)')

# Literal conversions.
$content = [regex]::Replace($content, 'CHAR\(36\)\s+''([0-9a-fA-F-]+)''', '''$1''')
$content = [regex]::Replace($content, '\bUUID\s+''([0-9a-fA-F-]+)''', '''$1''')
$content = [regex]::Replace($content, '\bJSON\s+''', '''')

# Normalize line endings and append import epilogue.
$content = $content.Trim() + "`r`n`r`nSET FOREIGN_KEY_CHECKS=1;`r`n"
$content = $preamble + $content

Set-Content -LiteralPath $OutputPath -Value $content -Encoding UTF8
Write-Host "Wrote MariaDB-compatible backup to: $OutputPath" -ForegroundColor Green
