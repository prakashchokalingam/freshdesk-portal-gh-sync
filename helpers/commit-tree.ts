interface Tree {
  path: string;
  mode: string;
  content: string;
}

interface CommitTree {
  owner: string;
  repo: string;
  base_tree: string;
  tree: Tree[];
}

class ThemeCommitTree {
  constructor(
    private readonly owner: string,
    private readonly repo: string,
    private readonly baseTree: string,
    private readonly themeId: string,
    private readonly tree: Tree[] = []
  ) {
  }


  public add(path: string, content: any) {
    this.tree.push({
      path: `${this.themeId}/${path}`,
      mode: '100644',
      content,
    });
  }


  public get(): CommitTree {
    return {
      owner: this.owner,
      repo: this.repo,
      base_tree: this.baseTree,
      tree: this.tree
    }
  }
}

export {
  ThemeCommitTree
}