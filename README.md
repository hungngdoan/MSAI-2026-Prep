<div align="center">

# `>_ MSAI 2026 Prep`

### From foundations to application-ready — one repo, one trail.

<br>

![Start: May 2026](https://img.shields.io/badge/start-May%202026-0d1117?style=for-the-badge&labelColor=161b22)
![Target: July 30](https://img.shields.io/badge/target-July%2030-0d1117?style=for-the-badge&labelColor=161b22)
![Status: In Progress](https://img.shields.io/badge/status-in%20progress-f59e0b?style=for-the-badge&labelColor=161b22)

<br>

![PyTorch](https://img.shields.io/badge/PyTorch-ee4c2c?style=flat-square&logo=pytorch&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776ab?style=flat-square&logo=python&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-f37626?style=flat-square&logo=jupyter&logoColor=white)

<br>
<br>

[**Live MML Study Tracker**](https://hungngdoan.github.io/MSAI-2026-Prep/)

</div>

<br>

<div align="center">

🎯 **13 weeks. Math, PyTorch, deep learning, projects.**
**Everything I build on the road to UT Austin MSAI.**

</div>

---

## Phases

```
  May                         June                         July
  ┌───────────────────┐       ┌──────────────────────┐     ┌──────────────────────┐
  │  Foundations      │       │   Deep Learning      │     │   Projects &         │
  │  Math + PyTorch   │       │  CNNs → Transformers │     │     Application      │
  │  basics           │       │  + first project     │     │     materials        │
  └───────────────────┘       └──────────────────────┘     └──────────────────────┘
```

| Phase                | Focus                                                          | Output                            |
| :------------------: | :------------------------------------------------------------- | :-------------------------------- |
| 🧮 **Foundations**   | Linear algebra, calculus, probability, PyTorch fundamentals    | Notes, derivations, notebooks     |
| 🔥 **Deep Learning** | Networks, optimization, convolution, attention, transformers   | Implementations and concept notes |
| 🛠️ **Projects**     | Apply what I learn to end-to-end ML projects                    | Portfolio-ready writeups          |
| 🚀 **Application**   | SOP, resume, recommendations, program prep                     | Polished application materials    |

---

## Resources

<table>
<tr>
<td align="center" width="33%">

### 📐 Math

[**Mathematics for Machine Learning**](https://mml-book.com/)

Deisenroth, Faisal & Ong
Cambridge University Press

`Linear Algebra` `Calculus` `Probability` `Optimization`

</td>
<td align="center" width="33%">

### 🔶 PyTorch

[**Learn PyTorch for Deep Learning**](https://www.learnpytorch.io/)

Daniel Bourke / Zero to Mastery
MIT Licensed

`Tensors` `Training Loops` `Datasets` `Experiments`

</td>
<td align="center" width="33%">

### 🧠 Deep Learning

[**UT Austin Deep Learning Class**](https://ut.philkr.net/deeplearning/)

UT Austin DL Group
Link only — no copied materials

`CNNs` `Attention` `Transformers` `Training`

</td>
</tr>
</table>

---

## Deep Learning Path

> Following the [UT Austin Deep Learning Class](https://ut.philkr.net/deeplearning/) as the main sequence.

| #     | Topics                                                              | Status |
| :---: | :------------------------------------------------------------------ | :----: |
| 1     | Introduction, statistics, linear algebra, tensors, gradients         | ⬜     |
| 2     | Regression, classification, losses, optimization, computation graphs | ⬜     |
| 3     | Deep networks, activations, SGD, practical network design            | ⬜     |
| 4     | Vanishing gradients, normalization, residual connections             | ⬜     |
| 5     | Convolution, pooling, CNN design                                     | ⬜     |
| 6     | Attention, multi-head attention, positional embeddings, transformers | ⬜     |
| 7     | Advanced training, overfitting, practical implementation             | ⬜     |

---

## Repo Structure

```
📁 MSAI-2026-Prep
├── 📂 notes/           Study notes by topic
├── 📂 practice/        Exercises and coding notebooks
├── 📂 projects/        Portfolio projects with writeups
├── 📂 applications/    SOP drafts, resume, program notes
└── 📂 weekly-log/      Weekly reflections and progress
```

---

## Progress

| Date       | What happened                          | Next                                   |
| :--------: | :------------------------------------- | :------------------------------------- |
| 2026-05-02 | Repo setup, README, resources gathered | Create folders, start first weekly log |

---

## MML Study Tracker

The static tracker lives in `docs/`. It uses:

- `docs/index.html` for the page.
- `docs/css/styles.css` for the Dragon Ball-inspired theme.
- `docs/js/` for rendering and browser progress storage.
- `docs/data/study-plan.json` for the study plan imported from `MML_Study_Plan_v3.xlsx`.
- `docs/data/progress.json` for optional committed progress that should travel with the repo.

### Run Locally

Run the page through a local server because the app uses JavaScript modules and `fetch()`:

```powershell
cd d:\workspace\MSAI-2026-Prep
python -m http.server 8126 --bind 127.0.0.1 -d docs
```

Then open:

```text
http://127.0.0.1:8126/
```

### Progress Storage

Clicking a checkbox saves progress in the current browser under this `localStorage` key:

```text
mml-progress-v1
```

This is instant and works on GitHub Pages, but it stays on that browser/device.

### Keep Progress Updated In Git

To make progress part of a commit:

1. Click `EXPORT` in the tracker.
2. From the exported JSON, copy the `completed` object.
3. Replace the contents of `docs/data/progress.json` with that object.
4. Commit and push:

```powershell
git add docs/data/progress.json
git commit -m "chore: update study tracker progress"
git push
```

The app loads `docs/data/progress.json` first, then merges browser `localStorage` on top. That means committed progress gives every browser a baseline, and local clicks still work immediately.

### GitHub Pages

Yes, this can be viewable on GitHub Pages. In the repository settings:

1. Go to `Settings` -> `Pages`.
2. Set source to `Deploy from a branch`.
3. Select your branch, usually `main`.
4. Select the `/docs` folder.
5. Save.

After that, every push to the selected branch auto-deploys the static site. For a normal project repo, the URL is usually:

```text
https://<your-username>.github.io/MSAI-2026-Prep/
```

If the repository itself is named `<your-username>.github.io`, then it is served at:

```text
https://<your-username>.github.io/
```

No backend server is needed for viewing. GitHub Pages cannot save checkbox clicks back into the repo by itself, so use the export-and-commit workflow above when you want versioned progress.

---

## Weekly Rhythm

```
Pick topic  →  Study  →  Code  →  Write summary  →  Reflect  →  Plan next
```

---

## Attribution

My own notes, solutions, and experiments. External resources are references, not material to copy.

- Link to original sources. No copied slides, videos, or PDFs.
- Summaries in my own words. Short quotes cited.
- License notes included when adapting code.
- Dragon Ball, Goku, and related marks belong to their respective owners. The tracker theme is fan-inspired, personal, non-commercial, and not monetized.

---

<div align="center">

*Started May 2026. Target: application-ready by July 30.*

</div>
