document.addEventListener("DOMContentLoaded", function() {
    const infoPanel = document.querySelector(".info-panel");
    const dragHandle = document.querySelector(".drag-handle");
    let isDragging = false;
    let startY;
    let startHeight;

    function startDrag(e) {
      if (e.type === "mousedown" || e.type === "touchstart") {
        e.preventDefault();
        isDragging = true;
        startY = e.clientY || e.touches[0].clientY;
        startHeight = infoPanel.offsetHeight;
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("touchend", stopDrag);
      }
    }

    function drag(e) {
      if (!isDragging) return;
      const currentY = e.clientY || e.touches[0].clientY;
      const newHeight = startHeight - (currentY - startY); // Корректируем изменение высоты
      infoPanel.style.height = `${newHeight}px`;
      e.preventDefault();
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", drag);
      document.removeEventListener("touchend", stopDrag);
    }

    dragHandle.addEventListener("mousedown", startDrag);
    dragHandle.addEventListener("touchstart", startDrag, { passive: false });
  });

  
        // Функция для проверки параметров URL
        
            
        
       
       

        // Вызов функции при загрузке страницы
        
    