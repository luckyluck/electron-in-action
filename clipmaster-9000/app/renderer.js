const { clipboard, shell, ipcRenderer } = require('electron');
const request = require('request').defaults({
  url: 'https://cliphub.glitch.me/clippings',
  headers: { 'User-Agent': 'Clipmaster 9000' },
  json: true,
});

const clippingsList = document.getElementById('clippings-list');
const copyFromClipboardButton = document.getElementById('copy-from-clipboard');

const createClippingElement = clippingText => {
  const clippingElement = document.createElement('article');

  clippingElement.classList.add('clippings-list-item');
  clippingElement.innerHTML = `
    <div class="clipping-text" disabled="true"></div>
    <div class="clipping-controls">
      <button class="copy-clipping">&rarr; Clipboard</button>
      <button class="publish-clipping">Publish</button>
      <button class="remove-clipping">Remove</button>
    </div>
  `;
  clippingElement.querySelector('.clipping-text').innerText = clippingText;

  return clippingElement;
};

const addClippingToList = () => {
  const clippingText = clipboard.readText();
  const clippingElement = createClippingElement(clippingText);
  clippingsList.prepend(clippingElement);
};

const getButtonParent = ({ target }) => target.parentNode.parentNode;

const removeClipping = target => target.remove();

const getClippingText = clippingListItem =>
  clippingListItem.querySelector('.clipping-text').innerText;

const writeToClipboard = text => clipboard.writeText(text);

const publishingClipping = clipping => {
  request.post({ json: { clipping } }, (error, response, body) => {
    if (error) {
      return alert(JSON.parse(error).message);
    }

    const url = body.url;
    const notification = new Notification(
      'Your Clipping Has Been Published',
      { body: `Click to open ${url} in your browser` }
    );

    notification.onclick = () => { shell.openExternal(url); };

    clipboard.writeText(url);
  });
};

copyFromClipboardButton.addEventListener('click', addClippingToList);

clippingsList.addEventListener('click', e => {
  const hasClass = className => e.target.classList.contains(className);

  if (hasClass('remove-clipping')) removeClipping(getButtonParent(e));
  if (hasClass('copy-clipping')) writeToClipboard(getClippingText(getButtonParent(e)));
  if (hasClass('publish-clipping')) publishingClipping(getClippingText(getButtonParent(e)));
});

ipcRenderer.on('create-new-clipping', () => {
  addClippingToList();
  new Notification(
    'Clipping Added',
    { body: `${clipboard.readText()}` }
  );
});

ipcRenderer.on('write-to-clipboard', () => {
  const clipping = clippingsList.firstChild;
  writeToClipboard(getClippingText(clipping))
});

ipcRenderer.on('publish-clipboard', () => {
  const clipping = clippingsList.firstChild;
  publishingClipping(getClippingText(clipping));
});
