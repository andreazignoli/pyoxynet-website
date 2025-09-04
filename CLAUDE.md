# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Oxynet website, a Jekyll-based GitHub Pages site that serves as the main landing page for the Oxynet project - an AI-powered toolset for automatic interpretation of cardiopulmonary exercise test (CPET) data. The site uses the Cayman theme and is deployed on GitHub Pages.

## Development Commands

### Setup and Installation
```bash
script/bootstrap          # Install dependencies (runs gem install bundler && bundle install)
```

### Development Server
```bash
script/server            # Start local development server (runs bundle exec jekyll serve)
# Access at http://localhost:4000
```

### Build and Test
```bash
bundle exec jekyll build            # Build the site to _site/ directory
script/cibuild                     # Full CI build with tests and validation
script/validate-html               # Validate HTML and CSS using W3C validators
bundle exec htmlproofer ./_site    # Check links and HTML structure
bundle exec rubocop -D --config .rubocop.yml  # Ruby linting
```

## Architecture and Structure

### Jekyll Site Structure
- `_config.yml` - Main Jekyll configuration (title: "Oxynet", theme: jekyll-theme-cayman)
- `index.md` - Primary content page with project information and documentation
- `_layouts/default.html` - Main layout template with header, content area, and footer
- `_includes/` - Partial templates for custom head elements
- `_sass/` - Sass stylesheets extending the Cayman theme
- `assets/css/style.scss` - Main stylesheet that imports the theme

### Content Management
The site uses Jekyll's front matter system:
- Pages use `layout: default` to apply the main template
- Content is written in Markdown with Jekyll liquid templating
- The main content showcases the Pyoxynet Python package, web app links, and research publications

### Theme Customization
Built on the Cayman Jekyll theme with:
- Custom Google Analytics integration support
- Extended Sass styling system
- Responsive design with mobile optimization
- SEO optimization through jekyll-seo-tag plugin

### Deployment
- Hosted on GitHub Pages (branch: gh-pages)
- Custom domain configured via CNAME file
- Automated deployment through GitHub Pages integration