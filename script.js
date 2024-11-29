let map; // Declare map globally
let marker = null; // Declare marker globally
let watchId;

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



// passengers

let waitingPassengers = {};

// Array of hostel locations (latitude, longitude)
const hostelLocations = {
    "Hostel A": [30.3510, 76.3668],
    "Hostel B": [30.3520, 76.3678],
    "Hostel C": [30.3530, 76.3688],
    "Hostel D": [30.3540, 76.3698],
    "Hostel E": [30.3550, 76.3708],
    "Hostel F": [30.3560, 76.3718],
    "Hostel G": [30.3570, 76.3728],
    "Hostel H": [30.3580, 76.3738],
    "Hostel I": [30.3590, 76.3748],
    "Hostel J": [30.3600, 76.3758]
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




function driverLogin() {
    const mobileNo = document.getElementById('mobile_no.').value;
    const password = document.getElementById('password2').value;

    if (mobileNo === "1234567890" && password === "password") {
        alert("Login successful!");
        showDriverInterface();
    } else {
        alert("Invalid credentials!");
    }
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


       