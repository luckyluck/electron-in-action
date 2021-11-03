const getIcon = () => {
  if (process.platform === 'wind32') {
    return 'icon-light@2x.ico';
  }

  return 'icon-dark.png';
};

module.exports = {
  getIcon,
};
