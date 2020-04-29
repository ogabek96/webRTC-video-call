const localView = document.getElementById("localView");
const remoteView = document.getElementById("remoteView");
const shareInput = document.getElementById("shareInput");
const shareScreenButton = document.getElementById("shareScreen");
const stopShareScreenButton = document.getElementById("stopShareScreen");

let localStream;

async function localCameraView() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      // video: {
      //   facingMode: "environment" 
      // },
      video: true,
      audio: true,

    });
    localView.srcObject = stream;
    localStream = stream;
    return stream;
  } catch (e) {
    console.log(e);
  }
}

async function shareScreen() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    localView.srcObject = stream;
    localStream = stream;
    stream.getVideoTracks()[0].onended = function() {
      stopShareScreen();
    };
    stopShareScreenButton.style.display = "inline";
    shareScreenButton.style.display = "none";
  } catch (e) {
    console.log(e);
  }
}

async function stopShareScreen() {
  try {
    stopShareScreenButton.style.display = "none";
    shareScreenButton.style.display = "inline";
    localStream.getTracks().forEach(track => track.stop());
    localCameraView();
  } catch (e) {
    console.log(e);
  }
}
function audioMute() {
  let audioTracks = localStream.getAudioTracks();
  for(let i = 0; i < audioTracks.length; ++ i)
    audioTracks[i].enabled = !audioTracks[i].enabled;
  if(audioTracks[0].enabled) {
    document.getElementById('audio-mute').style.display = 'inline-block';
    document.getElementById('audio-unmute').style.display = 'none';
  } else {
    document.getElementById('audio-mute').style.display = 'none';
    document.getElementById('audio-unmute').style.display = 'inline-block';
  }
  console.log(audioTracks);
}

function videoMute() {
  let videoTracks = localStream.getVideoTracks();
  videoTracks[0].muted = true;
  for(let i = 0; i < videoTracks.length; ++ i)
    videoTracks[i].enabled = !videoTracks[i].enabled;
  if(videoTracks[0].enabled) {
    document.getElementById('video-mute').style.display = 'inline-block';
    document.getElementById('video-unmute').style.display = 'none';
  } else {
    document.getElementById('video-mute').style.display = 'none';
    document.getElementById('video-unmute').style.display = 'inline-block';
  }
  console.log(videoTracks);
}

localView.addEventListener("dblclick", openFullscreen);
remoteView.addEventListener("dblclick", openFullscreen);
localCameraView();
shareInput.value = window.location.href;
