import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";
import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage"

import { INTERNAL_APIS, TRIGGER_FD_GH_SYNC_APP } from "~constants";
import cssText from "data-text:~/styles/app.css"

// components
import { Onboard } from "~components/app/onboard";
import { AppViews, CurrentAccount, ThemeInfo } from "~components/app/app.dto";

// plastmo contents
export const config: PlasmoContentScript = {
  matches: ["https://*.freshdesk.com/a/admin/portals/*"],
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
  const [showApp, toggleApp] = useState<Boolean>(true);
  const [currenView, setView] = useState<AppViews>(null);
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount>({ id: null, name: null, domain: null });
  const [themeInfo, setThemeInfo] = useState<ThemeInfo>({ portal: null, theme: null });
  const [config, updateConfig] = useState(null)


  useEffect(() => {
    console.log('useEffect')
    document.addEventListener(TRIGGER_FD_GH_SYNC_APP, function() {
      toggleApp(true);
    });

    // current theme info
    const [,,,, portal,, theme] = window.location.pathname.split('/');
    setThemeInfo({ portal, theme })

    // fetch current account
    decideView(setCurrentAccount, portal, setView,);

  }, [])

  const App = () => {
    return <div className="sync-overflow">
      <div className="sync-modal">
        <div className="navbar">
          <h3>Freshdesk Portal Github Sync</h3>

          <div className="nav-options">
            <a href="">Repo</a>
            <a href="">Config</a>
            <a href="">Close</a>
          </div>
        </div>

        <div className="sync-view">
          { renderView(currenView, currentAccount, config) }
        </div>
      </div>
    </div>
  }


  return showApp ? <App /> : '';
};

const decideView = async (setCurrentAccount, portalId, setView) => {
  // set account
  const {
    bootstrap: { account }
  } = await fetch(INTERNAL_APIS.ACCOUNT).then(res => res.json());
  setCurrentAccount({
    id: account.ref_id,
    name: account.helpdesk_name,
    domain: account.full_domain
  });

  // get configs
  const storage = new Storage()
  let accountConfig;
  try {
    accountConfig = await storage.get(account.ref_id);
  } catch (e) {
    accountConfig = null
  }

  let portalConfig;
   try {
    portalConfig = await storage.get(portalId);
  } catch (e) {
    portalConfig = null
  }

  // set view
  if (!accountConfig || !portalConfig) {
    setView(AppViews.ONBOARD);
  }
}

const renderView = (currentView: AppViews, currentAccount,  config) => {
  switch (currentView) {
    case AppViews.ONBOARD:
      return <Onboard currentAccount={currentAccount} config={config} />
  }
};


export default App;