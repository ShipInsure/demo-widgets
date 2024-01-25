/* Demos JS - general JS for demo site */

var widgetSwitch // globally define widgetSwitch (the widget switch)

document.addEventListener('DOMContentLoaded', function() {
    // define/set variables
    var widget = document.getElementById('ShipInsureWidget');
    var card = document.getElementById('demoCard')
    var colorInput = document.getElementById('colorInput');
    widgetSwitch = document.querySelector('.switch-input');

    // default switch color
    colorInput.value = '#6675FF'; 

    // switch toggle to 'on' on pageload
    widgetSwitch.checked = !widgetSwitch.checked; 

    // handle dynamic switch coloring! We only want the switch colored when it's checked, but that can only be done
    // in CSS. So I use JS to dynamic set/unset the color depending on the state of the switch. This won't matter in
    // merchant sites, but it's necessary to make switch color an option in the demo site
    widgetSwitch.addEventListener('change', function() {
        var switchLabel = document.querySelector('.switch-label');
        var colorInput = document.getElementById('colorInput').value;

        // Apply the color if the widgetSwitch is checked and the color is valid
        if (this.checked && /^#[0-9A-F]{6}$/i.test(colorInput)) {
            switchLabel.style.backgroundColor = colorInput;
        } else {
            // Clear the color otherwise
            switchLabel.style.backgroundColor = '';
        }
    });
    document.getElementById('colorInput').addEventListener('input', function() {
        let formattedInput = this.value;
        formattedInput.value = "#"
        if (formattedInput.charAt(0) !== '#') {
            formattedInput = '#' + formattedInput.replace(/#/g, ''); // Remove all # and add one at the start
        } else {
            formattedInput = '#' + formattedInput.slice(1).replace(/#/g, ''); // Remove additional # if present
        }
        
        formattedInput = formattedInput.slice(0, 7); // Limit input length to 7 characters (1 for default # and 6 for the hex code)

        this.value = formattedInput; // Update the switch color field with the formatted 'input' value

        var switchLabel = document.querySelector('.switch-label');

        // Check if the widgetSwitch is checked and input is a valid hex color
        if (widgetSwitch.checked && /^#[0-9A-F]{6}$/i.test(formattedInput)) {
            switchLabel.style.backgroundColor = formattedInput;
        } else {
            // If widgetSwitch is not checked or color is invalid, clear the inline style; it will return to default purple color
            switchLabel.style.backgroundColor = '';
        }
    });
    
    /** Handle customization options */
    // Define a mapping from select IDs to their respective class names
    const classMapping = {
        'modeSelect': { 'lightmode': 'lightmode', 'darkmode': 'darkmode' },
        'disclaimerSelect': { 'noDisclaimer': '', 'disclaimer': 'disclaimer' },
        'sizeSelect': { 'normal': '', 'minimal': 'minimal' },
        'infoSelect': { 'infoModal': '', 'infoLink': 'info-link' }
    };

    // Generic event handler for select change (so it applies to all the dropdowns)
    function handleSelectChange(event) {
        const selectId = event.target.id;
        const selectedValue = event.target.value;

        // Clear all possible classes for this select
        Object.values(classMapping[selectId]).forEach(className => {
            if (className) widget.classList.remove(className);
        });

        // Special handling for modeSelect
        if (selectId === 'modeSelect') {
            card.classList.remove('lightmode', 'darkmode');
            card.classList.add(classMapping[selectId][selectedValue]);
        }

        // Additional logic to make sure 'disclaimer' and 'small' cannot be active at the same time
        if (selectId === 'sizeSelect' && selectedValue === 'minimal') {
            // Set 'disclaimer' to 'none' if 'small' is selected
            document.getElementById('disclaimerSelect').value = 'noDisclaimer';
            handleSelectChange({ target: document.getElementById('disclaimerSelect') });
        } else if (selectId === 'disclaimerSelect' && selectedValue === 'disclaimer') {
            // Set 'size' to 'normal' if 'disclaimer' is selected
            document.getElementById('sizeSelect').value = 'normal';
            handleSelectChange({ target: document.getElementById('sizeSelect') });
        }

        // Add the new class if it's not an empty string
        if (classMapping[selectId][selectedValue]) {
            widget.classList.add(classMapping[selectId][selectedValue]);
        }
    }
    // Attach the event handler to each select element
    document.querySelectorAll('.customization-option select').forEach(selectElement => {
        selectElement.addEventListener('change', handleSelectChange);
    });

    // Handle resizing the widget demo card
    var resizeHandle = document.querySelector('.resize-handle');
    resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        card.style.transition = 'none'; // Disable transition immediately when resizing starts
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    });
    function resize(e) {
        card.style.width = e.clientX - card.getBoundingClientRect().left + 'px';
    }
    function stopResize() {
        window.removeEventListener('mousemove', resize);
        card.style.width = '400px'; // Set the width back to 450px once you're done resizing
        card.style.transition = 'width 0.5s ease'; // Apply a smooth transition so it *slowly* returns to 450px
    }

    // handle client form submit
    document.getElementById("clientForm").addEventListener("submit", function(event){
        event.preventDefault(); 
        var email = document.getElementById("email").value;
        var website = document.getElementById("website").value;
        var shipInsureWidgetContent = document.getElementById("ShipInsureWidget") ? document.getElementById("ShipInsureWidget").className : 'Element not found';
        var switchLabelElement = document.querySelector(".switch-label");
        var switchColor = switchLabelElement && switchLabelElement.style.backgroundColor ? switchLabelElement.style.backgroundColor : 'default';

        // MOCK formatted form data for email
        var emailBody = "Merchant Email: " + email + "\n" +
                        "Merchant URL: " + website + "\n" +
                        "ShipInsureWidget Classes: " + shipInsureWidgetContent + "\n" +
                        "Switch Color: " + switchColor;
        console.log(emailBody);

        // Disable submit button
        var submitButton = document.getElementById("submitButton");
        submitButton.disabled = true;
        submitButton.style.backgroundColor = 'grey';
        submitButton.style.cursor = 'initial';

        // Display a success message
        var successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";

        // MOCK email API
        // fetch('path to our email API?', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //         website: website,
        //         shipInsureWidgetClass: shipInsureWidgetContent,
        //         switchColor: switchColor
        //     })
        // })
        // .then(response => response.text())
        // .then(data => console.log(data))
        // .catch((error) => console.error('Error:', error));

    });

    // handle UI changes for form when focused (by accessing the 'focused' class in the CSS)
    var inputs = document.querySelectorAll("#clientForm input");

    inputs.forEach(function(input) {
        input.addEventListener("focus", function() {
            this.parentNode.classList.add("focused");
        });

        input.addEventListener("blur", function() {
            this.parentNode.classList.remove("focused");
        });
    });
});