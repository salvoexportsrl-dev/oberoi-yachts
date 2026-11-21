const IMG='https://cdn.shopify.com/s/files/1/1022/7911/9212/files/';const yachts={
'morrigan':{name:'Morrigan',subtitle:'Galeone 70 feet',size:'70 feet',intro:'A distinctive yacht for exclusive private cruises, refined experiences and unforgettable moments on the water.',image:'morrigan-slide-dubai.jpg?v=1792217517',gallery:['oberoi-morrigan-70-piedi.jpg?v=1792217005','morrigan-galleria-1.png?v=1792217851','morrigan-galleria-2.png?v=1792217858']},
'san-lorenzo-sx88':{name:'San Lorenzo SX88',subtitle:'San Lorenzo 88 feet',size:'88 feet',intro:'Contemporary Italian design and exceptional onboard comfort for a distinguished private yacht charter.',image:'san-lorenzo-sx88-slide.png?v=1792245901',gallery:['san-lorenzo-sx88-galleria-1.png?v=1792246220','san-lorenzo-sx88-galleria-2.png?v=1792246227','san-lorenzo-sx88-galleria-3.png?v=1792246236']},
'emir':{name:'EMIR',subtitle:'82.5 metres · 270′8″',size:'82.5 metres',intro:'Discover an extraordinary superyacht designed for exclusive luxury charters, exceptional privacy and memorable voyages.',image:'oberoi-emir-42649.jpg?v=1792867260',gallery:['oberoi-emir-42648.jpg?v=1792867323','oberoi-emir-42647.jpg?v=1792867328','oberoi-emir-42646.jpg?v=1792867332']},
'bella-vita':{name:'Bella Vita',subtitle:'Majesty 66 feet',size:'66 feet',intro:'Enjoy private celebrations and elegant cruises aboard this beautifully appointed Majesty yacht.',image:'oberoi-bella-vita-nuovo-2.jpg?v=1792933801',gallery:['oberoi-bella-vita-nuovo-1.jpg?v=1792933802','oberoi-bella-vita-nuovo-21.jpg?v=1792933801','oberoi-bella-vita-nuovo-20.jpg?v=1792933801']}
};
const modal=document.getElementById('details');const closeModal=()=>{modal.classList.remove('open');document.body.style.overflow='';};document.querySelectorAll('[data-yacht]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const data=yachts[a.dataset.yacht];if(!data)return;document.getElementById('detail-img').src=IMG+data.image;document.getElementById('detail-img').alt=data.name;document.getElementById('detail-title').textContent=data.name;document.getElementById('detail-subtitle').textContent=data.subtitle;document.getElementById('detail-desc').textContent=data.intro;document.getElementById('detail-gallery').innerHTML='';data.gallery.forEach(src=>{const img=document.createElement('img');img.src=IMG+src;img.alt=data.name+' interior';img.loading='lazy';img.addEventListener('click',()=>document.getElementById('detail-img').src=img.src);document.getElementById('detail-gallery').append(img)});document.getElementById('detail-book').onclick=()=>{document.getElementById('yacht').value=data.name;closeModal();document.getElementById('booking').scrollIntoView({behavior:'smooth'})};modal.classList.add('open');document.body.style.overflow='hidden';document.getElementById('close').focus()}));document.getElementById('close').onclick=closeModal;modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const API='https://eftswzwxcdkrimnyvnrg.supabase.co/functions/v1/';
const yachtSelect=document.getElementById('yacht'),durationSelect=document.getElementById('duration');
const optionsFor=(yacht)=>yacht==='EMIR'?Array.from({length:30},(_,i)=>({value:(i+1)*24,label:(i+1)+' day'+(i?'s':'')})):Array.from({length:10},(_,i)=>({value:i+(yacht==='Morrigan'||yacht==='San Lorenzo SX88'?3:1),label:(i+(yacht==='Morrigan'||yacht==='San Lorenzo SX88'?3:1))+' hours'}));
function refreshDurations(){durationSelect.replaceChildren();optionsFor(yachtSelect.value).forEach(o=>{const option=document.createElement('option');option.value=o.value;option.textContent=o.label;durationSelect.append(option)});}
yachtSelect.addEventListener('change',refreshDurations);refreshDurations();
document.getElementById('date').min=new Date(Date.now()+86400000).toLocaleDateString('en-CA',{timeZone:'Asia/Dubai'});
const form=document.getElementById('booking-form'),status=document.getElementById('form-status');
async function postBooking(path,payload){const res=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});let data;try{data=await res.json()}catch{throw Error('Booking service is unavailable. Please contact booking@oberoi.yachts.')}if(!res.ok)throw Error(data.error||'Booking service unavailable');return data}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const button=form.querySelector('button[type=submit]');button.disabled=true;status.textContent='Checking availability…';
 try{
  const f=new FormData(form);const start=f.get('date')+'T'+f.get('time')+':00+04:00';
  const payload={name:String(f.get('name')),email:String(f.get('email')),phone:String(f.get('phone')),yacht:String(f.get('yacht')),guests:Number(f.get('guests')),duration:Number(f.get('duration')),start,note:String(f.get('message')||''),payment_percent:Number(f.get('payment_percent'))};
  const booking=await postBooking('oy-request-booking',payload);
  if(!booking.booking_token)throw Error('Booking reference unavailable. Please contact our team.');
  status.textContent='Availability confirmed. Opening secure Stripe checkout…';
  const checkout=await postBooking('oy-customer-stripe-live-checkout',{token:booking.booking_token});
  const url=new URL(checkout.checkout_url);
  if(url.protocol!=='https:'||!url.hostname.endsWith('.stripe.com'))throw Error('Unexpected checkout destination');
  location.assign(url.href);
 }catch(error){status.textContent=error.message||'Unable to complete booking. Please try again.';button.disabled=false;}
});
