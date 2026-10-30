(function () {
  var btn  = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });

  // ── Reusable hierarchical dropdowns ─────────────────────────────────────
  var dropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
  function setDropdown(dropBtn, open) {
    var dropMenu = document.getElementById(dropBtn.getAttribute('aria-controls')) || dropBtn.nextElementSibling;
    dropBtn.setAttribute('aria-expanded', String(open));
    if (dropMenu) dropMenu.classList.toggle('is-open', open);
  }

  function closeUnrelated(dropBtn) {
    dropdownBtns.forEach(function (other) {
      if (other === dropBtn) return;
      var otherItem = other.closest('.nav-dropdown');
      var currentItem = dropBtn.closest('.nav-dropdown');
      // Preserve an open ancestor while operating a nested submenu.
      if (otherItem && currentItem && otherItem.contains(currentItem)) return;
      setDropdown(other, false);
    });
  }

  dropdownBtns.forEach(function (dropBtn) {
    var dropMenu = document.getElementById(dropBtn.getAttribute('aria-controls')) || dropBtn.nextElementSibling;

    dropBtn.addEventListener('click', function () {
      var open = dropBtn.getAttribute('aria-expanded') === 'true';
      closeUnrelated(dropBtn);
      setDropdown(dropBtn, !open);
    });

    dropBtn.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        closeUnrelated(dropBtn);
        setDropdown(dropBtn, true);
        var first = dropMenu && dropMenu.querySelector('a, button');
        if (first) first.focus();
      }
    });

    if (dropMenu) dropMenu.addEventListener('keydown', function (event) {
      var items = Array.prototype.slice.call(dropMenu.querySelectorAll(':scope > li > a, :scope > li > button'));
      var index = items.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        setDropdown(dropBtn, false);
        dropBtn.focus();
      } else if (event.key === 'ArrowDown' && items.length) {
        event.preventDefault();
        items[(index + 1) % items.length].focus();
      } else if (event.key === 'ArrowUp' && items.length) {
        event.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
      dropdownBtns.forEach(function (b) {
        setDropdown(b, false);
      });
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openButton = document.querySelector('.nav-dropdown-btn[aria-expanded="true"]');
      dropdownBtns.forEach(function (b) { setDropdown(b, false); });
      if (openButton) openButton.focus();
    }
  });

  // Set real header height as CSS variable so sticky offsets are exact
  function setHeaderHeight() {
    var h = document.getElementById('siteHeader').offsetHeight;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  // Shrink nav on scroll
  var header   = document.getElementById('siteHeader');
  var scrolled = false;
  window.addEventListener('scroll', function () {
    if (!scrolled && window.scrollY > 80) {
      header.classList.add('is-scrolled');
      scrolled = true;
    } else if (scrolled && window.scrollY < 40) {
      header.classList.remove('is-scrolled');
      scrolled = false;
    }
  }, { passive: true });
  header.addEventListener('transitionend', setHeaderHeight);
})();
