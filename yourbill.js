let menuBtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .flex .navbar');

menuBtn.onclick = () => {
    menuBtn.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

// Function to read and search for student fees
function lookupFees() {
    const rollNumber = document.getElementById("rollNumber").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    fetch("yourbill.csv")
        .then(response => response.text())
        .then(data => {
            const fees = searchFees(data, rollNumber, month, year);
            displayResult(fees, month, year);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            displayResult("An error occurred while fetching data.");
        });

    return false;
}

// Function to search for student fees in CSV data
function searchFees(csvData, rollNumber, month, year) {
    const lines = csvData.split("\n");
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(",");
        const csvRollNumber = fields[0].trim();
        const csvMonth = fields[1].trim();
        const csvYear = fields[2].trim();
        const fees = fields[3].trim();

        // Convert the input month to title case (uppercase first letter)
        const inputMonthTitleCase = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

        if (csvRollNumber === rollNumber && csvMonth === inputMonthTitleCase && csvYear === year) {
            return fees;
        }
    }

    return "Fees not found for the provided details.";
}
// Function to search for the name in CSV data based on rollNumber
function searchName(csvData, rollNumber) {
    const lines = csvData.split("\n");
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(",");
        const csvRollNumber = fields[0].trim();
        const csvMonth = fields[1].trim();
        const csvYear = fields[2].trim();
        const fees = fields[3].trim();
        const name = fields[4].trim(); 

        if (csvRollNumber === rollNumber) {
            return name; // Return the name if the rollNumber matches
        }
    }

    return null; // Return null if the rollNumber is not found
}

// Function to display the result
function displayResult(fees, month, year) {
    const resultDiv = document.getElementById("result");

    // Get the rollNumber entered by the user
    const rollNumber = document.getElementById("rollNumber").value;

    // Fetch the CSV data
    fetch("yourbill.csv")
        .then(response => response.text())
        .then(data => {
            // Search for the corresponding name based on the rollNumber
            const name = searchName(data, rollNumber);

            if (name) {
                resultDiv.innerText = `Dear ${name}, your mess bill for ${month} of ${year} is ₹ ${fees}.`;
            } else if (fees === "Fees not found for the provided details.") {
                resultDiv.innerText = fees;
            } else {
                resultDiv.innerText = "Unable to fetch data. Please try again later.";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultDiv.innerText = "An error occurred while fetching data.";
        });
}



