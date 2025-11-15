# Urban Water Access in Barcelona

**Author:** Cristiane Silva  
**Keywords:** Data Analysis · Geospatial Mapping · Python · Folium · Seaborn  

---

## Project Overview

This project analyzes the **distribution and evolution of public drinking fountains in Barcelona** from 2019 to 2024.  
The analysis integrates **open urban data** on fountains and population by district to assess whether **access to public water** has improved equitably across the city.


---

## Objectives

- Integrate datasets on fountains, population, and administrative boundaries.  
- Calculate the ratio of **fountains per 1,000 inhabitants** by district and year.  
- Examine **spatial and temporal inequalities** in access to public water.  
- Visualize how these patterns evolve over time.

---

## Methodology

### 1. Data Sources

All datasets used in this project were obtained from the **Open Data Portal of the Ajuntament de Barcelona**:

| Dataset | Description | Source |
|----------|--------------|--------|
| **Public Drinking Fountains** (`fonts_beure_2019_2024.csv`) | List and geolocation of public drinking fountains in Barcelona. Data was built by merging and cleaning the yearly datasets available on the open data portal. | [https://opendata-ajuntament.barcelona.cat/data/ca/dataset/fonts](https://opendata-ajuntament.barcelona.cat/data/ca/dataset/fonts) |
| **Population Data** (`poplacio_2019_2024.csv`) | Population per district and year, obtained from the Municipal Population Register (Padró Municipal d'Habitants). | [https://opendata-ajuntament.barcelona.cat/data/ca/dataset/pad_mdbas](https://opendata-ajuntament.barcelona.cat/data/ca/dataset/pad_mdbas) |
| **District Reference** (`BarcelonaCiutat_Districtes.csv`) | Official administrative units (district codes and names) used for spatial aggregation. | [https://opendata-ajuntament.barcelona.cat/resources/bcn/EstadisticaUnitatsAdministratives/BarcelonaCiutat_Districtes.csv](https://opendata-ajuntament.barcelona.cat/resources/bcn/EstadisticaUnitatsAdministratives/BarcelonaCiutat_Districtes.csv) |

---

### 2. Data Preparation

- Cleaning, normalization of district codes, and aggregation by year.  
- Merge of population and fountain datasets.  
- Computation of `fountains_per_1000` = fountains per 1,000 inhabitants.

---

### 3. Exploratory Data Analysis

- Visualization of fountains per district (`matplotlib`, `seaborn`).  
- Scatterplots to assess correlation between population and number of fountains.  
- Boxplots and bar charts to show inequalities in distribution.

---

### 4. Geospatial Mapping

- Interactive map created with `folium` and `MarkerCluster`.  
- Each marker represents a public fountain.  
- The map can be viewed [here](outputs/barcelona_water_map.html) .

---


---

## Key Visualizations

| Visualization | Purpose |
|----------------|----------|
| **Bar chart:** fountains per district | Compare total availability |
| **Scatterplot:** population × fountains | Examine correlation |
| **Boxplot:** fountains per 1,000 inhabitants | Show distribution variability |
| **Interactive map (Folium)** | Explore spatial access to public water |

---

## Live Demo: Interactive Fountain Explorer

Explore Barcelona’s public drinking fountains through an interactive map built using **Leaflet.js**, **Open Data BCN**, and lightweight frontend technologies.

👉 **Live site:**  
https://ssilvacris.github.io/barcelona-water-distribution/

This web application allows users to:

- Browse all public fountains in Barcelona (2025)
- Filter by administrative district
- Locate the nearest fountain using device geolocation
- Visualize the spatial distribution across the city
- Interact with clean and responsive UI designed for usability

The dataset used is sourced from **Open Data BCN** and includes 1,736 fountains in 2024/2025.


### 📁 Source Code
All frontend code is available inside the `/docs` folder of this repository.





