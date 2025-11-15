const LANG = {
  ca: {
    title: "Fonts d'aigua BCN (2025)",
    source: "Dades: Open Data Barcelona.",
    filter: "Filtrar per districte",
    locate: "📍 Mostrar font més propera",
    nearestPrefix: "Font més propera",
    about: "Sobre aquest projecte",
    geoNotSupported: "Geolocalització no suportada.",
    allOption: "— Tots —",
    visibleLabel: "Fonts visibles",

    // 🟦 Teaser (CAT)
    insightsTitle: "Insights de dades",
    insightsText:
      "Consulta els gràfics de fonts per districte i fonts per 1.000 habitants per entendre millor les possibles desigualtats d'accés a l'aigua pública a Barcelona.",
    insightsLink: "Veure els insights"
  },

  en: {
    title: "Barcelona Water Fountains (2025)",
    source: "Data: Open Data BCN.",
    filter: "Filter by district",
    locate: "📍 Show nearest fountain",
    nearestPrefix: "Nearest fountain",
    about: "About this project",
    geoNotSupported: "Geolocation not supported.",
    allOption: "— All —",
    visibleLabel: "Visible fountains",

    // 🟦 Teaser (EN)
    insightsTitle: "Data insights",
    insightsText:
      "Explore charts showing fountains per district and per 1,000 inhabitants to better understand differences in public water access across Barcelona.",
    insightsLink: "View insights"
  },

  es: {
    title: "Fuentes de agua de Barcelona (2025)",
    source: "Datos: Open Data Barcelona.",
    filter: "Filtrar por distrito",
    locate: "📍 Mostrar fuente más cercana",
    nearestPrefix: "Fuente más cercana",
    about: "Sobre este proyecto",
    geoNotSupported: "Geolocalización no soportada.",
    allOption: "— Todos —",
    visibleLabel: "Fuentes visibles",

    // 🟦 Teaser (ES)
    insightsTitle: "Insights de datos",
    insightsText:
      "Consulta los gráficos de fuentes por distrito y por 1.000 habitantes para entender mejor las posibles desigualdades de acceso al agua pública en Barcelona.",
    insightsLink: "Ver insights"
  }
};



let currentLang = "ca";

