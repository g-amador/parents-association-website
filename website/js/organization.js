document.addEventListener('DOMContentLoaded', function () {
    const directionTable = document.getElementById('direction-table');
    const contactsContainer = document.getElementById('contacts');

    // Load rolesData from localStorage or server (you can modify this part)
    const rolesData = JSON.parse(localStorage.getItem('rolesData')) || [
        { role: 'Secretary', name: 'John Doe', email: 'john@example.com', phoneNumber: '123-456-7890' },
        { role: 'Vice President', name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '987-654-3210' },
        { role: 'President', name: 'Bob Johnson', email: 'bob@example.com', phoneNumber: '555-123-4567' },
        { role: 'Finance Guy', name: 'Alice Brown', email: 'alice@example.com', phoneNumber: '111-222-3333' },
        { role: 'Vowel', name: 'Ella Davis', email: 'ella@example.com', phoneNumber: '444-555-6666' }
    ];

    // Create a single row for all roles
    const row = directionTable.insertRow();
    rolesData.forEach((roleData, index) => {
        addCell(roleData, index);
    });

    function addCell(roleData, index) {
        const cell = row.insertCell();

        // Create image element
        const contactImage = document.createElement('img');
        contactImage.src = 'images/generic-user.jpg'; // Default image
        contactImage.alt = 'Contact Image';
        cell.appendChild(contactImage);

        // Add role, name, email, and phone number to the cell on distinct lines
        cell.innerHTML += `<div>${roleData.role}</div>`;
        cell.innerHTML += `<div>${roleData.name}</div>`;
        cell.innerHTML += `<div>${roleData.email}</div>`;
        cell.innerHTML += `<div>${roleData.phoneNumber}</div>`;

        // Add an "Edit" button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () {
            editContact(index);
        });
        cell.appendChild(editButton);
    }

    function createContactCard() {
        const contactCard = document.createElement('div');
        contactCard.classList.add('contact-card');

        const contactImage = document.createElement('img');
        contactImage.src = 'images/generic-user.jpg'; // Default image
        //contactImage.alt = 'Contact Image';
        contactCard.appendChild(contactImage);

        const contactDetails = document.createElement('div');
        contactDetails.classList.add('contact-details');

        const nameInput = createInput('text', '', 'Name');
        const emailInput = createInput('email', '', 'Email');
        const phoneInput = createInput('tel', '', 'Phone Number');
        const imageInput = createInput('file', '', 'Select Image', 'image/*');

        imageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                contactImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        contactDetails.appendChild(nameInput);
        contactDetails.appendChild(emailInput);
        contactDetails.appendChild(phoneInput);
        contactDetails.appendChild(imageInput);

        contactCard.appendChild(contactDetails);
        contactsContainer.appendChild(contactCard);
    }

    function createInput(type, value, placeholder, accept = '') {
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.placeholder = placeholder;
        input.accept = accept;
        return input;
    }

    function editContact(index) {
		const roleData = rolesData[index];

		// Store contact details in localStorage to retrieve in the edit-contact.html page
		localStorage.setItem('editContactDetails', JSON.stringify({
			name: roleData.name,
			email: roleData.email,
			phoneNumber: roleData.phoneNumber,
			image: `images/generic-user.jpg` // Use a default image path or set an initial image path
		}));

		// Redirect to the edit-contact.html page
		window.location.href = 'edit-contact.html';
	}

	function saveContacts() {
		const contactCards = document.querySelectorAll('.contact-card');
		const contacts = [];

		contactCards.forEach(card => {
			const details = card.querySelectorAll('.contact-details input');
			const contact = {
				name: details[0].value,
				email: details[1].value,
				phoneNumber: details[2].value,
				image: getBase64Image(card.querySelector('img'))
			};
			contacts.push(contact);
		});

		// Store contacts in localStorage or send them to the server
		console.log(contacts);
		// localStorage.setItem('contacts', JSON.stringify(contacts));
		// Send contacts to the server via AJAX/fetch
	}

    function getBase64Image(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }

    document.addEventListener('click', function (event) {
        const isPopup = event.target.classList.contains('popup');
        if (!isPopup) {
            const popups = document.querySelectorAll('.popup');
            popups.forEach(popup => popup.remove());
        }
    });
});