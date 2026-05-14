
document.addEventListener('click',function(e){if(e.target.classList.contains('copy-btn')){const code=e.target.closest('.code-window').querySelector('code').innerText;navigator.clipboard.writeText(code);e.target.innerText='Copied';setTimeout(()=>e.target.innerText='Copy',1200)}});
const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
