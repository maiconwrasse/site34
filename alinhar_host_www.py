# -*- coding: utf-8 -*-
# ============================================================
#  alinhar_host_www.py  -  Complexo 34
#  Troca https://complexo34.com.br  ->  https://www.complexo34.com.br
#  em canonical, og:url, og:image, twitter:image e nos JSON-LD
#  (@id, url, item de breadcrumb, parentOrganization).
#  Alvos: index.html da raiz, /restaurante/index.html e todos os
#  index.html dentro de /blog/ (indice + materias).
#  - Ancoras de uma linha; preserva CRLF e grava UTF-8 sem BOM.
#  - Idempotente: rodar de novo nao faz nada.
#  Uso (na raiz do site):  python alinhar_host_www.py
# ============================================================

import io, os

ANTIGO = 'https://complexo34.com.br'
NOVO   = 'https://www.complexo34.com.br'

alvos = []
if os.path.exists('index.html'):
    alvos.append('index.html')
if os.path.exists(os.path.join('restaurante', 'index.html')):
    alvos.append(os.path.join('restaurante', 'index.html'))
for raiz, _dirs, arqs in os.walk('blog'):
    for a in arqs:
        if a == 'index.html':
            alvos.append(os.path.join(raiz, a))

if not alvos:
    raise SystemExit('Nenhum index.html encontrado. Rode este script na RAIZ do site.')

total = 0
for caminho in alvos:
    with io.open(caminho, 'r', encoding='utf-8', newline='') as f:
        bruto = f.read()

    nl = '\r\n' if '\r\n' in bruto else '\n'
    linhas = bruto.split(nl)

    n = 0
    for i, ln in enumerate(linhas):
        # nao mexe em quem ja esta em www
        if ANTIGO in ln and NOVO not in ln:
            linhas[i] = ln.replace(ANTIGO, NOVO)
            n += 1

    if n:
        with io.open(caminho, 'w', encoding='utf-8', newline='') as f:
            f.write(nl.join(linhas))
        print('  OK %s  (%d linhas)' % (caminho, n))
        total += n
    else:
        print('  =  %s  (ja em www)' % caminho)

print('')
print('Concluido. %d linhas reescritas em %d arquivo(s).' % (total, len(alvos)))
