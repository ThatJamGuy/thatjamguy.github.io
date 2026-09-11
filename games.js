/*
 * Yeah fuck this shit god damn
 *
 * games.js
 * Handles optional per-entry detail links for the
 * games list.
 *
 * To add a new status in the future:
 *   1. Add an entry to STATUS_CONFIG below (key = data-status value).
 *   2. Add a matching .status-<key> rule in styles.css.
 *   3. Set data-status="<key>" on the <li class="game-row"> and give its
 *      badge the class "game-status status-<key>".
 *
 * An entry can carry more than one status by space-separating them in
 * data-status, e.g. data-status="unclassified lost". Wrap the matching
 * badges in a <div class="game-status-group"> so they stack vertically —
 * see styles.css for the stacking layout. Row tinting, and the
 * "cancelled" text dimming all key off any status present, not just the
 * first one.
 */

(function () {
  "use strict";

  // Single source of truth for status display names used by the filter bar.
  // If a status appears in the HTML but not here, its key is title-cased
  // automatically as a fallback.
  var STATUS_CONFIG = {
    development: { label: "In Development" },
    released: { label: "Released" },
    cancelled: { label: "Cancelled" },
    hiatus: { label: "On Hold" },
    unclassified: { label: "Unclassified" },
  };

  var ALL_KEY = "all";

  function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function init() {
    var list = document.querySelector(".game-list");
    if (!list) return;

    var rows = list.querySelectorAll(".game-row");
    if (rows.length === 0) return;

    wireDetailLinks(rows);
    buildFilterBar(list, rows);
  }

  // If a <li class="game-row"> has a data-link attribute, wrap its
  // thumbnail and title in a real <a> and add a small affordance so
  // future per-game pages "just work" by adding one attribute.
  function wireDetailLinks(rows) {
    var i,
      row,
      href,
      thumbImg,
      titleHeading,
      thumbAnchor,
      titleAnchor,
      indicator;

    for (i = 0; i < rows.length; i++) {
      row = rows[i];
      href = row.getAttribute("data-link");
      if (!href) continue;

      row.classList.add("game-row--linked");

      thumbImg = row.querySelector(".game-thumb img");
      if (thumbImg && thumbImg.parentElement.tagName !== "A") {
        thumbAnchor = document.createElement("a");
        thumbAnchor.href = href;
        thumbAnchor.setAttribute("tabindex", "-1");
        thumbAnchor.setAttribute("aria-hidden", "true");
        thumbImg.parentElement.insertBefore(thumbAnchor, thumbImg);
        thumbAnchor.appendChild(thumbImg);
      }

      titleHeading = row.querySelector(".game-title h2, h2.game-title");
      if (titleHeading && titleHeading.parentElement.tagName !== "A") {
        titleAnchor = document.createElement("a");
        titleAnchor.href = href;
        titleAnchor.className = "game-title-link";
        titleAnchor.textContent = titleHeading.textContent;
        titleHeading.textContent = "";
        titleHeading.appendChild(titleAnchor);
      }

      if (!row.querySelector(".game-link-indicator")) {
        indicator = document.createElement("a");
        indicator.href = href;
        indicator.className = "game-link-indicator";
        indicator.textContent = "View project \u2192";
        row.querySelector(".game-info").appendChild(indicator);
      }
    }
  }

  // A row's data-status can hold one or more space-separated statuses,
  // ie. data-status="unclassified lost". This splits that into tokens.
  function getStatusTokens(row) {
    var raw = row.getAttribute("data-status");
    if (!raw) return [];
    return raw.trim().split(/\s+/);
  }

  function rowHasStatus(row, key) {
    var tokens = getStatusTokens(row);
    var i;
    for (i = 0; i < tokens.length; i++) {
      if (tokens[i] === key) return true;
    }
    return false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
