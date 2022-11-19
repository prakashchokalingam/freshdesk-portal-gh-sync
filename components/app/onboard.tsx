import type { CurrentAccount, PortalConfig as PortalConfigType, CurrentPortal } from "../../types/app.dto";
import { TokenConfig } from "./config/token";
import { PortalConfig } from './config/portal';
import { useState } from "react";
import Confetti from 'react-confetti';
import done from "data-base64:~assets/done.svg";


interface iProps {
  currentAccount: CurrentAccount;
  currentPortal: CurrentPortal;
  currentTokenConfig: string;
  currentPortalConfig: PortalConfigType;
  onSetToken: Function;
  onSetRepo: Function;
}

const Onboard = (props: iProps) => {
  const [allSet, toggleAllSet] = useState<boolean>(false);

  if (!props.currentTokenConfig) {
    return <TokenConfig
      currentAccount={props.currentAccount}
      onSetToken={(token) => props.onSetToken(token)}
    />
  }

  if (props.currentTokenConfig && !props.currentPortalConfig.owner) {
    return !allSet ? <PortalConfig
      currentAccount={props.currentAccount}
      currentPortal={props.currentPortal}
      onSetRepo={(repo) => allSetParty(repo, toggleAllSet, props.onSetRepo) }
    /> : allSetView()
  }
}

const allSetView = () => {
  return <div className="flex justify-center pt-10 mt-10 text-bold">
    <Confetti />
    <div className="text-center">
      <img src={done} className="inline-block mb-5" />
      <p className="font-extrabold text-white text-3xl tracking-wider">Config done! All set for sync.</p>
    </div>
  </div>
}

const allSetParty = (repo, toggleAllSet, onSetRepo) => {
  toggleAllSet(true);
  window.setTimeout(() => {
    onSetRepo(repo);
  }, 4000);
}

export {
  Onboard
}