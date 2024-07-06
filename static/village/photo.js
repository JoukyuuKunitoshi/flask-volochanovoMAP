function expandImage(img) {
    const overlay = document.getElementById('overlay');
    img.classList.toggle('expanded-image');
    if (img.classList.contains('expanded-image')) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

document.getElementById('overlay').onclick = function() {
    const expandedImage = document.querySelector('.expanded-image');
    if (expandedImage) {
        expandedImage.classList.remove('expanded-image');
        this.classList.remove('show');
    }
}