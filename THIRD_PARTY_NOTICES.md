# Third-Party Asset Notices

These notices apply to the included presentation assets and embedded dependencies of the historical v2 reference, not to an assumed repository-wide software license. AutoTrace's own code has not been assigned an open-source license by this document.

## Sentinel-2 presentation imagery

**Contains modified Copernicus Sentinel data 2021.**

- Files: `frontend/assets/before.webp` and `frontend/assets/after.webp`, also embedded in `docs/reference/autotrace-v2.html`.
- Acquisitions: 26 January 2021 (`S2A_47QQU_20210126_0_L2A`) and 12 March 2021 (`S2B_47QQU_20210312_0_L2A`).
- Source: Copernicus Sentinel-2 L2A true-colour imagery served by Sentinel COGs, selected via Earth Search. Original URLs, dates, geography and hashes are retained in [imagery-provenance.json](frontend/assets/imagery-provenance.json).
- Existing preparation cropped/resampled the source and encoded WebP for presentation. The imported WebP files are unchanged; there is no new painting, burn enhancement or synthetic overlay embedded in them.
- [Copernicus Sentinel legal notice](https://ecds.ecmwf.int/licences/ec-sentinel) permits lawful reproduction, distribution and modification, without warranty. The modified-data attribution above reflects the existing crop/resampling/format conversion.

These are not a verified before/after maize-fire pair. No endorsement by the EU, ESA or data distributors is implied.

## Fonts

The standalone reference embeds DM Sans and IBM Plex Sans Thai. The matching 14 WOFF2 files and `fonts.css` are supplied in `frontend/assets/`.

- **DM Sans** — Copyright 2014 The DM Sans Project Authors. SIL Open Font License 1.1. Full notice: [DM-Sans-OFL.txt](frontend/assets/licenses/DM-Sans-OFL.txt). Source notice: [Google Fonts DM Sans](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt).
- **IBM Plex Sans Thai** — Copyright © 2017 IBM Corp., Reserved Font Name “Plex”. SIL Open Font License 1.1. Full notice: [IBM-Plex-Sans-Thai-OFL.txt](frontend/assets/licenses/IBM-Plex-Sans-Thai-OFL.txt). Source notice: [Google Fonts IBM Plex Sans Thai](https://github.com/google/fonts/blob/main/ofl/ibmplexsansthai/OFL.txt).

Fonts are imported without modification. Retain the OFL notices when redistributing the standalone HTML or extracted font assets. No font version beyond the verified binary hashes is asserted.

## Tailwind CSS

The historical standalone HTML embeds compiled Tailwind CSS **v3.4.17**, identified by its existing header. Copyright © Tailwind Labs, Inc. MIT License. Full notice: [Tailwind-MIT.txt](frontend/assets/licenses/Tailwind-MIT.txt); [versioned upstream notice](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.17/LICENSE).

No Tailwind JavaScript runtime, package installation or new build setup has been added.

## Illustrative factory photo

- File: `frontend/assets/factory.webp`, also embedded in the historical reference.
- Title: **Ainsworth, Nebraska feed mill**; author **Ammodramus**.
- [Original Wikimedia Commons source and public-domain release](https://commons.wikimedia.org/wiki/File:Ainsworth,_Nebraska_feed_mill.JPG).
- Existing preparation resized/converted the photo to WebP; the imported file is unchanged. Source/credit/hash: [factory-provenance.json](frontend/assets/factory-provenance.json).

The photo is from Nebraska, USA. It is not a Thai facility, the fictional company's factory or evidence about the photographed business. Keep this distinction in any reused UI.

## Historical context overlays — not scenario inputs

The archived standalone HTML embeds two prior context PNGs. The unchanged imagery provenance manifest retains their descriptions; standalone PNGs are intentionally not imported into runtime assets.

- **WorldCereal selected-season crop context:** derived presentation overlay from *ESA WorldCereal 10 m 2021 v100*, Van Tricht, K. et al. (2023), [DOI 10.5281/zenodo.7875105](https://doi.org/10.5281/zenodo.7875105). The [dataset record](https://zenodo.org/records/7875105) states [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The historical display reprojected/class-selected the dataset and rendered it as a PNG; it is not independent ground truth or native-resolution validation.
- **MODIS MCD64A1 February 2021 Burn_Date context:** historical display reprojected raw positive cells into an orange PNG. [Product collection](https://planetarycomputer.microsoft.com/api/stac/v1/collections/modis-64A1-061). NASA's [open-data policy](https://www.earthdata.nasa.gov/engage/open-data-services-software-policies) allows unrestricted use of its Earth-science data. This is not a validated crop-specific/QA-filtered burn classification.

Neither overlay supplies the new synthetic scenarios, detects real maize fires, establishes purchases, nor measures real detector accuracy. Preserve context attribution when distributing the archive. See [docs/assets.md](docs/assets.md) for reuse boundaries.
