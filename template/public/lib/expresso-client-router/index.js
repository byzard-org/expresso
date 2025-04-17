(function () {
  const clientRouterPath = "/client-router";
  let routerSignal = 0;
  let currentPathName;

  async function loadView(viewPath) {
    if (!viewPath.startsWith("/")) viewPath = "/" + viewPath;

    routerSignal = 1;
    const response = await fetch(clientRouterPath + viewPath);
    routerSignal = 0;
    if (response.ok) return response.text();

    var message;
    try {
      const json = await response.json();
      message = json.error ?? json.message ?? null;
    } catch (error) {
      if (!error.message.includes("Unexpected token"))
        console.log("[EXPRESSO-ROUTER]", error);
    }

    return errorView(response.status, message);
  }

  const errorView = (code, message) => {
    return `<div id="router-content" class="router-error">
        <h1 class="code">${code}</h1>
        <p class="message">${
          message ??
          (code == 404 ? "Page introuvable" : "Une erreur s'est produite.")
        }</p>
    </div>`;
  };

  const loadingView = () => {
    return `<div id="router-content" class="router-loading">
        <div class="loading"></div>
    </div>`;
  };

  async function navigateTo(url, target, notSafe = false) {
    if (!url || routerSignal || window.location.href == url) return;
    history.pushState(null, null, url);
    await renderRoute(target, notSafe);
  }
  async function renderRoute(target, notSafe = false) {
    var fullPath = window.location.pathname + window.location.search;
    if (!fullPath.endsWith("/")) fullPath += "/";
    if (currentPathName && !currentPathName?.endsWith("/"))
      currentPathName += "/";
    if (!notSafe && fullPath == currentPathName) return;
    currentPathName = window.location.pathname;

    const isDomElement = target instanceof Element;
    if (!isDomElement) target = null;

    const appDiv = target ?? document.querySelector("[router-app]");
    if (!appDiv) return;
    const appBase = appDiv.getAttribute("router-base") ?? "";
    const route = window.location.pathname + window.location.search;
    // const route = window.location.pathname.replaceAll(appBase, "").replaceAll("//", "") + window.location.search;

    document
      .querySelectorAll("[router-nav]")
      .forEach((n) => n.classList.remove("active"));
    document.querySelectorAll("[router-nav]").forEach((n) => {
      var link = n.getAttribute("href") ?? n.getAttribute("route");
      if (link) {
        let isActive = false;
        let basePaths = [appBase + "/", appBase];

        link = link.split("?")[0];
        if (link === "/") isActive = currentPathName == "/";
        else if (basePaths.includes(link))
          isActive = basePaths.includes(currentPathName);
        else isActive = currentPathName.startsWith(link);

        if (isActive) {
          n.classList.add("active");
        }
      }
    });

    currentPathName += window.location.search;

    appDiv.innerHTML = loadingView();

    if (route) {
      const viewContent = await loadView(route);
      const router_class = "router" + route.replaceAll("/", "_");
      for (let c of appDiv.classList) {
        if (c.startsWith("router_")) appDiv.classList.remove(c);
      }
      appDiv.classList.add(router_class);

      appDiv.innerHTML = viewContent;

      const styles = appDiv.querySelectorAll("style");
      const stylesLinks = appDiv.querySelectorAll("link[rel='stylesheet'");
      var allStyles = "";
      for (let style of [...styles, ...stylesLinks]) {
        let content = style.innerHTML;
        if (style.getAttribute("href")) {
          content = await (await fetch(style.getAttribute("href"))).text();
        }
        content = content.trim();
        content = content.replaceAll("  }", "}");
        content += "\n\t";

        appDiv.innerHTML = appDiv.innerHTML.replace(style.outerHTML, "");
        allStyles += content;
      }
      allStyles = allStyles.replaceAll("}", "\t}");

      const embededStyle =
        allStyles.trim() == ""
          ? ""
          : `<style>\n.${router_class}{\n\t${allStyles.trim()}\t\n}\n</style> `;

      appDiv.innerHTML = embededStyle + appDiv.innerHTML;

      const scripts = appDiv.querySelectorAll("script");
      for (let script of scripts) {
        let content = script.innerHTML;
        if (script.getAttribute("src")) {
          // console.log(script.getAttribute("src"));
          content = await (await fetch(script.getAttribute("src"))).text();
        }
        eval(content);
        // appDiv.innerHTML = appDiv.innerHTML.replace(script.outerHTML,"")
      }
    } else {
      appDiv.innerHTML = errorView(404);
    }

    setListener();
  }

  function setListener() {
    document.querySelectorAll("[route]").forEach((r) => {
      const route =
        r.href && r.href.trim() != "" ? r.href : r.getAttribute("route");
      if (route == window.location.href) {
        r.classList.add("active");
      }
      r.style.cursor = "pointer";
      r.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(
          r.href && r.href.trim() != "" ? r.href : r.getAttribute("route"),
          document.getElementById(r.getAttribute("router-target")),
          r.hasAttribute("not-safe")
        );
      });
    });
  }

  setListener();

  window.addEventListener("popstate", renderRoute);

  // Charger la route initiale
  renderRoute();
})();
