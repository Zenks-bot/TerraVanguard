# TerraVanguard

**Crop rotation planning with NASA Earth observation data.**

TerraVanguard is a free, bilingual (English/Spanish) web application that helps farmers explore crop rotation strategies that strengthen soil health and adapt their farms to changing conditions.

- **Live app:** https://charming-maamoul-d40fdf.netlify.app/
- **Project demo:** _add the public link to your slide deck here_
- **Event:** 2026 NASA Space Apps Challenge
- **Challenge:** Field Shift: Adapting Farms with NASA Data

## Team TerraVanguard

- Ariana Alexia Santos De La Cruz
- Yonel Roy Arevalo Enriquez
- Jhordy Dueñas Villareal

## The problem

Farmers around the world face changing temperatures, shifting rainfall, water scarcity, extreme weather and declining soil health. These pressures make it hard to choose rotations that protect fields and conserve water, and most small and medium farmers have no data for their own field.

## What TerraVanguard does

1. **Draw a field.** The farmer draws the exact boundary of their parcel on a map.
2. **Explore local conditions.** The app retrieves NASA Earth observations for that field: climate, rainfall, soil moisture, vegetation and terrain.
3. **Compare rotation plans.** A rotation engine builds and compares 4-year plans and perennial planting options. It combines four inputs:
   - NASA Earth observations
   - local soil information (SoilGrids plus the farmer's own pH and organic matter tests)
   - crop characteristics (26 crops, FAO GAEZ v5 suitability and FAO-56 crop stages)
   - farmer priorities (climate scenario, soil, irrigation and strategy)
4. **Keep the results.** The farmer can export a PDF report that lists data sources, assumptions and limitations.

### Additional tools

- Daily irrigation guidance (simplified FAO-56 water balance) and a crop calendar with tasks (ICS export)
- Alerts for frost, heat, heavy rain, wind and NDVI decline
- Regional context from FIRMS fire detections and GloFAS river forecasts
- Season comparison with HLS Landsat/Sentinel-2 (30 m) or MODIS (250 m)
- Private field journal with photos, offline capture and account sync
- Cost, margin and break-even calculator using prices the user enters
- Community experiences and an AI assistant
- International settings for units, currency and time zone

## Data sources

### NASA

| Dataset | Use in TerraVanguard |
|---|---|
| NASA POWER | Daily and climatological weather |
| GPM IMERG | Recent precipitation |
| SMAP | Surface soil moisture |
| GLDAS Noah 2.1 | Modelled soil water context |
| ECOSTRESS | Land surface temperature, evapotranspiration, evaporative stress index |
| MODIS (ORNL DAAC) | NDVI, land surface temperature, evapotranspiration |
| VIIRS | NDVI with quality flags |
| HLS Landsat / Sentinel-2 | 30 m NDVI/EVI with cloud, shadow, snow and water masks |
| GEDI L4B | Historical aboveground biomass |
| NASADEM | Elevation |
| FIRMS | Active fire detections |
| GIBS | Satellite imagery layers |

NASA data are accessed through NASA Earthdata, NASA POWER, ORNL DAAC and GIBS.

### Partner agencies and other sources

ESA Copernicus DEM and Sentinel-2 (through HLS), ERA5 and GloFAS (through Open-Meteo), ISRIC SoilGrids, FAO GAEZ v5, Ag Data Commons (reference library), OpenStreetMap and Esri imagery.

## How it works

| Layer | Technology |
|---|---|
| Front end | Static HTML, CSS and JavaScript, hosted on Netlify; no build step |
| Raster processing | geotiff.js and proj4 in the browser |
| Back end (optional) | Supabase: authentication, PostgreSQL with row-level security, private storage, scheduled monitoring |
| Edge Functions (TypeScript/Deno) | `smap`, `gpm`, `gldas`, `earth-cog` (ECOSTRESS/GEDI), `farm-hazards` (FIRMS), `chat`, `pest` |
| Secrets | The Earthdata token and AI keys are stored only as Supabase secrets, never in the browser |

```
.
├── *.html                 App pages (map, rotation, plantation, observatory, journal, ...)
├── assets/
│   ├── js/                App logic (engine.js = agronomic calculations)
│   ├── css/  img/  data/  Styles, images, crop and GAEZ catalogs
│   └── vendor/            Third-party libraries with their licenses
├── supabase/
│   ├── functions/         Edge Functions for NASA data and AI
│   ├── schema.sql         Database tables and security rules
│   └── migrations/
├── tests/                 Node and Deno test suites
├── sw.js                  Service worker (offline cache)
└── netlify.toml
```

## Run locally

The website works without a back end:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Without Supabase, the app still works and keeps user data in the browser. To enable accounts, sync, protected NASA connectors and the AI assistant, create a Supabase project and follow these steps:

1. Run `supabase/schema.sql` and the files in `supabase/migrations/`.
2. Set your project URL and publishable key in `assets/js/config.js`.
3. Add the secrets and deploy the functions:

```bash
supabase secrets set EARTHDATA_TOKEN=... GROQ_API_KEY=...
supabase functions deploy smap gpm gldas earth-cog farm-hazards chat pest
```

## Tests

```bash
node --test tests/regression.cjs tests/farm.test.cjs
cd tests && npm install && cd .. && node --test tests/farm-ui.test.cjs
deno test --allow-env --allow-read tests/edge.test.ts tests/hazards.test.ts
```

## Use of AI

- **In the app:** the assistant uses `openai/gpt-oss-120b` through Groq, and the photo-based pest check uses a Groq vision model. Their answers are labelled as guidance.
- **During development:** AI coding assistants were used to help write and review code and documentation. The project idea and design are the team's own.

## Limitations

- Satellite and model data are estimates, and their coverage, dates and resolution vary by source and location.
- The soil indicator is orientative environmental context, not a laboratory diagnosis.
- Recommendations must be confirmed with local field checks and agronomic advice.
- Heat detections and river forecasts do not establish damage or flooding on a specific field.
- Prices are entered by the user and are not retrieved automatically.

## Credits

Use of NASA, ESA, FAO or other agency data does not imply their endorsement. Third-party libraries (Supabase JS, geotiff.js, proj4) are included under their licenses in `assets/vendor/`.