// inicializa mapa
const map = L.map('map').setView([41.387, 2.17], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

let allFountains = [];
let markersLayer = L.layerGroup().addTo(map);

// helpers de DOM
const countInfoEl = document.getElementById('countInfo');
const nearestInfoEl = document.getElementById('nearestInfo');
const districtFilterEl = document.getElementById('districtFilter');
const locateBtnEl = document.getElementById('locateBtn');

// carrega CSV
fetch(CSV_FILE)
  .then(res => res.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
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
  .catch(err => console.error("Erro ao carregar CSV:", err));

// renderização dos marcadores
function renderFountains(selectedDistrict = "") {
  markersLayer.clearLayers();
  const listEl = document.getElementById('fountainList');
  listEl.innerHTML = "";

  const filtered = selectedDistrict
    ? allFountains.filter(f => f.district === selectedDistrict)
    : allFountains;

  filtered.forEach(f => {
    const marker = L.marker([f.lat, f.lon]).addTo(markersLayer);
    marker.bindPopup(
      `<b>${f.name || "Font"}</b><br>${f.street || ""} ${f.num || ""}<br><i>${f.district || ""}</i>`
    );

    const item = document.createElement('div');
    item.className = 'fountain-item';
    item.textContent = f.name ? f.name : `Font ${f.code}`;
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
  const LText = LANG[currentLang];

  // guarda os valores atuais para poder reaproveitar na troca de idioma
  countInfoEl.dataset.visible = String(visible);
  countInfoEl.dataset.total = String(total);

  countInfoEl.textContent = `${LText.visibleLabel}: ${visible} | Total: ${total}`;
}

// filtro distrital
function populateDistrictFilter() {
  if (!districtFilterEl) return;

  const districts = Array.from(new Set(
    allFountains.map(f => f.district).filter(Boolean)
  )).sort();
  
  // mantém a primeira opção para "todos"
  districtFilterEl.innerHTML = "";
  const firstOpt = document.createElement("option");
  firstOpt.value = "";
  firstOpt.textContent = LANG[currentLang].allOption;
  districtFilterEl.appendChild(firstOpt);

  districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    districtFilterEl.appendChild(opt);
  });
}
// Apply Language
function applyLanguage(langCode) {
  currentLang = langCode;
  const LText = LANG[langCode];

  document.getElementById("appTitle").textContent = LText.title;
  document.getElementById("dataSourceText").textContent = LText.source;
  document.getElementById("districtLabel").textContent = LText.filter;
  document.getElementById("locateBtn").textContent = LText.locate;
  document.getElementById("aboutLink").textContent = LText.about;

  // 🆕 Teaser
  document.getElementById("insightsTeaserTitle").textContent = LText.insightsTitle;
  document.getElementById("insightsTeaserText").textContent = LText.insightsText;
  document.getElementById("insightsTeaserLink").textContent = LText.insightsLink;

  // atualizar texto "Fonts visibles"
  updateCountInfo(
    parseInt((document.getElementById('countInfo').dataset.visible || allFountains.length), 10) || allFountains.length,
    allFountains.length
  );

  // atualizar opção “todos”
  const select = document.getElementById("districtFilter");
  if (select.options.length > 0) {
    select.options[0].textContent = LText.allOption;
  }
}

if (districtFilterEl) {
  districtFilterEl.addEventListener('change', (e) => {
    renderFountains(e.target.value);
  });
}

// helper para mensagens da geolocalização
function setNearestMessage(msg) {
  if (nearestInfoEl) {
    nearestInfoEl.textContent = msg;
  }
}

// geolocalização (melhor UX)
if (locateBtnEl) {
  locateBtnEl.addEventListener('click', () => {
    const LText = LANG[currentLang];

    if (!navigator.geolocation) {
      // em vez de só alert, também mostra no painel
      setNearestMessage(LText.geoNotSupported);
      alert(LText.geoNotSupported);
      return;
    }

    setNearestMessage("Obtenint la teva ubicació...");

    navigator.geolocation.getCurrentPosition(
      pos => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;

        setNearestMessage("Ubicació trobada. Calculant la font més propera...");

        // marcador do utilizador
        L.circleMarker([userLat, userLon], { radius: 6, color: 'blue' })
          .addTo(map)
          .bindPopup(LText.youAreHere)
          .openPopup();
        map.setView([userLat, userLon], 14);

        const nearest = findNearestFountain(userLat, userLon, allFountains);
        if (nearest) {
          L.polyline([[userLat, userLon], [nearest.lat, nearest.lon]], {
            color: 'blue',
            dashArray: '4'
          }).addTo(map);

          setNearestMessage(
            `${LText.nearestPrefix}: ${nearest.name || nearest.code} – ${nearest.distance.toFixed(0)} m (${nearest.district || "—"})`
          );

          L.marker([nearest.lat, nearest.lon])
            .addTo(map)
            .bindPopup(
              `<b>${nearest.name || "Font"}</b><br>${nearest.street || ""} ${nearest.num || ""}<br><i>${nearest.district || ""}</i>`
            )
            .openPopup();
        } else {
          setNearestMessage("No s'ha trobat cap font propera.");
        }
      },
      error => {
        setNearestMessage(
          "No s'ha pogut obtenir la ubicació (" + error.message + ")."
        );
      }
    );
  });
}

// distância
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

// fórmula de Haversine
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
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

// Dark mode
document.getElementById('darkModeBtn').onclick = () => {
  document.body.classList.toggle('dark');
};

// Idioma
function applyLanguage(langCode) {
  currentLang = langCode;
  const LText = LANG[langCode];

  document.getElementById("appTitle").textContent = LText.title;
  document.getElementById("dataSourceText").textContent = LText.source;
  document.getElementById("districtLabel").textContent = LText.filter;
  document.getElementById("locateBtn").textContent = LText.locate;
  document.getElementById("aboutLink").textContent = LText.about;

  // atualizar texto "Fonts visibles" reaproveitando os dados atuais
  if (countInfoEl) {
    const visible = parseInt(countInfoEl.dataset.visible || allFountains.length, 10) || allFountains.length;
    const total = parseInt(countInfoEl.dataset.total || allFountains.length, 10) || allFountains.length;
    updateCountInfo(visible, total);
  }

  // atualizar opção "todos" no filtro
  if (districtFilterEl && districtFilterEl.options.length > 0) {
    districtFilterEl.options[0].textContent = LText.allOption;
  }
}

document.getElementById("langSelect").addEventListener("change", (e) => {
  applyLanguage(e.target.value);
});

// idioma padrão
applyLanguage("ca");
