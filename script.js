/* OMFIT – interacciones: animaciones al hacer scroll, fallback de video y año */
(() => {
  'use strict';

  // Año automático en el footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Si el video no carga, se muestra el logo en texto (queda la clase .no-video en <body>)
  const video = document.querySelector('.hero__video');
  if (video) {
    const fail = () => document.body.classList.add('no-video');
    video.addEventListener('error', fail, true);
    video.querySelector('source')?.addEventListener('error', fail);
    // Algunos navegadores bloquean autoplay: reintento silencioso
    video.play?.().catch(() => {});
  }

  // Animación de entrada al hacer scroll (respeta prefers-reduced-motion)
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('js-anim');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Pequeño escalonado entre elementos hermanos (tarjetas, bloques)
  items.forEach(el => {
    const index = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--delay', `${Math.min(index, 4) * 90}ms`);
    io.observe(el);
  });
})();
