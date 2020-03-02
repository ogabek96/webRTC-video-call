let connection;
const existingTracks = [];
const configuration = {
  iceServers: [
    {
      urls: "stun:stun1.l.google.com:19302"
    },
    {
      urls: "stun:stun2.l.google.com:19302"
    },
    {
      urls: "stun:stun3.l.google.com:19302"
    },
    {
      'urls': 'turn:turnserver.appearin.net:443?transport=udp',
      'credential': 'y56NfaOk+6K3lSnqTNHv1n3kflM=',
      'username': '779e24a7-7216-4879-b304-efc9c76cffd7:1583001639'
    }
    // ,
    // {
    //   urls: "turn:" + turnServerIPAddress + ":" + turnServerPort,
    //   username: turnServerUserName,
    //   credential: turnServerPassword
    // }
  ]
};

socket.on("update", data => {
  if (data.connectionHandShake) {
    const handsh = data.connectionHandShake;
    if (handsh.type === "offer") {
      handleOffer(handsh);
      createAndSendAnswer();
    }
    if (handsh.type === "answer") {
      handleAnswer(handsh);
    }
  } else if (data.iceCandidate) {
    handleCandidate(data.iceCandidate);
  }
});

function createRTCPeerConnection() {
  return new Promise((resolve, reject) => {
    try {
      connection = new RTCPeerConnection(configuration);

      for (const track of localStream.getTracks()) {
        existingTracks.push(connection.addTrack(track, localStream));
      }

      connection.ontrack = event => {
        console.log("on track");
        remoteView.srcObject = event.streams[0];
      };

      connection.onicecandidate = event => {
        if (event.candidate) {
          // console.log(event.candidate);
          // console.log("on ice candidate");
          socket.emit("update", { iceCandidate: event.candidate, roomName });
        }
      };
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

async function createAndSendOffer() {
  try {
    const offer = await connection.createOffer();
    socket.emit("update", { connectionHandShake: offer, roomName });
    connection.setLocalDescription(offer);
  } catch (e) {
    console.error(e);
  }
}

async function createAndSendAnswer() {
  try {
    const answer = await connection.createAnswer();
    socket.emit("update", { connectionHandShake: answer, roomName });
    connection.setLocalDescription(answer);
  } catch (e) {
    console.error(e);
  }
}

async function handleOffer(offer) {
  console.log("offer received");
  connection.setRemoteDescription(new RTCSessionDescription(offer));
}

async function handleAnswer(answer) {
  console.log("answer received");
  connection.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleCandidate(candidate) {
  console.log("handleCandidate", candidate);
  connection.addIceCandidate(new RTCIceCandidate(candidate));
}

localCameraView()
  .then(() => {
    return createRTCPeerConnection();
  })
  .then(() => {
    createAndSendOffer();
  });
