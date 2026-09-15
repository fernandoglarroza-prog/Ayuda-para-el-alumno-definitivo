import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/controls/OrbitControls.js/+esm';

const MANIFEST='https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public/models/atlas.json';
const mount=document.getElementById('dentition3dMount');
if(!mount) throw new Error('No existe el contenedor de dentición 3D');

const fdiFromName=(name='')=>{
  if(!/tooth/i.test(name))return null;
  const q=/Right upper/i.test(name)?1:/Left upper/i.test(name)?2:/Left lower/i.test(name)?3:/Right lower/i.test(name)?4:null;
  const p=/central/i.test(name)?1:/lateral/i.test(name)?2:/canine/i.test(name)?3:/first.*premolar/i.test(name)?4:/second.*premolar/i.test(name)?5:/first.*molar/i.test(name)?6:/second.*molar/i.test(name)?7:/third.*molar|wisdom/i.test(name)?8:null;
  return q&&p?q*10+p:null;
};
const typeOf=fdi=>({1:'Incisivo central',2:'Incisivo lateral',3:'Canino',4:'Primer premolar',5:'Segundo premolar',6:'Primer molar',7:'Segundo molar',8:'Tercer molar'}[fdi%10]||'Diente');
const archOf=fdi=>fdi<30?'Superior':'Inferior';
const sideOf=fdi=>[1,4].includes(Math.floor(fdi/10))?'Derecho':'Izquierdo';
const rootPattern=fdi=>{
  const q=Math.floor(fdi/10),p=fdi%10,upper=q<=2;
  if(p<=3)return {n:1,text:'1 raíz típica'};
  if(p===4&&upper)return {n:2,text:'habitualmente 2 raíces en el primer premolar superior'};
  if(p===4||p===5)return {n:1,text:'1 raíz típica, con variaciones'};
  if((p===6||p===7)&&upper)return {n:3,text:'3 raíces típicas: mesiovestibular, distovestibular y palatina'};
  if(p===6||p===7)return {n:2,text:'2 raíces típicas: mesial y distal'};
  return {n:2,text:'morfología radicular muy variable en terceros molares'};
};
const faceText=fdi=>fdi%10<=3?'vestibular · lingual/palatina · mesial · distal · incisal':'vestibular · lingual/palatina · mesial · distal · oclusal';

mount.innerHTML=`<div class="dentShell"><div class="dentStage"><canvas id="dentCanvas" class="dentCanvas" aria-label="Dentición permanente 3D educativa"></canvas></div><aside class="dentSide"><div><span class="simEy">Control de arcada</span><div class="dentControls"><button type="button" data-dent-show="all" class="active">Todas</button><button type="button" data-dent-show="upper">Superior</button><button type="button" data-dent-show="lower">Inferior</button><button type="button" data-dent-isolate>Aislar</button><button type="button" data-dent-reset>Restablecer</button></div></div><div><span class="simEy">Número FDI</span><div id="dentList" class="dentList"></div></div><div id="dentInfo" class="dentInfo"><h3>Seleccioná un diente</h3><p>Podés tocarlo en la arcada o elegir su número FDI.</p></div><div><span class="simEy">Cara a observar</span><div class="dentControls"><button type="button" data-face="vestibular">Vestibular</button><button type="button" data-face="lingual">Lingual/palatina</button><button type="button" data-face="mesial">Mesial</button><button type="button" data-face="distal">Distal</button><button type="button" data-face="occlusal">Oclusal/incisal</button></div></div><p class="dentLegend">Este visor usa modelos dentarios educativos de baja carga construidos con la posición y dimensiones de los dientes del atlas. Corona y raíces son aproximaciones morfológicas para estudio; no son segmentaciones clínicas ni sustituyen piezas anatómicas reales.</p></aside></div>`;

