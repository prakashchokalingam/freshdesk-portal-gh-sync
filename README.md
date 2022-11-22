<img width="250" alt="Screenshot_2022-11-19_at_10 55 41_PM-removebg-preview (1)" src="https://user-images.githubusercontent.com/5512765/203060603-55b3e1d7-46cc-4057-8511-4e081801367f.png">

# Fresdesk Portal Github Sync

Sync Freshdesk portal's themes code changes to your github repo

# How?

This addon includes [content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) to the portal customisation page and triggers the [freshdesk internal api's](https://github.com/prakashchokalingam/freshdesk-portal-gh-sync/blob/d0d731e5ad486ea05428a7a16e4737b2d7794cb8/constants/index.ts#L3) to fetch the template details and converts the data into freshdesk portal's import supported theme bundle.

# Download

> This addon is not available on any browser stores. You can download directly using below links

⬇️ [download for chrome](https://github.com/prakashchokalingam/freshdesk-portal-gh-sync/releases/download/v0.1/sync.chrome-mv3-prod.zip) ⬇️ [download for firefox](https://github.com/prakashchokalingam/freshdesk-portal-gh-sync/releases/download/v0.1/sync.firefox-mv2-prod.zip)

# Install

Refer the below links for the steps to install this addon to your browser

[Chrome Installation Guide](https://github.com/prakashchokalingam/freshdesk-portal-gh-sync/wiki/Chrome-installation-steps) | [Firefox Installtion Guide](https://github.com/prakashchokalingam/freshdesk-portal-gh-sync/wiki/Firefox-installation-steps)

# Usage

### Access
<table>
<tr>
  <td>
    <img width="1000" alt="sync-to-github" src="https://user-images.githubusercontent.com/5512765/203072198-158b64f2-feb0-4946-aac6-31b8a9d8b355.png"> </td>
  </td>
  <td>Once installed, The Github Sync button will start appear on your freshdesk portal theme customisation page</td>
</tr>
</table>

### Config
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

### Sync

All set, the addon is now ready sync the theme code changes to your github repository. Provide a commit message to describe the change and sync it.

<img width="1536" alt="gh-sync" src="https://user-images.githubusercontent.com/5512765/203238794-fbd866c4-3887-41c4-9473-8f8d753c1ed2.png">


> The files will be pushed to the repository under theme folder i.e `theme_id/files`. And the theme folder is import compatible, hence you can zip the theme folder and upload it to the freshdesk portal as a new theme.


# About this project

This addon was built using the following opensource dependencies,
* [plasmo](https://plasmo.com/)
* [octokit/rest.js](https://github.com/octokit/rest.js/)
* [reactjs](https://reactjs.org/)
* [tailwindcss](https://tailwindcss.com/)
* [hint.css](https://github.com/chinchang/hint.css)
* [react-confetti](https://github.com/alampros/react-confetti)


## Getting Started

First, run the development server:

```bash
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

For further guidance, [visit plasmo Documentation](https://docs.plasmo.com/).
