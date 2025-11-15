const LANG = {
  ca: {
    // UI geral
    title: "Fonts d'aigua BCN (2025)",
    subtitle: "Mapa interactiu de fonts d'aigua potable a Barcelona (2019–2024), integrant dades de fonts i de població per districte per analitzar l'accés a l'aigua pública.",
    source: "Dades: Open Data Barcelona.",
    filter: "Filtrar per districte",
    locate: "📍 Mostrar font més propera",
    nearestPrefix: "Font més propera",
    about: "Sobre aquest projecte i l'anàlisi de dades",
    geoNotSupported: "Geolocalització no suportada.",
    allOption: "— Tots —",
    visibleLabel: "Fonts visibles",
    youAreHere: "Ets aquí",

    // teaser de insights (sidebar)
    insightsTeaserTitle: "Insights de dades",
    insightsTeaserText: "Consulta els gràfics de fonts per districte i fonts per 1.000 habitants per entendre millor les possibles desigualtats d'accés a l'aigua pública a Barcelona.",
    insightsTeaserLink: "Veure els insights",

    // textos da secção de insights (abaixo do mapa)
    insightsTitle: "Insights de dades",

    insights1Title: "Fonts per districte (2024)",
    insights1Text: "Alguns districtes concentren moltes més fonts que altres en termes absoluts. Quan normalitzem per població, la classificació canvia i revela diferències en l'accés real.",

    insights2Title: "Fonts per 1.000 habitants",
    insights2Text: "L'indicador de fonts per 1.000 habitants mostra disparitats rellevants entre districtes, especialment quan es comparen zones centrals i perifèriques.",

    insights3Title: "Variabilitat temporal de l’accessibilitat (2019–2024)",
    insights3Text: "La desviació estàndard del nombre de fonts per 1.000 habitants permet identificar quins districtes presenten majors fluctuacions al llarg del temps.",

    insightsSummaryTitle: "Resum final de l’anàlisi",
    insightsSummaryText1: "La combinació d’indicadors absoluts, valors per càpita i variabilitat temporal ofereix una visió completa de l’accessibilitat a les fonts públiques.",
    insightsSummaryText2: "La normalització revela desigualtats territorials que no són visibles quan només es consideren els valors absoluts.",
    insightsSummaryText3: "L’estudi de la variabilitat temporal permet identificar patrons d’estabilitat i canvi útils per a la planificació urbana i la gestió pública."
  },

  en: {
    title: "Barcelona Water Fountains (2025)",
    subtitle: "Interactive map of public drinking fountains in Barcelona (2019–2024), combining fountain and population data by district to analyse access to public water.",
    source: "Data: Open Data BCN.",
    filter: "Filter by district",
    locate: "📍 Show nearest fountain",
    nearestPrefix: "Nearest fountain",
    about: "About this project and data analysis",
    geoNotSupported: "Geolocation not supported.",
    allOption: "— All —",
    visibleLabel: "Visible fountains",
    youAreHere: "You are here",

    insightsTeaserTitle: "Data insights",
    insightsTeaserText: "See the charts of fountains per district and fountains per 1,000 inhabitants to better understand possible inequalities in access to public water in Barcelona.",
    insightsTeaserLink: "View insights",

    insightsTitle: "Data insights",

    insights1Title: "Fountains per district (2024)",
    insights1Text: "Some districts contain far more fountains than others in absolute terms. When normalised by population, rankings shift and reveal meaningful differences in real accessibility.",

    insights2Title: "Fountains per 1,000 inhabitants",
    insights2Text: "The indicator of fountains per 1,000 inhabitants shows relevant disparities across districts, especially when comparing central and peripheral areas.",

    insights3Title: "Temporal variability of accessibility (2019–2024)",
    insights3Text: "The standard deviation of fountains per 1,000 inhabitants highlights which districts experienced the greatest fluctuations over time.",

    insightsSummaryTitle: "Final analysis summary",
    insightsSummaryText1: "Combining absolute values, per-capita indicators and temporal variability provides a comprehensive view of public water accessibility.",
    insightsSummaryText2: "Normalisation reveals territorial inequities that are not visible when only absolute values are considered.",
    insightsSummaryText3: "Temporal variability highlights stability and change patterns that are useful for urban planning and public resource management."
  },

  es: {
    title: "Fuentes de Agua de Barcelona (2025)",
    subtitle: "Mapa interactivo de fuentes de agua potable en Barcelona (2019–2024), combinando datos de fuentes y población por distrito para analizar el acceso al agua pública.",
    source: "Datos: Open Data BCN.",
    filter: "Filtrar por distrito",
    locate: "📍 Mostrar fuente más cercana",
    nearestPrefix: "Fuente más cercana",
    about: "Sobre este proyecto y el análisis de datos",
    geoNotSupported: "Geolocalización no soportada.",
    allOption: "— Todos —",
    visibleLabel: "Fuentes visibles",
    youAreHere: "Estás aquí",

    insightsTeaserTitle: "Insights de datos",
    insightsTeaserText: "Consulta los gráficos de fuentes por distrito y fuentes por 1.000 habitantes para entender mejor las posibles desigualdades en el acceso al agua pública en Barcelona.",
    insightsTeaserLink: "Ver insights",

    insightsTitle: "Insights de datos",

    insights1Title: "Fuentes por distrito (2024)",
    insights1Text: "Algunos distritos concentran muchas más fuentes que otros en términos absolutos. Al normalizar por población, la clasificación cambia y revela diferencias reales en el acceso.",

    insights2Title: "Fuentes por 1.000 habitantes",
    insights2Text: "El indicador de fuentes por 1.000 habitantes muestra disparidades relevantes entre distritos, especialmente al comparar zonas centrales y periféricas.",

    insights3Title: "Variabilidad temporal de la accesibilidad (2019–2024)",
    insights3Text: "La desviación estándar del número de fuentes por 1.000 habitantes permite identificar qué distritos presentan mayores fluctuaciones a lo largo del tiempo.",

    insightsSummaryTitle: "Resumen final del análisis",
    insightsSummaryText1: "La combinación de valores absolutos, indicadores per cápita y variabilidad temporal ofrece una visión completa de la accesibilidad a las fuentes públicas.",
    insightsSummaryText2: "La normalización revela desigualdades territoriales que no se observan al analizar solo los valores absolutos.",
    insightsSummaryText3: "El análisis de la variabilidad temporal permite identificar patrones de estabilidad y cambio útiles para la planificación urbana y la gestión pública."
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
