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

const getDraggedFile = e => e.dataTransfer.items[0];
const getDroppedFile = e => e.dataTransfer.files[0];

const fileTypeIsSupported = file =>
  ['text/plain', 'text/markdown'].includes(file.type);

const renderFile = (file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  updateUserInterface();
};

// Disabling default behaviour on drag-n-drop
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('dragleave', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());

markdownView.addEventListener('keyup', e => {
  renderMarkdownToHtml(e.target.value);
  updateUserInterface(e.target.value !== originalContent);
});
markdownView.addEventListener('dragover', e => {
  const file = getDraggedFile(e);

  if (fileTypeIsSupported(file)) {
    markdownView.classList.add('drag-over');
  } else {
    markdownView.classList.add('drag-error');
  }
});
markdownView.addEventListener('dragleave', () => {
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});
markdownView.addEventListener('drop', e => {
  const file = getDroppedFile(e);

  if (fileTypeIsSupported(file)) {
    ipcRenderer.send('open-file', file.path);
  } else {
    alert('That file type is not supported');
  }

  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
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

saveMarkdownButton.addEventListener('click', () => {
  ipcRenderer.send('save-markdown', filePath, markdownView.value);
});

revertButton.addEventListener('click', () => {
  markdownView.value = originalContent;
  renderMarkdownToHtml(originalContent);
  updateUserInterface(false);
});

ipcRenderer.on('file-opened', async (_, file, content) => {
  renderFile(file, content);
});

ipcRenderer.on('file-changed', async (_, file, content) => {
  renderFile(file, content);
});

ipcRenderer.on('save-markdown', () => {
  ipcRenderer.send('save-markdown', filePath, markdownView.value);
});

ipcRenderer.on('save-html', () => {
  ipcRenderer.send('save-html', htmlView.innerHTML);
});
