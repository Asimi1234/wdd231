// Function to calculate wind chill in Celsius
function calculateWindChill(temp, windSpeed) {
    if (temp <= 10 && windSpeed >= 4.8) {
        return (
            13.12 +
            0.6215 * temp - 
            11.37 * Math.pow(windSpeed, 0.16) + 
            0.3965 * temp * Math.pow(windSpeed, 0.16)
        ).toFixed(2);
    } else {
        return "N/A"; 
    }
}

// Static weather values in Celsius
let temperature = 7; 
let windSpeed = 16; 
let condition = "Cloudy";
let windChill = calculateWindChill(temperature, windSpeed);

// Function to update the weather section
function updateWeather() {
    document.getElementById("temperature").textContent = `Temperature: ${temperature}°C`;
    document.getElementById("condition").textContent = `Condition: ${condition}`;
    document.getElementById("windSpeed").textContent = `Wind Speed: ${windSpeed} km/h`;
    document.getElementById("windChill").textContent = `Wind Chill: ${windChill}°C`;
}

// Run the function after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
    updateWeather(); 

    document.getElementById("currentyear").textContent = new Date().getFullYear();
    
    document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;
});
