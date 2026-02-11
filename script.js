// Productos
let products = [
  {id:1, name:"Big Tutto Burger", category:"burgers", price:4500},
  {id:2, name:"Cheese Premium", category:"burgers", price:5000},
  {id:3, name:"Pizza Napolitana", category:"pizzas", price:6000},
  {id:4, name:"Pizza Pepperoni", category:"pizzas", price:6500},
  {id:5, name:"Coca Cola", category:"bebidas", price:500},
  {id:6, name:"Brownie", category:"postres", price:350}
];

// Toppings hamburguesas
let toppings = [
  {name:"Queso Extra", price:100},
  {name:"Bacon", price:200},
  {name:"Extra Carne", price:250}
];

let cart = [];
let currentBurger = null;

// Render productos
function renderProducts(filter='all'){
  let grid = document.getElementById('productsGrid');
  grid.innerHTML='';
  products.forEach(p=>{
    if(filter==='all' || p.category===filter){
      let div = document.createElement('div');
      div.className='food-card '+p.category;
      div.innerHTML=`<img src="${p.name.replace(/ /g,'').toLowerCase()}.jpg" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">$${p.price}</p>
      <button onclick="selectProduct(${p.id}, this)">Agregar +</button>`;
      grid.appendChild(div);
    }
  });
  hideToppings();
}

// Filtrar
function filterMenu(cat){
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts(cat);
}

// Selección producto
function selectProduct(id, btn){
  let p = products.find(x=>x.id===id);
  animateToCart(btn);
  if(p.category==='burgers'){
    currentBurger=p;
    showToppings();
  }else{
    cart.push({product:p, toppings:[]});
    updateCart();
  }
}

// Animación producto al carrito
function animateToCart(btn){
  let img = btn.parentNode.querySelector('img');
  let clone = img.cloneNode(true);
  let rect = img.getBoundingClientRect();
  clone.style.position='fixed';
  clone.style.left=rect.left+'px';
  clone.style.top=rect.top+'px';
  clone.style.width=rect.width+'px';
  clone.style.transition='all 0.7s ease-in-out';
  document.body.appendChild(clone);
  setTimeout(()=>{
    clone.style.top=(window.innerHeight-100)+'px';
    clone.style.left=(window.innerWidth-50)+'px';
    clone.style.width='30px';
    clone.style.opacity='0';
  },50);
  setTimeout(()=>clone.remove(),750);
}

// Mostrar toppings
function showToppings(){
  let section = document.getElementById('toppingsSection');
  section.style.display='block';
  let container = document.getElementById('toppingsButtons');
  container.innerHTML='';
  toppings.forEach(t=>{
    let btn = document.createElement('button');
    btn.innerText=`${t.name} +$${t.price}`;
    btn.onclick=()=>addToBurger(t, btn);
    container.appendChild(btn);
  });
}

// Agregar topping
function addToBurger(topping, btn){
  btn.style.transform='scale(1.2)';
  setTimeout(()=>btn.style.transform='scale(1)',200);
  let found = cart.find(c=>c.product===currentBurger);
  if(found) found.toppings.push(topping);
  else cart.push({product:currentBurger, toppings:[topping]});
  updateCart();
}

// Ocultar toppings
function hideToppings(){
  document.getElementById('toppingsSection').style.display='none';
  currentBurger=null;
}

// Carrito
function updateCart(){
  let container = document.getElementById('cartItems');
  container.innerHTML='';
  let total=0;
  cart.forEach((c,i)=>{
    let sum = c.product.price + c.toppings.reduce((a,b)=>a+b.price,0);
    total+=sum;
    let div=document.createElement('div');
    div.innerHTML=`${c.product.name} - $${sum} ${c.toppings.map(t=>t.name).join(', ')}
    <button onclick="removeFromCart(${i})">❌</button>`;
    container.appendChild(div);
  });
  document.getElementById('totalPrice').innerText=`$${total}`;
  document.getElementById('cartCount').innerText=cart.length;
}

// Quitar del carrito
function removeFromCart(i){
  cart.splice(i,1);
  updateCart();
}

// Ubicación
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(p=>{
      document.getElementById('locationText').innerText=`Ubicación: ${p.coords.latitude}, ${p.coords.longitude}`;
    }, ()=>alert('No se pudo obtener la ubicación'));
  }
}

// WhatsApp
function sendWhatsApp(){
  if(cart.length===0){ alert('No hay productos en el carrito'); return; }
  let text='Pedido: ';
  cart.forEach(c=>text+=`${c.product.name} (+${c.toppings.map(t=>t.name).join(',')}) - $${c.product.price}\n`);
  text+='Total: '+document.getElementById('totalPrice').innerText;
  let loc=document.getElementById('locationText').innerText;
  window.open(`https://wa.me/2644517816?text=${encodeURIComponent(text+'\n'+loc)}`);
}

// Panel admin
function loginAdmin(){
  let pass = document.getElementById('adminPass').value;
  if(pass==='tutto2026'){
    document.getElementById('adminPanel').style.display='block';
    renderAdmin();
  }else alert('Contraseña incorrecta');
}

function renderAdmin(){
  let content=document.getElementById('adminContent');
  content.innerHTML='';
  products.forEach((p,i)=>{
    let div=document.createElement('div');
    div.innerHTML=`${p.name} - $${p.price} <input type="number" id="price${i}" value="${p.price}">
    <button onclick="updateProduct(${i})">Actualizar</button>`;
    content.appendChild(div);
  });
}

function updateProduct(i){
  let val=document.getElementById('price'+i).value;
  products[i].price=parseInt(val);
  renderProducts();
  updateCart();
}

// Inicial
renderProducts();