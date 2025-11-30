


/* =======================================
   LOAD SAVED THEME ON ALL PAGES
======================================= */
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");

    const icon = document.getElementById("theme-icon");
    if (icon) icon.src = "images/sun.png";
}


/* =======================================
   DARK MODE TOGGLE 
======================================= */
const toggleBtn = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            icon.src = "images/sun.png";
        } else {
            localStorage.setItem("theme", "light");
            icon.src = "images/moon.png";
        }
    });
}



/* =======================================
   BACK TO TOP — HOME PAGE
======================================= */
document.addEventListener("DOMContentLoaded", function () {
    const backBtn = document.getElementById("backToTop");
    if (backBtn) {

        window.addEventListener("scroll", () => {
            backBtn.classList.toggle("show", window.scrollY > 300);
        });

        backBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});




/* =======================================
   CLOCK 
======================================= */
if (document.getElementById("clock")) {
    function updateClock() {
        const now = new Date();
        document.getElementById("clock").textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();
}


/* =======================================
   SERVICES PAGE — SORTING
======================================= */
if (document.querySelector(".services-page")) {

    const sortSelect = document.getElementById("sort");
    const serviceGrid = document.querySelector(".service-grid");
    let services = Array.from(document.querySelectorAll(".service-box"));

   
    sortSelect.addEventListener("change", function () {
        let value = this.value;

        services = Array.from(document.querySelectorAll(".service-box"));

        if (value === "low-high") {
            services.sort((a, b) => a.dataset.price - b.dataset.price);
        }
        else if (value === "high-low") {
            services.sort((a, b) => b.dataset.price - a.dataset.price);
        }
        else if (value === "a-z") {
            services.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
        }
        else if (value === "z-a") {
            services.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
        }

        services.forEach(card => serviceGrid.appendChild(card));
    });
}

/* =======================================
   FAVORITES — SAVE IN LOCAL STORAGE
======================================= */

if (document.querySelector(".services-page")) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const serviceBoxes = document.querySelectorAll(".service-box");

    serviceBoxes.forEach(box => {
        const name = box.dataset.name; 
        const checkbox = box.querySelector(".favorite input");

        if (favorites.includes(name)) {
            checkbox.checked = true;
            box.classList.add("fav-active");
        }

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                
                if (!favorites.includes(name)) {
                    favorites.push(name);
                }
            } else {
               
                favorites = favorites.filter(item => item !== name);
            }

            
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    });
}

