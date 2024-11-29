let map; // Declare map globally
let marker = null; // Declare marker globally




const drivers = [
    { mobileNo: "1234567890", password: "password" },
    { mobileNo: "9876543210", password: "driver123" }
];



const mapElement = document.getElementById('map');
console.log("Map element dimensions:", mapElement.offsetWidth, mapElement.offsetHeight);
console.log("Map element visibility:", window.getComputedStyle(mapElement).display);
function selectPickup() {
    alert("Pickup location selection triggered!");
}

function signInPassenger() {
    document.getElementById('passenger').style.display = 'none';
    document.getElementById('passenger-interface').style.display = 'block';
    document.getElementById('passenger-interface').classList.add('fade-in');
}

function filterHostels() {
    const input = document.getElementById('search-hostel');
    const dropdown = document.getElementById('dropdown2-options');
    const query = input.value.toLowerCase();

    dropdown.innerHTML = '';
    dropdown.style.display = 'none';

    const hostels = [
        "Hostel A", "Hostel B", "Hostel C", "Hostel D", "Hostel E",
        "Hostel F", "Hostel G", "Hostel H", "Hostel I", "Hostel J",
        "Hostel K", "Hostel L", "Hostel M", "Hostel N", "Hostel O",
        "Hostel PG", "Hostel Q", "MAIN GATE", "JAGGI", "COS", "TAN",
        "B BLOCK", "C BLOCK"
    ];

    const filteredHostels = hostels.filter(hostel => hostel.toLowerCase().includes(query));
    if (filteredHostels.length > 0) {
        dropdown.style.display = 'block';
        filteredHostels.forEach(hostel => {
            const option = document.createElement('div');
            option.textContent = hostel;
            option.onclick = () => selectHostel(hostel);
            dropdown.appendChild(option);
        });
    }
}



// drivers






let waitingPassengers = {};

// Array of hostel locations (latitude, longitude)
const hostelLocations = {
    "Hostel A": [30.35133958552917, 76.36454437285103],
    "Hostel B": [30.35118298578698, 76.36321464635124],
    "Hostel c": [30.351311120577055, 76.36238869491908],
    "Hostel D": [30.350882669215192, 76.36029133510257],
    "Hostel E": [30.35476756069593, 76.3671900291355],
    "Hostel F": [30.35472349935624, 76.35940139133767],
    "Hostel G": [30.35476756069593, 76.3671900291355],
    "Hostel H": [30.353187352063664, 76.36453748792752],
    "Hostel I": [30.35476756069593, 76.3671900291355],
    "Hostel J": [30.35297833013215, 76.36363979523249]
};

// Updated selectHostel function
function selectHostel(hostel) {
    // Update the input field with the selected hostel name
    document.getElementById('search-hostel').value = hostel;
    
    // Hide the dropdown options
    document.getElementById('dropdown2-options').style.display = 'none';
    
    // Increment the number of passengers waiting at the selected hostel
    if (waitingPassengers[hostel]) {
        waitingPassengers[hostel]++;
    } else {
        waitingPassengers[hostel] = 1;
    }
    
    console.log(`${hostel} now has ${waitingPassengers[hostel]} passenger(s) waiting.`);
}

window.addEventListener('click', event => {
    const dropdown = document.getElementById('dropdown2-options');
    const input = document.getElementById('search-hostel');
    if (!input.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});




function showHome() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('passenger').style.display = 'none';
    document.getElementById('driver').style.display = 'none';
    document.getElementById('passenger-interface').style.display = 'none';
    document.getElementById('driver-interface').style.display = 'none';
}









    function showDriverInterface() {
        
            // Hide all other sections
            document.getElementById('home').style.display = 'none';
            document.getElementById('passenger').style.display = 'none';
            document.getElementById('passenger-interface').style.display = 'none';
            document.getElementById('driver').style.display = 'none'; // Hide driver login pa
        
            // Show the driver interface
            document.getElementById('driver-interface').style.display = 'block';
        
            // Delay map initialization to ensure #map is fully displayed
            setTimeout(initMap, 100); // Add a small delay to ensure the container is visible
        }
        
        function initMap() {
            // Check if geolocation is available in the browser
            if (navigator.geolocation) {
                // First, try to get the current position
                navigator.geolocation.getCurrentPosition(function(position) {
                    const { latitude, longitude } = position.coords;
        
                    // Initialize the map with the driver's actual location
                    map = L.map('map').setView([latitude, longitude], 15);
        
                    // Add OpenStreetMap tiles
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                    }).addTo(map);
        
                    // Add a marker at the driver's location
                    marker = L.marker([latitude, longitude]).addTo(map);
                    marker.bindPopup("You are here").openPopup();
        
                    // Track the driver's location after initialization
                    trackDriverLocation();
                }, function(error) {
                    console.error("Error getting location:", error.message);
                    alert("Unable to retrieve your location. Please make sure location services are enabled.");
                }, {
                    enableHighAccuracy: true,  // Use GPS for more accurate results
                    timeout: 10000,            // Timeout if no position is found
                    maximumAge: 0,             // No caching of location
                });
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        }
        
        // Function to track the driver's location
        function trackDriverLocation() {
            if (navigator.geolocation) {
                // Watch the driver's position and update continuously
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude, accuracy } = position.coords;
                        const newCoordinates = [latitude, longitude];
        
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
        
                        // Update marker position or create a new marker if it doesn't exist
                        if (!marker) {
                            marker = L.marker(newCoordinates).addTo(map);
                            marker.bindPopup("You are here").openPopup();
                        } else {
                            marker.setLatLng(newCoordinates);
                        }
        
                        // Adjust map view only if the accuracy is acceptable
                        if (accuracy < 50) { // Only update if the accuracy is below 50 meters
                            map.setView(newCoordinates, 15);
                        } else {
                            console.warn("Location accuracy is too low to update the map view.");
                        }
                    },
                    (error) => {
                        console.error("Error fetching location:", error.message);
                    },
                    {
                        enableHighAccuracy: true,  // Use GPS for more accurate results
                        timeout: 10000,            // Timeout if no position is found
                        maximumAge: 0,             // No caching of location
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        }
        
        // Function to stop tracking the driver's location (optional)
        function stopTracking() {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                console.log("Stopped tracking driver location.");
            }
        }


       