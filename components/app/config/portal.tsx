import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";

import freshdesk from "data-base64:~assets/freshdesk.png";
import type { CurrentAccount, CurrentPortal } from "../../../types/app.dto";

interface iProps {
  currentAccount: CurrentAccount;
  currentPortal: CurrentPortal;
  onSetRepo: Function;
  readonly?: boolean;
  repoOwner?: string;
  repoName?: string;
  toggleReadOnly?: Function;
}

const PortalConfig = (props: iProps) => {
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');

  useEffect(() => {
    setOwner(props.repoOwner || '');
    setRepo(props.repoName || '');
  }, [props.repoOwner])

  return <div className="flex justify-center mt-3">
    <div className="text-center">
      <img src={freshdesk} className="h-20 inline-block mb-5" />
      <h2 className="text-2xl text-white">Set <b>Github repo</b> for the portal ({props.currentPortal.id}):</h2>
      <h3 className="text-1xl text-white pt-2 font-bold">
        {props.currentPortal.name} ({props.currentPortal.domain})
      </h3>

      {
        !props.readonly && <div className="my-3 w-full">
          <div className="input-container flex">
            <span className="p-5 text-2xl rounded-l-md bg-white font-bold tracking-wide">https://github.com</span>
            <span className="p-5 text-2xl bg-white font-bold tracking-wide">/</span>
            <input
              type="text"
              className="p-5 text-2xl font-bold tracking-wider placeholder:text-slate-400"
              placeholder="owner (or) org name"
              value={owner}
              onChange={(e) => { setOwner(e.target.value) }}
              required
            />
            <span className="p-5 text-2xl bg-white font-bold tracking-wider">/</span>
            <input
              type="text"
              className="p-5 text-2xl rounded-r-md font-bold tracking-wider placeholder:text-slate-400"
              placeholder="repo name"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
            />
          </div>
          <div className="text-base text-white py-2">
            <p>This repo will be used to sync the published code changes done for this portal themes.</p>
            <p>Make sure <b>repository is not empty</b>.Changes will be pushed to the default branch of the repo.</p>
          </div>

          <button
            className="w-64 my-5 px-6 py-5 text-2xl rounded-md font-bold tracking-wider bg-white ml-2 opacity-95 hover:opacity-100 hover:shadow-lg disabled:opacity-90 disabled:text-gray-500"
            onClick={() => saveRepo(props.currentPortal.id, owner, repo, props.onSetRepo)}
            disabled={!Boolean(owner && repo)}
          >
            Save
          </button>
        </div>
      }

      {
        props.readonly && <div>
          <button
            className="my-5 p-5 rounded-md text-2xl bg-white font-bold tracking-wider opacity-95 hover:opacity-100 hover:shadow-lg"
            onClick={() => props.toggleReadOnly()}
          >
            Update Repo "https://github.com/{props.repoOwner}/{props.repoName}"
          </button>
          <div className="text-base text-white py-2">
            <p>This repo will be used to sync the published code changes done for this portal themes.</p>
            <p>Make sure <b>repository is not empty</b>.Changes will be pushed to the default branch of the repo.</p>
          </div>
        </div>
      }

    </div>
  </div>
};

const saveRepo = async (
  portalId: string,
  owner: string,
  repo: string,
  onSetRepo: Function
) => {
  const storage = new Storage();
  const portalConfig = {
    owner,
    repo,
  };

  await storage.set(portalId, portalConfig);
  onSetRepo(portalConfig)
};

export {
  PortalConfig
};
