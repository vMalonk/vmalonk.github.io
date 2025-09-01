let images = [];
let currentPage = 1;
const perPage = 12;
let filteredImages = [];

const galeriaDiv = document.getElementById('galeria');
const yearFilter = document.getElementById('yearFilter');
const categoryFilter = document.getElementById('categoryFilter');

// Modal
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');

function openModal(src) {
  modal.style.display = 'flex';
  modalImg.src = src;
}
modalClose.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; }

// Cargar galeria.json
fetch('galeria.json')
  .then(res => res.json())
  .then(data => {
    // Ordenar por año descendente
    images = data.sort((a,b) => b.year - a.year);
    filteredImages = images; // por defecto mostrar todo
    populateFilters();
    renderGallery(); 
  })
  .catch(err => console.error('Error cargando la galería:', err));

// -------------------- FILTROS --------------------
function populateFilters() {
  // Years
    yearFilter.innerHTML = ""; // Limpia cualquier opción previa

    const defaultYearOpt = document.createElement('option');
    defaultYearOpt.value = "all";
    defaultYearOpt.textContent = "Todos";
    yearFilter.appendChild(defaultYearOpt);

    const years = [...new Set(images.map(i => i.year))].sort((a,b) => b - a);
    years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearFilter.appendChild(opt);
    });

  // Categories/tags
  const allTags = [...new Set(images.flatMap(img => img.tags))].sort();
  const defaultOpt = document.createElement('option');
  defaultOpt.value = "all";
  defaultOpt.textContent = "Todas";
  categoryFilter.appendChild(defaultOpt);

  allTags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    categoryFilter.appendChild(opt);
  });

  // Eventos
  yearFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
}

// -------------------- FILTRAR --------------------
function applyFilters() {
  const year = yearFilter.value;
  const tag = categoryFilter.value;

  filteredImages = images.filter(img => 
    (year === "" || year === "all" || img.year == year) &&
    (tag === "all" || img.tags.includes(tag))
  );

  currentPage = 1;
  galeriaDiv.innerHTML = "";
  renderGallery();
}

// -------------------- RENDER GALERÍA --------------------
function renderGallery() {
  const start = (currentPage-1) * perPage;
  const end = start + perPage;
  const slice = filteredImages.slice(start,end);

  slice.forEach(img => {
    const imgEl = document.createElement('img');
    imgEl.src = img.url;
    imgEl.loading = 'lazy'; // lazy load
    imgEl.onclick = () => openModal(img.url);
    galeriaDiv.appendChild(imgEl);
  });
}

// -------------------- SCROLL INFINITO --------------------
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    const totalPages = Math.ceil(filteredImages.length / perPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderGallery();
    }
  }
});
