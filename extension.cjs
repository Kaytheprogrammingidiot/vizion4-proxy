class GitHubZipReporter {
  constructor() {
    this.proxyBase = 'https://v4proxy.vercel.app/api/proxy';
  }

  getInfo() {
    return {
      id: 'githubZipReporter',
      name: 'GitHub ZIP Reporter',
      blocks: [
        {
          opcode: 'setProxy',
          blockType: 'command',
          text: 'set proxy to [URL]',
          arguments: {
            URL: { type: 'string', defaultValue: 'https://your-proxy.example.com' }
          }
        },
        {
          opcode: 'getZipArrayBuffer',
          blockType: 'reporter',
          text: 'get array buffer for [OWNER]/[REPO]',
          arguments: {
            OWNER: { type: 'string', defaultValue: 'octocat' },
            REPO: { type: 'string', defaultValue: 'Hello-World' }
          }
        },
        {
          opcode: 'getZipBase64',
          blockType: 'reporter',
          text: 'get base64 for [OWNER]/[REPO]',
          arguments: {
            OWNER: { type: 'string', defaultValue: 'octocat' },
            REPO: { type: 'string', defaultValue: 'Hello-World' }
          }
        },
        {
          opcode: 'getZipDataURL',
          blockType: 'reporter',
          text: 'get data URL for [OWNER]/[REPO]',
          arguments: {
            OWNER: { type: 'string', defaultValue: 'octocat' },
            REPO: { type: 'string', defaultValue: 'Hello-World' }
          }
        }
      ]
    };
  }

  setProxy(args) {
    this.proxyBase = args.URL;
  }

  async fetchZipBuffer(owner, repo) {
    const target = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;
    const proxied = `${this.proxyBase}?url=${encodeURIComponent(target)}`;
    const res = await fetch(proxied);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.arrayBuffer();
  }

  async getZipArrayBuffer(args) {
    const buffer = await this.fetchZipBuffer(args.OWNER, args.REPO);
    return buffer;
  }

  async getZipBase64(args) {
    const buffer = await this.fetchZipBuffer(args.OWNER, args.REPO);
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  async getZipDataURL(args) {
    const buffer = await this.fetchZipBuffer(args.OWNER, args.REPO);
    const base64 = await this.getZipBase64(args);
    return `data:application/zip;base64,${base64}`;
  }
}

Scratch.extensions.register(new GitHubZipReporter());
