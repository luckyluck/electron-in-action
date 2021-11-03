const { nativeTheme, clipboard, Notification } = require('electron');

const getIcon = () => {
  if (process.platform === 'wind32') {
    return 'icon-light@2x.ico';
  }

  if (nativeTheme.shouldUseDarkColors) {
    return 'icon-light.png';
  }

  return 'icon-dark.png';
};

const createClippingMenu = (clipping, index) => ({
  label: clipping.length > 20 ? `${clipping.slice(0, 20)}...` : clipping,
  click() { clipboard.writeText(clipping); },
  accelerator: `CommandOrControl+${index},`
});

const showNotification = clipping => {
  if (Notification.isSupported()) {
    new Notification({
      title: 'Clipping Added',
      body: clipping,
    }).show();
  }
};

module.exports = {
  getIcon,
  createClippingMenu,
  showNotification,
};
