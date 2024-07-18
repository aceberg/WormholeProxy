let proxyServers = [];
let mainServer = {};

// Get local proxyServers
browser.storage.sync.get(data => {
  if (data.proxyServers) {
    proxyServers = data.proxyServers;
  }

  displayProxyServers();

  // Listen to click on edit button
  const buttons = document.querySelectorAll(".edit-btn");
  for (let b of buttons) {
    b.addEventListener("click", () => {
      const i = b.getAttribute("name");
      
      fillForm(i);
      document.getElementById('addID').classList.add("show");
    });
  }
});

browser.storage.local.get(data => {
  if (data.mainServer) {
    mainServer = data.mainServer;
  }

  displaySelect();
});

// Listen for changes in local storage
browser.storage.sync.onChanged.addListener(changeData => {
  if (changeData.proxyServers) {
    proxyServers = changeData.proxyServers.newValue;
  }
});

// Listen to Select
const selectMain = document.getElementById("select-main");
selectMain.addEventListener("change", () => {

  const i = selectMain.value;

  console.log("SELECT", selectMain.value);

  mainServer = proxyServers[i];
  saveMainServer(mainServer);
  displaySelect();
});

// Listen to Delete button click
const delBtn = document.getElementById("delForm");
delBtn.addEventListener("click", (event) => {
  const index = document.getElementById('formID').value;
  // console.log('DEL', index);
  proxyServers.splice(index, 1);
  saveProxyServers(proxyServers);

  document.getElementById("addForm").reset();
});


// Add or edit server
const form1 = document.getElementById("addForm");
form1.addEventListener("submit", (event) => {
  const formData1 = new FormData(form1);
  const i = formData1.get('index');
  let oneServer = {};
  oneServer.name = formData1.get('name');
  oneServer.color = formData1.get('color');
  oneServer.type = formData1.get('type');
  oneServer.host = formData1.get('host');
  oneServer.port = formData1.get('port');

  if (i > -1) {
    proxyServers.splice(i, 1);
  }

  // console.log("ADD S", oneServer);
  proxyServers.push(oneServer);
  saveProxyServers(proxyServers);
});

// Fill form for editing
function fillForm(index) {
  const pr = proxyServers[index];
  // console.log("PR", pr);
  const form2 = document.getElementById("addForm");
  form2.elements['index'].value = index;
  form2.elements['name'].value = pr.name;
  form2.elements['color'].value = pr.color;
  form2.elements['type'].value = pr.type;
  form2.elements['host'].value = pr.host;
  form2.elements['port'].value = pr.port;

  document.getElementById("delForm").hidden = false;
};

function saveMainServer(mainServer) {

  browser.storage.local.set({
    mainServer: mainServer
  });
};

function saveProxyServers(proxyServers) {
  browser.storage.sync.set({
    proxyServers: proxyServers
  });

  // Update page
  location.reload();
};

function displaySelect() {
  const select = document.getElementById('select-main');
  
  let opt;
  let i = 0;

  select.textContent = '';

  opt = document.createElement("option");
  opt.selected = true;
  opt.disabled = true;

  if (mainServer.host != undefined) {
    opt.textContent = `${mainServer.name}, ${mainServer.host}:${mainServer.port}`;
  } else {
    opt.textContent = 'Please, select default server';
    document.getElementById('select-btn').classList.remove('btn-outline-primary');
    document.getElementById('select-btn').classList.add('btn-danger');
  }
  select.appendChild(opt);

  for (let serv of proxyServers){

    opt = document.createElement("option");
    opt.textContent = `${serv.name}, ${serv.host}:${serv.port}`;
    opt.value = i;
    select.appendChild(opt);

    i = i + 1;
  }
};

function displayProxyServers() {
  const tbody = document.getElementById('serverList');
  const template = document.querySelector("#serverTemplate");

  let clone, td, input, b;
  let i = 0;

  tbody.textContent = '';
  
  for (let serv of proxyServers){
      
    clone = template.content.cloneNode(true);
    td = clone.querySelectorAll("td");
       
    td[0].textContent = serv.name;
    td[0].style = `background-color: ${serv.color}`;
    td[1].textContent = serv.type;
    td[2].textContent = serv.host;
    td[3].textContent = serv.port;
    b = td[4].querySelectorAll("button")[0];
    b.name = i;

    tbody.appendChild(clone);

    i = i + 1;
  }
};