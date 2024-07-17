let ignoreHosts = [];


// Get local ignoreHosts
browser.storage.local.get(data => {
  if (data.ignoreHosts) {
    ignoreHosts = data.ignoreHosts;
  }

  // Show on options page
  displayIgnoreHosts(ignoreHosts);

  // Listen to click on delete button
  const buttons = document.querySelectorAll(".ign-del-btn");
  for (let b of buttons) {
    b.addEventListener("click", async (event) => {
      const i = b.getAttribute("name");
      
      // Remove item
      ignoreHosts.splice(i-1, 1);
      saveIgnoreHosts(ignoreHosts);
    });
  }
});

// Listen to click on sort button
const sortIgnBtn = document.getElementById("sortIgnBtn");
sortIgnBtn.addEventListener("click", async (event) => {
  
  ignoreHosts.sort();

  saveIgnoreHosts(ignoreHosts);
});

// Add host to ignoreHosts
const formIgn = document.getElementById("newHostIgnore");
formIgn.addEventListener("submit", async (event) => {
  const formData = new FormData(formIgn);
  const host = formData.get('host');

  ignoreHosts.push(host);

  saveIgnoreHosts(ignoreHosts);
});

function saveIgnoreHosts(ignoreHosts) {
  browser.storage.local.set({
    ignoreHosts: ignoreHosts
  });

  // Update page
  location.reload();
};

function displayIgnoreHosts(ignoreHosts) {
  const tbody = document.getElementById('ignoreList');
  const template = document.querySelector("#ignoreTemplate");
  
  let clone, td, a, b;

  let i = 0;
  for (let host of ignoreHosts){
      i = i + 1;
  
      clone = template.content.cloneNode(true);
      td = clone.querySelectorAll("td");

      td[0].textContent = i+'.';
      a = td[1].querySelectorAll("a")[0];
      a.href = `http://${host}`;
      a.textContent = host;
      b = td[2].querySelectorAll("button")[0];
      b.name = i;

      tbody.appendChild(clone);
  }
};