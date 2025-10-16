// Attributes data
const ATTRIBUTES = [
  {id:'creative', title:'Creative', desc:'Brings original ideas and new perspectives.'},
  {id:'focused', title:'Focused', desc:'Deep work and consistent follow-through.'},
  {id:'curious', title:'Curious', desc:'Always learning and asking questions.'},
  {id:'empathic', title:'Empathic', desc:'Understands and cares about others.'},
  {id:'analytical', title:'Analytical', desc:'Enjoys problem solving and structure.'},
  {id:'visionary', title:'Visionary', desc:'Sees long-term possibilities and direction.'},
  {id:'adaptable', title:'Adaptable', desc:'Adjusts quickly to new situations.'},
  {id:'resilient', title:'Resilient', desc:'Bounces back and stays persistent.'},
  {id:'intuitive', title:'Intuitive', desc:'Relies on gut feeling and insight.'},
  {id:'bold', title:'Bold', desc:'Takes risks and acts decisively.'}
];

// DOM refs
const cardsEl = document.getElementById('cards');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const startBtn = document.getElementById('startBtn');
const examplesBtn = document.getElementById('examplesBtn');
const toastEl = document.getElementById('toast');

let selected = new Set();

// Build cards
function buildCards() {
  cardsEl.innerHTML = '';
  ATTRIBUTES.forEach(attr => {
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.setAttribute('data-id', attr.id);
    card.setAttribute('aria-pressed', 'false');
    card.innerHTML = `<h3>${attr.title}</h3><p>${attr.desc}</p>`;
    card.addEventListener('click', () => toggleCard(attr.id, card));
    card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleCard(attr.id, card);} });
    cardsEl.appendChild(card);
  });
}

// Toggle selection
function toggleCard(id, el) {
  if (selected.has(id)) {
    selected.delete(id);
    el.classList.remove('selected');
    el.setAttribute('aria-pressed','false');
  } else {
    selected.add(id);
    el.classList.add('selected');
    el.setAttribute('aria-pressed','true');
  }
}

// Clear selection
clearBtn.addEventListener('click', ()=>{
  selected.clear();
  document.querySelectorAll('.card.selected').forEach(c=>c.classList.remove('selected'));
  history.replaceState(null,'',location.pathname);
});

// Generate link and copy
generateBtn.addEventListener('click', ()=>{
  if(selected.size===0){ showToast('Select at least one attribute to generate a link.'); return; }
  const arr = Array.from(selected);
  const params = new URLSearchParams(window.location.search);
  params.set('attrs', arr.join(','));
  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  copyToClipboard(url);
  showToast('Link copied to clipboard! You can share it now.');
  // replace URL in address bar without reloading
  history.replaceState(null,'', `${location.pathname}?${params.toString()}`);
});

// Copy helper
function copyToClipboard(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).catch(()=>fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try{ document.execCommand('copy'); } catch(e){ console.warn('copy failed',e); }
  ta.remove();
}

// Toast
let toastTimer = null;
function showToast(msg, ms=2500){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ toastEl.classList.remove('show'); }, ms);
}

// Parse URL for attrs
function applyAttrsFromURL(){
  const params = new URLSearchParams(window.location.search);
  const attrs = params.get('attrs');
  if(!attrs) return;
  const arr = attrs.split(',').map(s=>s.trim()).filter(Boolean);
  // map ids to cards
  arr.forEach(id=>{
    const btn = document.querySelector(`.card[data-id="${id}"]`);
    if(btn){
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed','true');
      selected.add(id);
    }
  });
  if(selected.size>0){
    showToast('Loaded profile from link.');
  }
}

// On load
buildCards();
applyAttrsFromURL();

// scroll behavior
startBtn.addEventListener('click', ()=>{
  document.getElementById('picker').scrollIntoView({behavior:'smooth', block:'start'});
});
examplesBtn.addEventListener('click', ()=>{
  document.getElementById('examples').scrollIntoView({behavior:'smooth', block:'start'});
});

// Accessibility: allow focus styling
document.addEventListener('keydown', (e)=>{
  if(e.key==='Tab') document.body.classList.add('show-focus');
});
