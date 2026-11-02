param(
  [string]$RootFolderName = "Material histórico",
  [string]$OutputPath = ".\\onedrive-material-historico-index.json",
  [switch]$CreateAnonymousLinks
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Ensure-GraphModule {
  if (-not (Get-Module -ListAvailable -Name Microsoft.Graph.Authentication)) {
    Write-Host "Instalando Microsoft.Graph.Authentication para el usuario actual..."
    Install-Module Microsoft.Graph.Authentication -Scope CurrentUser -Force -AllowClobber
  }
  Import-Module Microsoft.Graph.Authentication
}

function Invoke-GraphPaged {
  param([Parameter(Mandatory=$true)][string]$Uri)
  $items = @()
  $next = $Uri
  while ($next) {
    $response = Invoke-MgGraphRequest -Method GET -Uri $next
    if ($response.value) { $items += @($response.value) }
    $next = $response.'@odata.nextLink'
  }
  return $items
}

function Invoke-GraphWithRetry {
  param(
    [Parameter(Mandatory=$true)][ValidateSet("GET","POST")][string]$Method,
    [Parameter(Mandatory=$true)][string]$Uri,
    [object]$Body = $null,
    [int]$MaxAttempts = 7
  )
  for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    try {
      if ($null -ne $Body) {
        return Invoke-MgGraphRequest -Method $Method -Uri $Uri -Body ($Body | ConvertTo-Json -Depth 8) -ContentType "application/json"
      }
      return Invoke-MgGraphRequest -Method $Method -Uri $Uri
    } catch {
      if ($attempt -ge $MaxAttempts) { throw }
      $delay = [Math]::Min(30, [Math]::Pow(2, $attempt))
      Write-Host "Microsoft Graph pidió reintentar. Reintentando..."
      Start-Sleep -Seconds $delay
    }
  }
}

function Get-Children {
  param([Parameter(Mandatory=$true)][string]$ItemId)
  $escaped = [Uri]::EscapeDataString($ItemId)
  $uri = "https://graph.microsoft.com/v1.0/me/drive/items/$escaped/children?`$top=200&`$select=id,name,size,webUrl,parentReference,folder,file,lastModifiedDateTime"
  return Invoke-GraphPaged -Uri $uri
}

function Get-PublicLink {
  param([Parameter(Mandatory=$true)][string]$ItemId)
  $escaped = [Uri]::EscapeDataString($ItemId)
  $uri = "https://graph.microsoft.com/v1.0/me/drive/items/$escaped/createLink"
  $body = @{ type = "view"; scope = "anonymous" }
  try {
    $response = Invoke-GraphWithRetry -Method POST -Uri $uri -Body $body
    return $response.link.webUrl
  } catch {
    Write-Warning "No se pudo crear enlace público para el elemento $ItemId. Se conservará el webUrl normal."
    return $null
  }
}

function Find-MaterialRoot {
  param([Parameter(Mandatory=$true)][string]$FolderName)
  $query = [Uri]::EscapeDataString($FolderName)
  $uri = "https://graph.microsoft.com/v1.0/me/drive/root/search(q='$query')?`$top=200&`$select=id,name,size,webUrl,parentReference,folder,file,lastModifiedDateTime"
  $candidates = @(Invoke-GraphPaged -Uri $uri | Where-Object { $_.folder -and $_.name -eq $FolderName })
  if ($candidates.Count -eq 0) { throw "No se encontró una carpeta llamada $FolderName en OneDrive." }

  $expectedSchools = @(
    "Escuela de Administración",
    "Escuela de Ciencias de la Salud",
    "Escuela de Ciencias Jurídicas, Políticas y Sociales",
    "Escuela de Ciencias Tecnológicas",
    "Escuela de Humanidades"
  )
  $ranked = foreach ($candidate in $candidates) {
    $children = @(Get-Children -ItemId $candidate.id)
    $names = @($children | ForEach-Object { $_.name })
    $score = @($expectedSchools | Where-Object { $names -contains $_ }).Count
    [pscustomobject]@{ Candidate = $candidate; Score = $score; ChildCount = $children.Count }
  }
  $best = $ranked | Sort-Object Score,ChildCount -Descending | Select-Object -First 1
  if (-not $best -or $best.Score -lt 3) { throw "Ninguna carpeta coincide con la estructura esperada de Ayuda para el Alumno." }
  return $best.Candidate
}

