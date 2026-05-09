. "$PSScriptRoot\\common.ps1"

$config = Get-LocalPostgresConfig

if (-not (Test-Path -LiteralPath $config.DataDir)) {
  Write-Host "Local PostgreSQL cluster is not initialized."
  exit 0
}

if (-not (Test-LocalPostgresReady -Config $config)) {
  Write-Host "Local PostgreSQL is already stopped."
  exit 0
}

$pgCtl = Get-PgBinaryPath -BinaryName 'pg_ctl.exe'

& $pgCtl 'stop' '-D' $config.DataDir '-m' 'fast' '-w'

if ($LASTEXITCODE -ne 0) {
  throw "pg_ctl stop failed with exit code $LASTEXITCODE"
}

Write-Host "Local PostgreSQL stopped."
