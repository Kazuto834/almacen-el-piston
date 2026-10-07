const sections = [...document.querySelectorAll(".page-section")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const breadcrumb = document.getElementById("breadcrumb");
const sidebar = document.getElementById("sidebar");

const labels = {
  inicio:"Panel general", inventario:"Inventario", productos:"Productos",
  ubicaciones:"Ubicaciones", ordenes:"Órdenes de salida", empleados:"Personal",
  reportes:"Reportes", ayuda:"Ayuda"
};

function showSection(id){
  if(!document.getElementById(id)) id="inicio";
  sections.forEach(s=>s.classList.toggle("active",s.id===id));
  navLinks.forEach(a=>a.classList.toggle("active",a.dataset.section===id));
  breadcrumb.innerHTML = `Inicio <span>/</span> ${labels[id] || id}`;
  sidebar.classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
function route(){
  showSection(location.hash.replace("#","") || "inicio");
}
window.addEventListener("hashchange",route);
document.addEventListener("DOMContentLoaded",route);

document.querySelectorAll("[data-go]").forEach(btn=>{
  btn.addEventListener("click",()=>location.hash=btn.dataset.go);
});

document.getElementById("menuBtn").addEventListener("click",()=>sidebar.classList.toggle("open"));

const modalBackdrop=document.getElementById("modalBackdrop");
const modalTitle=document.getElementById("modalTitle");
const modalText=document.getElementById("modalText");
const modalForm=document.getElementById("modalForm");
const modalAction=document.getElementById("modalAction");

function openModal(title,type){
  modalTitle.textContent=title || "Detalle";
  modalForm.classList.toggle("hidden", !["nuevo","editar","orden"].includes(type));
  const texts={
    detalle:"Esta pantalla muestra cómo quedaría la consulta. Los datos son de demostración y no se guardan en una base de datos.",
    nuevo:"Aquí podrás capturar los datos cuando se conecte el sistema con la base de datos.",
    editar:"Formulario visual de edición. En esta versión los cambios no se persisten.",
    orden:"Formulario visual para crear una orden de salida y asignar un empleado."
  };
  modalText.textContent=texts[type] || texts.detalle;
  modalAction.textContent=type==="detalle"?"Cerrar":"Simular guardado";
  modalBackdrop.classList.add("open");
}
function closeModal(){modalBackdrop.classList.remove("open")}
document.getElementById("modalClose").addEventListener("click",closeModal);
modalBackdrop.addEventListener("click",e=>{if(e.target===modalBackdrop)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.querySelectorAll("[data-modal]").forEach(btn=>{
  btn.addEventListener("click",()=>openModal(btn.dataset.title,btn.dataset.modal));
});
modalAction.addEventListener("click",()=>{closeModal();showToast("Acción simulada correctamente.");});

const inventoryRows=[...document.querySelectorAll("#inventoryTable tbody tr")];
function filterInventory(){
  const q=document.getElementById("inventorySearch").value.toLowerCase().trim();
  const cat=document.getElementById("categoryFilter").value;
  let visible=0;
  inventoryRows.forEach(row=>{
    const okText=!q || row.dataset.search.includes(q);
    const okCat=!cat || row.dataset.category===cat;
    row.style.display=okText&&okCat?"":"none";
    if(okText&&okCat)visible++;
  });
  document.getElementById("inventoryCount").textContent=`Mostrando ${visible} producto${visible===1?"":"s"}`;
}
document.getElementById("searchInventory").addEventListener("click",filterInventory);
document.getElementById("inventorySearch").addEventListener("input",filterInventory);
document.getElementById("categoryFilter").addEventListener("change",filterInventory);
document.getElementById("clearInventory").addEventListener("click",()=>{
  document.getElementById("inventorySearch").value="";
  document.getElementById("categoryFilter").value="";
  filterInventory();
});

document.querySelectorAll(".zone").forEach(z=>{
  z.addEventListener("click",()=>openModal(`${z.dataset.zone} · Vista de zona`,"detalle"));
});

document.querySelectorAll(".filter-pill").forEach(p=>{
  p.addEventListener("click",()=>{
    document.querySelectorAll(".filter-pill").forEach(x=>x.classList.remove("active"));
    p.classList.add("active");
    showToast("Filtro seleccionado. Los datos son de demostración.");
  });
});

document.querySelectorAll(".report-card").forEach(card=>{
  card.addEventListener("click",()=>{
    const data={
      stock:["Stock por ubicación","Detalle de productos y cantidades por coordenada física."],
      eficiencia:["Eficiencia de recolección","Órdenes completadas por empleado durante el turno."],
      vacias:["Ubicaciones vacías","Espacios disponibles para recibir nueva mercancía."]
    }[card.dataset.report];
    document.getElementById("reportTitle").textContent=data[0];
    document.getElementById("reportDescription").textContent=data[1];
    document.querySelector(".report-preview").scrollIntoView({behavior:"smooth",block:"start"});
  });
});

document.getElementById("printReport").addEventListener("click",()=>window.print());

document.getElementById("themeBtn").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("piston-theme",document.body.classList.contains("dark")?"dark":"light");
});
if(localStorage.getItem("piston-theme")==="dark")document.body.classList.add("dark");

function showToast(message){
  const toast=document.getElementById("toast");
  toast.querySelector("small").textContent=message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2800);
}

document.querySelectorAll(".text-btn").forEach(btn=>{
  if(!btn.dataset.go) btn.addEventListener("click",()=>showToast("Función de demostración: no se genera ningún archivo real."));
});
