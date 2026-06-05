# Towards Autonomous Robot-Assisted Surgery — project website

A public-facing landing page for Ki-Hwan Oh's PhD dissertation, *Towards Autonomous Robot-Assisted Surgery*
(University of Illinois Chicago, 2026). It explains the work for a general audience and points researchers to the
open-source repositories so they can **replicate the work and use it as a baseline**.

It is a single, self-contained static site (plain HTML/CSS/JS — no build step), designed to be hosted on GitHub Pages.

## What's on the page

- A plain-language explanation of the research (no medical/robotics background required).
- The three open contributions: the **CRCD dataset**, the **autonomous dissection** system, and **vision-only instrument
  pose estimation**, each with embedded video, figures, and results.
- A **"Use this work as your baseline"** section with cards, quick-start commands, and links for the four repositories.
- Publications, a copy-ready BibTeX citation, and an About/contact section.

## Project structure

```
robotic-cholecystectomy/
├── index.html          # all page content
├── styles.css          # styling / responsive layout
├── script.js           # nav, scroll-spy, reveal, counters, lazy video, copy buttons
├── .nojekyll           # tell GitHub Pages to serve files as-is
├── README.md
└── assets/
    ├── img/            # figures, photo, logos, favicon
    ├── video/          # showcase + demo clips (autoplay, muted, looped)
    └── docs/
        └── thesis.pdf  # full dissertation (~28 MB)
```

All asset paths are **relative**, so the site works whether it is served from a project page
(`koh43.github.io/<repo>`) or a user page (`koh43.github.io`).

## Preview locally

From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Any static server works — `npx serve`, VS Code Live Server, etc. Opening `index.html` via `file://` also works,
but a local server best matches the GitHub Pages environment.)

## Deploy to GitHub Pages (standalone repo)

1. Create a new repository on GitHub, e.g. **`robotic-cholecystectomy`**.

2. Push this folder's contents to it:

   ```bash
   cd robotic-cholecystectomy
   git init
   git add .
   git commit -m "Add dissertation landing page"
   git branch -M main
   git remote add origin https://github.com/koh43/robotic-cholecystectomy.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment**.
   Set **Source = Deploy from a branch**, **Branch = `main`**, **Folder = `/ (root)`**, then **Save**.

4. After a minute, the site goes live at:

   ```
   https://koh43.github.io/robotic-cholecystectomy/
   ```

> **Tip — large files:** the repo includes a ~28 MB thesis PDF and a ~19 MB video (≈58 MB total), which is fine for
> GitHub Pages. If you'd rather keep the Git history light, either track them with
> [Git LFS](https://git-lfs.com/) (`git lfs track "*.pdf" "*.mp4"`) or host those two files elsewhere and update the
> links in `index.html` (`assets/docs/thesis.pdf` and `assets/video/autodissect.mp4`).

## Editing the content

- **Text & links:** everything lives in `index.html`, organized by clearly commented sections
  (`HERO`, `OVERVIEW`, `DATASET`, `DISSECTION`, `VISION`, `REPLICATE`, `PUBLICATIONS`, `ABOUT`).
- **Numbers in the stat strip:** edit the `data-count` / `data-suffix` attributes on the `.stat__num` elements.
- **Media:** drop replacements into `assets/` keeping the same filenames, or update the `src` / `poster` paths.
- **Colors & fonts:** tweak the CSS variables at the top of `styles.css` (`--navy`, `--accent`, `--display`, …).

## Linked repositories

| Repository | What it is |
|---|---|
| [SITL-Eng/CRCD](https://github.com/SITL-Eng/CRCD) · [🤗 dataset](https://huggingface.co/datasets/SITL-Eng/CRCD) | The Comprehensive Robotic Cholecystectomy Dataset |
| [SITL-Eng/sitl_ros2_cv](https://github.com/SITL-Eng/sitl_ros2_cv) | Real-time computer vision for the da Vinci stereo endoscope |
| [SITL-Eng/sitl_ros2_dvrk](https://github.com/SITL-Eng/sitl_ros2_dvrk) | Control layer for the da Vinci Research Kit (dVRK) |
| [koh43/stereo-endo-pose-vit](https://github.com/koh43/stereo-endo-pose-vit) | ViT-based instrument pose estimation from stereo images |
| [SITL-Eng/sitl_ros2_pedal](https://github.com/SITL-Eng/sitl_ros2_pedal) | Custom da Vinci pedal & electrosurgical-unit (ESU) control |
| [SITL-Eng/sitl_ros2_interfaces](https://github.com/SITL-Eng/sitl_ros2_interfaces) | Shared custom ROS 2 messages for the dVRK platform |

---

*For research purposes only — not intended for clinical use without proper validation and regulatory approval.*
