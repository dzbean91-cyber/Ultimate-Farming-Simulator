let certificates=[];
let rootActive=false;
let accountStatus="Active";
let phoneFarm=[];
let totalMoney=0;
let spamInterval=null;
let spamActive=false;

const ADMINS={
EU:{ip:"172.16.0.1",pass:"euadmin"},
Asia:{ip:"10.0.0.1",pass:"asiaadmin"},
NA:{ip:"192.168.1.100",pass:"usadmin"}
China:{ip:"182.02.1.67",pass:"chinaadmin
};

function log(msg,type=""){
 let p=document.createElement("p");
 p.className=type;
 p.innerText=msg;
 document.getElementById("log").appendChild(p);
}

function createCert(){
 if(accountStatus==="Locked"){log("Account Locked","error");return;}
 let id="CERT-"+Math.floor(Math.random()*999999);
 certificates.push(id);
 updateCertList();
 log("Cert Created: "+id,"success");
}

function updateCertList(){
 let s=document.getElementById("certList");
 s.innerHTML="";
 certificates.forEach((c,i)=>{
  let o=document.createElement("option");
  o.value=i;
  o.text=c;
  s.appendChild(o);
 });
}

function signApp(){
 if(certificates.length===0){log("No Cert","error");return;}
 let rate=document.getElementById("antiAudit").checked?0.07:0.15;
 if(Math.random()<rate) log("Audit Triggered","error");
 else log("App Signed","success");
}

function createRootCert(){
 let ip=document.getElementById("adminIP").value;
 let pass=document.getElementById("adminPass").value;

 if(ip===ADMINS.NA.ip){
  accountStatus="Locked";
  log("NA bypass → Account Locked","error");
  return;
 }

 if((ip===ADMINS.Asia.ip && pass===ADMINS.Asia.pass) ||
    (ip===ADMINS.EU.ip && pass===ADMINS.EU.pass)){
  rootActive=true;
  log("Root Certificate Created","success");
 }else log("Permission Denied","error");
}

function signWithRoot(){
 if(!rootActive){log("No Root Cert","error");return;}
 if(devRegion==="Asia"||devRegion==="LATAM")
  log("Signed with ROOT","success");
 else log("Root only Asia/EU","error");
}

function addPhone(){
 let name=document.getElementById("phoneName").value;
 if(!name)return;

 phoneFarm.push({
  name:name,
  region:document.getElementById("phoneRegion").value,
  rooted:document.getElementById("phoneRoot").checked,
  status:"Online",
  locked:false
 });

 updatePhones();
 log("Phone Added: "+name,"success");
}

function updatePhones(){
 let s=document.getElementById("phoneList");
 s.innerHTML="";
 phoneFarm.forEach((p,i)=>{
  let o=document.createElement("option");
  o.value=i;
  o.text=p.name+" | "+p.region+" | "+p.status+(p.locked?" | LOCKED":"");
  s.appendChild(o);
 });
}

function togglePhone(){
 let i=document.getElementById("phoneList").value;
 if(!phoneFarm[i]||phoneFarm[i].locked)return;
 phoneFarm[i].status=phoneFarm[i].status==="Online"?"Offline":"Online";
 updatePhones();
}

function lockPhone(){
 let i=document.getElementById("phoneList").value;
 if(!phoneFarm[i])return;
 phoneFarm[i].locked=true;
 phoneFarm[i].status="Offline";
 updatePhones();
 log("Phone Locked","error");
}

function auditCheck(){
 let i=document.getElementById("phoneList").value;
 if(!phoneFarm[i])return;
 let anti=document.getElementById("antiBanModule").checked;

 if(phoneFarm[i].rooted && !anti && Math.random()<0.25){
  phoneFarm[i].locked=true;
  phoneFarm[i].status="Offline";
  log("BanPan locked phone","error");
 }else log("BanPan Passed","success");

 updatePhones();
}

function gmatCheck(){
 let i=document.getElementById("phoneList").value;
 if(!phoneFarm[i])return;
 let anti=document.getElementById("antiBanModule").checked;
 let breakHide=Math.random()<0.30;

 if(phoneFarm[i].rooted){
  if(anti && breakHide){
   phoneFarm[i].locked=true;
   phoneFarm[i].status="Offline";
   log("GMAT broke HideRoot","error");
  }else if(!anti && Math.random()<0.20){
   phoneFarm[i].locked=true;
   phoneFarm[i].status="Offline";
   log("GMAT locked phone","error");
  }else log("GMAT Passed","success");
 }else log("Phone Safe","success");

 updatePhones();
}

function earnMoney(){
 let earned=0;
 phoneFarm.forEach(p=>{
  if(p.status==="Online" && !p.locked)
   earned+=Math.floor(Math.random()*10)+5;
 });
 totalMoney+=earned;
 document.getElementById("moneyDisplay").innerText=totalMoney;
 log("Earned "+earned+" $","success");
}

function startSpam(){
 if(spamActive)return;
 spamActive=true;
 document.getElementById("spamStatus").innerText="ON";
 log("Spam Started","warning");

 spamInterval=setInterval(()=>{
  let earned=0;
  phoneFarm.forEach(p=>{
   if(p.status==="Online"&&!p.locked){
    earned+=Math.floor(Math.random()*20)+10;
    if(Math.random()<0.15){
     p.locked=true;
     p.status="Offline";
     log("Spam detection → "+p.name+" locked","error");
    }
   }
  });
  totalMoney+=earned;
  document.getElementById("moneyDisplay").innerText=totalMoney;
  updatePhones();
 },2000);
}

function stopSpam(){
 clearInterval(spamInterval);
 spamActive=false;
 document.getElementById("spamStatus").innerText="OFF";
 log("Spam Stopped","success");
}

function makeCall(){
 let num=document.getElementById("callNumber").value.trim();
 let pattern=/^\+\d \d{5}0\d{3}$/;
 }

 let active=phoneFarm.filter(p=>p.status==="Online"&&!p.locked);
 if(active.length===0){
  log("No active phone","error");
  return;
 }

 let phone=active[Math.floor(Math.random()*active.length)];
 log(phone.name+" calling "+num,"warning");

 if(Math.random()<0.10){
  phone.locked=true;
  phone.status="Offline";
  log("Call detected → phone locked","error");
  updatePhones();
 }else log("Call success","success");
}

function yuenaAI(){
 if(devRegion!=="Asia"){
  log("YuenaAI only in Asia","error");
  return;
 }
 log("YuenaAI load spike...","warning");
 let c=0;
 let t=setInterval(()=>{
  log("Load "+c,"warning");
  c++;
  if(c>8){clearInterval(t);log("Simulation End","error");}
 },200);
}
