import { useEffect, useReducer, useState } from "react";
import { Octokit } from "@octokit/rest";
import Confetti from 'react-confetti';

import { INTERNAL_APIS, LAYOUTS, PAGES, THEME_OBJ_EXCLUDABLES } from "~constants";
import { ThemeCommitTree } from "~helpers/commit-tree";
import done from "data-base64:~assets/done.svg";
import error from "data-base64:~assets/error.svg";
import type { CurrentAccount, CurrentPortal, PortalConfig } from "../../types/app.dto";

interface iProps {
  currentAccount: CurrentAccount;
  currentPortal: CurrentPortal;
  currentPortalConfig: PortalConfig;
  currentTokenConfig: string;
  themeId: string;
}

enum commitStates {
  IDLE = 'idle',
  PROGRESS = 'inprogress',
  DONE = 'done',
  ERROR = 'error'
}

interface CommitState {
  type: commitStates,
  file?: string;
  commit?: string;
}


const reducer = (state, action: CommitState) => {
  switch (action.type) {
    case commitStates.IDLE:
      return { type: action.type };
    case commitStates.PROGRESS:
      return { type: action.type, file: action.file };
    case commitStates.DONE:
      return { type: action.type, commit: action.commit };
    case commitStates.ERROR:
      return { type: action.type };
  }
};

const Sync = (props: iProps) => {
  const [currentTheme, setCurrentTheme] = useState<any>();
  const [commitMsg, setCommitMsg] = useState<string>('');
  const [state, dispatch] = useReducer(reducer, { type: commitStates.IDLE });
  const ghLink: string = `https://github.com/${props.currentPortalConfig.owner}/${props.currentPortalConfig.repo}`;

  useEffect(() => {
    fetchTheme(props.themeId, setCurrentTheme);
  }, []);


  return <div className="flex justify-center mt-10 pt-10">
    {!currentTheme && Loader()}

    {
      currentTheme && (state.type === commitStates.IDLE) && <div className="w-6/12 text-center">
        <h2 className="text-2xl text-white mb-5">Sync changes of theme <b>{currentTheme.name} ({currentTheme.id})</b> to the github repo <b><a href={ghLink} target="_blank" className="hover:underline">{ghLink}</a></b></h2>
        <input
          type="text"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          className="p-5 text-2xl w-8/12 rounded-md font-bold tracking-wider"
          placeholder="Commit msg (optional)"
        />

        <button
          className="m-5 w-4/12 px-6 py-5 text-2xl rounded-md font-bold tracking-wider bg-white opacity-95 hover:opacity-100 hover:shadow-lg ml-2"
          onClick={() => commit(currentTheme, props.currentTokenConfig, props.currentPortalConfig, commitMsg, dispatch)}
        >
          Sync Changes
        </button>
      </div>
    }

    {
      (state.type === commitStates.PROGRESS) && <div className="w-6/12 text-center">
        {Loader()}
        {state.file && <h2 className="text-white text-3xl mt-5">Commit in pogress... processed file {state.file}...</h2>}
      </div>
    }

    {
      (state.type === commitStates.DONE) && <div className="w-6/12 text-center">
        <div className="text-center">
          <Confetti />
          <img src={done} className="inline-block mb-5" />
          <p className="font-extrabold text-white text-3xl tracking-wider">Sync complete!</p>
          <p className="font-extrabold text-white text-xl tracking-wider mt-5"><a href={state.commit} target="_blank" className="hover:underline">Click here to view commit</a></p>
        </div>
      </div>
    }

    {
      (state.type === commitStates.ERROR) && <div className="w-6/12 text-center">
        <div className="text-center">
          <img src={error} className="inline-block mb-5" />
          <p className="font-extrabold text-white text-3xl tracking-wider">Sync failed!</p>
          <p className="font-extrabold text-white text-xl tracking-wider mt-5"> Please check the given token has valid permissions to the given repository.</p>
        </div>
      </div>
    }
  </div>
};

const Loader = () => {
  return <div className="inline-block">
    <svg className="animate-spin text-white h-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
};


const fetchTheme = async (themeId: string, setCurrentTheme) => {
  const {
    portal_template: theme
  } = await fetch(INTERNAL_APIS.THEME(themeId)).then(res => res.json());
  setCurrentTheme(theme);
};

const commit = async (theme: any, currentTokenConfig: string, currentPortalConfig: PortalConfig, commitMsg, dispatch) => {
  try {
    dispatch({ type: commitStates.PROGRESS, file: 'repo' })

    const octokit = new Octokit({
      auth: currentTokenConfig
    });
    const { owner, repo } = currentPortalConfig;

    // get repo
    const repoInfo = await octokit.repos.get({ owner, repo });
    const defaultBranch = repoInfo.data.default_branch;

    // get commits
    const commits = await octokit.repos.listCommits({
      owner,
      repo,
      sha: defaultBranch,
      per_page: 1
    });
    const { sha } = commits.data[0];

    // create tree
    const tree = await getTree(theme, owner, repo, sha, dispatch);
    const treehash = await octokit.rest.git.createTree(tree as any);

    // create commit
    const commit = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: commitMsg || 'Freshdesk portal github sync',
      tree: treehash.data.sha,
      parents: [sha]
    });

    // commit
    const ref = await octokit.rest.git.updateRef({
      owner,
      repo,
      sha: commit.data.sha,
      ref: `heads/${defaultBranch}`,
      force: true
    });

    const commitSha = ref.data.object.sha;
    const commitLink = `https://github.com/${owner}/${repo}/commits/${commitSha}`;

    dispatch({ type: commitStates.DONE, commit: commitLink })
  } catch (e) {
    console.log(e);
    dispatch({ type: commitStates.ERROR, error: e });
  }
};

const getTree = async (theme: any, owner: string, repo: string, baseTree: string, dispatch) => {
  // construct theme files tree
  const commitTree = new ThemeCommitTree(owner, repo, baseTree, theme.id);

  // meta
  commitTree.add('meta', JSON.stringify({
    name: theme.name,
    base_theme: theme.reference
  }, null, 4));

  // preferences
  const preferences = Object.keys(theme).reduce((obj, key) => {
    if (!THEME_OBJ_EXCLUDABLES.includes(key)) { obj[key] = theme[key] };

    return obj;
  }, {});
  commitTree.add('preferences', JSON.stringify(preferences, null, 4));

  // layout & css files
  LAYOUTS.forEach((layout) => {
    commitTree.add(layout, theme[layout] || '');
  });

  dispatch({ type: commitStates.PROGRESS, file: 'meta, layouts & styles' });

  // pages
  for (const page of PAGES) {
    try {
      const { portal_page } = await fetch(INTERNAL_APIS.PAGES(theme.id, page)).then(res => res.json());
      commitTree.add(page, portal_page.content);
      dispatch({ type: commitStates.PROGRESS, file: page });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  return commitTree.get();
};

export {
  Sync
};
