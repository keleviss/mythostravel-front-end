// Toggle between showing and hiding the sidebar when clicking the menu icon
var mySidebar = document.getElementById("mySidebar");
        
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
  } else {
    mySidebar.style.display = 'block';
  }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
}

// Extract the location parameters and date from the URL
const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get('from');
const to = urlParams.get('to');
const date = urlParams.get('date');
const passengers = urlParams.get('pass');

// Set the trip title
const tripTitle = document.getElementById('tripTitle');
if (passengers > 1)
  tripTitle.textContent = `${from} - ${to} (${date}) for ${passengers} passengers`;
else
  tripTitle.textContent = `${from} - ${to} (${date}) for ${passengers} passenger`;

// Construct the API URL
const apiUrl = `http://localhost:3000/api/v1/trips/trips/${from}&${to}&${date}`;

// Fetch data from the API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const tripListContainer = document.getElementById('tripList');

    if (data.length > 0) {
      // For each trip from the database
      data.forEach(trip => {
        // Create a row with the trip information
        const tripItem = document.createElement('tr');
        tripItem.classList.add('w3-hover-grey');
        tripItem.classList.add('selectable-row');
        tripItem.innerHTML = `
          <td>${trip.tripId}</td>
          <td>${trip.time}</td>
          <td>${trip.tripfrom}-${trip.tripto}</td>
          <td>${trip.seats}</td>
        `;

        // Add the trip item to the tripList
        tripListContainer.appendChild(tripItem);
        console.log("Fetched the data!");
      });

      // Row selection
      var selectedRouteID = "";
      var selectedRow = null;
          
      console.log("Adding event listener!");
          
      var rows = document.getElementsByClassName('selectable-row');
      for (var i = 0; i < rows.length; i++) {
        rows[i].addEventListener('click', function() {
          if (selectedRow) {
            // Remove the 'selected' class from the previously selected row
            selectedRow.classList.remove('selected');

            if (selectedRow == this) {
              selectedRouteID = "";
              selectedRow = null;
            } else {
              // Toggle the 'selected' class for the clicked row
              this.classList.toggle('selected');

              // If the clicked row is now selected, update the selectedRouteID and selectedRow variables
              var idCell = this.querySelector('td:first-child');
              selectedRouteID = idCell.textContent;
              selectedRow = this;
            }
          } else {
            // Toggle the 'selected' class for the clicked row
            this.classList.toggle('selected');

            // If the clicked row is now selected, update the selectedRouteID and selectedRow variables
            var idCell = this.querySelector('td:first-child');
            selectedRouteID = idCell.textContent;
            selectedRow = this;
          }
        
          console.log('Selected route id: ', selectedRouteID);
        });
      }

      // Event when button is clicked
      var button = document.getElementById('continue');
      button.addEventListener('click', function() {
        // Execute your desired function here
        console.log("Button clicked! Selected row name: " + selectedRouteID);

        if (selectedRouteID) {
          // Get the selected trip ID
          const tripId = selectedRouteID;
          console.log("This is the tripId: ", tripId);
      
          // Submit the form
          const url = `/mythostravel-front-end/pages/seatsbooking.html?pass=${passengers}&tripId=${tripId}`;
          window.location.href = url;
        } else {
          const alertbox = document.getElementById('alert');
          alertbox.style.display = '';
          alertbox.innerHTML = `
              <p style="padding:10px;">Please select a route trip!</p>
              <span onclick="this.parentElement.style.display='none'"
              class="w3-button w3-display-topright" style="padding:10px 20px;">&times;</span>
          `;
        }
      });

    } else {
      const noTripsElement = document.getElementById('noTrips');
      noTripsElement.textContent = 'No trips available for the selected criteria.';
    }
  })
  .catch(error => {
    console.error('Error fetching trips:', error);
    // Handle error case
    const noTripsElement = document.getElementById('noTrips');
    noTripsElement.textContent = 'Unable to load the routes!';
  }); 