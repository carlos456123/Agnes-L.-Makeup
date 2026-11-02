(function () {
  "use strict";
  var cfg = window.AGNES_CONFIG || {};
  var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Contatos vindos do config.js */
  function aplicarContatos() {
    var msgPadrao = encodeURIComponent(cfg.mensagemPadrao || "");
    var msgOrc = encodeURIComponent(cfg.mensagemOrcamento || "");
    var wa = (cfg.contatos && cfg.contatos.whatsapp) || "";

    document.querySelectorAll('[data-contato="whatsapp"]').forEach(function (el) {
      var msg = el.hasAttribute("data-msg-orcamento") ? msgOrc : msgPadrao;
      el.href = "https://wa.me/" + wa + "?text=" + msg;
    });
    document.querySelectorAll('[data-contato-texto="whatsapp"]').forEach(function (el) {
      el.textContent = (cfg.contatos && cfg.contatos.whatsappExibicao) || "";
    });
    document.querySelectorAll('[data-contato="email"]').forEach(function (el) {
      el.href = "mailto:" + ((cfg.contatos && cfg.contatos.email) || "");
    });
    document.querySelectorAll('[data-contato-texto="email"]').forEach(function (el) {
      el.textContent = (cfg.contatos && cfg.contatos.email) || "";
    });
    document.querySelectorAll('[data-contato="instagram"]').forEach(function (el) {
      el.href = "https://instagram.com/" + ((cfg.contatos && cfg.contatos.instagram) || "");
    });
    document.querySelectorAll('[data-contato-texto="instagram"]').forEach(function (el) {
      el.textContent = "@" + ((cfg.contatos && cfg.contatos.instagram) || "");
    });
    document.querySelectorAll("[data-regiao]").forEach(function (el) {
      el.textContent = cfg.regiaoAtendimento || "";
    });
    document.querySelectorAll("[data-ano]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
    document.querySelectorAll("[data-credito-nome]").forEach(function (el) {
      var nome = (cfg.credito && cfg.credito.nome) || "";
      var link = (cfg.credito && cfg.credito.link) || "";
      if (link) {
        el.innerHTML = 'Site criado por <a class="rodape__credito-link" href="' + link + '" target="_blank" rel="noopener">' + nome + "</a>";
      } else {
        el.textContent = "Site criado por " + nome;
      }
    });
  }

  /* copiar texto (fallback para contextos sem clipboard API) */
  function copiarTexto(t) {
    function antigo() {
      return new Promise(function (ok, erro) {
        var c = document.createElement("textarea");
        c.value = t;
        c.setAttribute("readonly", "");
        c.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(c);
        c.select();
        var deu = false;
        try { deu = document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(c);
        deu ? ok() : erro();
      });
    }
    return navigator.clipboard && isSecureContext ? navigator.clipboard.writeText(t).catch(antigo) : antigo();
  }
  document.querySelectorAll("[data-copiar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tipo = btn.getAttribute("data-copiar");
      var valor = tipo === "whatsapp" ? (cfg.contatos && cfg.contatos.whatsappExibicao) : (cfg.contatos && cfg.contatos.email);
      var original = btn.textContent;
      copiarTexto(valor || "").then(function () {
        btn.textContent = "Copiado!";
        setTimeout(function () { btn.textContent = original; }, 1800);
      });
    });
  });

  /* 2. Menu */
  var topo = document.querySelector(".topo");
  var botaoMenu = document.querySelector(".menu-botao");
  var menu = document.querySelector("#menu");

  function abrirMenu(abrir) {
    if (!botaoMenu) return;
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    var rotulo = botaoMenu.querySelector(".visualmente-oculto");
    if (rotulo) rotulo.textContent = abrir ? "Fechar menu" : "Abrir menu";
    document.body.classList.toggle("menu-aberto", abrir);
  }
  if (botaoMenu) {
    botaoMenu.addEventListener("click", function () {
      abrirMenu(botaoMenu.getAttribute("aria-expanded") !== "true");
    });
  }
  if (menu) {
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) abrirMenu(false);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-aberto")) {
      abrirMenu(false);
      botaoMenu && botaoMenu.focus();
    }
  });

  function aoRolar() {
    if (topo) topo.classList.toggle("topo--rolado", scrollY > 40);
  }
  addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  /* 3. Scrollspy */
  var linksMenu = document.querySelectorAll(".menu__lista a[href^='#']");
  var secoesObservadas = [];
  linksMenu.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var secao = document.getElementById(id);
    if (secao) secoesObservadas.push({ secao: secao, link: link });
  });
  if ("IntersectionObserver" in window && secoesObservadas.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var item = secoesObservadas.find(function (s) { return s.secao === entry.target; });
          if (!item) return;
          if (entry.isIntersecting) {
            secoesObservadas.forEach(function (s) {
              s.link.classList.remove("ativo");
              s.link.removeAttribute("aria-current");
            });
            item.link.classList.add("ativo");
            item.link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secoesObservadas.forEach(function (s) { spy.observe(s.secao); });
  }

  /* 4. Revelação ao rolar */
  function iniciarRevelacao() {
    var itens = document.querySelectorAll(".revela");
    if (reduz || !("IntersectionObserver" in window) || !itens.length) return;
    document.documentElement.classList.add("anima");
    itens.forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) el.classList.add("visivel");
    });
    var obs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visivel");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    itens.forEach(function (el) {
      if (!el.classList.contains("visivel")) obs.observe(el);
    });
  }
  iniciarRevelacao();

  /* 5. Botão flutuante */
  var fab = document.querySelector(".fab");
  if (fab) {
    var inicioEl = document.getElementById("servicos");
    var fimEl = document.getElementById("contato");
    var visivelInicio = false, visivelFim = false;
    function atualizarFab() {
      fab.classList.toggle("fab--visivel", visivelInicio && !visivelFim);
    }
    if ("IntersectionObserver" in window) {
      if (inicioEl) {
        new IntersectionObserver(function (entries) {
          visivelInicio = entries[0].boundingClientRect.top < innerHeight;
          atualizarFab();
        }).observe(inicioEl);
      }
      if (fimEl) {
        new IntersectionObserver(function (entries) {
          visivelFim = entries[0].isIntersecting;
          atualizarFab();
        }).observe(fimEl);
      }
    }
  }

  /* 6. Parallax leve nas formas de canto e na letra gigante */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!reduz && parallaxEls.length && innerWidth >= 768) {
    var tique = false;
    function aplicarParallax() {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        var fator = parseFloat(el.getAttribute("data-parallax")) || 0.08;
        var d = Math.max(-30, Math.min(30, (r.top + r.height / 2 - innerHeight / 2) * fator));
        el.style.translate = "0 " + d.toFixed(1) + "px";
      });
      tique = false;
    }
    addEventListener(
      "scroll",
      function () {
        if (!tique) {
          tique = true;
          requestAnimationFrame(aplicarParallax);
        }
      },
      { passive: true }
    );
    aplicarParallax();
  }

  aplicarContatos();
})();
