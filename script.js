const ADMIN = "6285117010280";

const MP = [
  {id:'p1', em:'🥞', n:'Original',       h:7000},
  {id:'p2', em:'🍫', n:'Cokelat',         h:10000},
  {id:'p3', em:'🧁', n:'Coklat Crunchy',  h:11000},
  {id:'p4', em:'🧀', n:'Coklat Keju',     h:13000},
  {id:'p5', em:'🍪', n:'Coklat Oreo',     h:13000},
  {id:'p6', em:'☕', n:'Tiramisu',         h:10000},
  {id:'p7', em:'💜', n:'Taro',             h:10000},
  {id:'p8', em:'🍵', n:'Green Tea',       h:10000},
  {id:'p9', em:'🍓', n:'Strawberry',      h:10000},
  {id:'p10',em:'🌾', n:'Milo Susu',       h:11000},
  {id:'p11',em:'🥜', n:'Coklat Kacang',   h:12000},
  {id:'p12',em:'🌰', n:'Coklat Almond',   h:14000},
  {id:'p13',em:'🍈', n:'Durian',          h:10000},
  {id:'p14',em:'🧀', n:'Keju susu',       h:11000},
  {id:'p15',em:'🧀', n:'Chesee Chruncy',       h:12000},
  {id:'p16',em:'🎁', n:'Gratis',          h:0},
];
const MT = [
  {id:'t1',em:'🧀',n:'Keju',  h:3000},
  {id:'t2',em:'🍫',n:'Meses', h:2000},
  {id:'t3',em:'🥛',n:'Susu',  h:1000},
  {id:'t4',em:'🍪',n:'Oreo',  h:3000},
  {id:'t5',em:'🌾',n:'Milo',  h:3000},
  {id:'t6',em:'🍓',n:'Selai', h:3000},
  {id:'t7',em:'🥜',n:'Kacang',h:2000},
  {id:'t8',em:'🥜',n:'Almond',h:4000},
  {id:'t9',em:'🍓',n:'Redvelvet',h:3000},
];

/* ══════════════════════════════════════════
   STATE (DATA AKTIF)
══════════════════════════════════════════ */
let cP={}, cT={}, orders=[], exps=[], oCnt=0, selMat='Matang', selPay='Tunai';

/* ══════════════════════════════════════════
   LOCAL STORAGE (ANTI RESET)
══════════════════════════════════════════ */
function saveData() {
  const data = {
    cP, cT, orders, exps, oCnt, selMat, selPay,
    inputs: {
      p_nama: document.getElementById('p_nama')?.value || '',
      p_shift: document.getElementById('p_shift')?.value || '',
      p_modal: document.getElementById('p_modal')?.value || '',
      p_qris: document.getElementById('p_qris')?.value || '',
      p_online: document.getElementById('p_online')?.value || '',
      s_cup: document.getElementById('s_cup')?.value || '',
      s_bahan: document.getElementById('s_bahan')?.value || '',
      s_note: document.getElementById('s_note')?.value || ''
    }
  };
  localStorage.setItem('PANCONG_POS_DATA', JSON.stringify(data));
}

function loadData() {
  const dataStr = localStorage.getItem('PANCONG_POS_DATA');
  if (dataStr) {
    try {
      const data = JSON.parse(dataStr);
      cP = data.cP || {};
      cT = data.cT || {};
      orders = data.orders || [];
      exps = data.exps || [];
      oCnt = data.oCnt || 0;
      selMat = data.selMat || 'Matang';
      selPay = data.selPay || 'Tunai';

      if (data.inputs) {
        if(document.getElementById('p_nama')) document.getElementById('p_nama').value = data.inputs.p_nama;
        if(document.getElementById('p_shift')) document.getElementById('p_shift').value = data.inputs.p_shift;
        if(document.getElementById('p_modal')) document.getElementById('p_modal').value = data.inputs.p_modal;
        if(document.getElementById('p_qris')) document.getElementById('p_qris').value = data.inputs.p_qris;
        if(document.getElementById('p_online')) document.getElementById('p_online').value = data.inputs.p_online;
        if(document.getElementById('s_cup')) document.getElementById('s_cup').value = data.inputs.s_cup;
        if(document.getElementById('s_bahan')) document.getElementById('s_bahan').value = data.inputs.s_bahan;
        if(document.getElementById('s_note')) document.getElementById('s_note').value = data.inputs.s_note;
      }
      updProf();
    } catch (e) {
      console.error("Gagal memuat data tersimpan", e);
    }
  }
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const rp = n => 'Rp '+n.toLocaleString('id-ID');
const nn = v => parseInt((v||'').toString().replace(/[^0-9]/g,''))||0;
const tNow = () => new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
function fmt(el){const v=el.value.replace(/[^0-9]/g,'');el.value=v?'Rp '+parseInt(v).toLocaleString('id-ID'):'';}

let _tt;
function toast(m){
  const t=document.getElementById('toast');
  t.innerText=m;t.classList.add('show');
  clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),2200);
}
setInterval(()=>{const el=document.getElementById('clk');if(el)el.innerText=new Date().toLocaleTimeString('id-ID');},1000);

