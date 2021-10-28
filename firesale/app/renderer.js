const { ipcRenderer } = require('electron');
const marked = require('marked');
const createDOMPurify = require('dompurify');

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

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitizer: DOMPurity.sanitize });
};

markdownView.addEventListener('keyup', e => {
  renderMarkdownToHtml(e.target.value);
});

openFileButton.addEventListener('click', () => {
  ipcRenderer.invoke('open-file').then(({ file, content }) => {
    markdownView.value = content;
    renderMarkdownToHtml(content);
  });
});
