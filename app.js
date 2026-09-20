require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/ScaleBar",
    "esri/rest/query",
    "esri/rest/support/Query",
    "https://cdn.jsdelivr.net/npm/chart.js@4.0.1/dist/chart.umd.min.js",
    "esri/widgets/Search"
  ], function (
    Map,
    MapView,
    FeatureLayer,
    Legend,
    BasemapGallery,
    Expand,
    ScaleBar,
    query,
    Query,
    Chart,
    Search
  ) {
    // Create the map
    const map = new Map({
      basemap: "dark-gray-vector"
    });
  
    // Create the view
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-122.181725, 37.453],
      zoom: 12
    });
  
    // Add scale bar
    const sBar = new ScaleBar({
      view: view,
      style: "ruler",
      unit: "metric"
    });
  
    view.ui.add(sBar, { position: "bottom-left" });
  
    // Define the renderer for the Intersections layer
    const intersectionsRenderer = {
      type: "simple",
      symbol: {
        type: "simple-marker",
        color: null,
        outline: {
          color: "#ffffff",
          width: 0.5
        }
      },
      visualVariables: [
        {
          type: "size",
          valueExpression: "$view.scale",
          stops: [
            { size: 12, value: 500 },
            { size: 10, value: 9000 },
            { size: 0, value: 10000 }
          ]
        }
      ]
    };
  
    // Define the pop-up template for the Intersections layer
    const intersectionsPopupTemplate = {
      title: "Intersection Details",
      content: `
      <b>Control Type:</b> {Control_Ty}<br>
      <b>Crosswalk Type:</b> {Crosswalk}<br>
      <b>Intersection Roads:</b> {Intersecti}<br>
      <b>Number of Legs:</b> {LegsCount}<br>
      <b>Speed Limit:</b> {Max_Speed_} MPH
    `
    };
  
    // FeatureLayer for the Intersections layer
    const intersectionsLayer = new FeatureLayer({
      url:
        "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/MenloParkIntersections/FeatureServer",
      title: "Intersections",
      renderer: intersectionsRenderer,
      popupTemplate: intersectionsPopupTemplate
    });
  
    // Heatmap renderer for the Collisions layer
    const heatmapRenderer = {
      type: "heatmap",
      colorStops: [
        { color: "rgba(0, 0, 0, 0)", ratio: 0 }, // Transparent
        { color: "rgba(0, 0, 255, 1)", ratio: 0.1 }, // Blue
        { color: "rgba(0, 255, 255, 1)", ratio: 0.3 }, // Cyan
        { color: "rgba(0, 255, 0, 1)", ratio: 0.5 }, // Green
        { color: "rgba(255, 255, 0, 1)", ratio: 0.7 }, // Yellow
        { color: "rgba(255, 0, 0, 1)", ratio: 0.9 }, // Red
        { color: "rgba(255, 0, 0, 1)", ratio: 1 } // Red
      ],
      maxPixelIntensity: 120,
      minPixelIntensity: 1,
      blurRadius: 9
    };
  
    // Define the pop-up template for the Collisions layer
    const collisionsPopupTemplate = {
      title: "Collision Details",
      content: `
      <b>Collision Date:</b> {COLLISION_}<br>
      <b>Day of Week:</b> {DAY_OF_WEE}<br>
      <b>Reason for Collision:</b> {PCF_Viol_1}<br>
      <b>Type of Collision:</b> {TYPE_OF_CO}<br>
      <b>Resulting Injuries:</b> {severity}<br>
      <b>In School Zone?</b> {School_Buf}
    `
    };
  
    // FeatureLayer for Collisions with Heatmap renderer
    const collisionsLayer = new FeatureLayer({
      url:
        "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/MenloParkCollisions/FeatureServer",
      title: "Collisions",
      renderer: heatmapRenderer,
      opacity: 0.9,
      popupTemplate: collisionsPopupTemplate
    });
  
    // Renderer for the HIN layer
    const hinRenderer = {
      type: "class-breaks",
      field: "all_collis",
      legendOptions: {
        title: "Number of Collisions"
      },
      defaultSymbol: null,
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 10,
          symbol: {
            type: "simple-line",
            color: "#ffffb2", // Light yellow - lower collisions
            width: 0.75
          },
          label: "0 - 10 collisions"
        },
        {
          minValue: 11,
          maxValue: 30,
          symbol: {
            type: "simple-line",
            color: "#fd8d3c", // Orange - medium collisions
            width: 3
          },
          label: "11 - 30 collisions"
        },
        {
          minValue: 31,
          maxValue: 50,
          symbol: {
            type: "simple-line",
            color: "#f03b20", // Red - high collisions
            width: 4.5
          },
          label: "31 - 50 collisions"
        },
        {
          minValue: 51,
          maxValue: 70,
          symbol: {
            type: "simple-line",
            color: "#bd0026", // Dark red - high collisions
            width: 6
          },
          label: "51 - 70 collisions"
        }
      ]
    };
  
    // FeatureLayer for HIN with ClassBreaksRenderer
    const highInjuryNetworkLayer = new FeatureLayer({
      url:
        "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/SanMateoHIN/FeatureServer",
      title: "High Injury Network",
      renderer: hinRenderer,
      popupTemplate: {
        title: "HIN Info",
        content: "Number of collisions: {all_collis}"
      }
    });
  
    // FeatureLayer for the City Boundary with Renderer
    const cityBoundaryLayer = new FeatureLayer({
      url:
        "https://gisweb.menlopark.gov/server/rest/services/GISWeb/CityBoundaries/MapServer",
      title: "City Boundary",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "rgba(128, 0, 128, 0.6)",
          outline: {
            color: "rgba(128, 0, 128, 0.6)",
            width: 4,
            style: "dash"
          }
        }
      }
    });
  
    // Add the layers to the map
    map.addMany([
      cityBoundaryLayer,
      highInjuryNetworkLayer,
      intersectionsLayer,
      collisionsLayer
    ]);
  
    // Add the Search widget to the view
    const searchWidget = new Search({
      view: view, // Attach the Search widget to the map view
      allPlaceholder: "Search for places or features", // Placeholder text
      includeDefaultSources: true // Include default geocoders like Esri World Geocoder
    });
  
    // Add the Search widget to the top right of the UI
    view.ui.add(searchWidget, {
      position: "top-right"
    });
  
    // Set default definitionExpression to include all years
    collisionsLayer.definitionExpression =
      "ACCIDENT_Y >= 2017 AND ACCIDENT_Y <= 2021";
  
    // Listen for changes on the custom HTML slider
    const yearSlider = document.getElementById("yearSlider");
    const selectedYearLabel = document.getElementById("selectedYear");
  
    const yearMap = {
      0: "TOTAL",
      1: 2017,
      2: 2018,
      3: 2019,
      4: 2020,
      5: 2021
    };
  
    yearSlider.addEventListener("input", function () {
      const selectedValue = yearSlider.value;
      const selectedYear = yearMap[selectedValue];
  
      if (selectedValue === "0") {
        selectedYearLabel.textContent = "TOTAL";
        collisionsLayer.definitionExpression =
          "ACCIDENT_Y >= 2017 AND ACCIDENT_Y <= 2021";
      } else {
        selectedYearLabel.textContent = selectedYear;
        collisionsLayer.definitionExpression = `ACCIDENT_Y = ${selectedYear}`;
      }
  
      // Query and update the total collisions count
      updateCollisionCount();
    });
  
    // Function to update the collisions count
    function updateCollisionCount() {
      const totalCollisionsQuery = collisionsLayer.createQuery();
      collisionsLayer
        .queryFeatureCount(totalCollisionsQuery)
        .then(function (count) {
          document.getElementById("totalCollisionsCount").innerText = count;
        });
    }
  
    // Initial update of the collision count for all years
    updateCollisionCount();
  
    // Check for layer, then run the query for total collisions
    view.whenLayerView(collisionsLayer).then(function () {
      // Query to count total collisions
      const totalCollisionsQuery = new Query();
      totalCollisionsQuery.where = "1=1"; // Query for all features
      totalCollisionsQuery.returnGeometry = false;
      totalCollisionsQuery.outFields = ["ObjectID"];
  
      collisionsLayer
        .queryFeatureCount(totalCollisionsQuery)
        .then(function (count) {
          // Update the widget with the total number of collisions
          document.getElementById("totalCollisionsCount").innerText = count;
        })
        .catch(function (error) {
          console.error("Error querying the total collisions count: ", error);
        });
    });
    view.whenLayerView(collisionsLayer).then(function () {
      // Query for Day of Week
      const dayOfWeekQuery = collisionsLayer.createQuery();
      dayOfWeekQuery.where = "1=1";
      dayOfWeekQuery.outStatistics = [
        {
          onStatisticField: "DAY_OF_WEE",
          outStatisticFieldName: "dayOfWeek",
          statisticType: "count"
        }
      ];
      dayOfWeekQuery.groupByFieldsForStatistics = ["DAY_OF_WEE"];
  
      collisionsLayer.queryFeatures(dayOfWeekQuery).then(function (result) {
        const days = [];
        const counts = [];
  
        result.features.forEach(function (feature) {
          days.push(feature.attributes.DAY_OF_WEE);
          counts.push(feature.attributes.dayOfWeek);
        });
  
        // Create Day of Week Chart
        const ctx = document.getElementById("dayOfWeekChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: days,
            datasets: [
              {
                label: "Total Collisions by Day of Week",
                data: counts,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
  
      // Query for Month of Year
      const monthQuery = collisionsLayer.createQuery();
      monthQuery.where = "1=1";
      monthQuery.outStatistics = [
        {
          onStatisticField: "MONTH",
          outStatisticFieldName: "monthOfYear",
          statisticType: "count"
        }
      ];
      monthQuery.groupByFieldsForStatistics = ["MONTH"];
  
      collisionsLayer.queryFeatures(monthQuery).then(function (result) {
        const months = [];
        const counts = [];
  
        result.features.forEach(function (feature) {
          months.push(feature.attributes.MONTH); // Month of the year
          counts.push(feature.attributes.monthOfYear); // Count of collisions
        });
  
        // Create Month of Year Chart
        const ctx = document.getElementById("monthOfYearChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: months,
            datasets: [
              {
                label: "Total Collisions by Month",
                data: counts,
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
    });
  
    // Add the legend widget
    const legend = new Legend({
      view: view,
      layerInfos: [
        { layer: intersectionsLayer },
        { layer: collisionsLayer },
        { layer: highInjuryNetworkLayer },
        { layer: cityBoundaryLayer }
      ]
    });
  
    // Expand widget for the legend
    const legendExpand = new Expand({
      view: view,
      content: legend
    });
  
    view.ui.add(legendExpand, "top-right");
  
    // Toggle visibility
    document
      .getElementById("boundaryLayer")
      .addEventListener("change", function (e) {
        cityBoundaryLayer.visible = e.target.checked;
      });
  
    document.getElementById("hinLayer").addEventListener("change", function (e) {
      highInjuryNetworkLayer.visible = e.target.checked;
    });
  
    document
      .getElementById("intersectionsLayer")
      .addEventListener("change", function (e) {
        intersectionsLayer.visible = e.target.checked;
      });
  
    document
      .getElementById("collisionsLayer")
      .addEventListener("change", function (e) {
        collisionsLayer.visible = e.target.checked;
      });
  
    const basemapGallery = new BasemapGallery({
      view: view,
      source: {
        portal: "https://arcgis.com",
        // Allow only Dark Grey, Imagery, and OpenStreetMap basemaps
        filterFunction: async (item, index, basemaps) => {
          let allowed = false;
          await item.load().then((loadedBasemap) => {
            const allowedTitles = [
              "Dark Gray Canvas",
              "Imagery",
              "OpenStreetMap"
            ];
            // Check if the basemap title is in the allowedTitles array
            if (allowedTitles.includes(loadedBasemap.title)) {
              allowed = true;
            }
          });
          return allowed;
        }
      }
    });
    const basemapGalleryExpand = new Expand({
      view: view,
      content: basemapGallery,
      expanded: false
    });
    view.ui.add(basemapGalleryExpand, {
      position: "bottom-right"
    });
  });
  
