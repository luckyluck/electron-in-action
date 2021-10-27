const parser = new DOMParser();

const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

const parseResponse = text => parser.parseFromString(text, 'text/html');
const findTitle = nodes => nodes.querySelector('title').innerText;
const clearForm = () => {
  newLinkUrl.value = null;
};
const storeLink = url => title => {
  localStorage.setItem(url, JSON.stringify({ title, url }));
};
const getLinks = () =>
  Object.keys(localStorage)
    .map(key => JSON.parse(localStorage.getItem(key)));
const convertToElement = link => `
  <div class="link">
    <h3>${link.title}</h3>
    <p><a href="${link.url}" target="_blank">${link.url}</a></p>
  </div>
`;
const renderLinks = () => {
  linksSection.innerHTML = getLinks().map(convertToElement).join('');
};
const handleError = url => error => {
  errorMessage.innerHTML = `
    There was an issue adding "${url}": ${error.message}
  `.trim();

  setTimeout(() => errorMessage.innerHTML = '', 5000);
};
const validateResponse = response => {
  if (response.ok) return response;
  throw new Error(`Status code of ${response.status} ${response.statusText}`);
};

// Initial render
renderLinks();

newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = newLinkUrl.value;

  fetch(url)
    .then(validateResponse)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(storeLink(url))
    .then(clearForm)
    .then(renderLinks)
    .catch(handleError(url));
});

clearStorageButton.addEventListener('click', () => {
  localStorage.clear();
  linksSection.innerHTML = '';
});
