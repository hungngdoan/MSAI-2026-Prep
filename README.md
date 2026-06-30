<div align="center">

# `>_ MSAI 2026 Prep`

[**Live PyTorch Study Tracker**](https://hungngdoan.github.io/MSAI-2026-Prep/)

</div>

<div align="center">
🔥 **8 weeks. 9 PyTorch chapters. One capstone.**
**Master PyTorch before the UT Austin MSAI deep learning course.**
</div>

---

## Goal

Work through [**Learn PyTorch for Deep Learning**](https://www.learnpytorch.io/) chapters **01 to 09**,
then build one end-to-end capstone, in the window **2026-06-30 → 2026-08-24** (the day before
the UT Austin deep learning course starts). Chapter `00` (tensor fundamentals) is already done.

> This builds fluency in the PyTorch tooling, not the underlying math. The linear algebra,
> calculus, and probability foundations from the earlier MML phase now live in [`archive/`](archive/).

## Resources

<table>
<tr>
<td align="center" width="50%">

### 🔶 Main Course

[**Learn PyTorch for Deep Learning**](https://www.learnpytorch.io/)

Daniel Bourke / Zero to Mastery — MIT Licensed

`Tensors` `Training Loops` `CNNs` `Transfer Learning` `ViT` `Deployment`

</td>
<td align="center" width="50%">

### 🧠 What It Feeds Into

[**UT Austin Deep Learning Class**](https://ut.philkr.net/deeplearning/)

Phil Krähenbühl — link only, no copied materials

`CNNs` `Attention` `Transformers` `Training`

</td>
</tr>
</table>

---

## The Plan

One block per chapter. Each chapter follows the same rhythm: **read & follow along → code from
memory → review + exercises + deliverable**. Pace is ~60-90 min/day, 6 days/week (Sunday rest).

| Block | Chapter | Topic | Days | Dates |
| :---: | :------ | :---- | :--: | :---- |
|  1  | [01 Workflow](https://www.learnpytorch.io/01_pytorch_workflow/) | Data, `nn.Module`, the 5-step training loop, save/load | 3 | Jun 30 – Jul 2 |
|  2  | [02 Classification](https://www.learnpytorch.io/02_pytorch_classification/) | Non-linear data, `BCEWithLogitsLoss`, ReLU, multiclass | 3 | Jul 3 – Jul 6 |
|  3  | [03 Computer Vision](https://www.learnpytorch.io/03_pytorch_computer_vision/) | FashionMNIST, `DataLoader`, TinyVGG, `Conv2d`/`MaxPool2d` | 4 | Jul 7 – Jul 10 |
|  4  | [04 Custom Datasets](https://www.learnpytorch.io/04_pytorch_custom_datasets/) | `ImageFolder`, custom `Dataset`, transforms, augmentation | 4 | Jul 11 – Jul 15 |
|  5  | [05 Going Modular](https://www.learnpytorch.io/05_pytorch_going_modular/) | Notebook → `.py` scripts, CLI training with `argparse` | 2 | Jul 16 – Jul 17 |
|  6  | [06 Transfer Learning](https://www.learnpytorch.io/06_pytorch_transfer_learning/) | `EfficientNet_B0`, freeze layers, feature extraction | 3 | Jul 18 – Jul 21 |
|  7  | [07 Experiment Tracking](https://www.learnpytorch.io/07_pytorch_experiment_tracking/) | TensorBoard, comparing runs, picking the best model | 3 | Jul 22 – Jul 24 |
|  8  | [08 Paper Replicating](https://www.learnpytorch.io/08_pytorch_paper_replicating/) | Vision Transformer from scratch (the hard one) | 5 | Jul 25 – Jul 30 |
|  9  | [09 Model Deployment](https://www.learnpytorch.io/09_pytorch_model_deployment/) | Gradio, FoodVision, deploy to Hugging Face Spaces | 4 | Jul 31 – Aug 4 |
| 10  | Capstone & Course Prep | End-to-end project + UT DL environment setup | — | Aug 5 – Aug 24 |

The capstone block keeps several **flex days** (Aug 10, 12, 14, 17, 19, 21) deliberately empty.
They absorb overflow — especially from Block 8 (ViT), which is the most likely to run long. If you
fall behind, skim Ch 08 and protect the deploy + capstone work.

---

## Repo Structure

```
MSAI-2026-Prep
|-- docs/        GitHub Pages tracker (the live site)
|   |-- index.html
|   |-- css/styles.css
|   |-- js/      renderer, store, main
|   `-- data/study-plan.json   <- the entire plan lives here
|-- pytorch/     Learn PyTorch notebooks and exercises, ch00-ch09
|-- capstone/    Final end-to-end project and writeup
|-- archive/     Retired MML math phase (notes, plans, workbook)
|-- package.json
`-- scripts/serve-docs.js
```

Each `pytorch/chXX_*` folder holds a **sample** notebook (follow along) and an **exercise**
notebook (type the code from memory). See [`pytorch/README.md`](pytorch/README.md).

---

## PyTorch Study Tracker

The static tracker lives in [`docs/`](docs/). It is fully data-driven:

- [`docs/data/study-plan.json`](docs/data/study-plan.json) is the single source of truth — edit it to change the plan.
- `docs/index.html` / `docs/css/styles.css` are the page and theme.
- `docs/js/` renders the plan and stores progress in the browser.
- `docs/progress.json` (optional) holds committed progress that travels with the repo.

### Run Locally

The page uses JavaScript modules and `fetch()`, so serve it instead of opening the file directly:

```powershell
cd d:\workspace\MSAI-2026-Prep
npm start
```

Then open `http://localhost:8082/`. There are no npm dependencies to install.

### Progress Storage

On `localhost`, clicking a checkbox saves progress in the browser under the `localStorage`
key `pytorch-progress-v1`. On the deployed GitHub Pages site, clicks are session-only and reset
to the committed state in `docs/progress.json` on refresh.

To version your progress: click `EXPORT`, copy the `completed` object, paste it into
`docs/progress.json`, then commit it.

### GitHub Pages

In repository **Settings → Pages**: source `Deploy from a branch`, branch `main`, folder `/docs`.
Every push then auto-deploys to `https://hungngdoan.github.io/MSAI-2026-Prep/`.

---

## Attribution

My own notes, solutions, and experiments. External resources are references, not material to copy.

- Link to original sources. No copied slides, videos, or PDFs.
- Summaries in my own words. Short quotes cited.
- License notes included when adapting code (learnpytorch.io is MIT licensed).
- Dragon Ball, Goku, and related marks belong to their respective owners. The tracker theme is
  fan-inspired, personal, non-commercial, and not monetized.

---

<div align="center">

_PyTorch sprint: 2026-06-30 → 2026-08-24. Target: PyTorch-fluent before the MSAI deep learning course._

</div>
