# Alexandra Hinman — Portfolio

A single-file website (`index.html`) built for GitHub Pages.

## Deploy it (5 minutes)

1. On GitHub, create a new **public** repository. If you name it
   `yourusername.github.io`, your site will live at
   `https://yourusername.github.io`. Any other name works too — it'll
   just live at `https://yourusername.github.io/repo-name`.
2. Upload `index.html` (and `resume.pdf` / `headshot.jpg` once you have
   them) to the repo — either drag-and-drop on github.com, or:
   ```bash
   git init
   git add index.html README.md
   git commit -m "First version of portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**. Under "Build and
   deployment," set **Source** to "Deploy from a branch," branch
   `main`, folder `/ (root)`. Save.
4. Wait a minute or two, then visit the URL GitHub gives you.

## Things to update as your resume gets finalized

Search the file for `UPDATE ME` — every placeholder is flagged with a
comment so you can find it fast. Right now that's:

- **Resume download button** (hero section) — currently links to `#`.
  Add a `resume.pdf` file to the repo and change the link to
  `href="resume.pdf"`.
- **Photo** — the "AH" initials block in the About section is a
  placeholder. Add `headshot.jpg` to the repo and swap the `<div
  class="avatar">` for `<img src="headshot.jpg" alt="Alexandra
  Hinman" class="avatar">` (add `object-fit: cover;` and
  `border-radius: 16px;` in the CSS if needed).
- **LinkedIn link** — currently `href="#"` in the Contact section.
- **Admin licensure line** — under Credentials, update once you know
  the program name / completion date.
- **Growth chart data** — near the bottom of the file, in the
  `milestones` array. Add a new entry whenever your role changes;
  flip `projected: true` off once a role actually starts.
- **Phone/email** — double check you're comfortable with both being
  public before you deploy; delete either `<a>` in the Contact
  section if you'd rather leave it off.

## Structure

Everything lives in one file on purpose, so it's easy to drop into any
GitHub Pages repo with zero build step. Sections, top to bottom:

`Hero → About → Journey (timeline) → Approach (leadership
competencies) → Credentials → Contact`

The "Journey" timeline and the hero's growth-trajectory chart both
read from the same idea — plotting your roles like a progress-monitoring
chart, which is very on-brand for a data-driven case manager. When you
add a new role, update it in two places: the `milestones` array (for
the chart) and the `.timeline` HTML block (for the detailed writeup).

## If you outgrow the single file

Once you're comfortable editing HTML/CSS, you can split things into
`style.css` and `script.js` and link them from `index.html` — GitHub
Pages doesn't care either way. Not necessary for a portfolio this
size, though.
