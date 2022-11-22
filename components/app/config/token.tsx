import { useState } from "react";
import { Storage } from "@plasmohq/storage";

import github from "data-base64:~assets/ghwhite.png";
import type { CurrentAccount } from "../../../types/app.dto";

interface iProps {
  currentAccount: CurrentAccount
  onSetToken: Function;
  readonly?: boolean;
  toggleReadOnly?: Function;
}


const TokenConfig = (props: iProps) => {
  const [token, setToken] = useState<string>('');

  return <div className="flex justify-evenly mt-3">
    <div className="text-center">
      <img src={github} className="h-24 inline-block mb-5" />
      <h2 className="text-2xl text-white">Set <b>Github access token</b> for the account:</h2>
      <h3 className="text-1xl text-white pt-2 font-bold">
        {props.currentAccount.name} ({props.currentAccount.domain})
      </h3>

      {
        !props.readonly && <div className="my-5 w-full">
          <input
            type="password"
            className="p-5 text-2xl w-6/12 rounded-md font-bold tracking-wider"
            placeholder="Github access token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button
            className="px-6 py-5 text-2xl w-3/12 rounded-md font-bold tracking-wider bg-white ml-2 opacity-95 hover:opacity-100 hover:shadow-lg disabled:opacity-90 disabled:text-gray-500"
            onClick={() => saveToken(props.currentAccount.id, token, props.onSetToken)}
            disabled={!Boolean(token)}
          >
            Save
          </button>
        </div>
      }

      {
        props.readonly && <div className="my-5 w-full">
          <button
            className="px-6 py-5 text-2xl rounded-md font-bold tracking-wider bg-white opacity-95 hover:opacity-100 hover:shadow-lg ml-2"
            onClick={() => props.toggleReadOnly()}
          >
            Update Github access token
          </button>
        </div>
      }

      <div className="text-base text-white">
        <p>The token will be used to perform commit operations on the given repository.</p>
        <p><a className="underline" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" target='_blank'>Click here</a> for the guide to create single access token.The token provided will be <a className="underline" href="https://developer.chrome.com/docs/extensions/reference/storage/" target='_blank'>stored on addon storage locally.</a></p>
      </div>
    </div>
  </div>
}

const saveToken = async (currentAccount: string, token: string, onSetToken) => {
  const storage = new Storage();
  await storage.set(currentAccount, token)
  onSetToken(token);
};

export {
  TokenConfig
};
