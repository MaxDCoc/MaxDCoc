<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
  <img src="assets/banner-light.svg" alt="Maximiliano Cocito, full stack and embedded developer. A portrait on an orange locker door and a dot-matrix screen cycling through highlights." width="100%">
</picture>

[LinkedIn](https://www.linkedin.com/in/maximiliano-cocito) &nbsp;·&nbsp; [Email](mailto:maxcocito@gmail.com) &nbsp;·&nbsp; Resistencia, Chaco, Argentina

</div>

<!-- Portfolio link goes here once the domain is chosen. -->

## About

I build the plumbing between systems: n8n workflows and REST APIs that move data around, pipelines that clean it, and the apps and ESP32 hardware at the other end. I like projects where software meets the real world, like lockers, vehicle fleets and sustainability indicators.

- **Studying** Information Systems Engineering at UTN Resistencia, 5th year, with graduation expected in 2027.
- **Researching** as a Beca BIS fellow at UTN (CInApTIC), where I designed and built the MVP of SUSI, a sustainability indicators platform for universities.
- **Building** LockIT!, my final degree project: an open smart-locker network for last-mile delivery in Argentina. Team of 5, run with Scrum.
- **Competing** at the Huawei ICT Competition 2024/2025 (Computing track): 1st in the national and Latin American rounds, 2nd in the Global Final in Shenzhen, among 179 teams from 48 countries. Also 2nd at the Rally Latinoamericano de Innovación 2023.
- **Writing** two papers submitted to CoNaIISI 2026, on open smart lockers for Argentine last-mile delivery and on how Reddit conversation relates to the stock market.
- **Speaking** Spanish (native) and English (C1).

<details>
<summary>Leer en español</summary>

<br>

Soy estudiante de quinto año de Ingeniería en Sistemas de Información en la UTN FRRe (egreso estimado 2027) y becario de investigación. Me enfoco en automatización de procesos, integración de sistemas mediante APIs y pipelines de datos, y me gusta que el software toque el mundo real: lockers inteligentes, flotas de vehículos, indicadores de sostenibilidad. Fui 2.º en la final global de la Huawei ICT Competition 2024/2025, en Shenzhen.

</details>

## Projects

<table>
<tr>
<td valign="top" width="50%">

**LockIT!** · final degree project<br>
Open smart-locker network for last-mile delivery. NestJS API with 14 Prisma models and the shipment lifecycle as a state machine, a React Native app, and a hardware prototype (ESP32, QR reader, servo lock) over MQTT on TLS. 13 sprints, 75 user stories.<br>
<sub>NestJS · PostgreSQL · React Native · ESP32 · MQTT · private repository</sub>

</td>
<td valign="top" width="50%">

**[flota-ops](https://github.com/MaxDCoc/flota-ops)**<br>
Six n8n workflows for a workshop that serves company fleets, started with one command. A Python API cleans the supplier's price list into a staging table, rejected rows keep their reason, and every flow is idempotent. 29 tests and CI.<br>
<sub>n8n · FastAPI · pandas · PostgreSQL · Docker Compose · GitHub Actions</sub>

</td>
</tr>
<tr>
<td valign="top" width="50%">

**[SUSI](https://github.com/MaxDCoc/SUSI)** · research project<br>
Sustainability indicators platform for UTN. Django REST Framework backend with audit history and object-level permissions, a React and ECharts frontend, PostgreSQL on Supabase.<br>
<sub>Django · React · ECharts · Supabase · Docker</sub>

</td>
<td valign="top" width="50%">

**[VoltCare Analytics](https://github.com/MaxDCoc/VoltCare-Analytics)**<br>
Data engine over 50,000+ synthetic service tickets for a B2B electric-vehicle maintenance provider. MTTR, preventive vs corrective balance and RFM segments, served by a Go HTTP API that orchestrates the Python scripts, with Power BI dashboards.<br>
<sub>Python · pandas · Go · Docker · Power BI</sub>

</td>
</tr>
<tr>
<td valign="top" width="50%">

**[Climax](https://github.com/MaxDCoc/climax)** · [live demo](https://climax-phi.vercel.app)<br>
PWA for an independent refrigeration technician who used to manage about 5 clients a day from memory and WhatsApp. Clients, equipment and service history, plus a rule that schedules the next maintenance by service type. Six pytest suites in CI.<br>
<sub>FastAPI · SQLAlchemy · Alembic · React · TypeScript · Supabase</sub>

</td>
<td valign="top" width="50%">

**[ChePrecio](https://github.com/MaxDCoc/ChePrecio)**<br>
Price comparison app that reads photographed shelf labels with Anthropic's vision API and matches them against SEPA and Precios Claros data. NestJS API with JWT and versioned migrations, deployed from CI to Railway.<br>
<sub>NestJS · TypeORM · React Native (Expo) · Railway</sub>

</td>
</tr>
<tr>
<td valign="top" width="50%">

**[Dashboard La Fabiana](https://github.com/MaxDCoc/Dashboard-La-Fabiana)** · [live demo](https://dashboard-la-fabiana.vercel.app)<br>
A Power BI report for a care residence, migrated to an interactive web dashboard. The ETL reads the source Excel with only Python's standard library, and the indicators were checked against the original report.<br>
<sub>Python · JavaScript · Vite · ECharts · Vercel</sub>

</td>
<td valign="top" width="50%">

**CrowdWisdom** · with a teammate<br>
Reddit conversation versus the stock market: five containerized microservices around Postgres, about 70,000 mentions labeled with a local LLM, and a backtester. A +55% yearly result was thrown out after checking that the signal measured attention, not prediction.<br>
<sub>Python · FastAPI · TimescaleDB · Ollama · scikit-learn</sub>

</td>
</tr>
</table>

## Activity

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/cards/stats-dark.svg">
    <img src="assets/cards/stats-light.svg" alt="GitHub activity over the last 12 months: contributions, commits, pull requests and public repositories, with a weekly contributions chart." width="49%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/cards/languages-dark.svg">
    <img src="assets/cards/languages-light.svg" alt="Top languages across my public repositories." width="49%">
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/cards/recent-dark.svg">
    <img src="assets/cards/recent-light.svg" alt="The four repositories I pushed to most recently." width="100%">
  </picture>
</p>

## Stack

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/stack-dark.svg">
    <img src="assets/stack-light.svg" alt="Tools by layer. Automation: n8n, MQTT, GitHub Actions, REST APIs, GoHighLevel. Data and ETL: Python, pandas, NumPy, PostgreSQL, TimescaleDB, MySQL, Supabase, Redis, Power BI. Backend: FastAPI, Django, NestJS, Express, Prisma, Go, C#. Web, mobile and IoT: React, Expo, TypeScript, Svelte, Tailwind CSS, ESP32, C++. DevOps and AI: Docker, Linux, Traefik, Vercel, Railway, Ollama, scikit-learn, Anthropic API." width="100%">
  </picture>
</p>

## Contribution graph

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/MaxDCoc/MaxDCoc/output/snake-dark.svg">
    <img src="https://raw.githubusercontent.com/MaxDCoc/MaxDCoc/output/snake-light.svg" alt="My contribution graph, eaten by a snake." width="100%">
  </picture>
</p>

<sub>The banner, stack panel and activity cards are SVGs generated by the scripts in [`scripts/`](scripts), with the text drawn as outlines so they look the same everywhere. The cards refresh every day and the snake twice a day, both with GitHub Actions.</sub>
