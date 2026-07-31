(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.family-menu').forEach((menu) => {
    const trigger = menu.querySelector('.family-trigger');
    if (!trigger) return;

    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };

    trigger.addEventListener('click', () => {
      setOpen(!menu.classList.contains('is-open'));
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.focus();
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (!menu.contains(event.target)) setOpen(false);
    });
  });

  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('.gallery-track');
    const toggle = gallery.querySelector('.gallery-toggle');
    if (!track || !toggle) return;

    let paused = reducedMotion;
    let interacting = false;
    let direction = 1;
    let position = track.scrollLeft;
    let previousTime = 0;

    const updateToggle = () => {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Play' : 'Pause';
    };

    const step = (time) => {
      if (!paused && !interacting && previousTime) {
        const delta = Math.min(time - previousTime, 32);
        const maxScroll = track.scrollWidth - track.clientWidth;
        position += direction * delta * 0.022;
        if (position >= maxScroll) {
          position = maxScroll;
          direction = -1;
        } else if (position <= 0) {
          position = 0;
          direction = 1;
        }
        track.scrollLeft = position;
      }
      previousTime = time;
      window.requestAnimationFrame(step);
    };

    toggle.addEventListener('click', () => {
      paused = !paused;
      updateToggle();
    });

    gallery.addEventListener('mouseenter', () => { interacting = true; });
    gallery.addEventListener('mouseleave', () => { interacting = false; position = track.scrollLeft; });
    gallery.addEventListener('focusin', () => { interacting = true; });
    gallery.addEventListener('focusout', () => { interacting = false; position = track.scrollLeft; });
    gallery.addEventListener('pointerdown', () => { interacting = true; });
    gallery.addEventListener('pointerup', () => { interacting = false; position = track.scrollLeft; });

    updateToggle();
    window.requestAnimationFrame(step);
  });
})();
