const players = [];

function onYouTubeIframeAPIReady() {
  document.querySelectorAll(".youtube-player").forEach((element) => {
    const player = new YT.Player(element, {
      videoId: element.dataset.videoId,

      events: {
        onStateChange(event) {
          if (event.data === YT.PlayerState.PLAYING) {
            players.forEach((otherPlayer) => {
              if (otherPlayer !== event.target) {
                otherPlayer.pauseVideo();
              }
            });
          }
        },
      },
    });

    players.push(player);
  });
}
