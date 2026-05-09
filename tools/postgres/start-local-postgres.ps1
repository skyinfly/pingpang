. "$PSScriptRoot\\common.ps1"

$config = Get-LocalPostgresConfig

if (-not (Test-Path -LiteralPath $config.DataDir)) {
  & (Join-Path $PSScriptRoot 'init-local-postgres.ps1')
}

if (Test-LocalPostgresReady -Config $config) {
  Ensure-LocalDatabase -Config $config
  Write-Host "Local PostgreSQL already running on $($config.Host):$($config.Port)."
  exit 0
}

$pgCtl = Get-PgBinaryPath -BinaryName 'pg_ctl.exe'

& $pgCtl 'start' '-D' $config.DataDir '-l' $config.LogPath '-o' "-p $($config.Port)" '-w'

if ($LASTEXITCODE -ne 0) {
  throw "pg_ctl start failed with exit code $LASTEXITCODE"
}

Ensure-LocalDatabase -Config $config

Write-Host "Local PostgreSQL started on $($config.Host):$($config.Port) with database $($config.Database)."
