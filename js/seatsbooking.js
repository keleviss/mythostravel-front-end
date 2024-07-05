// Get the trip information from the URL parameters or any other source
const urlParams = new URLSearchParams(window.location.search);
const tripId = parseInt(urlParams.get('tripId'));
const passengers = parseInt(urlParams.get('pass'));

// Construct the API URL
const apiUrl = `http://localhost:3000/api/v1/trip/${tripId}`;

let standardPrice = 0;
let studentPrice = 0;

// Update the trip information and populate the form based on the fetched trip data
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Update the trip information dynamically
    const tripInfo = document.getElementById('tripInfo');
    tripInfo.innerHTML = `
    <p class="trip-information"><strong>${data.tripfrom}</strong> to <strong>${data.tripto}</strong> 
    Date: <strong>${data.date}</strong> Time: <strong>${data.time}</strong> 
    Passengers: <strong>${passengers}</strong></p>
  `;

    if (passengers) {
      // Dynamically create the ticket details sections based on the number of passengers
      const ticketDetailsSection = document.getElementById('ticketDetailsSection');
      for (let i = 1; i <= passengers; i++) {

        standardPrice = parseFloat(data.Standard);
        studentPrice = parseFloat(data.Student);

        const div = document.createElement('div');
        div.innerHTML = `
        <header class="w3-container">
        <h4>Ticket Information #${i}</h4>
        </header>
        <form class="w3-container" style="padding-bottom: 16px;" id="ticketForm${i}">
          <div class="w3-row">
              <span>Category</span> 
              <select class="w3-select w3-border" style="padding: 10px" id="category" name="option">
                  <option value="Standard">Standard ${data.Standard} EUR</option>
                  <option value="Student">Student ${data.Student} EUR</option>    
              </select>   
          </div>
        
          <b id="Standard${i}" style="display: none">${data.Standard}</b>
          <b id="Student${i}" style="display: none">${data.Student}</b>

          <div class="w3-row">
            <span>Full Name:</span>
            <input class="w3-input w3-border" type="text" id="passengerName" name="passengerName" required>
          </div>
  
          <div class="w3-row">
            <span>ID Number:</span>
            <input class="w3-input w3-border" type="text" id="idNumber" name="ID Number" required>
          </div>
        </form> 
      `;
        ticketDetailsSection.appendChild(div);
      }
    }
  })
  .then(() => {
    const priceSelects = document.querySelectorAll('.w3-select');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;

    priceSelects.forEach(select => {
      const selectedCategory = select.value;
      if (selectedCategory == 'Standard') {
        totalPrice += standardPrice;
      } else if (selectedCategory == "Student") {
        totalPrice += studentPrice;
      }
    });

    totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} EUR`;

    // Add event listeners to each select element
    priceSelects.forEach(select => {
      select.addEventListener('change', updateTotalPrice);
    });

    // Function to update the total price
    function updateTotalPrice() {
      let totalPrice = 0;

      // Iterate through each select element and add the selected price to the total
      priceSelects.forEach(select => {
        const selectedCategory = select.value;
        if (selectedCategory == 'Standard') {
          totalPrice += standardPrice;
        } else if (selectedCategory == "Student") {
          totalPrice += studentPrice;
        }
      });

      // Update the text element with the total price
      totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)} EUR`;
    }
  })
  .catch(error => {
    console.error('Error fetching trip data:', error);
    // Handle error case
  });

// Function to post the booking data to the server
function postBookingData(bookingData) {
  return fetch('http://localhost:3000/api/v1/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  })
    .then(response => response.json())
    .then(booking => {
      return booking;
    })
    .catch(error => {
      console.error('Error saving booking:', error);
      throw error;
    });
};

// Function to post the ticket data to the server
function postTicketData(ticketData) {
  return fetch('http://localhost:3000/api/v1/ticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData),
  })
    .then(response => response.json())
    .then(tickets => {
      return tickets;
    })
    .catch(error => {
      console.error('Error saving tickets:', error);
      throw error;
    });
};