/* ══════════════════════════════════════════
   NAV & PROFILE
══════════════════════════════════════════ */
function sw(id,btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('on'));
  document.getElementById('tab-'+id).classList.add('on');
  if(btn) btn.classList.add('on');
  if(id==='rekap') renderRekap();
}

function updProf(){
  const n=document.getElementById('p_nama').value;
  const r=document.getElementById('p_shift').value;
  document.getElementById('dn').innerText=n||'Nama Staff';
  document.getElementById('dr').innerText=r||'Shift belum dipilih';
}

function checkin(){
  const n=document.getElementById('p_nama').value.trim();
  const s=document.getElementById('p_shift').value;
  if(!n||!s) return alert('Lengkapi Nama & Shift dulu!');
  toast('Check-in Berhasil ✓');
  sw('jual',document.getElementById('nb-jual'));
  saveData();
}

/* ══════════════════════════════════════════
   RENDER MENUS & CART LOGIC
══════════════════════════════════════════ */
function renderMenus(){
  const gp=document.getElementById('gpancong');
  gp.innerHTML='';
  MP.forEach(m=>{
    const q=cP[m.id]?.qty||0;
    const d=document.createElement('div');
    d.className='mc'+(q?' hit':'');
    d.onclick=()=>addP(m);
    d.innerHTML=`${q?`<span class="qb">${q}</span>`:''}
    <div class="mc-em">${m.em}</div>
    <div class="mc-name">${m.n}</div>
    <div class="mc-price">${m.h?rp(m.h):'Gratis'}</div>`;
    gp.appendChild(d);
  });
  const gt=document.getElementById('gtopping');
  gt.innerHTML='';
  MT.forEach(m=>{
    const q=cT[m.id]?.qty||0;
    const d=document.createElement('div');
    d.className='tp'+(q?' hit':'');
    d.onclick=()=>addT(m);
    d.innerHTML=`${q?`<span class="qb">${q}</span>`:''}
    <span class="tp-em">${m.em}</span>
    <div class="tp-name">${m.n}</div>
    <div class="tp-price">${rp(m.h)}</div>`;
    gt.appendChild(d);
  });
}

function addP(m){ if(navigator.vibrate) navigator.vibrate(15); if(!cP[m.id]) cP[m.id]={qty:0,h:m.h,n:m.n}; cP[m.id].qty++; upd(); }
function addT(m){ if(navigator.vibrate) navigator.vibrate(15); if(!cT[m.id]) cT[m.id]={qty:0,h:m.h,n:m.n}; cT[m.id].qty++; upd(); }
function chP(id,d){if(!cP[id])return;cP[id].qty+=d;if(cP[id].qty<=0)delete cP[id];upd();updModal();}
function chT(id,d){if(!cT[id])return;cT[id].qty+=d;if(cT[id].qty<=0)delete cT[id];upd();updModal();}

function tots(){
  let qP=0,sP=0,qT=0,sT=0;
  for(const k in cP){qP+=cP[k].qty;sP+=cP[k].qty*cP[k].h;}
  for(const k in cT){qT+=cT[k].qty;sT+=cT[k].qty*cT[k].h;}
  return{qP,sP,qT,sT,tot:sP+sT};
}

function upd(){renderMenus();updFloat();calcTot(); saveData();}

