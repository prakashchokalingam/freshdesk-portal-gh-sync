import type { CurrentAccount, CurrentPortal, PortalConfig as PortalConfigType } from "../../../types/app.dto"
import { PortalConfig } from "./portal"
import { TokenConfig } from "./token";
import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage"

interface iProps {
  currentAccount: CurrentAccount;
  currentPortal: CurrentPortal;
  setCurrentTokenConfig: Function;
  setCurrentPortalConfig: Function;
}

const Config = (props: iProps) => {
  const [tokenReadonly, toggleReadonly] = useState<boolean>(true);
  const [portalReadonly, togglePortalReadonly] = useState<boolean>(true);
  const [repoOwner, setRepoOwner] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('');

  useEffect(() => {
    getRepoInfo(props.currentPortal.id, setRepoOwner, setRepoName);
  }, []);

  return <div className="flex justify-around">
    <PortalConfig
      readonly={portalReadonly}
      repoOwner={repoOwner}
      repoName={repoName}
      toggleReadOnly={() => togglePortalReadonly(false)}
      currentAccount={props.currentAccount}
      currentPortal={props.currentPortal}
      onSetRepo={(repo) => {
        setRepoOwner(repo.owner);
        setRepoName(repo.repo);
        props.setCurrentPortalConfig(repo);
        togglePortalReadonly(true);
      }}
    />

    <div className="border-r-2 border-gray-300"></div>

    <TokenConfig
      readonly={tokenReadonly}
      toggleReadOnly={() => toggleReadonly(false)}
      currentAccount={props.currentAccount}
      onSetToken={(token) => {
        props.setCurrentTokenConfig(token);
        toggleReadonly(true)
      }}
    />
  </div>
}

const getRepoInfo = async (portalId: string, setRepoOwner, setRepoName) => {
  const storage = new Storage();
  const portalConfig: PortalConfigType = await storage.get(portalId);
  setRepoOwner(portalConfig.owner);
  setRepoName(portalConfig.repo);
}


export {
  Config
}