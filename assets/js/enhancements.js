// Small progressive enhancements (carousels, swipe navigation, scroll snapping, layout helpers).

(function(){
  var g=document.querySelector(".svc-grid");if(!g)return;
  var cards=[].slice.call(g.querySelectorAll(".sv"));if(cards.length<2)return;
  var dots=document.createElement("div");dots.className="svc-dots";dots.setAttribute("role","group");dots.setAttribute("aria-label","Services pages");
  cards.forEach(function(c,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Show service "+(i+1)+" of "+cards.length);b.addEventListener("click",function(){g.scrollTo({left:c.offsetLeft-g.offsetLeft-parseFloat(getComputedStyle(g).paddingLeft||0),behavior:"smooth"})});dots.appendChild(b)});
  g.parentNode.insertBefore(dots,g.nextSibling);
  var bs=[].slice.call(dots.children),cur=-1,tick=0,swiped=false;
  function set(){tick=0;var mid=g.scrollLeft+g.clientWidth/2,best=0,bd=1e9;
    if(g.scrollLeft+g.clientWidth>=g.scrollWidth-2)best=cards.length-1;
    else cards.forEach(function(c,i){var cx=c.offsetLeft-g.offsetLeft+c.offsetWidth/2,d=Math.abs(cx-mid);if(d<bd){bd=d;best=i}});
    if(best===cur)return;cur=best;bs.forEach(function(b,i){if(i===best)b.setAttribute("aria-current","true");else b.removeAttribute("aria-current")});}
  g.addEventListener("scroll",function(){cards.forEach(function(c){c.classList.remove("is-active")});if(!tick)tick=requestAnimationFrame(set)},{passive:true});
  window.addEventListener("resize",set);set();
  window.__svcActivate=function(){cur=-1;set();cards.forEach(function(c,i){c.classList.toggle("is-active",i===cur)})};
})();

/* project page: arrow = previous page, X = exit to Work */
(function(){
  var hops = 0;
  addEventListener("hashchange", function(){ hops++; });
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest(".pj-side .back");
    if(!a) return;
    var can = (window.navigation && "canGoBack" in navigation) ? navigation.canGoBack : hops > 0;
    if(can){ e.preventDefault(); history.back(); }
  });
})();

(function(){
  var gs=document.getElementById("view-work"); if(!gs) return;
  var x0=0,y0=0,t0=0,on=false;
  gs.addEventListener("touchstart",function(e){ if(e.touches.length!==1){on=false;return} var t=e.touches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); on=true; },{passive:true});
  gs.addEventListener("touchend",function(e){
    if(!on) return; on=false;
    var t=e.changedTouches[0], dx=t.clientX-x0, dy=t.clientY-y0;
    if(innerWidth>900 || Math.abs(dx)<40 || Math.abs(dx)<Math.abs(dy)*1.2 || Date.now()-t0>800) return;
    var tabs=[].slice.call(document.querySelectorAll(".fp")), i=tabs.findIndex(function(b){return b.getAttribute("aria-pressed")==="true"});
    var n=i+(dx<0?1:-1); if(i<0||n<0||n>=tabs.length) return;
    tabs[n].click();
    try{ tabs[n].scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"}); }catch(_){}
  },{passive:true});
  gs.addEventListener("touchcancel",function(){on=false},{passive:true});
})();

(function(){
  var row=document.getElementById("stRow"); if(!row) return;
  var cards=[].slice.call(row.querySelectorAll(".st-card"));
  function on(i){ cards.forEach(function(c,k){c.classList.toggle("is-on",k===i)}); }
  cards.forEach(function(c,i){ c.addEventListener("click",function(){on(i); c.scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"});}); });
  var t; row.addEventListener("scroll",function(){clearTimeout(t); t=setTimeout(function(){ var x=row.scrollLeft+row.clientWidth/3,best=0; cards.forEach(function(c,k){ if(c.offsetLeft<=x) best=k; }); if(row.scrollLeft+row.clientWidth>=row.scrollWidth-4) best=cards.length-1; on(best); },80); },{passive:true});
  var links=[].slice.call(document.querySelectorAll(".st-toc a"));
  function cur(id){ links.forEach(function(l){l.setAttribute("aria-current",String(l.dataset.sec===id))}); }
  links.forEach(function(l){ l.addEventListener("click",function(e){ e.preventDefault(); var el=document.getElementById(l.dataset.sec); if(el){ cur(l.dataset.sec); el.scrollIntoView({behavior:"smooth",block:"start"}); } }); });
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) cur(e.target.id); }); },{rootMargin:"-30% 0px -60% 0px"});
    links.forEach(function(l){ var el=document.getElementById(l.dataset.sec); if(el) io.observe(el); });
  }
})();

