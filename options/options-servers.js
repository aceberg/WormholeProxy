let mainServer = {};
let proxyServers = [];

// Get local proxyServers
browser.storage.local.get(data => {
  if (data.proxyServers) {
    proxyServers = data.proxyServers;
  }

  displayProxyServers(proxyServers);

  // Listen to click on edit button
  const buttons = document.querySelectorAll(".edit-btn");
  for (let b of buttons) {
    b.addEventListener("click", async (event) => {
      const i = b.getAttribute("name");
      
      // console.log("EDIT", proxyServers[i-1]);
      fillForm(i-1);
    });
  }
});

// Listen to Delete button click
const delBtn = document.getElementById("delForm");
delBtn.addEventListener("click", async (event) => {
  const index = document.getElementById('formID').value;
  // console.log('DEL', index);
  proxyServers.splice(index, 1);
  saveProxyServers(proxyServers);

  document.getElementById("addForm").reset();
});


// Add or edit server
const form1 = document.getElementById("addForm");
form1.addEventListener("submit", async (event) => {
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

function saveProxyServers(proxyServers) {
  browser.storage.local.set({
    proxyServers: proxyServers
  });

  // Update page
  location.reload();
};

function displayProxyServers(proxyServers) {
  const sList = document.getElementById('serverList');
  const html = sList.innerHTML;
  let finalOutput = '';
  let i = 0;
  for (let serv of proxyServers){
      i = i + 1;
      finalOutput = finalOutput + html.replaceAll('colorTemplate', serv.color).replaceAll('nameTemplate', serv.name).replaceAll('typeTemplate', serv.type).replaceAll('hostTemplate', serv.host).replaceAll('portTemplate', serv.port).replaceAll('iTemplate', i);
  }

  sList.innerHTML = finalOutput;
};