function updFloat(){
  const b=document.getElementById('fcart');
  const {qP,tot}=tots();
  if(qP>0){
    b.classList.add('show');
    document.getElementById('fc-cnt').innerText=qP;
    document.getElementById('fc-lbl').innerText=qP===1?'porsi di keranjang':'porsi di keranjang';
    document.getElementById('fc-tot').innerText=rp(tot);
  } else {
    b.classList.remove('show');
  }
}

function calcTot() {
  // Hitung total omzet yang sudah dikonfirmasi (tersimpan di riwayat)
  const omzetTunai = orders.filter(o => o.pay === 'Tunai').reduce((a, o) => a + o.sub, 0);
  const omzetQRIS = orders.filter(o => o.pay === 'QRIS').reduce((a, o) => a + o.sub, 0);
  const omzetOnline = orders.filter(o => o.pay === 'Gojek/Online').reduce((a, o) => a + o.sub, 0);

  // Ambil data keranjang yang sedang aktif (belum disimpan)
  const { sP, sT } = tots();
  const keranjangAktif = sP + sT;

  // Masukkan omzet keranjang ke kategori Tunai secara default sebelum disimpan
  const totalOmzetTunai = omzetTunai + (selPay === 'Tunai' ? keranjangAktif : 0);
  const totalOmzetQRIS = omzetQRIS + (selPay === 'QRIS' ? keranjangAktif : 0);
  const totalOmzetOnline = omzetOnline + (selPay === 'Gojek/Online' ? keranjangAktif : 0);

  // Ambil input modal dan pengeluaran
  const modal = nn(document.getElementById('p_modal').value);
  const pengeluaran = exps.reduce((a, b) => a + b.p, 0);

  // Update Otomatis Nilai Input QRIS & Online di UI agar staff melihat hasilnya
  document.getElementById('p_qris').value = rp(totalOmzetQRIS);
  document.getElementById('p_online').value = rp(totalOmzetOnline);

  // Hitung Setoran Tunai Bersih
  const nettoTunai = modal + totalOmzetTunai - pengeluaran;
  
  // Update Tampilan UI
  const totalPorsi = orders.reduce((a, o) => a + o.porsi, 0) + (Object.values(cP).reduce((a, b) => a + b.qty, 0));
  document.getElementById('t_porsi').innerText = totalPorsi + ' Porsi';
  document.getElementById('t_tunai').innerText = rp(nettoTunai < 0 ? 0 : nettoTunai);
}

/* ══════════════════════════════════════════
   MODAL & PILIHAN
══════════════════════════════════════════ */
function openM(){document.getElementById('ov').classList.add('on');updModal();}
function closeM(){document.getElementById('ov').classList.remove('on');}
function ovClick(e){if(e.target.id==='ov')closeM();}

function updModal(){
  const {qP,sP,qT,sT,tot}=tots();
  // Pancong list
  const pl=document.getElementById('ml-pancong');
  pl.innerHTML='';
  let hasP=false;
  for(const k in cP){
    hasP=true;const it=cP[k];const s=it.qty*it.h;
    const r=document.createElement('div');r.className='m-item';
    r.innerHTML=`<div><div class="m-item-n">${it.n}</div><div class="m-item-p">${rp(it.h)} / porsi</div></div>
    <div class="m-ctrl">
      <button class="qbtn" onclick="chP('${k}',-1)">−</button>
      <span class="qv">${it.qty}</span>
      <button class="qbtn" onclick="chP('${k}',1)">+</button>
      <span class="m-sub-price">${rp(s)}</span>
    </div>`;
    pl.appendChild(r);
  }
  if(!hasP) pl.innerHTML='<div class="empty">Belum ada pancong dipilih</div>';
  
  // Topping list
  const tw=document.getElementById('ml-top-wrap');
  const tl=document.getElementById('ml-topping');
  tl.innerHTML='';let hasT=false;
  for(const k in cT){
    hasT=true;const it=cT[k];const s=it.qty*it.h;
    const r=document.createElement('div');r.className='m-item';
    r.innerHTML=`<div><div class="m-item-n">${it.n}</div><div class="m-item-p">${rp(it.h)} / pcs</div></div>
    <div class="m-ctrl">
      <button class="qbtn" onclick="chT('${k}',-1)">−</button>
      <span class="qv">${it.qty}</span>
      <button class="qbtn" onclick="chT('${k}',1)">+</button>
      <span class="m-sub-price">${rp(s)}</span>
    </div>`;
    tl.appendChild(r);
  }
  tw.style.display=hasT?'block':'none';
  
  document.getElementById('m-tot').innerText=rp(tot);
  document.getElementById('m-chip').innerText=qP+' porsi';
  document.getElementById('m-sub').innerText=oCnt>0?`Pesanan ke-${oCnt+1}`:'Pesanan baru';
}

