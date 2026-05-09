Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-RepoRoot {
  return Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
}

function Get-LocalPostgresConfig {
  $repoRoot = Get-RepoRoot

  return @{
    RepoRoot = $repoRoot
    BaseDir = Join-Path $repoRoot '.local'
    BinDir = Join-Path $repoRoot '.local\postgresql\pgsql\bin'
    DataDir = Join-Path $repoRoot '.local\postgres-data'
    LogPath = Join-Path $repoRoot '.local\postgres.log'
    Database = 'pingpang'
    Host = 'localhost'
    Port = 5432
    User = 'postgres'
    Password = 'postgres'
  }
}

function Get-PgBinaryPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$BinaryName
  )

  $config = Get-LocalPostgresConfig
  $binaryPath = Join-Path $config.BinDir $BinaryName

  if (-not (Test-Path -LiteralPath $binaryPath)) {
    throw "PostgreSQL binary not found: $binaryPath"
  }

  return $binaryPath
}

function Test-LocalPostgresReady {
  param(
    [Parameter(Mandatory = $true)]
    [hashtable]$Config
  )

  $pgIsReady = Get-PgBinaryPath -BinaryName 'pg_isready.exe'
  & $pgIsReady '-h' $Config.Host '-p' "$($Config.Port)" '-U' $Config.User '-d' 'postgres' | Out-Null
  return $LASTEXITCODE -eq 0
}

function Invoke-LocalPsql {
  param(
    [Parameter(Mandatory = $true)]
    [hashtable]$Config,
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $psql = Get-PgBinaryPath -BinaryName 'psql.exe'
  $previousPassword = $env:PGPASSWORD
  $env:PGPASSWORD = $Config.Password

  try {
    return & $psql @Arguments
  } finally {
    $env:PGPASSWORD = $previousPassword
  }
}

function Ensure-LocalDatabase {
  param(
    [Parameter(Mandatory = $true)]
    [hashtable]$Config
  )

  $databaseExists = (Invoke-LocalPsql -Config $Config -Arguments @(
      '-h', $Config.Host,
      '-p', "$($Config.Port)",
      '-U', $Config.User,
      '-d', 'postgres',
      '-tAc', "SELECT 1 FROM pg_database WHERE datname = '$($Config.Database)';"
    ) | Out-String).Trim()

  if ($databaseExists -eq '1') {
    return
  }

  $createdb = Get-PgBinaryPath -BinaryName 'createdb.exe'
  $previousPassword = $env:PGPASSWORD
  $env:PGPASSWORD = $Config.Password

  try {
    & $createdb '-h' $Config.Host '-p' "$($Config.Port)" '-U' $Config.User $Config.Database

    if ($LASTEXITCODE -ne 0) {
      throw "createdb failed with exit code $LASTEXITCODE"
    }
  } finally {
    $env:PGPASSWORD = $previousPassword
  }
}
