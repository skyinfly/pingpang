. "$PSScriptRoot\\common.ps1"

$config = Get-LocalPostgresConfig

if (-not (Test-Path -LiteralPath $config.DataDir)) {
  Write-Host "Local PostgreSQL cluster is not initialized."
  exit 1
}

if (-not (Test-LocalPostgresReady -Config $config)) {
  Write-Host "Local PostgreSQL is stopped."
  exit 1
}

Ensure-LocalDatabase -Config $config

Write-Host "Local PostgreSQL is running on $($config.Host):$($config.Port) with database $($config.Database)."
