let Songs;
let crntFolder;
let currentsong = new Audio();
console.log("Let's dive into javascript");

async function getSongs(folder) {
  crntFolder = folder;
  let get = await fetch(`http://127.0.0.1:3000/Songs/${folder}`);
  let response = await get.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  Songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      Songs.push(element.href.split(`/${folder}/`)[1]);

    }
  }
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of Songs) {
    songUL.innerHTML += `<li class="pointing">
                            <img src="assets/sidebar/music-note-03-stroke-rounded.svg" alt="Music">
                            <div class="info flex item-align direction">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Prachit</div>
                                
                            </div>
                            <div class="playingbtn flex item-align">
                                <img class="invert" src="assets/sidebar/play-circle-02-stroke-rounded (1).svg" alt="play">
                            </div>
                        </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  
}

const playMusic = (track, pause = false) => {
  currentsong.src = `Songs/${crntFolder}/` + track;


  if (!pause) {
    currentsong.play();
    Play.src = "assets/playbar/pause-stroke-rounded.svg";
  }

  document.querySelector(".SongNameinfo").innerHTML = track;
  console.log(track);
  




};


async function displayAlbums(){
  let get = await fetch(`http://127.0.0.1:3000/Songs/`);
  let response = await get.text();  
  let div = document.createElement("div");
  div.innerHTML = response;
  let ass=div.getElementsByTagName("a")
  console.log(ass);
  let CardAppend=document.querySelector(".CardPlaylists");
  let array=Array.from(ass)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
      if(e.href.includes('/Songs')){
        let folder=(e.href.split("/").slice(-2)[0]);
        console.log(folder);
        
        let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`);
        let response= await a.json();
        CardAppend.innerHTML=CardAppend.innerHTML+`<div data-folder="${folder}" class="card rounded m-1 p-1">
                        <img src="/Songs/${folder}/cover.jpg" alt="Phonk">
                        <div class="text1 m-1">${response.title}</div>
                        <div class="text2 m-1 textWidth">${response.description}</div>
                        <div class="playbtn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="10.75" fill="green" />
                                <path
                                    d="M9.956,15.386 C9.5,15.079 9.5,14.319 9.5,12.8 L9.5,11.2 C9.5,9.681 9.5,8.921 9.956,8.614 C10.411,8.307 11.035,8.646 12.281,9.326 L13.75,10.126 C15.25,10.944 16,11.353 16,12 C16,12.647 15.25,13.056 13.75,13.874 L12.281,14.674 C11.035,15.354 10.411,15.693 9.956,15.386 Z"
                                    fill="black" />
                            </svg>

                        </div>

                    </div>`
        
      }
    }

   Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
       await getSongs(`${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  await getSongs("playlist1"); // Add a default folder name here
  playMusic(Songs[0], true);

  // Code to display dynamic albums

  displayAlbums()

  Play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      Play.src = "assets/playbar/pause-stroke-rounded.svg";
    } else {
      currentsong.pause();
      Play.src = "assets/playbar/play-stroke-rounded.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    let current = formatTime(currentsong.currentTime);
    let total = formatTime(currentsong.duration);
    document.querySelector(".time").innerHTML = `${current}/${total}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

 

  document.querySelector(".scroller").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  document.getElementById("previous").style.opacity = 0.5;
  
    previous.addEventListener("click", () => {
    let index = Songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
    console.log(index);
    
    if (index - 1 >= 0) {
      playMusic(Songs[index - 1].replaceAll("%20", " "));
      document.getElementById("Next").style.opacity = 1;
      if (index - 1 <= 0) {
        document.getElementById("previous").style.opacity = 0.5;
      }
    }
  });

  Next.addEventListener("click", () => {
    console.log("Songs:", Songs);
    console.log("currentsong:", currentsong);
    console.log("currentsong.src:", currentsong?.src);
    console.log("filename:", currentsong?.src?.split("/")?.splice(-1)[0]);

    let index = Songs.indexOf(currentsong.src.split("/").splice(-1)[0]);

    if (index + 1 <= Songs.length - 1) {
      playMusic(Songs[index + 1].replaceAll("%20", " "));
      document.getElementById("previous").style.opacity = 1;
      if (index + 1 == Songs.length - 1) {
        document.getElementById("Next").style.opacity = 0.5;
      }
    }
  });

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value) / 100;
      if (currentsong.volume == 0) {
        currentsong.volume = parseInt(e.target.value) / 100;
        volImg.src = "assets/playbar/volume-mute-02-stroke-rounded.svg";
      } else {
        volImg.src = "assets/playbar/volume-high-stroke-rounded.svg";
      }
    });

 
}

main();