/* =======================================PROVIDER DASHBOARD — LOAD SERVICES======================================= */
document.addEventListener("DOMContentLoaded", function () {
    const servicesContainer = document.getElementById("provider-services");
    // Set up horizontal navigation for the services list if arrows are present
    const prevBtn = document.getElementById("service-prev");
    const nextBtn = document.getElementById("service-next");
    if (servicesContainer && prevBtn && nextBtn) {
        // Scroll amount is based on the container's visible width so that clicking
        // an arrow advances the view by roughly one card width.  Adjust as
        // needed for your card sizing.
        const scrollAmount = () => servicesContainer.clientWidth || 300;
        prevBtn.addEventListener("click", function (e) {
            e.preventDefault();
            servicesContainer.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
        });
        nextBtn.addEventListener("click", function (e) {
            e.preventDefault();
            servicesContainer.scrollBy({ left: scrollAmount(), behavior: "smooth" });
        });
    }
    if (servicesContainer) {
        // Retrieve services from localStorage or fall back to an empty array
        const services = JSON.parse(localStorage.getItem("services")) || [];
        // Show or hide arrow controls depending on whether any services exist.
        if (prevBtn && nextBtn) {
            if (services.length === 0) {
                // Hide arrows when there are no services to scroll through
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                // Ensure arrows are visible when services exist
                prevBtn.style.display = "";
                nextBtn.style.display = "";
            }
        }
        // If there are no stored services, display a friendly message
        if (services.length === 0) {
            const msg = document.createElement("p");
            msg.textContent = "No services have been added yet.";
            servicesContainer.appendChild(msg);
        } else {
            services.forEach(service => {
                const card = document.createElement("div");
                card.className = "Our-service";

                const img = document.createElement("img");
                img.src = service.image;
                img.alt = service.name;

                const title = document.createElement("h3");
                title.textContent = service.name;

                const desc = document.createElement("p");
                desc.textContent = service.description;

                const price = document.createElement("p");
                price.className = "price";
                price.textContent = `Price: ${service.price}SAR`;

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(desc);
                card.appendChild(price);

                servicesContainer.appendChild(card);
            });
        }
    }

    /* =======================================
       ADD A NEW SERVICE — FORM HANDLING
    ======================================= */
    const addServiceForm = document.getElementById("add-service-form");
    if (addServiceForm) {
        addServiceForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("service_name");
            const imageInput = document.getElementById("image");
            const priceInput = document.getElementById("price");
            const descInput = document.getElementById("description");

            const name = nameInput.value.trim();
            const price = priceInput.value.trim();
            const description = descInput.value.trim();

            // Name must not start with a number
            if (/^\d/.test(name)) {
                alert("The service name cannot start with a number.");
                return;
            }

           
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = function () {
                const services = JSON.parse(localStorage.getItem("services")) || [];
                services.push({
                    name: name,
                    description: description,
                    price: price,
                    image: reader.result
                });
                localStorage.setItem("services", JSON.stringify(services));
                alert(`${name} has been added successfully.`);
                addServiceForm.reset();
            };
            reader.readAsDataURL(file);
        });
    }

    /* =======================================MANAGE TEAM MEMBERS — LOAD & UPDATE MEMBERS ======================================= */
    const teamListContainer = document.getElementById("team-list");
    const deleteForm = document.getElementById("delete-members-form");
    const addMemberForm = document.getElementById("add-member-form");

    // Only execute this section if we are on the Manage Team Members page
    if (teamListContainer && deleteForm && addMemberForm) {
        // Default members replicate the original static content
        const defaultMembers = [
            { id: "member1", name: "Yara", image: "images/member3.png" },
            { id: "member2", name: "Sara", image: "images/member1.png" },
            { id: "member3", name: "Lara", image: "images/member6.png" },
            { id: "member4", name: "Nora", image: "images/member2.png" },
            { id: "member5", name: "Lulu", image: "images/member4.png" },
            { id: "member6", name: "Jood", image: "images/member5.png" }
        ];

        let members = [];

        // Load existing members from localStorage or set defaults
        function loadMembers() {
            const stored = JSON.parse(localStorage.getItem("teamMembers"));
            if (stored && Array.isArray(stored) && stored.length > 0) {
                members = stored;
            } else {
                members = defaultMembers.slice();
            }
        }

        // Render the members list into two columns
        function renderMembers() {
            teamListContainer.innerHTML = "";
            const leftCol = document.createElement("div");
            leftCol.className = "team-col left-col";
            const rightCol = document.createElement("div");
            rightCol.className = "team-col right-col";
            members.forEach((member, index) => {
                const label = document.createElement("label");
                label.className = "team-item";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "member-checkbox";
                checkbox.value = member.id;

                const img = document.createElement("img");
                img.src = member.image;
                img.alt = member.name;

                const span = document.createElement("span");
                span.className = "team-name";
                span.textContent = member.name;

                label.appendChild(checkbox);
                label.appendChild(img);
                label.appendChild(span);

                if (index % 2 === 0) {
                    leftCol.appendChild(label);
                } else {
                    rightCol.appendChild(label);
                }
            });
            teamListContainer.appendChild(leftCol);
            teamListContainer.appendChild(rightCol);
        }

        // Initial load and render
        loadMembers();
        renderMembers();

        // Delete selected members
        deleteForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const selected = Array.from(teamListContainer.querySelectorAll(".member-checkbox:checked"));
            if (selected.length === 0) {
                alert("Please select at least one member");
                return;
            }
            const confirmed = confirm("Are you sure you want to delete the selected member(s)?");
            if (!confirmed) return;
            const idsToRemove = selected.map(cb => cb.value);
            members = members.filter(m => !idsToRemove.includes(m.id));
            localStorage.setItem("teamMembers", JSON.stringify(members));
            renderMembers();
        });

        // Add a new member
        addMemberForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameField = document.getElementById("name");
            const photoField = document.getElementById("photo");
            const dobField = document.getElementById("dob");
            const emailField = document.getElementById("email");
            const expertiseField = document.getElementById("expertise");
            const skillsField = document.getElementById("skills");
            const educationField = document.getElementById("education");

            const name = nameField.value.trim();
            
            // ensure name not starting with numbers
            
            if (/^\d/.test(name)) {
                alert("The staff name cannot start with a number.");
                return;
            }

            // Read image as base64
            const file = photoField.files[0];
            const reader2 = new FileReader();
            reader2.onload = function () {
                const newMember = {
                    id: `member${Date.now()}`,
                    name: name,
                    image: reader2.result
                };
                members.push(newMember);
                localStorage.setItem("teamMembers", JSON.stringify(members));
                alert(`${name} has been added successfully.`);
                addMemberForm.reset();
                renderMembers();
            };
            reader2.readAsDataURL(file);
        });
    }
});
/* ======================================= end of MANAGE TEAM MEMBERS page=======================================*/

/* =======================================
   shatha
======================================= */

