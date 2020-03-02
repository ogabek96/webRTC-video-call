function openFullscreen() {
  if (this.requestFullscreen) {
    this.requestFullscreen();
  } else if (this.mozRequestFullScreen) { /* Firefox */
    this.mozRequestFullScreen();
  } else if (this.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    this.webkitRequestFullscreen();
  } else if (this.msRequestFullscreen) { /* IE/Edge */
    this.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}