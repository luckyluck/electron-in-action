const { ipcRenderer } = require('electron');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const path = require('path');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const DOMPurity = createDOMPurify();

let filePath;
let originalContent = '';

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitizer: DOMPurity.sanitize });
};

const updateUserInterface = (isEdited = false) => {
  let title = 'Fire Sale';

  if (filePath) {
    title = `${path.basename(filePath)} - ${title}`;
  }
  if (isEdited) {
    title = `${title} (Edited)`;
  }

  ipcRenderer.send('file-update', title, isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;
};

markdownView.addEventListener('keyup', e => {
  renderMarkdownToHtml(e.target.value);
  updateUserInterface(e.target.value !== originalContent);
});

newFileButton.addEventListener('click', () => {
  ipcRenderer.send('new-file');
});

openFileButton.addEventListener('click', () => {
  ipcRenderer.send('open-file');
});

saveHtmlButton.addEventListener('click', () => {
  ipcRenderer.send('save-html', htmlView.innerHTML);
});

ipcRenderer.on('file-opened', (_, file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  updateUserInterface();
});
