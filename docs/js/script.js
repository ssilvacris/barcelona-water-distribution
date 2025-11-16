// Path to the CSV file inside assets/data
const CSV_FILE = 'assets/data/2025_fonts_beure_with_district.csv';

// Optional mapping from code prefix to district (fallback)
const codeToDistrict = {
  "01": "Ciutat Vella",
  "02": "Eixample",
  "03": "Sants-Montjuïc",
  "04": "Les Corts",
  "05": "Sarrià-Sant Gervasi",
  "06": "Gràcia",
  "07": "Horta-Guinardó",
  "08": "Nou Barris",
  "09": "Sant Andreu",
  "10": "Sant Martí",
};

// Initialize Leaflet map
const map = L.map('map').setView([41.387, 2.17], 12); // Barcelona center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

let allFountains = [];
let markersLayer = L.layerGroup().addTo(map);

// DOM helpers
const countInfoEl = document.getElementById('countInfo');
const nearestInfoEl = document.getElementById('nearestInfo');
const districtFilterEl = document.getElementById('districtFilter');
const locateBtnEl = document.getElementById('locateBtn');

// Load CSV with PapaParse
fetch(CSV_FILE)
  .then(res => res.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        allFountains = results.data
          .filter(r => r.LATITUD && r.LONGITUD)
          .map(r => {
            let district = r.DISTRICTE || r.DISTRICT || "";
            if (!district && r.CODI) {
              const prefix = r.CODI.split('-')[0];
              district = codeToDistrict[prefix] || "";
            }
            return {
              code: r.CODI,
              name: r.NOM,
              street: r.CARRER,
              num: r.NUMERO_CARRER,
              lat: parseFloat(r.LATITUD),
              lon: parseFloat(r.LONGITUD),
              district: district
            };
          });

        renderFountains();
        populateDistrictFilter();
        updateCountInfo(allFountains.length, allFountains.length);
      }
    });
  })
  .catch(err => console.error("Error loading CSV:", err));

// Render markers and list
function renderFountains(selectedDistrict = "") {
  markersLayer.clearLayers();
  const listEl = document.getElementById('fountainList');
  if (!listEl) return;
  listEl.innerHTML = "";

  const filtered = selectedDistrict
    ? allFountains.filter(f => f.district === selectedDistrict)
    : allFountains;

  filtered.forEach(f => {
    const marker = L.marker([f.lat, f.lon]).addTo(markersLayer);
    marker.bindPopup(
      `<b>${f.name || "Fountain"}</b><br>${f.street || ""} ${f.num || ""}<br><i>${f.district || ""}</i>`
    );

    const item = document.createElement('div');
    item.className = 'fountain-item';
    item.textContent = f.name ? f.name : `Fountain ${f.code}`;
    item.onclick = () => {
      map.setView([f.lat, f.lon], 17);
      marker.openPopup();
    };
    listEl.appendChild(item);
  });

  if (filtered.length > 0) {
    const bounds = L.latLngBounds(filtered.map(f => [f.lat, f.lon]));
    map.fitBounds(bounds, { padding: [20, 20] });
  }

  updateCountInfo(filtered.length, allFountains.length);
}

function updateCountInfo(visible, total) {
  if (!countInfoEl) return;
  countInfoEl.textContent = `Visible fountains: ${visible} | Total: ${total}`;
}

// Populate district filter
function populateDistrictFilter() {
  if (!districtFilterEl) return;

  const districts = Array.from(new Set(
    allFountains.map(f => f.district).filter(Boolean)
  )).sort();

  districtFilterEl.innerHTML = "";
  const firstOpt = document.createElement("option");
  firstOpt.value = "";
  firstOpt.textContent = "— All —";
  districtFilterEl.appendChild(firstOpt);

  districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    districtFilterEl.appendChild(opt);
  });
}

if (districtFilterEl) {
  districtFilterEl.addEventListener('change', (e) => {
    renderFountains(e.target.value);
  });
}

// Helper for geolocation messages
function setNearestMessage(msg) {
  if (nearestInfoEl) {
    nearestInfoEl.textContent = msg;
  }
}

// Geolocation: find nearest fountain
if (locateBtnEl) {
  locateBtnEl.addEventListener('click', () => {
    if (!navigator.geolocation) {
      setNearestMessage("Geolocation not supported by your browser.");
      alert("Geolocation not supported by your browser.");
      return;
    }

    setNearestMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      pos => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;

        setNearestMessage("Location found. Searching nearest fountain...");

        L.circleMarker([userLat, userLon], { radius: 6, color: 'blue' })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
        map.setView([userLat, userLon], 14);

        const nearest = findNearestFountain(userLat, userLon, allFountains);
        if (nearest) {
          L.polyline([[userLat, userLon], [nearest.lat, nearest.lon]], {
            color: 'blue',
            dashArray: '4'
          }).addTo(map);

          setNearestMessage(
            `Nearest fountain: ${nearest.name || nearest.code} – ${nearest.distance.toFixed(0)} m (${nearest.district || "—"})`
          );

          L.marker([nearest.lat, nearest.lon])
            .addTo(map)
            .bindPopup(
              `<b>${nearest.name || "Fountain"}</b><br>${nearest.street || ""} ${nearest.num || ""}<br><i>${nearest.district || ""}</i>`
            )
            .openPopup();
        } else {
          setNearestMessage("No nearby fountain found.");
        }
      },
      error => {
        setNearestMessage("Could not get your location: " + error.message);
      }
    );
  });
}

// Distance: Haversine formula
function findNearestFountain(lat, lon, fountains) {
  let nearest = null;
  let minDist = Infinity;
  fountains.forEach(f => {
    const d = haversine(lat, lon, f.lat, f.lon);
    if (d < minDist) {
      minDist = d;
      nearest = { ...f, distance: d };
    }
  });
  return nearest;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Dark mode toggle
const darkBtn = document.getElementById('darkModeBtn');
if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}