function submitRequest() {

    let name = document.getElementById("name").value.trim();
    let service = document.getElementById("service").value;
    let date = document.getElementById("date").value;
    let description = document.getElementById("description").value.trim();

    // 1) Service
    if (service === "") {
        alert("Please select a service.");
        return;
    }

    // 2) Name (full name + no numbers + no symbols)
    let namePattern = /^[A-Za-z\s]+$/;
    if (name === "" || !namePattern.test(name) || name.split(" ").length < 2) {
        alert("Please enter a valid full name without numbers or symbols.");
        return;
    }

    // 3) Due date must not be too soon (3 days rule)
    let today = new Date();
    let selectedDate = new Date(date);

    let minDate = new Date();
    minDate.setDate(today.getDate() + 3);

    if (date === "" || selectedDate < minDate) {
        alert("The due date is too soon. Please select a later date.");
        return;
    }

    // 4) Description ≥ 100 chars
    if (description.length < 100) {
        alert("Description must be at least 100 characters.");
        return;
    }

    // Confirmation alert (Stay / Leave)
    let stay = confirm("Your request has been sent.\nPress OK to stay on this page.\nPress Cancel to return to the dashboard.");

    if (!stay) {
        window.location.href = "Customer’s_Dashboard.html";
        return;
    }

    // Show the request inside the page
    let container = document.getElementById("requestsContainer");

    let box = document.createElement("div");
    box.className = "request-box";

    box.innerHTML = `
        <h3>New Request Added</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Due Date:</strong> ${date}</p>
        <p><strong>Description:</strong> ${description}</p>
        
    `;

    container.appendChild(box);

    // Clear form
    document.getElementById("requestForm").reset();
}

/* =======================================
   SERVICE EVALUATION — BY SHATHA
======================================= */
/* =======================================
   SERVICE EVALUATION — SHATHA
======================================= */
function submitEvaluation() {

    let service = document.getElementById("service").value;
    let feedback = document.getElementById("feedback").value.trim();
    let rating = document.getElementById("ratingValue").value;

    // 1) Check service
    if (service === "") {
        alert("Please select a service.");
        return;
    }

    // 2) Check rating
    if (rating === "" || rating === "0") {
        alert("Please select a rating.");
        return;
    }

    // 3) Check feedback
    if (feedback === "") {
        alert("Please enter your feedback.");
        return;
    }

    // Show message
    if (parseInt(rating) >= 4) {
        alert("Thank you for your great rating! We appreciate your feedback ❤️");
    } else {
        alert("We apologize for not meeting your expectations. Thank you for your feedback 💔");
    }

    // Redirect
    window.location.href = "Customer’s_Dashboard.html";
}



/* =======================================
   STAR RATING — INTERACTIVE
======================================= */

const stars = document.querySelectorAll(".rating-stars span");
let ratingInput = document.getElementById("ratingValue");

if (stars.length > 0) {

    // Hover effect
    stars.forEach(star => {
        star.addEventListener("mouseover", function () {
            let value = this.dataset.value;
            highlightStars(value);
        });

        // Remove color when mouse leaves
        star.addEventListener("mouseout", function () {
            let value = ratingInput.value;
            highlightStars(value);
        });

        // Click to select rating
        star.addEventListener("click", function () {
            let value = this.dataset.value;
            ratingInput.value = value;
            highlightStars(value);
        });
    });
}

// Function to highlight stars
function highlightStars(value) {
    stars.forEach(star => {
        if (parseInt(star.dataset.value) <= value) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}


//-----------About Us --------


document.addEventListener("DOMContentLoaded", function () {

    const joinForm = document.querySelector(".form-section form");

    if (!joinForm) return; // 

    joinForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Stop automatic submission

        const name = document.getElementById("name").value.trim();
        const photo = document.getElementById("photo").files[0];
        const dob = document.getElementById("dob").value;
        const email = document.getElementById("email").value.trim();
        const expertise = document.getElementById("expertise").value.trim();
        const skills = document.getElementById("skills").value.trim();
        const education = document.getElementById("education").value.trim();
        const message = document.getElementById("message").value.trim();

       
        if (!name || !photo || !dob || !email || !expertise || !skills || !education || !message) {
            alert("Please fill in all the fields before submitting.");
            return;
        }

        if (/^\d/.test(name)) {
            alert("The name cannot start with a number.");
            return;
        }

        if (!photo.type.startsWith("image/")) {
            alert("Only image files are allowed for the photo.");
            return;
        }

        const selectedDate = new Date(dob);
        const limitDate = new Date("2008-12-31");

        if (selectedDate > limitDate) {
            alert("Date of Birth must not be after the year 2008.");
            return;
        }

        alert(`Thank you ${name}! Your request to join the team has been submitted successfully `);

        joinForm.reset(); // Clear form 
    });

})
