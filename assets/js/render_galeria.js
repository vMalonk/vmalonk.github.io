let images = [];
let currentPage = 1;
const perPage = 12;
let filteredImages = [];

const galeriaDiv = document.getElementById('galeria');
const yearFilter = document.getElementById('yearFilter');
const categoryFilter = document.getElementById('categoryFilter');
const paginationDiv = document.getElementById('pagination');

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');

// Modal
function openModal(src) {
  modal.style.display = 'flex';
  modalImg.src = src;
}

modalClose.onclick = () => { modal.style.display = 'none'; }
modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; }

// Cargar galeria.json
fetch('galeria.json')
  .then(res => res.json())
  .then(data => {
    images = data.sort((a,b) => b.year - a.year);
    populateFilters();
    applyFilters();
  })
  .catch(err => console.error('Error cargando la galería:', err));

// -------------------- FILTROS --------------------
function populateFilters() {
  // FILTRO POR AÑO
  const years = [...new Set(images.map(i => i.year))].sort((a,b) => b - a);
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearFilter.appendChild(opt);
  });

  // FILTRO POR TAGS
  const defaultOpt = document.createElement('option');
  defaultOpt.value = "all";
  defaultOpt.textContent = "Todas";
  categoryFilter.appendChild(defaultOpt);

  const tags = [...new Set(images.flatMap(i => i.tags))].sort();
  tags.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    categoryFilter.appendChild(opt);
  });

  yearFilter.addEventListener('change', () => { currentPage = 1; applyFilters(); });
  categoryFilter.addEventListener('change', () => { currentPage = 1; applyFilters(); });
}

function applyFilters() {
  const year = yearFilter.value;
  const tag = categoryFilter.value;

  filteredImages = images.filter(img => 
    (year === "" || img.year == year) &&
    (tag === "all" || img.tags.includes(tag))
  );

  renderGallery();
  renderPagination();
}

// -------------------- GALERÍA --------------------
function renderGallery() {
  galeriaDiv.innerHTML = "";
  const start = (currentPage-1) * perPage;
  const end = start + perPage;
  filteredImages.slice(start, end).forEach(img => {
    const imgEl = document.createElement('img');
    imgEl.src = img.url;
    imgEl.onclick = () => openModal(img.url);
    galeriaDiv.appendChild(imgEl);
  });
}

// -------------------- PAGINACIÓN --------------------
function renderPagination() {
  paginationDiv.innerHTML = "";
  const totalPages = Math.ceil(filteredImages.length / perPage);
  if(totalPages <= 1) return;

  for(let i=1; i<=totalPages; i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i===currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => { currentPage = i; renderGallery(); renderPagination(); });
    paginationDiv.appendChild(btn);
  }
}
