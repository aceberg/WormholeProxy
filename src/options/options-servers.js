let proxyServers = [];


// Get local proxyServers
browser.storage.local.get(data => {
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

  // Listen to click on check
  const checks = document.querySelectorAll(".main-check");
  for (let c of checks) {
    c.addEventListener("click",  () => {
      const index = c.getAttribute("name");
      console.log("CHECKED", index);

      for (let i=0; i<proxyServers.length; i++){
        if (i == index) {
          proxyServers[i].checked = true;
          saveMainServer(proxyServers[i]);
          console.log('NAME', proxyServers[i].name, 'CH', proxyServers[i].checked);
        } else {
          proxyServers[i].checked = false;
          console.log('NAME', proxyServers[i].name, 'CH', proxyServers[i].checked);
        }
      }
      
      saveProxyServers(proxyServers);
      displayProxyServers();
    });
  }
});

// Listen for changes in local storage
browser.storage.onChanged.addListener(changeData => {
  if (changeData.proxyServers) {
    proxyServers = changeData.proxyServers.newValue;
  }
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
  oneServer.checked = formData1.get('checked');

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
  form2.elements['checked'].value = pr.checked;
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
  browser.storage.local.set({
    proxyServers: proxyServers
  });

  // Update page
  location.reload();
};

function displayProxyServers() {
  const tbody = document.getElementById('serverList');
  const template = document.querySelector("#serverTemplate");

  let clone, td, input, b;
  let i = 0;

  browser.storage.local.get(data => {
    if (data.proxyServers) {
      proxyServers = data.proxyServers;
    }
  });

  tbody.textContent = '';
  
  for (let serv of proxyServers){
      
    console.log('DISPLAY: NAME', serv.name, 'CH', serv.checked);
      
    clone = template.content.cloneNode(true);
    td = clone.querySelectorAll("td");
    
    input = td[0].querySelectorAll("input")[0];
    input.name = i;
    input.checked = serv.checked;
    
    td[1].textContent = serv.name;
    td[1].style = `background-color: ${serv.color}`;
    td[2].textContent = serv.type;
    td[3].textContent = serv.host;
    td[4].textContent = serv.port;
    b = td[5].querySelectorAll("button")[0];
    b.name = i;

    tbody.appendChild(clone);

    i = i + 1;
  }
};