/* Tested For Real Gear hub
 *
 * AFFILIATE TAGS ARE CURRENTLY OMITTED.
 * Product links use clean https://www.amazon.com/dp/<ASIN> URLs with no tag=
 * parameter. Do NOT add gsg-gear-20 or any Garage Survival Guide tag.
 *
 * After Daniel creates tfrg-* Amazon Associates tracking IDs and adds the live
 * TFRG hub URL to his Amazon Associates sitelist, set AFFILIATE_TAG to that
 * tracking ID (for example "tfrg-20"). This script will then append ?tag=...
 * to Amazon product links. Leave it as an empty string until that is done.
 */
(function () {
  "use strict";

  var AFFILIATE_TAG = ""; // pending tfrg-* tracking ID + sitelist approval

  var search = document.getElementById("product-search");
  var chips = document.querySelectorAll(".chips button");
  var cards = document.querySelectorAll("article.card");
  var empty = document.getElementById("empty-state");
  var countEl = document.getElementById("results-count");
  var activeCategory = "all";

  function applyAffiliateTag() {
    if (!AFFILIATE_TAG) return;
    var links = document.querySelectorAll('a[href^="https://www.amazon.com/dp/"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var url = new URL(links[i].href);
        if (!url.searchParams.get("tag")) {
          url.searchParams.set("tag", AFFILIATE_TAG);
          links[i].href = url.toString();
        }
      } catch (e) { /* leave the clean link in place */ }
    }
  }

  function norm(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function matches(card, query, category) {
    var cat = card.getAttribute("data-category") || "";
    if (category && category !== "all" && cat !== category) return false;
    if (!query) return true;
    var hay = norm(card.getAttribute("data-search") + " " + card.textContent);
    return hay.indexOf(query) !== -1;
  }

  function filter() {
    var query = search ? norm(search.value) : "";
    var shown = 0;
    for (var i = 0; i < cards.length; i++) {
      var ok = matches(cards[i], query, activeCategory);
      cards[i].classList.toggle("is-hidden", !ok);
      if (ok) shown += 1;
    }
    if (empty) empty.classList.toggle("is-visible", shown === 0);
    if (countEl) {
      if (query || activeCategory !== "all") {
        countEl.textContent = shown === 0 ? "No matching products." : shown + " of " + cards.length + " products";
      } else {
        countEl.textContent = cards.length + " products";
      }
    }
  }

  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener("click", function () {
      activeCategory = this.getAttribute("data-filter") || "all";
      for (var i = 0; i < chips.length; i++) {
        chips[i].setAttribute("aria-pressed", chips[i] === this ? "true" : "false");
      }
      filter();
    });
  }

  if (search) {
    search.addEventListener("input", filter);
    search.addEventListener("search", filter);
  }

  try {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var cat = params.get("cat");
    if (q && search) search.value = q;
    if (cat) {
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].getAttribute("data-filter") === cat) {
          activeCategory = cat;
          for (var j = 0; j < chips.length; j++) {
            chips[j].setAttribute("aria-pressed", chips[j] === chips[i] ? "true" : "false");
          }
          break;
        }
      }
    }
  } catch (e) { /* ignore */ }


  applyAffiliateTag();
  filter();
})();
