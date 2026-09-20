# Menlo Park Collision Web GIS

An interactive Web GIS application for exploring traffic collisions in Menlo Park, California from 2017–2021.

Built with the **ArcGIS API for JavaScript**, **Chart.js**, HTML, CSS, and JavaScript, the application combines interactive mapping, temporal filtering, summary statistics, and supporting transportation-safety layers.

## Features

* Interactive collision heatmap
* Year filtering for 2017–2021
* Dynamic collision totals
* Collision summaries by day of week and month
* Menlo Park intersection locations and attributes
* San Mateo County High Injury Network
* Menlo Park city boundary
* Layer visibility controls
* Search, legend, scale bar, and basemap selection
* Feature popups with collision and intersection attributes

## Technologies

* JavaScript
* HTML5
* CSS3
* ArcGIS API for JavaScript 4.x
* Chart.js
* ArcGIS Feature Services

## Purpose

This project was developed for **GEOG 863 – Web Application Development** as part of Penn State's Master of Spatial Data Science program.

The application explores how interactive Web GIS techniques can be used to present traffic-safety information for transportation planning. Collision records are displayed alongside intersections, city boundaries, and High Injury Network segments to provide additional geographic context for identifying patterns in roadway safety.

## Data

The application consumes hosted ArcGIS feature services representing:

* Menlo Park traffic collisions from 2017–2021
* Menlo Park intersections
* San Mateo County High Injury Network segments
* Menlo Park city boundary

The collision layer includes attributes used for temporal summaries and feature-level inspection.

## Project Evolution

This project represents an earlier implementation of my Menlo Park traffic-safety visualization work.

The concept was later expanded into a more advanced open-source Web GIS application using **MapLibre GL JS**, custom map layers, GeoJSON, Chart.js, and additional interactive visualization techniques:

[Menlo Park Collision Dashboard](https://github.com/pcppalmer/menlo-park-collision-dashboard)

That later project demonstrates the progression from an ArcGIS-based Web GIS implementation to a more customized open-source web-mapping architecture.

## Repository Structure

```text
menlo-park-collision-web-gis/
├── index.html
├── style.css
├── app.js
├── README.md
└── LICENSE
```

## Academic Context

**Penn State University**
Master of Spatial Data Science
GEOG 863 – Web Application Development
