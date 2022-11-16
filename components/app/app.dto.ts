interface CurrentAccount {
  id: string;
  name: string;
  domain: string;
}

interface ThemeInfo {
  portal: string;
  theme: string;
}

enum AppViews {
  ONBOARD = 'onboard',
  CONFIG = 'config',
  SYNC = 'sync'
}


export {
  AppViews
};

export type {
  CurrentAccount,
  ThemeInfo
};

