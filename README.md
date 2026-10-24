# bkmcoding.github.io

This site is built with [Hugo](https://gohugo.io/) and deployed to GitHub
Pages through GitHub Actions.

## Add a project

1. Create the page:

   ```sh
   hugo new content --kind projects projects/<project-name>/index.md
   ```

2. Put a `cover.png`, `cover.gif`, or `cover.webp` in the same folder.
3. Edit the front matter and Markdown body.
4. Run `hugo server -D` to preview it.

## Add a blog post

1. Create the page:

   ```sh
   hugo new content --kind blog blog/<post-name>/index.md
   ```

2. Put a `cover.png`, `cover.gif`, or `cover.webp` in the same folder.
3. Edit the front matter, tags, and body.
4. Run `hugo server -D` to preview it.

## Build and deploy

The GitHub Actions workflow builds the site and publishes it to GitHub Pages.
For a local production build:

```sh
hugo --gc --minify --cleanDestinationDir
```

Set the repository's GitHub Pages source to **GitHub Actions** before the first
deployment.
