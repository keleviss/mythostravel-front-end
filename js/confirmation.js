// Get the trip information from the URL parameters or any other source
const urlParams = new URLSearchParams(window.location.search);
const statusmsg = urlParams.get('status');

let ticketID = {};

if (statusmsg == 'error') {
    const mainContainer = document.getElementById('main-container');
    const div = document.createElement('div');
    div.innerHTML = `<h2 class="w3-center">Error when booking your tickets!</h2>`;
    mainContainer.appendChild(div);
} else if (statusmsg == 'success') {
    
    const mainContainer = document.getElementById('main-container');
    const div = document.createElement('div');
    div.innerHTML = `<h2 class="w3-center">Your tickets have been successfully booked!</h2>`;
    const card = document.createElement('div');
    card.classList.add('w3-card-4');
    card.id = 'card';
    mainContainer.appendChild(div);
    mainContainer.appendChild(card);

    const bookId = urlParams.get('bookid');

    console.log('Booking ID: ', bookId);

    const bookingUrl = `http://localhost:3000/api/v1/trips/bookings/${bookId}`;
    const ticketsUrl = `http://localhost:3000/api/v1/trips/tickets/${bookId}`;

    async function fetchBookingData() {
        const response = await fetch(bookingUrl);
        const bookingData = await response.json();
        return bookingData;
    }

    async function fetchTicketData() {
        const response = await fetch(ticketsUrl);
        const ticketData = await response.json();
        return ticketData;
    }

    async function processBookingAndTripData() {
        try {
            const bookingData = await fetchBookingData();
          
            const email = bookingData.email;
            const name = bookingData.name;
            const phone = bookingData.phone;
            const tripId = bookingData.tripId;
            const passengers = bookingData.passengers;

            const tripUrl = `http://localhost:3000/api/v1/trips/trip/${tripId}`;

            async function fetchTripData() {
                const response = await fetch(tripUrl);
                const tripData = await response.json();
                return tripData;
            }

            const tripData = await fetchTripData();

            const tripFrom = tripData.tripfrom;
            const tripTo = tripData.tripto;
            const date = tripData.date;
            const time = tripData.time;

            const card = document.getElementById('card');
            const div = document.createElement('div');
            div.innerHTML = `
                <header class="w3-container w3-grey">
                    <h4>Booking Information</h4>
                    <p id="tripInfo">Trip: <b id="tripFrom">${tripFrom}</b> to <b id="tripTo">${tripTo}</b> Date: <b id="date">${date}</b> Time: <b id="time">${time}</b> Passengers: <b id="passengers">${passengers}</b></p>
                </header>   
            `;
            card.appendChild(div);

            const commsContainer = document.createElement('div');
            commsContainer.classList.add('w3-container');
            commsContainer.classList.add('w3-border');
            commsContainer.innerHTML = `
                <h5>Communication Information</h5>
                <p id="email">Email Address: <b>${email}</b></p>
                <p id="name">Name:  <b>${name}</b></p>
                <p id="phone">Phone: <b>${phone}</b></p>
            `;
            card.appendChild(commsContainer);

            const ticketData = await fetchTicketData();

            for (let i = 0; i < ticketData.length; i++) {
                const category = ticketData[i].category;
                const passengerName = ticketData[i].passengerName;
                const idNumber = ticketData[i].idNumber;
                const price = ticketData[i].price;

                ticketID[i+1] = ticketData[i].ticketId;
    
                const card = document.getElementById('card');
                const ticketContainer = document.createElement('div');
                ticketContainer.classList.add('w3-container');
                ticketContainer.classList.add('w3-border');
                ticketContainer.innerHTML = `
                    <h5>Ticket #${i+1} Information - Price: <b id="price${i+1}">${price} EUR</b></h5>
                    <p>Category: <b id="category${i+1}">${category}</b></p>
                    <p>Name:  <b id="passName${i+1}">${passengerName}</b></p>
                    <p>ID Number: <b id="idnum${i+1}">${idNumber}</b></p>
                `;
                card.appendChild(ticketContainer);
            }
          
        } catch (error) {
            console.error('Error:', error);
        }
    }

    processBookingAndTripData();

    // Add an event listener to the download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', generatePDF);

    // Function to generate and download the PDF
    function generatePDF() {

        const passengers = document.getElementById('passengers').innerText;

        window.jsPDF = window.jspdf.jsPDF;

        // Create a new jsPDF instance
        const doc = new jsPDF();
                
        const tripFrom = document.getElementById('tripFrom').innerText;
        const tripTo = document.getElementById('tripTo').innerText;
        const date = document.getElementById('date').innerText;
        const time = document.getElementById('time').innerText;

        // Set font styles
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        for (let i = 1; i <= passengers; i++) {
            if (i > 1) { doc.addPage(); }
        
            const name = document.getElementById(`passName${i}`).innerText;
            const price = document.getElementById(`price${i}`).innerText;
            const category = document.getElementById(`category${i}`).innerText;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('MythosTravels', 105, 20, null, null, 'center');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            // Add ticket ID and passenger name
            doc.text(`Ticket ID: ${ticketID[i]}`, 30, 40);
            doc.setFont('helvetica', 'bold');
            doc.text(`${name}`, 110, 40);
        
            // Draw horizontal line
            doc.setLineWidth(0.3);
            doc.line(20, 45, 190, 45);

            // Draw vertical line
            doc.line(100, 45, 100, 85);
            doc.line(60, 45, 60, 85);
        
            // Add ticket content
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text('Date', 30, 60);
            doc.text('Time', 70, 60);
            doc.text('From', 110, 60);
            doc.text('->', 140, 60);
            doc.text('To', 150, 60);
        
            // Draw horizontal line
            doc.line(20, 65, 190, 65);
        
            // Add trip details
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(`${date}`, 30, 80);
            doc.text(`${time}` , 70, 80);
            doc.text(`${tripFrom}` , 110, 80);
            doc.text('->', 140, 80);
            doc.text(`${tripTo}` , 150, 80);
        
            // Draw horizontal line
            doc.line(20, 85, 190, 85);

            // Add category and price
            doc.setFont('helvetica', 'normal');
            doc.text('Category:', 30, 100);
            doc.text('Price:', 110, 100);
            doc.setFont('helvetica', 'bold');
            doc.text(`${category}`, 70, 100);
            doc.text(`${price}`, 150, 100);
        
            // Draw rectangle for the ticket content
            doc.rect(20, 30, 170, 80);
        }
        
        try {
            // Save the PDF file
            doc.save('tickets.pdf');
        } catch (e) {
            console.log(e);
        }
    }
}