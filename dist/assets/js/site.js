
document.addEventListener('DOMContentLoaded', () => {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(x => {
    if (x.getAttribute('href') === current) x.classList.add('active');
  });
});
