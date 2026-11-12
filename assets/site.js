// 공통: 머리말/꼬리말, 금액 표시, 매물 카드
// 사무소 법정 표시 항목: 확인된 값만 채움. 빈 값('')은 화면에 표시하지 않음 (확인되면 채우기)
const OFFICE = {name:'용산호반제이공인중개사사무소', ceo:'송영주', reg:'11170-2025-00042', addr:'서울특별시 용산구 한강대로 66, 1층 107호 (한강로2가, 용산호반써밋에이디션)', tel:'02-797-3575', mobile:'010-9524-6002', fax:'02-790-3575', email:'jeie3575@gmail.com', hours:''};
function won(v){if(v==null||v==='')return '';v=Math.round(v);const e=Math.floor(v/10000),m=v%10000;return e&&m?`${e}억 ${m.toLocaleString()}`:e?`${e}억`:`${m.toLocaleString()}만`}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
// 실제 데이터(data/listings.json) → 카드용 모양으로. 로컬 시안(파일로 열 때)은 가짜 데이터로 대체
function norm(x){if(x.deal)return x; // 시안 데이터
 const p=[];for(const d of x.deals||[]){if(d==='매매'&&x.sale)p.push(['매매',won(x.sale)]);else if(d==='전세'&&x.jeonse)p.push(['전세',won(x.jeonse)]);else if(d==='월세'&&(x.deposit||x.rent))p.push(['월세',`${won(x.deposit)||0} / ${x.rent??'-'}만`]);else if(!['매매','전세','월세'].includes(d))p.push([d,''])}
 return {...x,deal:(x.deals||[])[0]||'',prices:p,area:x.pyeong?Math.round(x.pyeong*3.3058*10)/10:null}}
async function loadListings(){try{const r=await fetch('data/listings.json',{cache:'no-store'});if(!r.ok)throw 0;const j=await r.json();window.LIST_UPDATED=j.updated;return j.items.map(norm)}catch(e){return (window.DEMO_LISTINGS||[]).map(norm)}}
function priceHtml(x){if(x.prices)return x.prices.length?x.prices.map(([d,v])=>`<div class="price">${esc(v||'가격 상담')} <small>${esc(d)}</small></div>`).join(''):'<div class="price">가격 상담</div>';
 return `<div class="price">${esc(x.deal==='월세'?`${won(x.price)} / ${x.rent}만`:won(x.price))} <small>${esc(x.deal)}</small></div>`}
const HUES={'매매':160,'전세':210,'월세':30};
function photo(x){const h=HUES[x.deal]||200;return `<div class="ph" style="background:linear-gradient(135deg,hsl(${h} 35% 42%),hsl(${h+30} 40% 28%))" role="img" aria-label="${esc(x.complex)}">
 <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/></svg>
 <span class="tag">${esc(x.cat||x.deal)}</span><span class="cnt">사진 준비 중</span></div>`}
function card(x,extra=''){const sz=x.pyeong?`${x.pyeongKind||'전용'} ${x.pyeong}평${x.area?` (${x.area}㎡)`:''}`:'';
 return `<article class="card">${photo(x)}<div class="b">${priceHtml(x)}
 <div><b>${esc(x.complex)}</b>${x.type?` <span class="mut">· ${esc(x.type)}타입</span>`:''}</div>
 <div class="mut" style="font-size:14px">${[sz,x.floor,x.dir?x.dir+'향':''].filter(Boolean).map(esc).join(' · ')}</div>
 ${x.addr?`<div class="mut" style="font-size:13px">소재지 ${esc(x.addr)}</div>`:''}
 <div class="chips">${(x.points||[]).map(p=>`<span class="chip">${esc(p)}</span>`).join('')}${x.checked?`<span class="chip">${esc(x.checked)} 확인</span>`:''}</div>${extra}</div></article>`}
const NAVER='https://m.land.naver.com/agency/info/jeie3575';
function chrome(active){
 const sub=(href,l)=>`<a href="${href}">${l}</a>`;
 document.body.insertAdjacentHTML('afterbegin',`<div class="demo-bar">정식 오픈 준비 중인 페이지예요. 매물 조건은 상담으로 꼭 확인해 주세요.</div>
 <header class="top"><div class="wrap">
 <a class="logo" href="index.html"><img src="assets/logo.svg" alt="용산 호반J부동산" width="190" height="46"></a>
 <nav class="main" aria-label="주 메뉴">
  <details class="dd${['listings','client'].includes(active)?' on':''}"><summary>매물</summary><div class="menu">${sub('listings.html','매물 보기')}${sub('index.html#complex','전문단지안내')}${sub('client.html','내 매물 보기')}</div></details>
  <details class="dd"><summary>사무소 소개</summary><div class="menu">${sub('index.html#about','중개사소개')}${sub('index.html#process','중개프로세스')}</div></details>
  <a href="info.html" class="${active==='info'?'on':''}">부동산 정보실</a>
  <a href="index.html#contact">매물접수/상담</a>
 </nav>
 <div class="hbtn"><a class="pill" href="client.html">내 매물 보기</a><a class="pill naver" href="${NAVER}" rel="noopener">네이버부동산</a></div>
 </div></header>`);
 const dds=[...document.querySelectorAll('details.dd')];
 dds.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)dds.forEach(o=>{if(o!==d)o.open=false})}));
 document.addEventListener('click',e=>{if(!e.target.closest('details.dd'))dds.forEach(d=>d.open=false)});
 document.querySelectorAll('details.dd .menu a').forEach(a=>a.addEventListener('click',()=>dds.forEach(d=>d.open=false)));
 const line=[OFFICE.ceo&&`대표 ${OFFICE.ceo}`,OFFICE.reg&&`등록번호 ${OFFICE.reg}`].filter(Boolean).join(' · '),line2=[OFFICE.addr,OFFICE.tel&&`전화 ${OFFICE.tel}`,OFFICE.mobile&&`휴대폰 ${OFFICE.mobile}`,OFFICE.fax&&`팩스 ${OFFICE.fax}`,OFFICE.email&&`이메일 ${OFFICE.email}`,OFFICE.hours].filter(Boolean).join(' · ');
 document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><b>${OFFICE.name}</b><br>${line}${line2?'<br>'+line2:''}
 <div class="legal">매물 정보는 공인중개사법 제18조의2에 따른 중개대상물 표시·광고 명시사항(소재지·면적·가격·거래형태·층·방향 등)을 반영해 표시하며, 정확한 호수는 공개하지 않아요. 실제 거래 조건은 상담으로 확인해 주세요.${window.LIST_UPDATED?` · 매물 갱신 ${window.LIST_UPDATED}`:''}</div></div></footer>`)}
