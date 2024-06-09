document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const uploadedImage = document.getElementById("uploadedImage");
  const uploadForm = document.getElementById("uploadForm");
  const predictionText = document.getElementById("predictionText");

  const container = document.getElementsByClassName("container");
  const title = document.getElementsByClassName("title");
  const result = document.getElementById("result");
  const loader = document.getElementById("loader");

  gsap.from([container, title], {
    opacity: 0,
    y: 25,
    duration: 1,
    stagger: 0.25,
  });

  loader.classList.add("hidden");

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Silahkan pilih gambar terlebih dahulu!");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        result.classList.remove("hidden");
        predictionText.textContent = "";

        gsap.fromTo(
          uploadedImage,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1 }
        );
      };
      reader.readAsDataURL(file);
    }
  });

  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // Tampilkan loader
      loader.classList.remove("hidden");

      fetch("/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          predictionText.textContent = `Gambar tersebut adalah sebuah ${data.prediction}!`;
          gsap.fromTo(
            predictionText,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 1 }
          );

          // Sembunyikan loader setelah mendapatkan hasil
          loader.classList.add("hidden");
        })
        .catch((error) => {
          console.error("Error:", error);
          // Sembunyikan loader jika ada error
          loader.classList.add("hidden");
        });
    }
  });
});
