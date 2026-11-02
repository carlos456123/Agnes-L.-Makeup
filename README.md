# Agnes L. Makeup — Portfólio

Site One Page do portfólio de maquiagem da Agnes Lorena. HTML + CSS + JS puros, sem build e sem framework.

## Estrutura
```
index.html          a página (seções: inicio, sobre, servicos, portfolio, diferencial, pagamento, contato)
css/style.css        mobile-first, com índice no topo
js/config.js          contatos, mensagens do WhatsApp e crédito — edite aqui, não precisa mexer no HTML
js/script.js          comportamento (menu, scrollspy, revelação ao rolar, botão flutuante)
img/fotos/            fotos do portfólio (WebP) — placeholders extraídos do PDF, trocar pelos arquivos originais quando a Agnes tiver
img/textura/          papel de fundo
```

## Como editar
- **Contatos e mensagens do WhatsApp**: tudo em `js/config.js`.
- **Trocar uma foto**: salve o novo arquivo em `img/fotos/` com o mesmo nome (ex. `beauty-1.webp`) e ajuste `width`/`height` no `index.html` se o tamanho mudar.
- **Textos**: diretamente no `index.html`, dentro de cada `<section>`.

## Pontos de atenção (herdados da Etapa 1/2)
- As fotos atuais são as mesmas extraídas do PDF original (resolução entre 500–1200px de largura) — ok para o protótipo, mas para fotos realmente enormes em tela cheia, trocar pelos arquivos originais da câmera quando disponíveis.
- Fontes (Italiana/Lora) carregam do Google Fonts — precisa de internet no navegador de quem visita.
