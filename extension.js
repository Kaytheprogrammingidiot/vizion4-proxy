class GitHubZipProxy {
  constructor() {
    this.proxyBase = 'https://v4proxy.vercel.app/proxy.js';
  }

  getInfo() {
    return {
      id: 'githubZipProxy',
      name: 'GitHub ZIP Proxy',
      blocks: [
        {
          opcode: 'fetchRepoZip',
          blockType: 'command',
          text: 'fetch repo [OWNER]/[REPO] as zip',
          arguments: {
            OWNER: { type: 'string', defaultValue: 'octocat' },
            REPO: { type: 'string', defaultValue: 'Hello-World' }
          }
        },
        {
          opcode: 'setProxy',
          blockType: 'command',
          text: 'set proxy to [URL]',
          arguments: {
            URL: { type: 'string', defaultValue: 'https://your-proxy.example.com' }
          }
        }
      ]
    };
  }

  setProxy(args) {
    this.proxyBase = args.URL;
  }

  async fetchRepoZip(args) {
    const { OWNER, REPO } = args;
    const targetUrl = `https://github.com/${OWNER}/${REPO}/archive/refs/heads/main.zip`;
    const proxiedUrl = `${this.proxyBase}?url=${encodeURIComponent(targetUrl)}`;
    const response = await fetch(proxiedUrl);
    if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${REPO}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

Scratch.extensions.register(new GitHubZipProxy());