function setMat(btn){
  document.querySelectorAll('.mc2').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');selMat=btn.dataset.v;
  saveData();
}
function setPay(btn){
  document.querySelectorAll('.pc2').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');selPay=btn.dataset.v;
  saveData();
}

/* ══════════════════════════════════════════
   RESET & CONFIRM
══════════════════════════════════════════ */
function resetCart(){
  const {qP,qT}=tots();
  if(!qP&&!qT){closeM();return;}
  if(confirm('Kosongkan keranjang tanpa menyimpan?')){
    cP={};cT={};upd();closeM();toast('Keranjang dikosongkan');
    saveData();
  }
}

function confirmOrder(){
  const {qP,sP,sT,tot}=tots();
  if(!qP) return alert('Pilih minimal 1 pancong dulu!');
  
  // Ambil nama pelanggan
  const cNameInput = document.getElementById('c_name');
  const custName = (cNameInput && cNameInput.value.trim() !== '') ? cNameInput.value.trim() : 'Pelanggan';

  oCnt++;
  const pi=[],ti=[];let qT=0;
  for(const k in cP) pi.push({n:cP[k].n,q:cP[k].qty,h:cP[k].h});
  for(const k in cT){ti.push({n:cT[k].n,q:cT[k].qty,h:cT[k].h});qT+=cT[k].qty;}
  
  orders.push({id:oCnt, time:tNow(), cust:custName, pi, ti, sub:tot, porsi:qP, mat:selMat, pay:selPay});
  
  // Reset input & pilihan
  cP={};cT={};
  if(cNameInput) cNameInput.value = '';
  selMat='Matang';selPay='Tunai';
  document.querySelectorAll('.mc2').forEach(b=>b.classList.remove('sel'));
  document.querySelector('.mc2[data-v="Matang"]').classList.add('sel');
  document.querySelectorAll('.pc2').forEach(b=>b.classList.remove('sel'));
  document.querySelector('.pc2[data-v="Tunai"]').classList.add('sel');
  
  upd();closeM();toast(`Pesanan #${oCnt} disimpan ✓`);renderRekap();
  saveData();
}

/* ══════════════════════════════════════════
   PENGELUARAN
══════════════════════════════════════════ */
function addExp(){
  const n=document.getElementById('en').value.trim();
  const p=nn(document.getElementById('ep').value);
  if(!n||!p) return alert('Isi nama & jumlah!');
  exps.push({n,p});
  document.getElementById('en').value='';document.getElementById('ep').value='';
  renderExps();calcTot();
  saveData();
}
function delExp(i){exps.splice(i,1);renderExps();calcTot(); saveData();}
function renderExps(){
  const el=document.getElementById('explist');el.innerHTML='';
  exps.forEach((e,i)=>{
    const d=document.createElement('div');d.className='exp-row';
    d.innerHTML=`<span>${e.n}</span>
    <div style="display:flex;align-items:center;gap:8px">
      <b>${rp(e.p)}</b>
      <button class="exp-del" onclick="delExp(${i})">✕</button>
    </div>`;
    el.appendChild(d);
  });
}