const canvas=document.getElementById('dentCanvas');
const stage=canvas.parentElement;
const list=document.getElementById('dentList');
const info=document.getElementById('dentInfo');
const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<900;
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:mobile?'low-power':'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1:1.5));
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(35,1,.001,10);camera.position.set(0,.03,.34);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=.04;controls.maxDistance=.7;
scene.add(new THREE.HemisphereLight(0xffffff,0x78879a,2.6));
const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(.4,.8,1);scene.add(light);
const root=new THREE.Group();scene.add(root);
const crownMat=new THREE.MeshStandardMaterial({color:0xf4efe3,roughness:.56,metalness:0});
const rootMat=new THREE.MeshStandardMaterial({color:0xe3d5bc,roughness:.68,metalness:0});
const selectedMat=new THREE.MeshStandardMaterial({color:0x2b72d6,roughness:.5,metalness:0});
let teeth=[],selected=null,filter='all',isolated=false;
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();

function requestRender(){renderer.render(scene,camera);}
controls.addEventListener('change',requestRender);
function resize(){const r=stage.getBoundingClientRect();const w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();requestRender();}
new ResizeObserver(resize).observe(stage);

function createTooth(part,fdi){
  const [lo,hi]=part.bounds;const w=Math.max(.002,hi[0]-lo[0]),h=Math.max(.004,hi[1]-lo[1]),d=Math.max(.002,hi[2]-lo[2]);const upper=fdi<30;const group=new THREE.Group();group.position.set((lo[0]+hi[0])/2,(lo[1]+hi[1])/2,(lo[2]+hi[2])/2);group.userData={fdi,partName:part.name};
  const p=fdi%10;const crownH=h*(p>=6?.38:p<=2?.34:.37);const rootH=Math.max(h-crownH,h*.48);const crownCenterY=upper?-h/2+crownH*.56:h/2-crownH*.56;
  const crown=new THREE.Mesh(new THREE.SphereGeometry(1,mobile?8:12,mobile?6:9),crownMat);crown.scale.set(w*.55,crownH*.55,d*(p>=6?.62:p<=2?.42:.52));crown.position.y=crownCenterY;crown.userData.toothGroup=group;group.add(crown);
  const pattern=rootPattern(fdi);const rootBaseY=upper?crownCenterY+crownH*.42:crownCenterY-crownH*.42;const rootDir=upper?1:-1;const spread=w*.19;
  for(let i=0;i<pattern.n;i++){
    const radius=Math.max(.00065,w*(pattern.n===1?.17:.12));const geom=new THREE.ConeGeometry(radius,rootH,mobile?6:8,1,false);const mesh=new THREE.Mesh(geom,rootMat);const offset=pattern.n===1?0:(i-(pattern.n-1)/2)*spread;mesh.position.set(offset,rootBaseY+rootDir*rootH*.48,(pattern.n===3&&i===2?d*.15:0));if(!upper)mesh.rotation.z=Math.PI;mesh.rotation.x=(i-(pattern.n-1)/2)*.07;mesh.userData.toothGroup=group;group.add(mesh);
  }
  root.add(group);return group;
}
function visualState(){for(const g of teeth){const fdi=g.userData.fdi;const allowed=filter==='all'||(filter==='upper'&&fdi<30)||(filter==='lower'&&fdi>=30);g.visible=allowed&&(!isolated||g===selected);for(const m of g.children)m.material=g===selected?selectedMat:(m.geometry.type==='SphereGeometry'?crownMat:rootMat);}list.querySelectorAll('[data-fdi]').forEach(b=>b.classList.toggle('active',selected&&Number(b.dataset.fdi)===selected.userData.fdi));requestRender();}
function select(g){selected=g;isolated=false;visualState();const fdi=g.userData.fdi,p=rootPattern(fdi);info.innerHTML=`<h3>${fdi} · ${typeOf(fdi)}</h3><dl><dt>Arcada</dt><dd>${archOf(fdi)}</dd><dt>Lado</dt><dd>${sideOf(fdi)}</dd><dt>Corona</dt><dd>${fdi%10<=2?'Borde incisal y caras proximales/axiales':fdi%10===3?'Cúspide única dominante':'Superficie oclusal con cúspides y surcos'}</dd><dt>Raíces</dt><dd>${p.text}</dd><dt>Caras</dt><dd>${faceText(fdi)}</dd></dl><p class="v1Mini">Patrón morfológico típico: puede presentar variaciones anatómicas reales.</p>`;fitSelected();}
function fitAll(){const box=new THREE.Box3().setFromObject(root);const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()),max=Math.max(size.x,size.y,size.z);controls.target.copy(center);camera.position.set(center.x,center.y,center.z+Math.max(max*2.2,.18));camera.near=.001;camera.far=5;camera.updateProjectionMatrix();controls.update();requestRender();}
function fitSelected(){if(!selected)return;const box=new THREE.Box3().setFromObject(selected);const c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3()),m=Math.max(s.x,s.y,s.z);controls.target.copy(c);const dir=camera.position.clone().sub(controls.target);if(dir.lengthSq()<.001)dir.set(0,0,1);dir.normalize();camera.position.copy(c).add(dir.multiplyScalar(Math.max(m*4,.04)));controls.update();requestRender();}
function faceView(face){if(!selected)return;const box=new THREE.Box3().setFromObject(selected),c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3()),d=Math.max(s.x,s.y,s.z)*4;const upper=selected.userData.fdi<30;const dirs={vestibular:[0,0,1],lingual:[0,0,-1],mesial:[-1,0,0],distal:[1,0,0],occlusal:[0,upper?-1:1,.001]};const v=dirs[face]||dirs.vestibular;controls.target.copy(c);camera.position.set(c.x+v[0]*d,c.y+v[1]*d,c.z+v[2]*d);camera.up.set(0,1,0);if(face==='occlusal')camera.up.set(0,0,upper?-1:1);controls.update();requestRender();}

