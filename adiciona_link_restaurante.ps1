# ============================================================
#  adiciona_link_restaurante.ps1  -  Complexo 34
#  Insere o link "Restaurante" (-> /restaurante/) na navbar
#  e no menu mobile da HOME (index.html da raiz).
#  - Ancoras de uma linha, script 100% ASCII (usa .*? no lugar
#    de "Inicio") para nao ter problema de acento no PowerShell.
#  - Idempotente: nao duplica se o link ja existir.
#  - Preserva o CRLF/codificacao (grava UTF-8 sem BOM).
#  Rodar na RAIZ do site:
#    powershell -ExecutionPolicy Bypass -File .\adiciona_link_restaurante.ps1
# ============================================================

$ErrorActionPreference = 'Stop'
$file = 'index.html'

if (-not (Test-Path $file)) {
    Write-Error "index.html nao encontrado. Rode este script na raiz do site."
    exit 1
}

$raw = [System.IO.File]::ReadAllText($file)

if ($raw -match 'href="/restaurante/"') {
    Write-Host "Link do restaurante ja existe na home. Nada a fazer."
    exit 0
}

$before = $raw
$nl = "`r`n"

# 1) NAVBAR (desktop) - insere logo apos o item "Inicio"
$reNav = [regex]'(<li><a href="#inicio">.*?</a></li>)'
$raw = $reNav.Replace($raw, ('$1' + $nl + '    <li><a href="/restaurante/">Restaurante</a></li>'), 1)

# 2) MENU MOBILE - insere logo apos o link "Inicio"
$reMob = [regex]'(<a href="#inicio"\s+onclick="closeMenu\(\)">.*?</a>)'
$raw = $reMob.Replace($raw, ('$1' + $nl + '  <a href="/restaurante/" onclick="closeMenu()">Restaurante</a>'), 1)

if ($raw -eq $before) {
    Write-Error "Nenhuma ancora encontrada (navbar/menu mobile). Nada foi alterado."
    exit 1
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $raw, $utf8NoBom)

Write-Host "OK: link 'Restaurante' adicionado na navbar e no menu mobile da home."