const submitBtn = document.getElementById('submitButton');
submitBtn.addEventListener('click', function (event) {
  event.preventDefault();

  var commsError;
  var ticketError;

  const communicationForm = document.getElementById('communicationForm');
  const email = communicationForm.email.value;
  const name = communicationForm.fullName.value;
  const phone = communicationForm.phone.value;

  if (email == '' || name == '' || phone == '') {
    commsError = 'error';
  }

  for (let i = 1; i <= passengers; i++) {
    const name = document.getElementById('passengerName').value;
    const id = document.getElementById('idNumber').value;

    if (name == '' || id == '') {
      ticketError = 'error'
    }
  }

  if (commsError == 'error') {
    const alertbox = document.getElementById('alert');
    alertbox.style.display = '';
    alertbox.innerHTML = `
      <p style="padding:10px;">Please fill all the card information!</p>
      <span onclick="this.parentElement.style.display='none'"
      class="w3-button w3-display-topright w3-hover-red" style="padding:10px 20px;">
      <i class="fa fa-close"></i></span>
    `;
  } else if (ticketError == 'error') {
    const alertbox = document.getElementById('alert');
    alertbox.style.display = '';
    alertbox.innerHTML = `
      <p style="padding:10px;">Please fill all the card information!</p>
      <span onclick="this.parentElement.style.display='none'"
      class="w3-button w3-display-topright w3-hover-red" style="padding:10px 20px;">
      <i class="fa fa-close"></i></span>
    `;
  } else {
    const seatsBooking = document.getElementById('seatsbooking');
    seatsBooking.style.display = 'none';

    const loading = document.getElementById('loading');
    loading.style.display = ''; // Show the loading animation

    // Simulate a delay to demonstrate the loading animation
    setTimeout(function () {
      loading.style.display = 'none';
      const payment = document.getElementById('payment'); // Hide the loading animation
      payment.style.display = 'block';
    }, 2000); // Adjust the delay time as needed
  }
});

// Handle form submission
const payBtn = document.getElementById('payButton');
payBtn.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the communication information from the form
  const communicationForm = document.getElementById('communicationForm');
  const email = communicationForm.email.value;
  const fullName = communicationForm.fullName.value;
  const phone = communicationForm.phone.value;

  // Get the ticket details for each passenger
  const ticketDetails = [];
  for (let i = 1; i <= passengers; i++) {
    const ticketForm = document.getElementById(`ticketForm${i}`);
    const category = ticketForm.category.value;
    const passengerName = ticketForm.passengerName.value;
    const idNumber = ticketForm.idNumber.value;
    const price = document.getElementById(`${category}${i}`).innerText;

    ticketDetails.push({
      category,
      passengerName,
      idNumber,
      price,
    });
  }

  let fullPrice = parseFloat(0.00);

  for (let i = 0; i < ticketDetails.length; i++) {
    fullPrice += parseFloat(ticketDetails[i].price);
  }

  // Create the booking object
  const bookingData = {
    email,
    name: fullName,
    phone,
    tripId,
    passengers,
    fullPrice
  };

  const paymentForm = document.getElementById('paymentForm');
  const cardholder = paymentForm.cardholder.value;
  const cardNum = paymentForm.cardNum.value;
  const expDate = paymentForm.expDate.value;
  const cvv = paymentForm.cvv.value;

  var paymentError;

  if (cardholder == '' || cardNum == '' || expDate == '' || cvv == '') {
    paymentError = 'error';
  }

  if (paymentError == "error") {
    const alertbox = document.getElementById('paymentAlert');
    alertbox.style.display = '';
    alertbox.innerHTML = `
      <p style="padding:10px;">Please fill all the card information!</p>
      <span onclick="this.parentElement.style.display='none'"
      class="w3-button w3-display-topright w3-hover-red" style="padding:10px 20px; border-radius: 5px;">
      <i class="fa fa-close"></i></span>
    `;
  } else {
    var bookId;
    // Send the booking data to the server
    postBookingData(bookingData)
      .then(booking => {
        // Create the ticket objects
        const ticketData = ticketDetails.map(ticket => ({
          ...ticket,
          bookingId: booking.bookingId,
          tripId,
        }));

        for (let i = 0; i < passengers; i++) {
          console.log(`Ticket price: ${ticketData[i].price}`);
        }

        bookId = booking.bookingId;
        // Send the ticket data to the server
        const ticketPromises = ticketData.map(postTicketData);

        return Promise.all(ticketPromises); // Wait for all ticket promises to resolve
      })
      .then(tickets => {
        // Handle successful booking and ticket creation
        console.log('Success! Booking ID: ', bookId);

        const payment = document.getElementById('payment');
        payment.style.display = 'none';

        const loading = document.getElementById('loading');
        loading.style.display = 'block'; // Show the loading animation

        // Simulate a delay to demonstrate the loading animation
        setTimeout(function () {
          loading.style.display = 'none';
        }, 2000); // Adjust the delay time as needed

        // Perform any further actions or display success message
        const status = "success"
        const url = `/mythostravel-front-end/pages/confirmation.html?status=${status}&bookid=${bookId}`;
        window.location.href = url;
      })
      .catch(error => {
        // Handle any error that occurred during the process
        console.error('Error:', error);
        // Perform any further actions or display error message
        const status = "error"
        const url = `/mythostravel-front-end/pages/confirmation.html?status=${status}`;
        window.location.href = url;
      });
  }
});
