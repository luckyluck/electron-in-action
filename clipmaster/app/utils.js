const { nativeTheme } = require('electron');

const getIcon = () => {
  if (process.platform === 'wind32') {
    return 'icon-light@2x.ico';
  }

  if (nativeTheme.shouldUseDarkColors) {
    return 'icon-light.png';
  }

  return 'icon-dark.png';
};

module.exports = {
  getIcon,
};
