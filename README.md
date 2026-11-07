# ccMineChromakit

Protótipo estático, responsivo e sem dependências externas para apresentar templates de Minecraft em green screen.

## Abrir

Abre index.html num navegador com JavaScript ativo.

## Início de sessão e cookies

Não existe backend de autenticação neste projeto. O ecrã aceita um e-mail válido e uma palavra-passe fictícia com pelo menos 8 caracteres. A palavra-passe nunca é gravada.

A opção “Lembrar-me neste dispositivo” é voluntária. Se marcada, guarda apenas o e-mail e um sinal de sessão de demonstração durante até 30 dias, num cookie SameSite=Lax ou, se o navegador não aceitar cookies na pré-visualização file://, no armazenamento local. A sessão não confirma a identidade nem é segura. Não uses uma palavra-passe verdadeira. Terminar sessão apaga os dados lembrados.

A proteção das rotas é feita no JavaScript do navegador. Como os ficheiros são estáticos, o endereço direto dos vídeos continua tecnicamente acessível a quem o conhecer. Isto é uma demonstração de interface, não controlo de acesso.

## Recursos

- assets/1107.mov — ficheiro original para descarregar.
- assets/1107-preview.mp4 — prévia H.264/AAC para o navegador.
- assets/tnt-reference.jpg — detalhe visual secundário.
- app.js — dados dos templates, rotas e sessão local de demonstração.
- styles.css — apresentação responsiva.

## Para autenticação real

Liga o site a um serviço de autenticação com sessões entre dispositivos. O servidor deve validar cada página e download e definir cookies de sessão HttpOnly, Secure e SameSite. Nunca guardes palavras-passe em texto simples; o cookie local desta demonstração não substitui autenticação real.
