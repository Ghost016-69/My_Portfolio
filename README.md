# My Portfolio

A five-page personal portfolio website, built by hand with plain HTML, CSS and
vanilla JavaScript. No framework, no build step, no dependencies to install.

## Pages

| File | Contents |
| --- | --- |
| `index.html` | Hero, about me, skills, highlights and a closing call to action |
| `education.html` | Matric subjects and results, diploma modules, and supporting documents |
| `certificates.html` | Twelve certificates (Cisco, Google, IBM, Twinkl, Digiy Africa), six with viewable PDFs |
| `projects.html` | This website and three other projects |
| `contact.html` | Contact details and a mail-to based message form |

## Layout

```
.
├── index.html                  Home
├── education.html              Secondary + tertiary education
├── certificates.html           Certification cards
├── projects.html               Project cards
├── contact.html                Contact details and form
└── src/
    ├── Style/style.css         The one stylesheet: design tokens, layout, themes
    ├── Scripts/main.js         The one script: nav, theme, viewer, form
    ├── Images/                 Favicon and profile photo
    └── Documents/              Scanned records for the Education and Certificates pages
```

Every page sits at the same folder depth, so all five share one identical set of
relative paths (`./src/Style/style.css`, `./src/Scripts/main.js`).

## Running it locally

Open `index.html` directly, or serve the folder over HTTP:

```
python -m http.server 5500
```

Then visit <http://localhost:5500/>.

## Features

- Responsive from 320 px upward, with breakpoints at 600 / 768 / 1024 px
- Light and dark theme, following the OS preference and remembered in
  `localStorage`
- Mobile navigation drawer, and a working plain-link menu when JavaScript is off
- In-page PDF viewer with a new-tab fallback
- Skip link, focus rings, reduced-motion and print stylesheets

## Known gaps

- **Six of the twelve certificates** have no scan yet, so they read "Available on
  request" rather than being linked: four IBM courses, the Twinkl course and the
  Digiy Africa course.
- **Matric certificate and diploma** are not in the repository either, for the same
  reason. The CV and the academic transcript are, and are linked from the contact
  and Education pages.
- The **skills list** on `index.html` is drawn from the projects and certificates
  in this repository — trim or extend it to match your own experience.

Nothing on the site is a dead link — anything without a document behind it says
"Available on request" instead.

## Documents and verification

`src/Documents/` holds the scanned records. The CV is linked from the home page and
the contact page; the academic transcript sits on the Education page; and the Cisco
course certificates and letter, the Coursera certificate, the IBM certificate, the
CCNA badge record and the Cisco Networking Academy learning transcript all sit on
the Certificates page.

Where the issuer offers online verification, the card links to it as well —
Coursera for the Google course, and Credly for the IBM and Cisco badges.

## Privacy

This repository and the published site are **public**. The scanned documents were
redacted before publication — no student number, national ID number, date of birth
or home address remains in any of them — and the repository history was rebuilt from
scratch, so no earlier, unredacted version of any document is recoverable.

Two items are deliberately public: an email address (which also appears on the
contact page and the CV) and the Cisco Networking Academy account number on the
NetAcad learning transcript.

## Hosting

Published with GitHub Pages from the `main` branch, root folder, giving
`https://<owner>.github.io/<repository>/`. The `.nojekyll` file disables Jekyll, so
every file and folder is served exactly as it appears here.

