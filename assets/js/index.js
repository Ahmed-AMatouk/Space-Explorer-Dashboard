var dateToday = new Date();
var dateInput = document.getElementById("apod-date-input");
dateInput.max = `${dateToday.getFullYear()}-${dateToday.getMonth()+1}-${dateToday.getDate()}`;
dateInput.value = dateInput.max; 
var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var dateText = document.querySelector("label.date-input-wrapper span");
var labelDate = document.querySelector("label.date-input-wrapper");
var loadDate = document.getElementById("load-date-btn");

dateText.innerHTML = `${month[dateToday.getMonth()].slice(0,3)} ${dateToday.getDate()}, ${dateToday.getFullYear()}`;
getImageDay(`https://api.nasa.gov/planetary/apod?api_key=KsM6r2cnBUDUVCgwwe02dfg4suKyknaFoNwufnDH`);



var todayApodBtn = document.getElementById("today-apod-btn");
todayApodBtn.addEventListener("click",function(e) {
    document.querySelector(".FailedIcon").classList.add("hidden");
    imgDay.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    dateInput.value = dateInput.max;
    dateText.innerHTML = `${month[dateToday.getMonth()].slice(0,3)} ${dateToday.getDate()}, ${dateToday.getFullYear()}`;
    getImageDay(`https://api.nasa.gov/planetary/apod?api_key=KsM6r2cnBUDUVCgwwe02dfg4suKyknaFoNwufnDH`);

});



labelDate.addEventListener("change",function(e) {
    var date = dateInput.value.split("-");
    dateText.innerHTML = `${month[Number(date[1])-1].slice(0,3)} ${date[2]}, ${date[0]}`;
    console.log(dateInput.value)

})


var loadingSpinner = document.querySelector("#apod-loading");
var imgDay = document.getElementById("apod-image");
async function getImageDay(Api){
    var todayDateElements = document.querySelectorAll(".todayDate");
    var date = dateInput.value.split("-");
    for(var i=0;i<todayDateElements.length;i++){
        todayDateElements[i].innerHTML = `${month[Number(date[1])-1]} ${date[2]}, ${date[0]}`;
    }
    try {
        
        var http = await fetch(Api);
        var httpResponse = await http.json();
        if(!httpResponse.url) throw new Error("No image found");
        else if(httpResponse.media_type==="video"){
            document.getElementById("apod-image").classList.add("hidden");
            var videoDay = document.getElementById("apod-video");
            videoDay.src = httpResponse.url;
            videoDay.classList.remove("hidden");
        }
        else if(httpResponse.media_type==="image") 
        {
            document.getElementById("apod-image").classList.add("hidden");
            var videoDay = document.getElementById("apod-video");
            videoDay.classList.add("hidden");
            imgDay.src = httpResponse.url;
            imgDay.classList.remove("hidden");
        }    
        document.getElementById("apod-title").innerHTML = httpResponse.title;
        document.getElementById("apod-explanation").innerHTML = httpResponse.explanation;
        if(httpResponse.copyright) document.getElementById("apod-copyright").innerHTML = `&copy; ${httpResponse.copyright}`;
        else document.getElementById("apod-copyright").innerHTML = ``;
        

        
        loadingSpinner.classList.add("hidden");
    } catch (e) {
        document.querySelector(".FailedIcon").classList.remove("hidden");
        loadingSpinner.classList.add("hidden");
    }
    
}


loadDate.addEventListener("click",function(e) {
    document.querySelector(".FailedIcon").classList.add("hidden");
    imgDay.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    getImageDay(`https://api.nasa.gov/planetary/apod?api_key=KsM6r2cnBUDUVCgwwe02dfg4suKyknaFoNwufnDH&date=${dateInput.value}`);

});

document.getElementById("ViewImageOverlay").addEventListener("click",function(e) {
    window.open(imgDay.src, '_blank');
});


