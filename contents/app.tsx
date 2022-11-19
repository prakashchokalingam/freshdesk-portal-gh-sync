import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";
import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";

import { INTERNAL_APIS, TRIGGER_FD_GH_SYNC_APP } from "~constants";
import cssText from "data-text:~/styles/app.css";

import configIcon from "data-base64:~assets/config.svg";
import cancelIcon from "data-base64:~assets/cancel.svg";
import helpIcon from "data-base64:~assets/help.svg";
import syncIcon from "data-base64:~assets/sync.svg";

// components
import { Onboard } from "~components/app/onboard";
import { Sync } from "~components/app/sync";
import { Config } from "~components/app/config";

import { AppViews, CurrentAccount, CurrentPortal, PortalConfig } from "~types/app.dto";

const DEFAULT_VALUES: CurrentAccount = {
  id: null,
  name: null,
  domain: null
};

const CONFIG_DEFAULT_VALUE: PortalConfig = {
  owner: null,
  repo: null,
};

// plastmo contents
export const config: PlasmoContentScript = {
  matches: ["https://*/a/admin/portals/*/themes/*"],
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".footer-wrapper .footer")


export const getShadowHostId = () => "fd-sync-trigger"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}


// component
const App = () => {
  const [showApp, toggleApp] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppViews>(null);
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount>(DEFAULT_VALUES);
  const [currentPortal, setCurrentPortal] = useState<CurrentPortal>(DEFAULT_VALUES);
  const [currentTokenConfig, setCurrentTokenConfig] = useState<string>(null)
  const [currentPortalConfig, setCurrentPortalConfig] = useState<PortalConfig>(CONFIG_DEFAULT_VALUE)
  const [currentTheme, setTheme] = useState<string>(null);


  useEffect(() => {
    document.addEventListener(TRIGGER_FD_GH_SYNC_APP, function () {
      toggleApp(true);
    });

    // current theme info
    const [, , , , portalId, , themeId] = window.location.pathname.split('/');
    setTheme(themeId);

    // set global variables & decide default view
    decideView(
      setCurrentAccount,
      setCurrentPortal,
      setCurrentView,
      setCurrentTokenConfig,
      setCurrentPortalConfig,
      String(portalId)
    );
  }, []);

  const App = () => {
    return <div className="sync-overflow">
      <div className="sync-modal">
        <div className="flex justify-between items-center py-5 px-5 shadow-md">
          <h2 className="text-2xl text-white font-bold tracking-wider">
            Freshdesk Portal Github Sync
          </h2>
          <div>
            {(currentView !== AppViews.ONBOARD) && <button className="mr-10 sync-icon hint--top" aria-label="Sync" onClick={() => setCurrentView(AppViews.SYNC)}> <img src={syncIcon} /> </button> }
            {(currentView !== AppViews.ONBOARD) && <button className="mr-10 sync-icon hint--top" aria-label="Config" onClick={() => setCurrentView(AppViews.CONFIG)}> <img src={configIcon} /> </button> }
            <button className="mr-10 sync-icon hint--top" aria-label="Report an issue"><a href="https://github.com/prakashchokalingam/freshdesk-portal-gh-sync/issues" target="_blank"> <img src={helpIcon} /> </a></button>
            <button className="sync-icon hint--top" aria-label="Close" onClick={() => toggleApp(false)}> <img src={cancelIcon} /> </button>
          </div>
        </div>

        <div className="sync-view px-5 py-5 overflow-auto">
          {renderView(
            currentView,
            currentAccount,
            currentPortal,
            currentTokenConfig,
            currentPortalConfig,
            currentTheme,
            setCurrentTokenConfig,
            setCurrentPortalConfig,
            setCurrentView,
          )}
        </div>
      </div>
    </div>
  }

  return showApp ? <App /> : '';
};

const decideView = async (
  setCurrentAccount,
  setCurrentPortal,
  setCurrentView,
  setCurrentTokenConfig,
  setCurrentPortalConfig,
  portalId
) => {
  // fetch account and portal
  const [
    { bootstrap: { account } },
    { portal }
  ] = await Promise.all([
    fetch(INTERNAL_APIS.ACCOUNT).then(res => res.json()),
    fetch(INTERNAL_APIS.PORTAL(portalId)).then(res => res.json())
  ]);

  const accountId: string = String(account.ref_id);

  setCurrentAccount({
    id: accountId,
    name: account.helpdesk_name,
    domain: account.full_domain
  });

  setCurrentPortal({
    id: portalId,
    name: portal.name,
    domain: portal.portal_url
  });

  // get configs
  const storage = new Storage();
  let accountConfig: string = await storage.get(accountId);
  let portalConfig: PortalConfig = await storage.get(portalId);

  setCurrentTokenConfig(accountConfig);

  setCurrentPortalConfig({
    owner: portalConfig?.owner,
    repo: portalConfig?.repo,
  });

  // set view
  setView(accountConfig, portalConfig, setCurrentView);
}

const setView = (accountConfig: string, portalConfig: PortalConfig, setCurrentView) => {
  if (!accountConfig || !portalConfig.owner || !portalConfig.repo) {
    setCurrentView(AppViews.ONBOARD);
  } else {
    setCurrentView(AppViews.SYNC);
  }
}

const renderView = (
  currentView: AppViews,
  currentAccount: CurrentAccount,
  currentPortal: CurrentPortal,
  currentTokenConfig: string,
  currentPortalConfig: PortalConfig,
  themeId: string,
  setCurrentTokenConfig,
  setCurrentPortalConfig,
  setCurrentView,
) => {
  switch (currentView) {
    case AppViews.ONBOARD:
      return <Onboard
        currentAccount={currentAccount}
        currentPortal={currentPortal}
        currentTokenConfig={currentTokenConfig}
        currentPortalConfig={currentPortalConfig}
        onSetToken={(token: string) => {
          setCurrentTokenConfig(token);
          setView(token, currentPortalConfig, setCurrentView);
        }}
        onSetRepo={(config: PortalConfig) => {
          setCurrentPortalConfig(config)
          setView(currentTokenConfig, config, setCurrentView);
        }}
      />
    case AppViews.SYNC:
      return <Sync
        currentAccount={currentAccount}
        currentPortal={currentPortal}
        currentTokenConfig={currentTokenConfig}
        currentPortalConfig={currentPortalConfig}
        themeId={themeId}
      />
    case AppViews.CONFIG:
      return <Config
        currentAccount={currentAccount}
        currentPortal={currentPortal}
        setCurrentTokenConfig={setCurrentTokenConfig}
        setCurrentPortalConfig={setCurrentPortalConfig}
      />
  }
};


export default App;