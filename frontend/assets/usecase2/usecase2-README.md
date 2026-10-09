# AutoTrace — Use case 2 satellite image packet

> **Superseded location/source — historical note only.** The prototype uses the two supplied GISTDA exports, not WorldCereal/live fetching; exact AOIs and file mappings are in [the canonical origin brief](../../../data/origins/README.md). The corrected cap is **5 km²**. Old packet AOI/dates/images do not cover selected UC2 and cannot supply crop/burn evidence. New Sentinel-2 is pending. Factories may use selected maize for feed, human food or other uses. The description below preserves historical provenance, not active requirements. Only this note is published with the GISTDA documentation; the other 18 packet files listed below remain local, untouched and excluded. No API request, new imagery or application implementation occurred.

Actual satellite imagery selected from a WorldCereal maize-map AOI. This is not a certified no-burn farm and is not associated with the named 300-rai farmer in previous research.

## Main images
- `usecase2-before-2021-01-31.webp` / `.png`
- `usecase2-after-2021-03-12.webp` / `.png`
- `usecase2-before-after-comparison.jpg`

Both images use the same aligned crop. Display enlargement does not increase native satellite detail. No simulated burn appearance was added.

## WorldCereal
- Separate transparent overlay: `usecase2-worldcereal-maize-overlay.png`
- Separate classification display: `usecase2-worldcereal-maize-map.png`
- Season: 2020-09-02 through 2021-06-19.
- Map-derived maize extent on UTM 47N 10 m grid: 371.00 rai / 59.36 ha (approximate, not surveyed farm area).
- WorldCereal classifies maize, not feed-maize use, ownership or procurement.

## Screening and limits
The AOI was convenience-selected to contain WorldCereal class-100 cells and no positive burned cells in the available February 2021 MODIS Burn_Date crop with QA-bit screening. Other dates were not covered by that screening. MODIS resolution can miss small fires, and absence of a detection is not proof of no burning. No Sentinel-2 dNBR/burn detector was executed. Colour/vegetation changes may reflect harvest or other land-cover changes.

All source URLs, dates, selection details, SCL counts, grid details and file hashes are in `usecase2-imagery-provenance.json`. Native TCI/SCL crops, aligned WorldCereal classification, original STAC metadata and the arbitrary AOI GeoJSON are in `usecase2-source-data/`.

Do not call this an independent WorldCereal accuracy evaluation. Do not label the AOI as a real farmer's surveyed plot. Use the no-burn outcome only as a separately labelled prototype scenario unless qualified reference evidence is obtained.
