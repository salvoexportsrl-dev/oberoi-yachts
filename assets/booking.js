(function(){const root=document.querySelector('aside[data-yacht]'),f=root&&root.querySelector('form');if(!f)return;
 const config={yacht:root.dataset.yacht,rate:Number(root.dataset.rate)};
 const en=document.documentElement.lang.toLowerCase().startsWith('en'),t=(it,eng)=>en?eng:it;
 const q=c=>root.querySelector('.'+c),emir=config.yacht==='EMIR';
 const date=emir?f.querySelector('input[type=date]'):q('oy-date'),time=emir?f.querySelector('[name="contact[Ora]"]'):q('oy-time'),duration=emir?f.querySelector('[name="contact[Durata]"]'):q('oy-duration');
 const pct=emir?document.getElementById('emir-payment-percent'):q('oy-payment-percent');
 const oldSend=f.querySelector('button[type=submit]'),buy=emir?document.getElementById('emir-pay'):q('oy-buy-now'),status=emir?document.getElementById('emir-payment-status'):q('oy-payment-status'),amount=emir?document.getElementById('emir-quote'):q('oy-deposit-price');
 if(!buy||!status||!oldSend)return;
 oldSend.hidden=true;oldSend.style.display='none';buy.disabled=false;buy.type='button';buy.textContent=t('PRENOTA E PAGA','BOOK AND PAY');buy.style.setProperty('background','#0876d9','important');buy.style.opacity='1';buy.style.cursor='pointer';
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const choices=document.createElement('div');choices.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:12px';status.after(choices);
 const base='https://eftswzwxcdkrimnyvnrg.supabase.co/functions/v1/',key='oy-instant-'+config.yacht;
 let saved=null,busy=false,version=0;try{saved=JSON.parse(localStorage.getItem(key)||'null')}catch{}
 const hours=()=>Number(duration.value)*(emir?24:1),start=()=>date.value+'T'+time.value.slice(0,5)+':00+04:00';
 const money=c=>new Intl.NumberFormat(en?'en-GB':'it-IT',{style:'currency',currency:'EUR'}).format(c/100);
 const payload=()=>({yacht:config.yacht,duration:hours(),guests:Number(emir?f.querySelector('[name="contact[Ospiti]"]').value:q('oy-guests').value),payment_percent:Number(pct?pct.value:100),name:(emir?f.querySelector('[name="contact[name]"]'):q('oy-client-name')).value,email:(emir?f.querySelector('input[type=email]'):q('oy-client-email')).value,phone:(emir?f.querySelector('input[type=tel]'):q('oy-client-phone')).value,start:start(),note:f.querySelector('textarea')?.value||'',website:''});
 async function api(path,data){const res=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const out=await res.json();if(!res.ok){const e=Error(out.error||t('Servizio non disponibile','Service unavailable'));e.result=out;throw e}return out}
 function display(s){choices.replaceChildren();status.textContent=s.available?t('Disponibile nel calendario. Puoi procedere al pagamento.','Available in the calendar. Continue to payment.'):t('Questo yacht è già prenotato per la data e l’orario scelti. Scegli un’alternativa:','This yacht is already reserved for the selected date and time. Choose an alternative:');
  if(!s.available){if(!s.alternatives?.length)status.textContent+=t(' Prova altre date.',' Try other dates.');for(const iso of s.alternatives||[]){const b=document.createElement('button');b.type='button';b.style.cssText='border:1px solid #c5a36a;border-radius:8px;background:white;color:#102236;padding:10px;cursor:pointer';b.textContent=new Intl.DateTimeFormat(en?'en-GB':'it-IT',{timeZone:'Asia/Dubai',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(iso));b.onclick=()=>{const local=new Date(Date.parse(iso)+4*3600000).toISOString();date.value=local.slice(0,10);time.value=local.slice(11,16);date.dispatchEvent(new Event('change',{bubbles:true}));};choices.append(b);}}
 }
 function quote(){const total=config.rate*(emir?Number(duration.value):hours());const totalBox=q("oy-total");if(totalBox)totalBox.textContent=money(total||0);if(!total && amount)amount.textContent='';if(amount&&total)amount.textContent=t('Totale: ','Total: ')+money(total)+t(' · Da pagare ora: ',' · Due now: ')+money(total*Number(pct?pct.value:100)/100)+' · Balance: '+money(total*(100-Number(pct?pct.value:100))/100);}
 async function check(){const v=++version;choices.replaceChildren();quote();if(!date.value||!time.value||!hours()){status.textContent=t('Scegli data, orario e durata. Prenotazione e pagamento senza attesa di approvazione.','Choose date, time and duration. Book and pay without waiting for approval.');return}try{const s=await api('oy-request-booking',{action:'availability',yacht:config.yacht,start:start(),duration:hours()});if(v===version&&!busy)display(s);}catch(e){if(v===version&&!busy)status.textContent=e.message;}}
 async function book(e){e.preventDefault();if(busy)return;if(!date.value||!time.value||!hours()){date.reportValidity();time.reportValidity();duration.reportValidity();return}
  busy=true;buy.setAttribute('aria-busy','true');buy.textContent=t('CONTROLLO DISPONIBILITÀ…','CHECKING AVAILABILITY…');
  try{const p=payload(),fingerprint=JSON.stringify(p);
   if(saved&&saved.fingerprint!==fingerprint){await api('oy-request-booking',{action:'release',token:saved.token});saved=null;try{localStorage.removeItem(key)}catch{}}
   if(!saved){const a=await api('oy-request-booking',{action:'availability',yacht:config.yacht,start:p.start,duration:p.duration});if(!a.available){display(a);return}if(!f.reportValidity())return;const r=await api('oy-request-booking',p);if(!r.booking_token||!r.instant_booking)throw Error(t('Prenotazione non disponibile','Booking unavailable'));saved={token:r.booking_token,fingerprint};try{localStorage.setItem(key,JSON.stringify(saved))}catch{}}
   status.textContent=t('Apertura pagamento sicuro…','Opening secure payment…');const s=await api('oy-customer-stripe-live-checkout',{token:saved.token});if(!s.live_mode||new URL(s.checkout_url).origin!=='https://checkout.stripe.com')throw Error(t('Checkout non disponibile','Checkout unavailable'));location.assign(s.checkout_url);
  }catch(e){if(e.result?.available===false)display(e.result);else status.textContent=e.message;if(/expired|received|completed/i.test(e.message)){saved=null;try{localStorage.removeItem(key)}catch{}}}
  finally{busy=false;buy.removeAttribute('aria-busy');buy.disabled=false;buy.textContent=t('PRENOTA E PAGA','BOOK AND PAY');}
 }
 buy.addEventListener('click',book);f.addEventListener('submit',book);f.addEventListener('input',quote);[date,time,duration].forEach(el=>el.addEventListener('change',check));if(pct)pct.addEventListener('change',quote);
 date.min=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());check();
})();
