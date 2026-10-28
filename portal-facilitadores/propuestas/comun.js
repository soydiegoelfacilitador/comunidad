  /* Piezas comunes: escapar texto, avatar, íconos y la ventana de perfil. */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function initials(n) { var p = n.trim().split(/\s+/); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
  function avatar(p, size) {
    var st = 'style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size / 2.8) + 'px"';
    if (p.foto) return '<span class="avatar" ' + st + '><img src="' + esc(p.foto) + '" alt="Foto de ' + esc(p.nombre) + '" loading="lazy"></span>';
    return '<span class="avatar" ' + st + ' aria-hidden="true">' + esc(initials(p.nombre)) + "</span>";
  }
  var ICON = {
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#165dfc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
    linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>',
    whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0c0c0c" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  function waUrl(p) {
    if (p.whatsapp === "demo") return "#";
    var n = String(p.whatsapp || "").replace(/\D/g, "");
    var msg = encodeURIComponent("Hola " + p.nombre.split(" ")[0] + ", vi tu perfil en el Portal de Partners de la Escuela de Facilitadores y quiero conversar.");
    return n ? "https://wa.me/" + n + "?text=" + msg : "";
  }
  function tags(list) { return '<ul class="tags">' + (list || []).map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>"; }
  function certs(list) { return '<ul class="certs">' + (list || []).map(function (c) { return "<li>" + ICON.check + "<span>" + esc(c[0]) + (c[1] ? " <small>· " + esc(c[1]) + "</small>" : "") + "</span></li>"; }).join("") + "</ul>"; }
  function contactButtons(p) {
    var h = "";
    var wa = waUrl(p);
    if (wa) h += '<a class="bpill" href="' + wa + '" target="_blank" rel="noopener">' + ICON.whatsapp + "Escribir por WhatsApp</a>";
    if (p.linkedin) h += '<a class="bpill bpill--ghost" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">' + ICON.linkedin + "LinkedIn</a>";
    (p.links || []).forEach(function (l) { h += '<a class="bpill bpill--ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + ICON.link + esc(l.label) + "</a>"; });
    return h;
  }
  function profileHTML(p, idp) {
    return '<div class="prof">' +
      '<div class="prof__top">' + avatar(p, 120) + "<div>" + (p.especialidad ? '<span class="tag-main">' + esc(p.especialidad) + "</span>" : "") +
        '<h3 id="' + idp + '" style="margin-top:10px">' + esc(p.nombre) + "</h3>" + (p.cargo ? '<p class="prof__role">' + esc(p.cargo) + "</p>" : "") +
        (p.ciudad ? '<p class="prof__place">' + esc(p.ciudad) + (p.pais ? " · " + esc(p.pais) : "") + "</p>" : "") + "</div></div>" +
      (p.bio ? '<p class="prof__bio">' + esc(p.bio) + "</p>" : "") +
      (p.cita ? '<blockquote class="quote">“' + esc(p.cita) + "”</blockquote>" : "") +
      ((p.especialidades || []).length ? '<div><span class="lbl">ESPECIALIDADES</span>' + tags(p.especialidades) + "</div>" : "") +
      ((p.certificaciones || []).length ? '<div><span class="lbl">CERTIFICACIONES DE LA ESCUELA</span>' + certs(p.certificaciones) + "</div>" : "") +
      '<div class="prof__cta">' + contactButtons(p) + "</div>" +
    "</div>";
  }
  function makeModal(root) {
    var modal = root.querySelector(".modal"), body = modal.querySelector(".modal__body"), last = null;
    function close() { modal.setAttribute("data-open", "false"); document.body.style.overflow = ""; if (last) last.focus(); }
    modal.querySelector(".close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.getAttribute("data-open") === "true") close(); });
    return function open(p) {
      var idp = root.id + "-mname";
      modal.setAttribute("aria-labelledby", idp);
      body.innerHTML = profileHTML(p, idp);
      last = document.activeElement;
      modal.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
      modal.querySelector(".close").focus();
    };
  }
  function allSpecialties(list) {
    var out = [];
    list.forEach(function (p) { [p.especialidad].concat(p.especialidades || []).forEach(function (e) { if (e && out.indexOf(e) < 0) out.push(e); }); });
    return out.sort(function (a, b) { return a.localeCompare(b, "es"); });
  }
  function hasSpecialty(p, e) { return !e || p.especialidad === e || (p.especialidades || []).indexOf(e) >= 0; }
