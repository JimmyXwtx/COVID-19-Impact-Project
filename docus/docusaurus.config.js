module.exports = {
  title: 'COVID-19 Impact Project',
  tagline: 'More than numbers, we hope to help answer essential questions.',
  url: 'https://github.com/EP-Visual-Design/COVID-19-Impact-Project',
  // dependency: bin/doc-pub-html.sh
  baseUrl: '/COVID-19-Impact/Project/',
  // baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'EP-Visual-Design', // Usually your GitHub org/user name.
  projectName: 'covid19-dashboard', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'COVID-19 Impact Project',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo192.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Pages',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href:
            'https://github.com/EP-Visual-Design/COVID-19-Impact-Project.git',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: 'blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} John Henry Thompson & Shindy Johnson.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'd01-intro',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/EP-Visual-Design/COVID-19-Impact-Project/edit/master/docus/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/EP-Visual-Design/COVID-19-Impact-Project/edit/master/docus/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