fetch(MANIFEST).then(r=>{if(!r.ok)throw new Error(`Manifest ${r.status}`);return r.json();}).then(data=>{
  const items=(data.parts||[]).map(part=>({part,fdi:fdiFromName(part.name||'')})).filter(x=>x.fdi&&Array.isArray(x.part.bounds)).sort((a,b)=>a.fdi-b.fdi);if(!items.length)throw new Error('No se encontraron dientes en el atlas');
  const seen=new Set();for(const {part,fdi} of items){if(seen.has(fdi))continue;seen.add(fdi);teeth.push(createTooth(part,fdi));}
  list.innerHTML=teeth.map(g=>`<button type="button" data-fdi="${g.userData.fdi}">${g.userData.fdi}</button>`).join('');list.querySelectorAll('[data-fdi]').forEach(b=>b.addEventListener('click',()=>select(teeth.find(g=>g.userData.fdi===Number(b.dataset.fdi)))));fitAll();requestRender();
}).catch(err=>{console.error('[Dentición 3D]',err);mount.querySelector('.dentStage').innerHTML='<p style="padding:20px">No se pudo cargar la dentición educativa. El resto del simulador continúa disponible.</p>';});

canvas.addEventListener('pointerup',e=>{const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(teeth.flatMap(g=>g.children).filter(x=>x.parent.visible),false)[0]?.object;const g=hit?.userData?.toothGroup;if(g)select(g);});
document.querySelectorAll('[data-dent-show]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.dentShow;isolated=false;document.querySelectorAll('[data-dent-show]').forEach(x=>x.classList.toggle('active',x===b));visualState();fitAll();}));
document.querySelector('[data-dent-isolate]')?.addEventListener('click',()=>{if(!selected)return;isolated=!isolated;visualState();if(isolated)fitSelected();else fitAll();});
document.querySelector('[data-dent-reset]')?.addEventListener('click',()=>{selected=null;isolated=false;filter='all';document.querySelectorAll('[data-dent-show]').forEach(x=>x.classList.toggle('active',x.dataset.dentShow==='all'));visualState();info.innerHTML='<h3>Seleccioná un diente</h3><p>Podés tocarlo en la arcada o elegir su número FDI.</p>';fitAll();});
document.querySelectorAll('[data-face]').forEach(b=>b.addEventListener('click',()=>faceView(b.dataset.face)));
resize();