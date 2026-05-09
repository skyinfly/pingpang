. "$PSScriptRoot\\common.ps1"

$config = Get-LocalPostgresConfig

New-Item -ItemType Directory -Force -Path $config.BaseDir | Out-Null

if (Test-Path -LiteralPath $config.DataDir) {
  Write-Host "Local PostgreSQL cluster already initialized at $($config.DataDir)."
  exit 0
}

$initdb = Get-PgBinaryPath -BinaryName 'initdb.exe'

& $initdb '-D' $config.DataDir '--username=postgres' '--auth=trust' '--encoding=UTF8'

if ($LASTEXITCODE -ne 0) {
  throw "initdb failed with exit code $LASTEXITCODE"
}

Write-Host "Initialized local PostgreSQL cluster at $($config.DataDir)."
