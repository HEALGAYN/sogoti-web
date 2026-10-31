/* SOGOTI · main.js */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };

  // nav
  var nav=$('nav');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});
  var mb=$('menuBtn'), nl=$('navlinks');
  mb.addEventListener('click',function(){var o=nl.classList.toggle('open');mb.setAttribute('aria-expanded',o)});

  // theme toggle
  document.getElementById('themeBtn').addEventListener('click',function(){
    var r=document.documentElement, n=r.getAttribute('data-theme')==='dark'?'light':'dark';
    r.setAttribute('data-theme',n); try{localStorage.setItem('sogoti-theme',n)}catch(e){} if(window.__sgDraw)window.__sgDraw();
  });


  // marquee
  var tr=$('track');
  if(tr){tr.innerHTML+=tr.innerHTML;[].slice.call(tr.children).slice(tr.children.length/2).forEach(function(n){n.setAttribute('aria-hidden','true')});}

  // interés preseleccionado: contacto/?interes=...
  var sel=$('f-interest'), q=new URLSearchParams(location.search).get('interes');
  if(sel&&q){[].slice.call(sel.options).forEach(function(o){if(o.text===q)sel.value=o.value})}

  if($('ppanel')){
  // maturity path
  var P=[
    {t:'Todas las fuentes en un solo historiador',d:'Inventariamos las fuentes OT y TI, desplegamos interfaces y Connectors con failover y buffering, y dejamos cada flujo monitoreado desde el primer día.',l:['Inventario de fuentes y PointSources','Interfaces con failover documentado','Monitoreo de disponibilidad por interfaz'],m:'% en línea',ml:'Disponibilidad de cada interfaz y horas de historia recuperadas por buffering.'},
    {t:'Datos vigilados y auditables',d:'Aplicamos un health check y reglas por tag: valores congelados, fuera de rango, estados digitales anómalos y configuración de excepción y compresión.',l:['Health check de la plataforma','Reglas de calidad por tipo de tag','Alertas y tickets automáticos'],m:'% Good',ml:'Índice de calidad: tags con estado Good y actualizados dentro de su frecuencia esperada.'},
    {t:'Un modelo AF para toda la corporación',d:'Diseñamos plantillas AF corporativas, jerarquías comunes y cálculos con Analytics y Event Frames. Las pantallas PI Vision siguen la guía ISA-101.',l:['Plantillas y jerarquía AF corporativas','Analytics, Event Frames y Notifications','Guía de pantallas ISA-101'],m:'% plantillado',ml:'Activos críticos modelados con plantilla corporativa y cálculos reutilizables entre sitios.'},
    {t:'Del histórico a la anticipación',d:'Entrenamos modelos de comportamiento normal con AVEVA Predictive Analytics, publicamos datos con CONNECT y aplicamos IA sobre un dato que ya es confiable.',l:['Modelos predictivos por tipo de activo','Datos en la nube con CONNECT','Casos de IA con revisión humana'],m:'días de aviso',ml:'Anticipación con la que se detecta una desviación antes de la falla o la parada.'}
  ];
  var tabs=[].slice.call(document.querySelectorAll('.ptab')), panel=document.getElementById('ppanel');
  function sel(i,focus){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});
    var p=P[i]; document.getElementById('pp-t').textContent=p.t; document.getElementById('pp-d').textContent=p.d;
    document.getElementById('pp-l').innerHTML=p.l.map(function(x){return '<li>'+x+'</li>'}).join('');
    document.getElementById('pp-m').textContent=p.m; document.getElementById('pp-ml').textContent=p.ml;
    panel.setAttribute('aria-labelledby','pt-'+i); if(focus)tabs[i].focus();
  }
  tabs.forEach(function(t,k){
    t.addEventListener('click',function(){sel(k)});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();sel((k+1)%4,true)}
      if(e.key==='ArrowLeft'){e.preventDefault();sel((k+3)%4,true)}
    });
  });

  }

  if($('trend')){
  // live mining dashboard (datos simulados)
  function fmt(n,d){var p=n.toFixed(d).split('.');return p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(d?','+p[1]:'')}
  var st={view:'mina',shift:'A'}, cv=document.getElementById('trend'), ctx=cv.getContext('2d');
  var V={
    mina:{title:'Mina Tajo Norte · operación en vivo', chart:'Movimiento acumulado vs plan · kt',
      legend:[['Real','var(--sb-beam)'],['Plan','var(--band-muted)']],
      kpis:function(k){return [
        ['Movimiento',fmt(96.4*k,1),'kt',103*k,'del plan'],
        ['Mineral a chancado',fmt(31.2*k,1),'kt',98*k,'del plan'],
        ['Ley Cu',fmt(0.64-(1-k)*0.4,2),'%',(0.64-(1-k)*0.4)/0.60*100,'vs plan 0,60'],
        ['Camiones',k<1?'36':'38','/42',k<1?86:90,'disponibles']]},
      rows:function(k){return [
        ['PA-03 · pala eléctrica','Cargando · cola 4','ok','Operando'],
        ['CA-217 · camión 330 t',fmt(3.2*k,1)+' km a chancado','ok','En ruta'],
        ['PA-07 · pala hidráulica','Cambio de frente','warn','Demora 12 min'],
        ['CA-104 · camión 330 t','Falla neumático','bad','Mantención']]},
      foot:function(k){return ['Cumplimiento del turno · hora 10 de 12',Math.min(99,Math.round(103*k*10/12)),fmt(103*k,0)+' %']}},
    planta:{title:'Planta Concentradora · operación en vivo', chart:'Balance de aguas · m³/h',
      legend:[['Recuperada','var(--sb-beam)'],['Fresca','var(--sb-warn)']],
      kpis:function(k){return [
        ['Tratamiento',fmt(4820*k,0),'t/h',101*k,'del plan'],
        ['Recuperación Cu',fmt(89.4*(0.99+k*0.01),1),'%',101,'vs plan 88,5'],
        ['Agua recuperada',fmt(76*k,0),'%',76*k/75*100,'meta 75 %'],
        ['Concentrado',fmt(12.6*k,1),'kt',100,'producido hoy']]},
      rows:function(k){return [
        ['TK-02 · espesador de relaves','Underflow '+fmt(64*k,0)+' % sólidos','ok','Normal'],
        ['FP-01 · filtro de concentrado','Humedad '+fmt(9.1,1)+' %','ok','Normal'],
        ['BO-04 · bomba agua recuperada','Vibración 7,8 mm/s','warn','Alta'],
        ['Embarque L-118 · puerto',fmt(7820*k,0)+' / 12 600 t','ok','Cargando']]},
      foot:function(k){return ['Embarque L-118 · carga de concentrado',Math.round(62*k),fmt(62*k,0)+' %']}}
  };
  var series={};
  function seed(){
    var k=st.shift==='A'?1:.95;
    if(st.view==='mina'){var a=[0],p=[];for(var h=0;h<=12;h++)p.push(93.6*h/12);
      for(h=1;h<=10;h++)a.push(a[h-1]+9.64*k*(0.92+Math.random()*.16));
      series={a:a,p:p};}
    else{var r=[],f=[],x=2400*k,y=760;for(var i=0;i<80;i++){x+=(2400*k-x)*.1+(Math.random()-.5)*90;y+=(760-y)*.1+(Math.random()-.5)*40;r.push(x);f.push(y)}series={r:r,f:f}}
  }
  function render(){
    var v=V[st.view], k=st.shift==='A'?1:.95;
    document.getElementById('dTitle').textContent=v.title;
    document.getElementById('dTime').textContent=st.shift==='A'?'Día · 07:00–19:00':'Noche · 19:00–07:00';
    document.getElementById('dChartT').textContent=v.chart;
    document.getElementById('dLegend').innerHTML=v.legend.map(function(l){return '<em style="--c:'+l[1]+'">'+l[0]+'</em>'}).join('');
    document.getElementById('dKpis').innerHTML=v.kpis(k).map(function(q){var c=q[3]>=100?'ok':'warn';return '<div class="c-kpi"><span>'+q[0]+'</span><b>'+q[1]+'<small> '+q[2]+'</small></b><i class="'+c+'">'+fmt(q[3],0)+' % '+q[4]+'</i></div>'}).join('');
    document.getElementById('dRows').innerHTML=v.rows(k).map(function(r){return '<div class="c-row'+(r[2]!=='ok'?' hl':'')+'"><span class="n">'+r[0]+'</span><span class="v">'+r[1]+'</span><span class="st st-'+r[2]+'">'+r[3]+'</span></div>'}).join('');
    var f=v.foot(k); document.getElementById('dFoot').innerHTML='<div class="fh"><span>'+f[0]+'</span><b>'+f[2]+'</b></div><div class="bar"><i style="width:'+f[1]+'%"></i></div>';
    draw();
  }
  function draw(){
    var cs=getComputedStyle(cv),gv=function(n){return cs.getPropertyValue(n).trim()},C={beam:gv('--sb-beam'),plan:gv('--band-muted'),warn:gv('--sb-warn'),grid:gv('--band-line'),ink:gv('--band-ink')};
    var dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight; if(!w)return;
    cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    ctx.strokeStyle=C.grid;ctx.lineWidth=1;
    for(var g=1;g<4;g++){ctx.beginPath();ctx.moveTo(0,h*g/4+.5);ctx.lineTo(w,h*g/4+.5);ctx.stroke()}
    ctx.font='10px "IBM Plex Mono", monospace';
    function line(arr,n,lo,hi,col,dash,fill){
      var pad=8,X=function(i){return 2+i*(w-34)/(n-1)},Y=function(v){return pad+(hi-v)/(hi-lo)*(h-pad*2)};
      ctx.setLineDash(dash?[4,4]:[]);ctx.beginPath();arr.forEach(function(v,i){i?ctx.lineTo(X(i),Y(v)):ctx.moveTo(X(i),Y(v))});
      ctx.strokeStyle=col;ctx.lineWidth=dash?1.2:1.8;ctx.stroke();ctx.setLineDash([]);
      if(fill){ctx.lineTo(X(arr.length-1),h);ctx.lineTo(X(0),h);ctx.closePath();var gr=ctx.createLinearGradient(0,0,0,h);gr.addColorStop(0,fill);gr.addColorStop(1,'rgba(60,193,240,0)');ctx.fillStyle=gr;ctx.fill()}
      var li=arr.length-1;ctx.beginPath();ctx.arc(X(li),Y(arr[li]),3,0,7);ctx.fillStyle=col;ctx.fill();
      return [X(li),Y(arr[li])];
    }
    if(st.view==='mina'){
      line(series.p,13,0,110,C.plan,true);
      var e=line(series.a,13,0,110,C.beam,false,'rgba(60,193,240,.25)');
      ctx.fillStyle=C.ink;ctx.fillText(fmt(series.a[series.a.length-1],1)+' kt',Math.min(e[0]+6,w-56),e[1]+3);
    }else{
      line(series.r,80,400,3000,C.beam,false,'rgba(60,193,240,.22)');
      line(series.f,80,400,3000,C.warn,false);
    }
  }
  document.querySelectorAll('[data-view]').forEach(function(b){b.addEventListener('click',function(){st.view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});seed();render()})});
  document.querySelectorAll('[data-shift]').forEach(function(b){b.addEventListener('click',function(){st.shift=b.dataset.shift;document.querySelectorAll('[data-shift]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});seed();render()})});
  seed();render();addEventListener('resize',draw);window.__sgDraw=draw;
  if(!reduce){setInterval(function(){
    var k=st.shift==='A'?1:.95;
    if(st.view==='mina'){var a=series.a;a[a.length-1]+=0.04*k}
    else{['r','f'].forEach(function(key){var arr=series[key],l=arr[arr.length-1],m=key==='r'?2400*k:760;arr.shift();arr.push(l+(m-l)*.1+(Math.random()-.5)*(key==='r'?90:40))})}
    draw()},1500)}

  }

  // copy helpers
  function copyText(t,btn){
    var ok=function(){var o=btn.textContent;btn.textContent='Copiado';setTimeout(function(){btn.textContent=o},1500)};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){fallback(t);ok()})}else{fallback(t);ok()}
  }
  function fallback(t){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove()}
  document.querySelectorAll('.copy').forEach(function(b){b.addEventListener('click',function(){copyText(document.getElementById(b.dataset.copy).textContent,b)})});


  // formulario: Netlify Forms (por defecto) o un endpoint externo (Web3Forms / Formspree)
  var FORM_ENDPOINT = '';
  var form=$('form');
  if(form){
    var done=$('done');
    var check=function(el){
      var f=el.closest('.f'), err=f.querySelector('.err'), ok=el.checkValidity()&&el.value.trim()!=='';
      f.classList.toggle('invalid',!ok); if(err)err.hidden=ok; return ok;
    };
    form.querySelectorAll('[required]').forEach(function(el){el.addEventListener('blur',function(){check(el)})});
    var show=function(ok){
      done.querySelector('h3').textContent = ok ? 'Solicitud enviada' : 'Envíenos su solicitud por WhatsApp';
      done.querySelector('p').textContent = ok ? 'Gracias. Le responderemos en menos de 1 día hábil.' : 'No pudimos enviar el formulario desde aquí. Use el botón para enviarnos este resumen por WhatsApp.';
      $('summary').hidden = ok; done.querySelector('.row').hidden = ok;
      done.hidden=false; done.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    };
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var bad=[].slice.call(form.querySelectorAll('[required]')).filter(function(el){return !check(el)});
      if(bad.length){bad[0].focus();return}
      var fd=new FormData(form), lines=[];
      fd.forEach(function(v,k){if(k!=='form-name'&&k!=='bot-field'&&String(v).trim())lines.push(k.charAt(0).toUpperCase()+k.slice(1)+': '+v)});
      var text='Solicitud desde la web de SOGOTI\n\n'+lines.join('\n');
      $('summary').textContent=text;
      $('mailto').href='https://wa.me/51997658881?text='+encodeURIComponent(text);
      var btn=form.querySelector('[type=submit]'); btn.disabled=true;
      var req = FORM_ENDPOINT
        ? fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:fd})
        : fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fd).toString()});
      req.then(function(r){ if(!r.ok) throw new Error(r.status); show(true); form.reset(); })
         .catch(function(){ show(false); })
         .then(function(){ btn.disabled=false; });
    });
    $('copySum').addEventListener('click',function(){copyText($('summary').textContent,this)});
  }
})();
