document.addEventListener('DOMContentLoaded', function () {
    // Retrieve contact details from localStorage or server (you can modify this part)
    const contactDetails = JSON.parse(localStorage.getItem('editContactDetails'));

    const editContactContainer = document.getElementById('edit-contact-container');
    
    // Add input fields for editing contact details
    const nameInput = createInput('text', contactDetails.name, 'Name');
    const emailInput = createInput('email', contactDetails.email, 'Email');
    const phoneInput = createInput('tel', contactDetails.phoneNumber, 'Phone Number');
    const imageInput = createInput('file', '', 'Select Image', 'image/*');

    // Create an image element
    const contactImage = document.createElement('img');
    contactImage.src = contactDetails.image; // Use the existing image
    contactImage.alt = 'Contact Image';

    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            contactImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    editContactContainer.appendChild(nameInput);
    editContactContainer.appendChild(emailInput);
    editContactContainer.appendChild(phoneInput);
    editContactContainer.appendChild(imageInput);
    editContactContainer.appendChild(contactImage);

    const saveButton = document.getElementById('save-contact');
    saveButton.addEventListener('click', function () {
        saveContactChanges(contactDetails);
    });
});

function createInput(type, value, placeholder, accept = '') {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    input.accept = accept;
    return input;
}

function saveContactChanges(contactDetails) {
    // Retrieve the updated contact details
    const updatedName = document.querySelector('input[placeholder="Name"]').value;
    const updatedEmail = document.querySelector('input[placeholder="Email"]').value;
    const updatedPhoneNumber = document.querySelector('input[placeholder="Phone Number"]').value;
    const updatedImage = document.querySelector('img').src;

    // Update the contact details
    contactDetails.name = updatedName;
    contactDetails.email = updatedEmail;
    contactDetails.phoneNumber = updatedPhoneNumber;
    contactDetails.image = updatedImage;

    // Save the updated contact details to localStorage or server (you can modify this part)
    localStorage.setItem('editContactDetails', JSON.stringify(contactDetails));

    // Redirect back to the organization page after saving changes
    window.location.href = 'organization.html';
}
