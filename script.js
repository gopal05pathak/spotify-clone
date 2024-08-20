
let currentSong = new Audio();


function convertSecondsToMinutesAndSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Adding leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes} : ${formattedSeconds}`;
}



async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();


    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs

}

const playMusic=(track)=>{
    currentSong.src = "/songs/" + track
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00"

}

async function main() {

    

    // get the list of all the songs
    let songs = await getSongs()

    // Show all the songs in the playlist 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Gopal</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img  class= "invert" src="play.svg" alt="">
        </div></li>`;

    }
    // attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // attach an event listener to next , previous and play button
    play.addEventListener("click" , ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // listen to time update 
    currentSong.addEventListener("timeupdate" , ()=>{
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${(convertSecondsToMinutesAndSeconds(currentSong.duration))}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
    })

    // add a eventlistner to seek a seekbar 
    document.querySelector(".seekbar").addEventListener("click" , (e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

    // add eventlistner to hamburger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0"
    }) 

    // add eventlistner to close hamburger 
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-120%"
    }) 
}

main()

