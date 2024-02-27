/* Demos JS - general JS for demo site */

var widgetSwitch // globally define widgetSwitch (the widget switch)

document.addEventListener('DOMContentLoaded', function() {
    // define/set variables
    var widget = document.getElementById('ShipInsureWidget');
    var card = document.getElementById('demoCard')
    let colorInput = document.getElementById('colorInput');
    var switchLabel = document.querySelector('.switch-label');
    widgetSwitch = document.querySelector('.switch-input');
    let switchColorChanged = false

    // switch toggle to 'on' on pageload
    widgetSwitch.checked = !widgetSwitch.checked; 

    colorInput.value = '#6675FF'; 

    var ecoCheckbox = document.querySelector('input[name="typeOption"][value="eco"]');
    ecoCheckbox.addEventListener('change', function() {
        if (switchColorChanged) {
            return;
        } else {
            if (this.checked) {
                colorInput.value = "#09B825"
                switchLabel.style.backgroundColor = colorInput.value
            } else {
                colorInput.value = '#6675FF';
                switchLabel.style.backgroundColor = colorInput.value
            }
        }
    });

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
        switchColorChanged = true

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
        var fullCoveragePill = document.querySelector('.si-full-coverage')

        // Check if the widgetSwitch is checked and input is a valid hex color
        if (widgetSwitch.checked && /^#[0-9A-F]{6}$/i.test(formattedInput)) {
            switchLabel.style.backgroundColor = formattedInput;
            fullCoveragePill.style.backgroundColor = formattedInput;
        } else {
            // If widgetSwitch is not checked or color is invalid, clear the inline style; it will return to default purple color
            switchLabel.style.backgroundColor = '';
            fullCoveragePill.style.backgroundColor = '';
        }
    });
    
    /** Handle customization options */
    // Define a mapping from select IDs to their respective class names
    const classMapping = {
        'disclaimerSelect': { 'noDisclaimer': '', 'disclaimer': 'disclaimer' },
        'typeSelect': { 'minimal': 'minimal', 'eco': 'eco', 'disclaimer': 'disclaimer', 'darkmode': 'darkmode' },
        'infoSelect': { 'infoModal': '', 'infoLink': 'info-link' },
        'snapSelect': { 'snapRight': 'snap-right', 'snapLeft': 'snap-left'},
        'coverageSelect': { 'standard': '', 'full-coverage': 'full-coverage' }
    };

    var darkmodeCheckbox = document.querySelector('input[name="typeOption"][value="darkmode"]');
    darkmodeCheckbox.addEventListener('change', function() {
        if(this.checked) {
            // If the checkbox is checked, add the 'darkmode' class
            card.classList.add('darkmode');
            card.classList.remove('lightmode')
        } else {
            // If the checkbox is not checked, remove the 'darkmode' class
            card.classList.remove('darkmode');
            card.classList.add('lightmode')
        }
    });

    // Generic event handler for select change (so it applies to all the dropdowns)
    function handleSelectChange(event) {
        const selectId = event.target.id;
        const selectedValue = event.target.value;

        // Clear all possible classes for this select
        Object.values(classMapping[selectId]).forEach(className => {
            if (className) widget.classList.remove(className);
        });

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

    document.querySelectorAll('#typeSelect input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function(event) {
            const selectedOption = event.target.value;
            const isChecked = event.target.checked;
    
            // Clear class if unchecked
            if (!isChecked) {
                widget.classList.remove(classMapping['typeSelect'][selectedOption]);
            } else {
                // Add class if checked
                if (classMapping['typeSelect'][selectedOption]) {
                    widget.classList.add(classMapping['typeSelect'][selectedOption]);
                }

                // Logic to ensure "Disclaimer" and "Minimal" are not selected at the same time
                if (selectedOption === 'minimal' && isChecked) {
                    const disclaimerCheckbox = document.querySelector('input[type="checkbox"][value="disclaimer"]');
                    if (disclaimerCheckbox && disclaimerCheckbox.checked) {
                        disclaimerCheckbox.checked = false;
                        widget.classList.remove(classMapping['typeSelect']['disclaimer']);
                    }
                } else if (selectedOption === 'disclaimer' && isChecked) {
                    const minimalCheckbox = document.querySelector('input[type="checkbox"][value="minimal"]');
                    if (minimalCheckbox && minimalCheckbox.checked) {
                        minimalCheckbox.checked = false;
                        widget.classList.remove(classMapping['typeSelect']['minimal']);
                    }
                }
            }
        });
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

    // functionality to resize widget when demoCard/checkout button gets too wide
    var siWidget = document.querySelector('.si-widget');

    // Create a function to apply or remove styles based on width
    function handleDynamicWidgetWidth() {
        if (card.offsetWidth > 520) {
            if (siWidget.classList.contains('snap-left')) {
                siWidget.style.maxWidth = '335px';
                siWidget.style.marginRight = 'auto';
                siWidget.style.marginLeft = '0px'
            } else {
                siWidget.style.maxWidth = '335px';
                siWidget.style.marginLeft = 'auto';
                siWidget.style.marginRight = '0px';
            }
        } else {
            siWidget.style.maxWidth = '';
            siWidget.style.marginRight = '';
        }
    }

    // Create a ResizeObserver instance and observe the demoCard
    var resizeObserver = new ResizeObserver(function(entries) {
        // Call adjustStyles whenever a resize is observed
        handleDynamicWidgetWidth();
    });

    // Start observing the demoCard element
    resizeObserver.observe(card);

    // Also call adjustStyles initially in case the initial state needs adjustment
    handleDynamicWidgetWidth();
});