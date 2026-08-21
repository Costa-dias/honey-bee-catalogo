const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const spanClose = document.getElementsByClassName("close")[0];
const imagens = document.querySelectorAll(".zoom-img");

imagens.forEach(img => {
  img.addEventListener("click", function() {
    modal.style.display = "flex";
    modalImg.src = this.src;
  });
});

spanClose.onclick = function() {
  modal.style.display = "none";
}

modal.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
} 