function Find-ExtraMaterial {
  param(
    [Parameter(Mandatory=$true)][string]$MaterialId,
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][int64]$Size
  )
  $query = [Uri]::EscapeDataString($Name)
  $uri = "https://graph.microsoft.com/v1.0/me/drive/root/search(q='$query')?`$top=200&`$select=id,name,size,webUrl,parentReference,folder,file,lastModifiedDateTime"
  $candidates = @(Invoke-GraphPaged -Uri $uri | Where-Object {
    -not $_.folder -and $_.name -eq $Name -and [int64]$_.size -eq $Size
  })
  if ($candidates.Count -ne 1) {
    return [pscustomobject]@{
      material_id = $MaterialId
      source_name = $Name
      source_size = $Size
      status = if ($candidates.Count -eq 0) { "missing" } else { "ambiguous" }
      id = $null
      parent_id = $null
      name = $null
      size = $null
      mime_type = $null
      web_url = $null
      public_url = $null
    }
  }
  $item = $candidates[0]
  $publicUrl = if ($CreateAnonymousLinks) { Get-PublicLink -ItemId $item.id } else { $null }
  return [pscustomobject]@{
    material_id = $MaterialId
    source_name = $Name
    source_size = $Size
    status = "matched"
    id = $item.id
    parent_id = $item.parentReference.id
    name = $item.name
    size = [int64]$item.size
    mime_type = $item.file.mimeType
    web_url = $item.webUrl
    public_url = $publicUrl
  }
}
function Walk-OneDriveTree {
  param(
    [Parameter(Mandatory=$true)][object]$Item,
    [Parameter(Mandatory=$true)][string]$Path,
    [string]$ParentId = $null
  )
  $kind = if ($Item.folder) { "folder" } else { "file" }
  $publicUrl = $null
  if ($CreateAnonymousLinks) {
    Write-Host "Generando enlace público: $Path"
    $publicUrl = Get-PublicLink -ItemId $Item.id
  }
  $script:Rows.Add([pscustomobject]@{
    id = $Item.id
    parent_id = $ParentId
    name = $Item.name
    path = $Path
    node_type = $kind
    size = if ($null -ne $Item.size) { [int64]$Item.size } else { $null }
    mime_type = if ($Item.file) { $Item.file.mimeType } else { $null }
    last_modified = $Item.lastModifiedDateTime
    web_url = $Item.webUrl
    public_url = $publicUrl
  })
  if ($Item.folder) {
    $children = @(Get-Children -ItemId $Item.id)
    foreach ($child in $children) {
      $childPath = "$Path/$($child.name)"
      Walk-OneDriveTree -Item $child -Path $childPath -ParentId $Item.id
    }
  }
}

Ensure-GraphModule
Write-Host "Iniciando sesión en Microsoft Graph..."
Write-Host "Usá la cuenta Microsoft asociada a Ayuda para el Alumno."
Connect-MgGraph -Scopes "Files.ReadWrite" -UseDeviceCode -ContextScope Process -NoWelcome

try {
  $context = Get-MgContext
  if (-not $context) { throw "No se pudo obtener el contexto de Microsoft Graph." }
  $drive = Invoke-GraphWithRetry -Method GET -Uri "https://graph.microsoft.com/v1.0/me/drive?`$select=id,driveType,webUrl,quota"
  $root = Find-MaterialRoot -FolderName $RootFolderName
  $script:Rows = [System.Collections.Generic.List[object]]::new()
  Walk-OneDriveTree -Item $root -Path $RootFolderName
  $extraSpecs = @(
    @{ material_id = "e15c7497-5bed-4c5e-9164-ce477cdcbaa3"; name = "1° Parcial.pdf"; size = 487781 },
    @{ material_id = "24d3791c-c2fb-40ce-9fc4-02a90ef01b71"; name = "2° Parcial.pdf"; size = 674252 },
    @{ material_id = "8524a3b7-7e20-4601-916d-dd7833f918bf"; name = "Finales.pdf"; size = 319375 },
    @{ material_id = "6fe9fa18-3bf6-4588-b332-b0344a1445d4"; name = "Finales.pdf"; size = 100758 },
    @{ material_id = "630a0eaa-d2ad-4894-887d-086bafae6e6f"; name = "Qmca.Org-Wade7seven Tom.2.pdf"; size = 90672586 },
    @{ material_id = "35ad9894-0e99-4f8f-a235-a42355741ed0"; name = "Quimica Organica Carey 9a Edición.pdf"; size = 54290327 },
    @{ material_id = "5829c6ac-9035-4f88-9ee4-e41bd980e036"; name = "Recuperatorios.pdf"; size = 308177 }
  )
  $extraMaterials = @()
  foreach ($spec in $extraSpecs) {
    $extraMaterials += Find-ExtraMaterial -MaterialId $spec.material_id -Name $spec.name -Size ([int64]$spec.size)
  }
  $payload = [ordered]@{
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    account = $context.Account
    drive_id = $drive.id
    drive_type = $drive.driveType
    drive_web_url = $drive.webUrl
    root_folder_name = $RootFolderName
    root_item_id = $root.id
    anonymous_links_requested = [bool]$CreateAnonymousLinks
    item_count = $Rows.Count
    items = $Rows
    extra_materials = $extraMaterials
  }
  $payload | ConvertTo-Json -Depth 12 | Set-Content -Path $OutputPath -Encoding UTF8
  Write-Host ""
  Write-Host "Inventario terminado."
  Write-Host "Elementos encontrados: $($Rows.Count)"
  Write-Host "Archivo generado: $OutputPath"
} finally {
  Disconnect-MgGraph | Out-Null
}