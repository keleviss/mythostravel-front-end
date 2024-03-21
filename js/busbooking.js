$(document).ready(function() {

    // Disable the destination city select initially
    $('#destination-city').prop('disabled', true);

    // Enable the destination city select when a start city is selected
    $('#start-city').change(function() {
        const selectedStartCity = $(this).val();
        const selectedDestinationCity = $('#destination-city').val();
      
        if (selectedStartCity !== "") {
            $('#destination-city').prop('disabled', false);
        
        // Disable the selected start city from the destination city options
        $('#destination-city option').prop('disabled', false);
        $('#destination-city option[value="' + selectedStartCity + '"]').prop('disabled', true);
        
        // Check if the destination city is the same as the start city
        if (selectedDestinationCity === selectedStartCity) {
            $('#destination-city').val("");
        }
        } else {
            $('#destination-city').prop('disabled', true);
        }
    });

    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = day + '-' + month + '-' + year;

    // Configure the datepicker
    $("#trip-date").datepicker({
        dateFormat: "dd-mm-yy",
        minDate: 0,
        beforeShow: function(input) {
            $(input).prop("readonly", true);
        }
    });

    $("#trip-date").datepicker("setDate", formattedDate);

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the selected values from the form
        const startCity = $('#start-city').val();
        const destinationCity = $('#destination-city').val();
        const tripDate = $('#trip-date').val();
        const passengers = $('#passengers').val();
  
        if (startCity == '' && destinationCity == '') {
            const alertbox = document.getElementById('alert');
            alertbox.style.display = '';
            alertbox.innerHTML = `
                <p style="padding:10px;">Please select stations!</p>
                <span onclick="this.parentElement.style.display='none'"
                class="w3-button w3-display-topright" style="padding:10px 20px;">&times;</span>
            `;
        }
        else if (startCity == '') {
            console.log("Select starting station");
        } else if (destinationCity == '') {
            console.log("Select destination station");
        } else {
            // Redirect to the next page with query parameters
            const url = `/mythostravel-front-end/pages/tripsbooking.html?pass=${passengers}&from=${startCity}&to=${destinationCity}&date=${tripDate}`;
            window.location.href = url;
        }
    });
});