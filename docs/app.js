document.addEventListener('DOMContentLoaded', () => {
  const style = document.getElementById('style');
  const color = document.getElementById('color');
  const labelColor = document.getElementById('labelColor');
  const badge = document.getElementById('badge');
  const badgeUrlDiv = document.getElementById('badge-url');
  const badgeLinkDiv = document.getElementById('badge-link');
  const resultUrlSection = document.getElementById('result-url-section');
  const resultLinkSection = document.getElementById('result-link-section');

  function renderBadge() {
    const styleValue = style.value;
    const colorValue = color.value.replace('#', '');
    const labelColorValue = labelColor.value.replace('#', '');

    const badgeUrl = `https://img.shields.io/badge/visitors-42-${colorValue}?style=${styleValue}&labelColor=${labelColorValue}`;
    badge.innerHTML = `<img src="${badgeUrl}" alt="Visitor badge">`;

    const markdown = `![visitors](${badgeUrl})`;
    badgeUrlDiv.textContent = badgeUrl;
    badgeLinkDiv.textContent = markdown;
    resultUrlSection.style.display = 'none';
    resultLinkSection.style.display = 'none';
  }

  style.addEventListener('change', renderBadge);
  color.addEventListener('input', renderBadge);
  labelColor.addEventListener('input', renderBadge);
  color.value = "#FFD700";
  renderBadge();

  const sendBtn = document.getElementById('send-btn');

  sendBtn.addEventListener('click', () => {
    const styleValue = style.value;
    const colorValue = color.value.replace('#', '');
    const labelColorValue = labelColor.value.replace('#', '');

    const url = `https://visitor-badge-self.vercel.app/api/new-badge?style=${encodeURIComponent(styleValue)}&color=${encodeURIComponent(colorValue)}&labelColor=${encodeURIComponent(labelColorValue)}`;

    badgeUrlDiv.textContent = 'Loading...';
    badgeLinkDiv.textContent = '';
    resultUrlSection.style.display = '';
    resultLinkSection.style.display = 'none';

    fetch(url, { method: 'GET' })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        badgeUrlDiv.textContent = data.badgeUrl || '';
        badgeLinkDiv.textContent = data.markdown || '';
        resultUrlSection.style.display = '';
        resultLinkSection.style.display = '';
      })
      .catch(err => {
        badgeUrlDiv.textContent = 'Errore: ' + err.message;
        badgeLinkDiv.textContent = '';
        resultUrlSection.style.display = '';
        resultLinkSection.style.display = '';
      });
  });
});