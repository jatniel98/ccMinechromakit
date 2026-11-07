(function () {
  "use strict";

  var root = document.getElementById("app-root");
  var sessionKey = "ccMineChromakitDemoSession";
  var authMode = "login";
  var templates = [
    {
      id: 1,
      title: "TNT Minecraft — Template #01",
      description: "O primeiro template da biblioteca, em vídeo MOV com som incluído.",
      category: "Minecraft / TNT / Green screen",
      priceType: "free",
      priceLabel: "Grátis",
      file: "assets/1107.mov",
      preview: "assets/1107-preview.mp4",
      audioIncluded: true,
      duration: "2,42 s",
      dimensions: "4094 × 2160 px",
      aspectRatio: "≈1,90:1",
      fileSize: "929 753 B",
      frameRate: "60 fps"
    }
  ];

  function readCookie(name) {
    var prefix = encodeURIComponent(name) + "=";
    try {
      var parts = document.cookie ? document.cookie.split(";") : [];
      for (var i = 0; i < parts.length; i += 1) {
        var part = parts[i].trim();
        if (part.indexOf(prefix) === 0) return decodeURIComponent(part.slice(prefix.length));
      }
    } catch (error) {
      return "";
    }
    return "";
  }

  function getRemembered() {
    var raw = readCookie("ccMineChromakitRemember");
    if (!raw) {
      try {
        raw = window.localStorage.getItem("ccMineChromakitRememberFallback") || "";
      } catch (error) {
        raw = "";
      }
    }
    if (!raw) return null;
    try {
      var record = JSON.parse(raw);
      if (record && record.email && record.expires > Date.now()) return record;
    } catch (error) {
      // Um valor inválido não inicia uma sessão.
    }
    clearRemembered();
    return null;
  }

  function saveRemembered(email) {
    var record = JSON.stringify({ email: email, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 });
    var cookieValue = encodeURIComponent(record);
    try {
      document.cookie = "ccMineChromakitRemember=" + cookieValue + "; Max-Age=2592000; Path=/; SameSite=Lax";
      if (readCookie("ccMineChromakitRemember") === record) return true;
    } catch (error) {
      // Usa o armazenamento local apenas quando a pré-visualização file:// não aceita cookies.
    }
    try {
      window.localStorage.setItem("ccMineChromakitRememberFallback", record);
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearRemembered() {
    try {
      document.cookie = "ccMineChromakitRemember=; Max-Age=0; Path=/; SameSite=Lax";
    } catch (error) {
      // O cookie pode não estar disponível em file://.
    }
    try {
      window.localStorage.removeItem("ccMineChromakitRememberFallback");
    } catch (error) {
      // O armazenamento local pode não estar disponível.
    }
  }

  function hasSession() {
    var temporarySession = false;
    try {
      temporarySession = window.sessionStorage.getItem(sessionKey) === "active";
    } catch (error) {
      temporarySession = false;
    }
    return temporarySession || Boolean(getRemembered());
  }

  function startDemoSession(email, remember) {
    if (remember) return saveRemembered(email);
    clearRemembered();
    try {
      window.sessionStorage.setItem(sessionKey, "active");
      return true;
    } catch (error) {
      return false;
    }
  }

  function endDemoSession() {
    clearRemembered();
    try {
      window.sessionStorage.removeItem(sessionKey);
    } catch (error) {
      // A sessão desta página termina ao recarregar se o armazenamento estiver indisponível.
    }
  }

  function getTemplate(id) {
    return templates.filter(function (item) {
      return String(item.id) === String(id);
    })[0];
  }

  function coverMarkup(template) {
    return '<div class="video-stage">' +
      '<video class="cover-video" data-cover-video autoplay muted loop playsinline preload="metadata" aria-label="Prévia em vídeo de ' + template.title + '">' +
        '<source src="' + template.preview + '" type="video/mp4">' +
        'Este navegador não conseguiu reproduzir a prévia MP4.' +
      '</video>' +
      '<span class="play-indicator"><span aria-hidden="true">▶</span> Prévia em loop · sem som</span>' +
      '<button class="video-fallback" type="button" data-video-play hidden aria-label="Tentar reproduzir a prévia em vídeo">▶ Reproduzir prévia</button>' +
      '<p class="video-status" data-video-status role="status">O som está disponível ao abrir o template.</p>' +
      '</div>';
  }

  function metadataMarkup(template) {
    var items = [
      template.duration,
      template.dimensions,
      template.aspectRatio,
      template.fileSize,
      template.frameRate,
      template.audioIncluded ? "Som incluído" : ""
    ];
    return '<ul class="spec-list" aria-label="Dados confirmados do ficheiro">' +
      items.filter(Boolean).map(function (item) {
        return '<li>' + item + '</li>';
      }).join("") +
      '</ul>';
  }

  function renderLogin() {
    var isRegister = authMode === "register";
    var formTitle = isRegister ? "Criar conta" : "Iniciar sessão";
    var switchText = isRegister ? "Já tens conta? Iniciar sessão" : "Ainda não tens conta? Criar conta";
    var switchMode = isRegister ? "login" : "register";
    root.innerHTML =
      '<a class="skip-link" href="#auth-form">Saltar para a entrada</a>' +
      '<main class="auth-page">' +
        '<section class="auth-story" aria-labelledby="auth-story-heading">' +
          '<a class="brand brand-large" href="#/login" aria-label="ccMineChromakit">' +
            '<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>' +
            '<span>ccMine<span class="brand-accent">Chromakit</span></span>' +
          '</a>' +
          '<div class="auth-story-copy">' +
            '<p class="eyebrow"><span class="eyebrow-dot"></span> Templates de Minecraft em green screen</p>' +
            '<h1 id="auth-story-heading">Cria. Edita.<br><span>Dá cor.</span></h1>' +
            '<p>Entra para explorar efeitos e templates editados pelo autor. Grátis nesta fase.</p>' +
          '</div>' +
          '<figure class="auth-art">' +
            '<img src="assets/tnt-reference.jpg" alt="Bloco TNT sobre relva e céu azul, usado como detalhe visual do projeto." width="596" height="335">' +
            '<figcaption><span class="caption-square">cc</span><span>Um projeto independente<br><strong>em construção criativa</strong></span></figcaption>' +
          '</figure>' +
          '<p class="independent-note">Projeto não oficial e sem afiliação com Mojang ou Microsoft.</p>' +
        '</section>' +
        '<section class="auth-side" aria-labelledby="auth-title">' +
          '<div class="auth-card">' +
            '<p class="eyebrow"><span class="eyebrow-dot"></span> Acesso ao protótipo</p>' +
            '<h2 id="auth-title">' + formTitle + '</h2>' +
            '<p class="auth-description">A biblioteca e a página do template só aparecem depois de iniciares uma sessão nesta aba.</p>' +
            '<form id="auth-form" novalidate>' +
              '<label for="email">E-mail</label>' +
              '<input id="email" name="email" type="email" autocomplete="email" required placeholder="nome@exemplo.com">' +
              '<label for="password">Palavra-passe</label>' +
              '<input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required placeholder="Pelo menos 8 caracteres">' +
              '<label class="remember-setting" for="remember-me"><input id="remember-me" type="checkbox"><span><strong>Lembrar-me neste dispositivo</strong><small>Manter sessão e e-mail por até 30 dias.</small></span></label>' +
              '<p class="form-error" id="form-error" role="alert" hidden></p>' +
              '<button class="button button-primary auth-submit" type="submit">' + formTitle + '<span aria-hidden="true">→</span></button>' +
              '<button class="mode-switch" type="button" data-auth-mode="' + switchMode + '">' + switchText + '</button>' +
            '</form>' +
            '<aside class="demo-notice" aria-label="Limites da autenticação de demonstração">' +
              '<strong>Modo de demonstração local</strong>' +
              '<p>Usa um e-mail válido e uma palavra-passe fictícia com pelo menos 8 caracteres. Não uses uma palavra-passe real. Não há conta real nem servidor de autenticação: a palavra-passe não é guardada. Se assinalares a opção, só o e-mail e um sinal de sessão ficam neste dispositivo por até 30 dias; sem a opção, a sessão termina quando fechares a aba.</p>' +
            '</aside>' +
          '</div>' +
        '</section>' +
      '</main>';

    var form = document.getElementById("auth-form");
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var errorBox = document.getElementById("form-error");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      errorBox.hidden = true;
      errorBox.textContent = "";

      var email = emailInput.value.trim();
      var password = passwordInput.value;
      if (!email || !emailInput.validity.valid) {
        errorBox.textContent = "Escreve um endereço de e-mail válido.";
        emailInput.focus();
        errorBox.hidden = false;
        return;
      }
      if (password.length < 8) {
        errorBox.textContent = "A palavra-passe de demonstração precisa de pelo menos 8 caracteres.";
        passwordInput.focus();
        errorBox.hidden = false;
        return;
      }
      var remember = document.getElementById("remember-me").checked;
      if (!startDemoSession(email, remember)) {
        errorBox.textContent = "Não foi possível iniciar a sessão temporária neste navegador.";
        errorBox.hidden = false;
        return;
      }
      window.location.hash = "#/home";
    });

    root.querySelector("[data-auth-mode]").addEventListener("click", function () {
      authMode = this.getAttribute("data-auth-mode");
      renderLogin();
      document.getElementById("email").focus();
    });
  }

  function shell(content, active, pageTitle) {
    root.innerHTML =
      '<a class="skip-link" href="#main-content">Saltar para o conteúdo</a>' +
      '<header class="site-header">' +
        '<div class="nav-wrap">' +
          '<a class="brand" href="#/home" aria-label="ccMineChromakit, início">' +
            '<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>' +
            '<span>ccMine<span class="brand-accent">Chromakit</span></span>' +
          '</a>' +
          '<nav class="main-nav" aria-label="Navegação principal">' +
            '<a class="' + (active === "home" ? "active" : "") + '" href="#/home">Início</a>' +
            '<a class="' + (active === "templates" || active === "template" ? "active" : "") + '" href="#/templates">Templates</a>' +
            '<a class="' + (active === "how" ? "active" : "") + '" href="#/how">Como usar</a>' +
          '</nav>' +
          '<div class="account-actions"><span class="remembered-email" id="remembered-email" hidden></span><span class="demo-chip">DEMO · LOCAL</span><button class="logout-button" id="logout-button" type="button">Terminar sessão</button></div>' +
        '</div>' +
        '<p class="session-note">Sessão temporária desta aba. Esta demonstração não é autenticação real.</p>' +
      '</header>' +
      '<main id="main-content" class="page-main" aria-label="' + pageTitle + '">' + content + '</main>' +
      '<footer class="site-footer">' +
        '<div class="footer-main section-wrap">' +
          '<a class="brand footer-brand" href="#/home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>ccMine<span class="brand-accent">Chromakit</span></span></a>' +
          '<p>Pequenos efeitos. Novas ideias.</p>' +
          '<nav class="footer-nav" aria-label="Links do rodapé">' +
            '<a href="#/about">Sobre</a><a href="#/contact">Contacto</a><a href="#/terms">Termos</a><a href="#/cookies">Cookies</a>' +
          '</nav>' +
        '</div>' +
        '<div class="footer-bottom section-wrap">' +
          '<span>© ' + new Date().getFullYear() + ' ccMineChromakit</span>' +
          '<span>Projeto independente · Não oficial</span>' +
        '</div>' +
      '</footer>';

    var remembered = getRemembered();
    var rememberedNode = document.getElementById("remembered-email");
    if (remembered && rememberedNode) {
      rememberedNode.textContent = remembered.email;
      rememberedNode.hidden = false;
    }
    document.getElementById("logout-button").addEventListener("click", function () {
      endDemoSession();
      authMode = "login";
      window.location.hash = "#/login";
    });
    initializeCoverVideos();
  }

  function renderHome() {
    var template = templates[0];
    shell(
      '<section class="hero section-wrap" id="inicio">' +
        '<div class="hero-copy">' +
          '<p class="eyebrow"><span class="eyebrow-dot"></span> Templates independentes · Grátis nesta fase</p>' +
          '<h1>Templates de Minecraft <span>para os teus vídeos.</span></h1>' +
          '<p class="hero-lead">Efeitos em green screen, editados por mim. O primeiro template já está disponível, com som incluído.</p>' +
          '<div class="hero-actions"><a class="button button-primary" href="#/templates">Ver templates <span aria-hidden="true">↘</span></a><a class="text-link" href="#/how">Como usar <span aria-hidden="true">→</span></a></div>' +
          '<p class="hero-note"><span class="pixel-spark" aria-hidden="true">✦</span> Um projeto independente, feito ao seu ritmo.</p>' +
        '</div>' +
        '<div class="featured-cover">' +
          '<div class="cover-heading"><span class="cover-label">PRIMEIRO TEMPLATE</span><span class="free-pill">GRÁTIS</span></div>' +
          coverMarkup(template) +
          '<div class="cover-meta"><div><span class="caption-index">01</span><span><strong>' + template.title + '</strong><small>' + template.category + '</small></span></div><a class="text-link" href="#/template/1">Abrir template <span aria-hidden="true">↗</span></a></div>' +
          '<p class="sound-note">Som incluído · disponível no leitor do template.</p>' +
        '</div>' +
      '</section>' +
      '<section class="library section-wrap" id="templates" aria-labelledby="templates-heading">' +
        '<div class="section-heading"><div><p class="eyebrow"><span class="eyebrow-dot"></span> A biblioteca</p><h2 id="templates-heading">O primeiro está aqui.</h2></div><p class="section-intro">Um template disponível, apresentado sem avaliações ou contagens inventadas.</p></div>' +
        '<article class="recent-row"><div><span class="card-kicker">Template #01 <span class="free-pill">Grátis</span></span><h3>' + template.title + '</h3><p>' + template.category + ' · Som incluído</p></div><a class="button button-secondary" href="#/template/1">Ver detalhes <span aria-hidden="true">→</span></a></article>' +
      '</section>' +
      '<section class="home-how how-section" id="como-usar" aria-labelledby="how-heading">' +
        '<div class="section-wrap how-inner"><div class="how-copy"><p class="eyebrow"><span class="eyebrow-dot"></span> Do download à edição</p><h2 id="how-heading">Como usar<br><span>green screen.</span></h2><p>Os nomes das ferramentas e a ordem dos passos podem variar conforme o editor e a versão.</p><a class="dark-link" href="#/how">Ver os passos <span aria-hidden="true">→</span></a></div>' +
        '<ol class="steps"><li><span class="step-number">01</span><span><strong>Inicia sessão</strong><small>Entra no protótipo para abrir a biblioteca.</small></span></li><li><span class="step-number">02</span><span><strong>Abre e descarrega</strong><small>Escolhe o template e guarda o ficheiro original.</small></span></li><li><span class="step-number">03</span><span><strong>Importa para o editor</strong><small>Adiciona o vídeo ao teu projeto.</small></span></li><li><span class="step-number">04</span><span><strong>Remove o verde</strong><small>Usa chroma key e ajusta o recorte.</small></span></li><li><span class="step-number">05</span><span><strong>Ajusta vídeo e som</strong><small>Revê o resultado conforme as opções do editor.</small></span></li></ol></div>' +
      '</section>' +
      '<section class="independent section-wrap"><span class="pixel-spark" aria-hidden="true">✳</span><p>ccMineChromakit é um projeto independente, não oficial e sem afiliação com Mojang ou Microsoft.</p></section>',
      "home",
      "Início"
    );
  }

  function renderTemplateCard(template) {
    return '<article class="template-card">' +
      '<div class="template-cover">' +
        '<div class="cover-heading"><span class="cover-label">TEMPLATE #01</span><span class="free-pill">GRÁTIS</span></div>' +
        coverMarkup(template) +
      '</div>' +
      '<div class="card-content">' +
        '<p class="card-kicker">' + template.category + '</p>' +
        '<h2>' + template.title + '</h2>' +
        '<p class="card-description">' + template.description + '</p>' +
        '<p class="sound-note">Som incluído · disponível no leitor do template.</p>' +
        '<a class="button button-primary" href="#/template/' + template.id + '">Abrir template <span aria-hidden="true">→</span></a>' +
      '</div>' +
    '</article>';
  }

  function renderLibrary() {
    shell(
      '<section class="subpage section-wrap" aria-labelledby="library-title">' +
        '<p class="eyebrow"><span class="eyebrow-dot"></span> A biblioteca</p>' +
        '<div class="section-heading"><h1 id="library-title">Templates</h1><p class="section-intro">Apenas o ficheiro fornecido está listado. A estrutura pode crescer com novos templates e opções gratuitas ou pagas.</p></div>' +
        renderTemplateCard(templates[0]) +
      '</section>',
      "templates",
      "Biblioteca de templates"
    );
  }

  function renderDetail(template) {
    var details = [
      ["Duração", template.duration],
      ["Dimensões", template.dimensions],
      ["Proporção", template.aspectRatio],
      ["Tamanho", template.fileSize],
      ["Fotogramas", template.frameRate],
      ["Som", template.audioIncluded ? "Incluído" : "Não confirmado"]
    ];
    shell(
      '<section class="detail-page section-wrap" aria-labelledby="detail-title">' +
        '<a class="back-link" href="#/templates">← Voltar aos templates</a>' +
        '<div class="detail-grid">' +
          '<div class="detail-player">' +
            '<div class="cover-heading"><span class="cover-label">PRÉ-VISUALIZAÇÃO</span><span class="free-pill">GRÁTIS</span></div>' +
            '<video class="detail-video" controls preload="metadata" playsinline aria-label="Leitor de ' + template.title + '">' +
              '<source src="' + template.preview + '" type="video/mp4">' +
              'Este navegador não conseguiu reproduzir a prévia MP4. Descarrega o ficheiro original.' +
            '</video>' +
            '<p class="video-hint" data-detail-status role="status">Carrega em reproduzir para ver e ouvir o vídeo.</p>' +
          '</div>' +
          '<div class="detail-copy">' +
            '<p class="eyebrow"><span class="eyebrow-dot"></span> ' + template.category + '</p>' +
            '<h1 id="detail-title">' + template.title + '</h1>' +
            '<p class="card-description">' + template.description + ' O som toca apenas quando carregas em reproduzir.</p>' +
            '<a class="button button-primary download-button" href="' + template.file + '" download="1107.mov">Descarregar grátis <span aria-hidden="true">↓</span></a>' +
            '<p class="file-note">Ficheiro original · MOV</p>' +
            '<h2 class="spec-heading">Dados do ficheiro</h2>' +
            '<dl class="detail-specs">' + details.map(function (item) { return '<div><dt>' + item[0] + '</dt><dd>' + item[1] + '</dd></div>'; }).join("") + '</dl>' +
          '</div>' +
        '</div>' +
      '</section>',
      "template",
      template.title
    );
    var detailVideo = document.querySelector(".detail-video");
    if (detailVideo) {
      detailVideo.addEventListener("error", function () {
        var status = document.querySelector("[data-detail-status]");
        if (status) status.textContent = "Este navegador não abriu a prévia MOV. Podes descarregar o ficheiro original.";
      });
    }
  }

  function renderHow() {
    shell(
      '<section class="subpage section-wrap how-page" aria-labelledby="how-title">' +
        '<p class="eyebrow"><span class="eyebrow-dot"></span> Guia rápido</p><h1 id="how-title">Como usar o template.</h1>' +
        '<p class="section-intro">Os passos podem variar entre editores e versões.</p>' +
        '<ol class="steps steps-large"><li><span class="step-number">01</span><span><strong>Inicia sessão</strong><small>Entra na demonstração para abrir a biblioteca.</small></span></li><li><span class="step-number">02</span><span><strong>Abre e descarrega o template</strong><small>Na página do TNT, usa “Descarregar grátis”.</small></span></li><li><span class="step-number">03</span><span><strong>Importa o vídeo para o editor</strong><small>Adiciona o ficheiro MOV ao teu projeto.</small></span></li><li><span class="step-number">04</span><span><strong>Usa chroma key</strong><small>Aplica a ferramenta para remover o fundo verde e ajusta o recorte.</small></span></li><li><span class="step-number">05</span><span><strong>Ajusta vídeo e som</strong><small>O áudio está incluído no ficheiro; ativa-o e ajusta-o conforme o editor permitir.</small></span></li></ol>' +
      '</section>',
      "how",
      "Como usar"
    );
  }

  function renderInfo(kind) {
    var content = "";
    var title = "";
    if (kind === "about") {
      title = "Sobre";
      content = '<p>ccMineChromakit é um projeto independente com templates de Minecraft em green screen editados pelo autor.</p><p class="independent-note">Não oficial e sem afiliação com Mojang ou Microsoft.</p><img class="about-image" src="assets/tnt-reference.jpg" alt="Bloco TNT usado como detalhe visual do projeto." width="596" height="335">';
    } else if (kind === "contact") {
      title = "Contacto";
      content = '<p>Não foi indicado um endereço de contacto para este protótipo.</p>';
    } else {
      title = "Termos";
      content = '<p>O preço indicado para o template atual é grátis nesta fase. A licença de utilização não foi especificada; confirma as condições com o autor antes de reutilizar ou redistribuir o ficheiro.</p>';
    }
    shell(
      '<section class="subpage section-wrap info-page" aria-labelledby="info-title"><p class="eyebrow"><span class="eyebrow-dot"></span> ccMineChromakit</p><h1 id="info-title">' + title + '</h1>' + content + '<a class="text-link" href="#/home">Voltar ao início <span aria-hidden="true">→</span></a></section>',
      "",
      title
    );
  }

  function renderCookieSettings() {
    var remembered = getRemembered();
    shell(
      '<section class="subpage section-wrap info-page cookie-page" aria-labelledby="cookie-title">' +
        '<p class="eyebrow"><span class="eyebrow-dot"></span> Preferências locais</p>' +
        '<h1 id="cookie-title">Cookies e sessão.</h1>' +
        '<p>“Lembrar-me neste dispositivo” guarda o e-mail e um sinal de sessão de demonstração durante até 30 dias. A palavra-passe nunca é guardada. Se cookies não estiverem disponíveis na pré-visualização local, o navegador usa o armazenamento local como alternativa.</p>' +
        '<p class="cookie-state" id="cookie-state" role="status"></p>' +
        '<p class="demo-notice-text">Este dado local é editável pelo utilizador e não é um token seguro. A sessão não valida a identidade e não deve ser usada para proteger conteúdo real.</p>' +
        '<button class="button button-secondary" id="forget-cookie" type="button">Apagar dados lembrados e terminar sessão</button>' +
      '</section>',
      "",
      "Cookies"
    );
    var state = document.getElementById("cookie-state");
    if (state) state.textContent = remembered ? "E-mail lembrado neste dispositivo: " + remembered.email : "Não há e-mail lembrado neste dispositivo.";
    document.getElementById("forget-cookie").addEventListener("click", function () {
      endDemoSession();
      window.location.hash = "#/login";
    });
  }

  function initializeCoverVideos() {
    document.querySelectorAll("[data-cover-video]").forEach(function (video) {
      var fallback = video.parentElement.querySelector("[data-video-play]");
      var status = video.parentElement.querySelector("[data-video-status]");
      function showFallback(message) {
        if (fallback) fallback.hidden = false;
        if (status && message) status.textContent = message;
      }
      video.addEventListener("playing", function () {
        if (fallback) fallback.hidden = true;
        if (status) status.textContent = "A prévia está em loop e sem som. Abre o template para ouvir.";
      });
      video.addEventListener("error", function () {
        showFallback("A prévia MP4 não abriu neste navegador. O ficheiro original continua disponível para descarregar.");
      });
      if (fallback) {
        fallback.addEventListener("click", function () {
          video.muted = true;
          var attempt;
          try {
            attempt = video.play();
          } catch (error) {
            showFallback("Não foi possível iniciar esta prévia neste navegador.");
            return;
          }
          if (attempt && typeof attempt.catch === "function") {
            attempt.then(function () {
              fallback.hidden = true;
            }).catch(function () {
              showFallback("Não foi possível iniciar esta prévia neste navegador. Abre o template para tentar no leitor.");
            });
          }
        });
      }
      try {
        var playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(function () {
            showFallback("A reprodução automática não iniciou. Carrega no botão para tentar reproduzir.");
          });
        }
      } catch (error) {
        showFallback("A reprodução automática não iniciou. Carrega no botão para tentar reproduzir.");
      }
    });
  }

  function currentPath() {
    return window.location.hash.replace(/^#\/?/, "").split("?")[0];
  }

  function route() {
    var path = currentPath();
    if (!hasSession()) {
      if (path !== "login") window.location.hash = "#/login";
      renderLogin();
      return;
    }
    if (!path || path === "login") {
      if (path !== "home") window.location.hash = "#/home";
      renderHome();
      return;
    }
    if (path === "home") {
      renderHome();
    } else if (path === "templates") {
      renderLibrary();
    } else if (path === "how") {
      renderHow();
    } else if (path === "about" || path === "contact" || path === "terms") {
      renderInfo(path);
    } else if (path === "cookies") {
      renderCookieSettings();
    } else if (path.indexOf("template/") === 0) {
      var id = path.split("/")[1];
      var template = getTemplate(id);
      if (template) renderDetail(template);
      else renderHome();
    } else {
      renderHome();
    }
  }

  window.addEventListener("hashchange", route);
  route();
}());