/* ══════════════════════════════════════════
   RIWAYAT (REKAP TAB)
══════════════════════════════════════════ */
function renderRekap(){
  const rb=document.getElementById('rbox');
  const rl=document.getElementById('rlist');
  if(!rb||!rl) return;
  const totalOmzet=orders.reduce((a,o)=>a+o.sub,0);
  const totalPorsi=orders.reduce((a,o)=>a+o.porsi,0);
  const modal=nn(document.getElementById('p_modal').value);
  const kel=exps.reduce((a,b)=>a+b.p,0);
  const qris=nn(document.getElementById('p_qris').value);
  const onl=nn(document.getElementById('p_online').value);
  const netto=modal+totalOmzet-kel-qris-onl;
  const byPay={};
  orders.forEach(o=>{byPay[o.pay]=(byPay[o.pay]||0)+o.sub;});
  if(!orders.length){
    rb.innerHTML='<div class="empty">Belum ada transaksi dikonfirmasi</div>';
    rl.innerHTML='';return;
  }
  const payStr=Object.entries(byPay).map(([k,v])=>`<div class="rr"><span>• Omzet ${k}</span><strong>${rp(v)}</strong></div>`).join('');
  rb.innerHTML=`
    <div class="rr"><span>Transaksi</span><strong>${orders.length}×</strong></div>
    <div class="rr"><span>Porsi Terjual</span><strong>${totalPorsi} porsi</strong></div>
    <div class="rr"><span>Omzet Penjualan</span><strong>${rp(totalOmzet)}</strong></div>
    ${payStr}
    <div class="rr" style="color:var(--red)"><span>💸 Pengeluaran</span><strong>−${rp(kel)}</strong></div>
    <div class="rr" style="color:var(--blue)"><span>📱 QRIS</span><strong>−${rp(qris)}</strong></div>
    <div class="rr" style="color:var(--green)"><span>🛵 Gojek/Online</span><strong>−${rp(onl)}</strong></div>
    <div class="rr tot"><span>Setoran Tunai</span><span>${rp(netto<0?0:netto)}</span></div>`;
  rl.innerHTML='';
  [...orders].reverse().forEach(o=>{
    const ps=o.pi.map(i=>`${i.n}×${i.q}`).join(', ');
    const ts=o.ti.length?' + '+o.ti.map(i=>`${i.n}×${i.q}`).join(', '):'';
    const d=document.createElement('div');d.className='tx';
    d.innerHTML=`<div class="tx-top">
      <span><span class="tx-id">#${o.id}</span><span class="tx-time">${o.time} - 👤 ${o.cust}</span></span>
      <span class="tx-amt">${rp(o.sub)}</span>
    </div>
    <div class="tx-tags">
      <span class="tag tm">🔥 ${o.mat}</span>
      <span class="tag tb">💳 ${o.pay}</span>
      <span class="tag tp2">${o.porsi} porsi</span>
    </div>
    <div class="tx-items">${ps}${ts}</div>`;
    rl.appendChild(d);
  });
}