var asideTabs = document.querySelectorAll("aside nav a");
asideTabs.forEach(function(tab) {
    tab.addEventListener("click", function(e) {
        asideTabs.forEach(function(t) {
            document.getElementById(`${t.dataset.section}`).classList.add("hidden");
            t.classList.remove("bg-blue-500/10", "text-blue-400");
            t.classList.add("text-slate-300", "hover:bg-slate-800");
        });
        e.currentTarget.classList.remove("text-slate-300", "hover:bg-slate-800");
        e.currentTarget.classList.add("bg-blue-500/10", "text-blue-400");
        document.getElementById(`${e.currentTarget.dataset.section}`).classList.remove("hidden");
    });
});


function getLaunchces() {
    fetch("https://ll.thespacedevs.com/2.3.0/launches/upcoming/?format=json&limit=10").then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data.results[0]);
        var mainLaunch = document.getElementById("featured-launch")
        try {
            mainLaunch.querySelector(".img").innerHTML = `<img src="${data.results[0].image.image_url}" alt="Launch Image" class="w-full h-full object-cover">`;
        } catch (error) {
            mainLaunch.querySelector(".img").innerHTML = `<img src="assets/images/launch-placeholder.png" alt="Launch Image" class="w-full h-full object-cover">`;
        }
        mainLaunch.querySelector(".featured-launch-name").innerHTML = data.results[0].name;
        mainLaunch.querySelector(".launch-agency").innerHTML = data.results[0].launch_service_provider.name;
        mainLaunch.querySelector(".launch-rocket").innerHTML = data.results[0].rocket.configuration.name;
        
        dayOfWeak = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var date = new Date(data.results[0].window_start.split("T")[0]);
        var launchDate = dayOfWeak[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        mainLaunch.querySelector(".launch-date").innerHTML = launchDate;
        
        var timeLaunch = data.results[0].window_start.slice(data.results[0].window_start.indexOf("T")+1, data.results[0].window_start.indexOf("Z")-3);
        if (Number(timeLaunch.split(":")[0]) > 12) {
            timeLaunch = (Number(timeLaunch.split(":")[0]) - 12) + ":" + timeLaunch.split(":")[1] + " PM";
        } else{
            timeLaunch += " AM";
        }
        timeLaunch += " UTC";
        mainLaunch.querySelector(".launch-time").innerHTML = timeLaunch;
        
        locationLaunch = data.results[0].pad.location.name;
        mainLaunch.querySelector(".launch-location").innerHTML = locationLaunch;
        
        countryLaunch = data.results[0].pad.country.name;
        mainLaunch.querySelector(".launch-country").innerHTML = countryLaunch;
        
        descriptionLaunch = data.results[0].mission.description;
        mainLaunch.querySelector(".launch-description").innerHTML = descriptionLaunch;


        for (let i = 1; i < data.results.length; i++) {
            var date = new Date(data.results[i].window_start.split("T")[0]);
            var launchDate = month[date.getMonth()].slice(0,3) + " " + date.getDate() + ", " + date.getFullYear();
            mainLaunch.querySelector(".launch-date").innerHTML = launchDate;
            
            var timeLaunch = data.results[i].window_start.slice(data.results[i].window_start.indexOf("T")+1, data.results[i].window_start.indexOf("Z")-3);
            if (Number(timeLaunch.split(":")[0]) > 12) {
                timeLaunch = (Number(timeLaunch.split(":")[0]) - 12) + ":" + timeLaunch.split(":")[1] + " PM";
            } else{
                timeLaunch += " AM";
            }
            timeLaunch += " UTC";
            
            document.getElementById("launches-grid").innerHTML += `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
              <div class="img flex items-center justify-center h-full text-9xl text-slate-700/50 w-full">
              <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                </div>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-yellow-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    ${data.results[i].status.abbrev}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${data.results[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${data.results[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launchDate}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${timeLaunch}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${data.results[i].rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1"
                      >${data.results[i].pad.location.name}</span
                    >
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`
            var launchesGrid = document.getElementById("launches-grid")
            try {
                launchesGrid.querySelectorAll(".img")[i-1].innerHTML = `<img src="${data.results[i].image.image_url}" alt="Launch Image" class="w-full h-full object-cover">`;
            } catch (error) {
                launchesGrid.querySelectorAll(".img")[i-1].innerHTML = `<img src="assets/images/launch-placeholder.png" alt="Launch Image" class="w-full h-full object-cover">`;
            }
            
        }
    })
}
getLaunchces();


