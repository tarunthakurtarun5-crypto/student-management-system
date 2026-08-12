const KEY="sms_students_v1";
let students=JSON.parse(localStorage.getItem(KEY))||[
 {id:1,name:"Rahul Sharma",email:"rahul@example.com",course:"BCA",marks:82,attendance:91},
 {id:2,name:"Priya Singh",email:"priya@example.com",course:"BCA",marks:76,attendance:87}
];

const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem(KEY,JSON.stringify(students));

function render(){
  const q=$("search").value.toLowerCase().trim();
  const rows=students.filter(s=>[s.name,s.email,s.course].some(v=>v.toLowerCase().includes(q)));
  $("studentTable").innerHTML=rows.map(s=>`
    <tr>
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.course)}</td>
      <td>${s.marks}%</td>
      <td>${s.attendance}%</td>
      <td class="actions">
        <button class="edit" onclick="editStudent(${s.id})">Edit</button>
        <button class="delete" onclick="deleteStudent(${s.id})">Delete</button>
      </td>
    </tr>`).join("");
  $("empty").style.display=rows.length?"none":"block";
  $("totalStudents").textContent=students.length;
  $("avgMarks").textContent=(students.length?Math.round(students.reduce((a,s)=>a+Number(s.marks),0)/students.length):0)+"%";
  $("presentCount").textContent=students.filter(s=>Number(s.attendance)>=75).length;
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function openModal(s=null){
  $("modal").classList.remove("hidden");
  $("modalTitle").textContent=s?"Edit Student":"Add Student";
  $("studentId").value=s?.id||"";
  $("name").value=s?.name||"";
  $("email").value=s?.email||"";
  $("course").value=s?.course||"";
  $("marks").value=s?.marks??"";
  $("attendance").value=s?.attendance??"";
  $("name").focus();
}
function closeModal(){$("modal").classList.add("hidden");}
window.editStudent=id=>openModal(students.find(s=>s.id===id));
window.deleteStudent=id=>{
  if(confirm("Delete this student record?")){
    students=students.filter(s=>s.id!==id); save(); render();
  }
};
$("addBtn").onclick=()=>openModal();
$("closeBtn").onclick=closeModal;
$("search").oninput=render;
$("studentForm").onsubmit=e=>{
  e.preventDefault();
  const id=Number($("studentId").value);
  const data={id:id||Date.now(),name:$("name").value.trim(),email:$("email").value.trim(),
    course:$("course").value.trim(),marks:Number($("marks").value),attendance:Number($("attendance").value)};
  if(id) students=students.map(s=>s.id===id?data:s); else students.push(data);
  save(); render(); closeModal(); e.target.reset();
};
$("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
render();
