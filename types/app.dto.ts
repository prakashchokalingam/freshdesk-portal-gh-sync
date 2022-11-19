interface CurrentAccount {
  id: string;
  name: string;
  domain: string;
}

interface CurrentPortal extends CurrentAccount {
}

interface PortalConfig {
  owner: string;
  repo: string;
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
  CurrentPortal,
  PortalConfig,
};