/* ══════════════════════════════════════════
   CHECKOUT → WHATSAPP
══════════════════════════════════════════ */
function checkout(){
  const nama=document.getElementById('p_nama').value.trim();
  if(!nama) return alert('Isi nama staff di tab Absen dulu!');
  const {qP}=tots();
  if(qP>0){
    if(!confirm('Masih ada item di keranjang. Simpan otomatis sekarang?')) return;
    confirmOrder();
  }
  if(!orders.length) return alert('Belum ada pesanan tersimpan!');

  const shift=document.getElementById('p_shift').value||'-';
  const tgl=new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  const modal=nn(document.getElementById('p_modal').value);
  const kel=exps.reduce((a,b)=>a+b.p,0);
  const qris=nn(document.getElementById('p_qris').value);
  const onl=nn(document.getElementById('p_online').value);
  const totalOmzet=orders.reduce((a,o)=>a+o.sub,0);
  const totalPorsi=orders.reduce((a,o)=>a+o.porsi,0);
  const netto=modal+totalOmzet-kel-qris-onl;
  const byPay={};
  orders.forEach(o=>{byPay[o.pay]=(byPay[o.pay]||0)+o.sub;});
  const pMap={},tMap={};
  orders.forEach(o=>{
    o.pi.forEach(i=>{if(!pMap[i.n])pMap[i.n]={q:0,h:i.h};pMap[i.n].q+=i.q;});
    o.ti.forEach(i=>{if(!tMap[i.n])tMap[i.n]={q:0,h:i.h};tMap[i.n].q+=i.q;});
  });
  const sCup=document.getElementById('s_cup').value;
  const sBhn=document.getElementById('s_bahan').value;
  const sNot=document.getElementById('s_note').value;

  let txt='';
  txt+=`╔═══════════════════════╗\n`;
  txt+=`  💼 LAPORAN KEUANGAN\n`;
  txt+=`╚═══════════════════════╝\n`;
  txt+=`📅 ${tgl}\n`;
  txt+=`👤 ${nama}  |  ${shift}\n`;
  txt+=`━━━━━━━━━━━━━━━━━━━━━━━\n`;
  txt+=`💰 Modal Awal     : ${rp(modal)}\n`;
  txt+=`🥞 Omzet Jual     : ${rp(totalOmzet)}\n`;
  txt+=`📥 Total Kas      : ${rp(modal+totalOmzet)}\n`;
  txt+=`━━━━━━━━━━━━━━━━━━━━━━━\n`;
  for(const[k,v] of Object.entries(byPay)){
    const ic=k==='Tunai'?'💵':k==='QRIS'?'📱':'🛵';
    txt+=`${ic} Omzet ${k}    : ${rp(v)}\n`;
  }
  txt+=`━━━━━━━━━━━━━━━━━━━━━━━\n`;
  txt+=`💸 Pengeluaran    : −${rp(kel)}\n`;
  txt+=`📱 Setor QRIS     : −${rp(qris)}\n`;
  txt+=`🛵 Setor Online   : −${rp(onl)}\n`;
  txt+=`━━━━━━━━━━━━━━━━━━━━━━━\n`;
  txt+=`💵 *SETORAN TUNAI : ${rp(netto<0?0:netto)}*\n\n`;
  
  // BAGIAN REKAP ITEM TERJUAL
  txt+=`╔═══════════════════════╗\n`;
  txt+=`  🥞 TOTAL ITEM TERJUAL\n`;
  txt+=`╚═══════════════════════╝\n`;
  txt+=`📦 Transaksi : ${orders.length}×  |  🥞 Porsi : ${totalPorsi}\n`;
  txt+=`━━━━━━━━━━━━━━━━━━━━━━━\n`;
  for(const[k,v] of Object.entries(pMap)) txt+=`• ${k} ×${v.q} = ${rp(v.q*v.h)}\n`;
  if(Object.keys(tMap).length){
    txt+=`─ Topping ─\n`;
    for(const[k,v] of Object.entries(tMap)) txt+=`• ${k} ×${v.q} = ${rp(v.q*v.h)}\n`;
  }
  txt+=`\n`;

  // BAGIAN DETAIL PER PELANGGAN
  txt+=`╔═══════════════════════╗\n`;
  txt+=`  📝 DETAIL PESANAN\n`;
  txt+=`╚═══════════════════════╝\n`;
  orders.forEach(o => {
    txt+=`#${o.id} | 👤 ${o.cust} | ${o.time}\n`;
    const ps = o.pi.map(i => `${i.n} x${i.q}`).join(', ');
    const ts = o.ti.length ? ' + ' + o.ti.map(i => `${i.n} x${i.q}`).join(', ') : '';
    txt+=`🛒 ${ps}${ts}\n`;
    txt+=`💳 ${o.pay} | 🔥 ${o.mat} | 💰 ${rp(o.sub)}\n`;
    txt+=`┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
  });

  if(sCup||sBhn||sNot){
    txt+=`\n╔═══════════════════════╗\n`;
    txt+=`  📦 STOK OPNAME\n`;
    txt+=`╚═══════════════════════╝\n`;
    if(sCup) txt+=`🥡 Sisa Cup   : ${sCup}\n`;
    if(sBhn) txt+=`🧂 Sisa Bahan : ${sBhn}\n`;
    if(sNot) txt+=`📝 Catatan    : ${sNot}\n`;
  }

  window.open(`https://api.whatsapp.com/send?phone=${ADMIN}&text=${encodeURIComponent(txt)}`);
  if(confirm('Laporan terkirim! Klik OK untuk reset data shift ini.')){
    orders=[];exps=[];oCnt=0;cP={};cT={};
    ['p_qris','p_online','s_cup','s_bahan','s_note'].forEach(id=>{const el=document.getElementById(id); if(el)el.value='';});
    localStorage.removeItem('PANCONG_POS_DATA'); // Hapus memori agar shift depan bersih
    upd();renderExps();renderRekap();toast('Shift selesai, data di-reset ✓');
  }
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
window.onload=()=>{
  loadData();
  renderMenus();
  renderRekap();
  renderExps();
  updFloat();
  calcTot();

  // Listener untuk save otomatis ketika mengetik di form
  const inputIds = ['p_nama', 'p_shift', 'p_modal', 'p_qris', 'p_online', 's_cup', 's_bahan', 's_note', 'c_name'];
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', saveData);
      el.addEventListener('change', saveData);
    }
  });
};