async function getPlanetDetails() {
    var planetsSection = document.getElementById("planets-grid");
    var planets = document.querySelectorAll(".planet-card");
    var http = await fetch(`https://solar-system-opendata-proxy.vercel.app/api/planets`);
    var httpResponse = await http.json();
    console.log(httpResponse);
    for (let i = 0; i < planets.length; i++) {
        planets[i].addEventListener("click",function(e) {
            
            var planetData = httpResponse.bodies[i];

            document.getElementById("planet-detail-image").src = `assets/images/${planetData.englishName.toLowerCase()}.png`;
            document.getElementById("planet-detail-name").innerHTML = planetData.englishName;
            document.getElementById("planet-detail-description").innerHTML = planetData.description;
            document.getElementById("planet-distance").innerHTML = `${new Intl.NumberFormat("en", {notation: "compact",maximumFractionDigits: 1}).format(planetData.semimajorAxis)} km`;
            document.getElementById("planet-radius").innerHTML = `${Math.round(planetData.meanRadius)} km`;
            document.getElementById("planet-mass").innerHTML = `${planetData.mass.massValue} x 10<sup>${planetData.mass.massExponent}</sup> kg`;
            document.getElementById("planet-density").innerHTML = `${Number(planetData.density).toFixed(2)} g/cm³`;
            document.getElementById("planet-orbital-period").innerHTML = `${Number(planetData.sideralOrbit).toFixed(2)} days`;
            document.getElementById("planet-rotation").innerHTML = `${Number(planetData.sideralRotation).toFixed(2)} hours`;
            document.getElementById("planet-moons").innerHTML =
            planetData.moons ? planetData.moons.length : 0;
            document.getElementById("planet-gravity").innerHTML = `${planetData.gravity} m/s²`;

            document.getElementById("planet-discoverer").innerHTML = planetData.discoveredBy ? planetData.discoveredBy : "Known since antiquity";
            document.getElementById("planet-discovery-date").innerHTML = planetData.discoveryDate ? planetData.discoveryDate : "Ancient times";
            document.getElementById("planet-volume").innerHTML = `${planetData.vol.volValue} x 10<sup>${planetData.vol.volExponent}</sup> kg`;

            document.getElementById("planet-mass2").innerHTML = document.getElementById("planet-mass").innerHTML;
            document.getElementById("planet-density2").innerHTML = document.getElementById("planet-density").innerHTML;
            document.getElementById("planet-gravity2").innerHTML = document.getElementById("planet-gravity").innerHTML;
            document.getElementById("planet-axial-tilt").innerHTML = `${Number(planetData.axialTilt).toFixed(2)}°`;
            
            document.getElementById("planet-perihelion").innerHTML = `${new Intl.NumberFormat("en", {notation: "compact",maximumFractionDigits: 1}).format(planetData.perihelion)} km`;
            document.getElementById("planet-aphelion").innerHTML = `${new Intl.NumberFormat("en", {notation: "compact",maximumFractionDigits: 1}).format(planetData.aphelion)} km`;
            document.getElementById("planet-eccentricity").innerHTML = planetData.eccentricity;
            document.getElementById("planet-inclination").innerHTML = planetData.inclination;
            document.getElementById("planet-axial-tilt2").innerHTML = document.getElementById("planet-axial-tilt").innerHTML;
            document.getElementById("planet-temp").innerHTML = `${planetData.avgTemp}°C`;
            document.getElementById("planet-escape").innerHTML = `${planetData.escape} m/s`;


            
        });
        
    }
}

getPlanetDetails();