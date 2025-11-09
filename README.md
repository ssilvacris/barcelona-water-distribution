# Urban Water Access in Barcelona

**Author:** Cristiane Silva  
**Keywords:** Data Analysis · Geospatial Mapping · Machine Learning · Python · Folium · Seaborn  

---

## Project Overview

This project analyzes the **distribution of public drinking fountains in Barcelona (2019–2024)** and explores how it relates to the **population of each district**.  
The goal is to understand whether access to water points correlates with demographic factors and if simple machine learning models can capture meaningful spatial patterns.

---

## Objectives

- Clean and integrate population and infrastructure datasets.  
- Visualize the distribution of fountains across Barcelona districts.  
- Compare availability of fountains relative to population density.  
- Apply basic Machine Learning models (Regression and Clustering) to identify patterns.  
- Create an **interactive map** with Folium to explore the results.  

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

### 5. Machine Learning

- **Linear Regression** to predict number of fountains from population.  
- **K-Means Clustering** to group districts by access level.  The map can be viewed [here](outputs/barcelona_water_map_clusters.html)
- Evaluation using R² and MAE metrics.

---

## Key Visualizations

| Visualization | Purpose |
|----------------|----------|
| **Bar chart:** fountains per district | Compare total availability |
| **Scatterplot:** population × fountains | Examine correlation |
| **Boxplot:** fountains per 1,000 inhabitants | Show distribution variability |
| **Interactive map (Folium)** | Explore spatial access to public water |

---

## Project Structure


---
barcelona-water-distribution/
├── notebooks/
│ └── FontsBeure_Population.ipynb
├── data/
│ ├── poplacio_2019_2024.csv
│ ├── fonts_beure_2019_2024.csv
│ └── BarcelonaCiutat_Districtes.csv
├── outputs/
│ ├── barcelona_water_map.html
│ └── figures/
├── requirements.txt
└── README.md

---





