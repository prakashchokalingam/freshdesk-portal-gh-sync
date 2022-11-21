<img width="250" alt="Screenshot_2022-11-19_at_10 55 41_PM-removebg-preview (1)" src="https://user-images.githubusercontent.com/5512765/203060603-55b3e1d7-46cc-4057-8511-4e081801367f.png">

# Fresdesk Portal Github Sync

Sync Freshdesk portal's themes code changes to your github repo

#### Download

> This addon is not available on the browser addon stores. [Click here to download](Click here to download).



#### Click here for the steps to install this addon on your browser

### Addon usage

##### Access
<table>
<tr>
  <td>
    <img width="1000" alt="sync-to-github" src="https://user-images.githubusercontent.com/5512765/203072198-158b64f2-feb0-4946-aac6-31b8a9d8b355.png"> </td>
  </td>
  <td>Once installed, The Github Sync button will start appear on your freshdesk portal theme customisation page</td>
</tr>
</table>

##### Config
Provide config settings like github access token and repository details to perform the sync.

> Note: All your secret tokens will be stored in the browser's addon storage securely. [click here to know more about storages](https://developer.chrome.com/docs/extensions/reference/storage/).

<table>
<tr>
 <td>Ensure the token has access to commit changes on the default branch of the given repo.</td>
 <td><img width="1536" alt="gh-token" src="https://user-images.githubusercontent.com/5512765/203077325-5a11c920-05be-49d0-9637-f88d553eb6d9.png"></td>
</tr>
<tr>
  <td><img width="1536" alt="repo" src="https://user-images.githubusercontent.com/5512765/203078757-a94638ff-b512-42f1-b646-e98c0103704b.png"></td>
   <td>Make sure the repo is not empty and has a default branch.</td>
</tr>
<tr>
<td>Update your configuration details anytime using the config option</td>
<td>
<img width="1536" alt="config" src="https://user-images.githubusercontent.com/5512765/203083568-a28ed4c4-28ca-4864-9105-a5a70a98ebcd.png">
</td>
</tr>
</table>



# About this project

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/workflows/submit) and you should be on your way for automated submission!
