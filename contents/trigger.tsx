import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo"

// assets
import cssText from "data-text:~/styles/trigger.css"
import github from "data-base64:~assets/github.png"

import { TRIGGER_FD_GH_SYNC_APP } from "~constants";

// plastmo contents
export const config: PlasmoContentScript = {
  matches: ["https://*.freshdesk.com/a/admin/portals/*"],
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".footer-wrapper > .footer button:first-child")


export const getShadowHostId = () => "fd-sync-trigger"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}


// component
const Trigger = () => {
  return <div>
    <button className="sync-btn-style" title="Update changes to github">
      <img src={github} className="gh-trigger-icon" alt="Github sync" />
      <span onClick={openApp}> Sync to Github </span>
    </button>
  </div>
}

const openApp = () => {
  // Send events to app content
  document.dispatchEvent(new CustomEvent(TRIGGER_FD_GH_SYNC_APP));
}

export default Trigger