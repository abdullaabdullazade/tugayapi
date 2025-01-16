const dropArea = document.querySelector(".drop_box"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");

button.onclick = () => {
  input.click();
};

async function fetchPhotos() {
  try {
    const response = await fetch("http://localhost:3000/photos");
    const photos = await response.json();
    const photoList = document.getElementById("photoList");
    photoList.innerHTML = "";
    console.log(response);
    photos.forEach((photo) => {
      const listItem = document.createElement("div");
      listItem.className = "photo-item";

      const image = document.createElement("img");
      image.src = `http://localhost:3000/uploads/${photo.photoname}`;
      image.alt = photo.filename;

      const text = document.createElement("span");
      text.textContent = `${photo.title}`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Sil";
      removeBtn.onclick = () => {
        photoList.removeChild(listItem);
      };

      listItem.appendChild(image);
      listItem.appendChild(text);
      listItem.appendChild(removeBtn);
      photoList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Xəta:", error);
  }
  window.onload = fetchPhotos;
}

async function uploadImg(file) {
  try {
    const formData = new FormData();
    const title = document.querySelector("input[type='text']").value;

    formData.append("file", file[0]);
    formData.append("title", title);
    if (title.length < 6) {
      alert("kisi 6 herfden cox gir");
      return;
    }
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("file uğurla yükləndi!");
      location.reload();
    } else {
      alert("Yükləmə zamanı xəta baş verdi.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Yükləmə zamanı xəta baş verdi.");
  }
}

input.addEventListener("change", function (e) {
  fetchPhotos();

  const file = e.target.files;

  dropArea.innerHTML = `
    <div class="file-list">
      ${file[0].name}
    </div><br/>
    <input type="text" placeholder="Title daxil ele"><br/><br/>
    <button class="btn" id="uploadBtn">Faylı Yüklə</button>
  `;

  const uploadBtn = document.getElementById("uploadBtn");
  uploadBtn.onclick = () => uploadImg(file);
});

window.onload = fetchPhotos;
