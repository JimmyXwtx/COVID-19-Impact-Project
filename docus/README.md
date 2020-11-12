# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

### Installation

Run in /docus folder

```
yarn
```

### Local Development

```
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
# Build and publish docus to epvisual.com
bin/doc-build-pub.sh

open https://epvisual.com/COVID-19-Impact/Project

```

```
# pub to github.io --retired--
GIT_USER=jhtep yarn deploy

open https://ep-visual-design.github.io/COVID-19-Impact/

```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

### Dev Notes

```

my-website/docusaurus.config.js

navbar: {
  title: 'My Site - Docus Test',
      to: 'docs/',
    { to: 'blog', label: 'Blog', position: 'left' },
      href: 'https://github.com/facebook/docusaurus',

footer: {

sidebarPath: require.resolve('./sidebars.js'),


my-website/src/pages/index.js

const features = [
    title: <>Easy to Use</>,
    title: <>Focus on What Matters</>,
    title: <>Powered by React</>,

npx http-server ./build

```