(function(){
  var m=document.getElementById("main"), lock=false;
  if(!m) return;
  function go(top){ lock=true; m.scrollTo({top:top,behavior:"smooth"}); setTimeout(function(){lock=false},800); }
  m.addEventListener("wheel",function(e){
    if(innerWidth<=900 || !m.classList.contains("is-home") || Math.abs(e.deltaY)<4) return;
    e.preventDefault(); if(lock) return;
    var hero=document.querySelector(".hero"), sv=document.getElementById("services");
    var y=sv.offsetTop-m.offsetTop - parseFloat(getComputedStyle(m).paddingTop||0);
    go(e.deltaY>0 ? Math.max(0,y) : 0);
  },{passive:false});
  addEventListener("keydown",function(e){
    if(innerWidth<=900 || !m.classList.contains("is-home")) return;
    var t=e.target; if(t&&/INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
    var sv=document.getElementById("services"), y=Math.max(0,sv.offsetTop-m.offsetTop);
    if(e.key==="ArrowDown"||e.key==="PageDown"||e.key===" "){ e.preventDefault(); go(y); }
    else if(e.key==="ArrowUp"||e.key==="PageUp"){ e.preventDefault(); go(0); }
  });
})();

document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#inqForm button[type=submit]");if(b)b.classList.add("is-sent")});

(function(){function m(){var s=document.querySelector(".side");if(s&&innerWidth<=900){var h=s.getBoundingClientRect().height;if(h)document.documentElement.style.setProperty("--navh",Math.round(h)+"px")}}addEventListener("resize",m);addEventListener("hashchange",function(){setTimeout(m,50)});addEventListener("load",m);setTimeout(m,200)})();

(function(){var v=document.getElementById("view-service");if(!v)return;var x0,y0,t0,ok=false;
v.addEventListener("touchstart",function(e){if(innerWidth>900||e.touches.length!==1){ok=false;return}var t=e.touches[0];x0=t.clientX;y0=t.clientY;t0=Date.now();ok=true},{passive:true});
v.addEventListener("touchend",function(e){if(!ok)return;ok=false;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.5||Date.now()-t0>800)return;
var tabs=[].slice.call(document.querySelectorAll(".svc-tabs .svc-tab"));var i=tabs.findIndex(function(a){return a.getAttribute("aria-current")==="page"});if(i<0)return;var n=tabs[i+(dx<0?1:-1)];if(n)location.hash=n.getAttribute("href")},{passive:true});
v.style.touchAction="pan-y"})();

(function(){function u(){try{var m=document.querySelector('.main.is-work');if(!m)return;var gl=document.getElementById('gallery');if(!gl)return;var n=getComputedStyle(gl).gridTemplateColumns.split(' ').length,real=[].slice.call(gl.querySelectorAll('.g:not(.gz)'));if(real.length&&gl.querySelectorAll('.gz').length+real.length!==2*n){[].forEach.call(gl.querySelectorAll('.gz'),function(e){e.remove()});for(var k=real.length;k<2*n;k++){var z=real[0].cloneNode(true);z.className='g gz';z.removeAttribute('href');z.removeAttribute('data-id');z.setAttribute('aria-hidden','true');z.setAttribute('tabindex','-1');z.style.pointerEvents='none';gl.appendChild(z)}}
var g=[].slice.call(gl.querySelectorAll('.g')),c=g[n],t;if(c)t=c.getBoundingClientRect().top;else if(g.length)t=g[g.length-1].getBoundingClientRect().bottom+8;else return;m.style.setProperty('--soon-top',Math.max(t-6,0)+'px')}catch(e){}}
addEventListener('resize',u);addEventListener('hashchange',function(){setTimeout(u,60);setTimeout(u,500)});document.addEventListener('click',function(){setTimeout(u,80);setTimeout(u,500)});setInterval(u,400);u()})();
