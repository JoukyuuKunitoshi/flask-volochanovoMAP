/* JavaScript для управления боковым меню */
function toggleNav() {
    if (document.getElementById("mySidebar").style.width == "250px") {
      closeNav();
    } else {
      openNav();
    }
  }
  
  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
  }
  
  window.addEventListener('mouseup', function(event) {
    var sidebar = document.getElementById('mySidebar');
    var openButton = document.querySelector('.openbtn');
    if (event.target != sidebar && event.target != openButton && event.target.parentNode != sidebar) {
      closeNav();
    }
  });