/* Modals JS */

document.addEventListener('DOMContentLoaded', function() {
    // Function to open the modal
    function openModal() {
        console.log('modal triggered')
        document.getElementById("siInfoModal").style.display = "block";
    }

    // get the infoTags
    var infoTags = document.querySelectorAll('.infoPopupTag');
    infoTags.forEach(function(tag) {
        tag.onclick = openModal;
    });

    // Get the modal
    var siModal = document.getElementById("siInfoModal");

    // Get the <span> element that closes the modal
    var siCloseModal = document.getElementsByClassName("si-modal-close")[0];

    // When the user clicks on <span> (x), close the modal
    siCloseModal.onclick = function() {
        siModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == siModal) {
            siModal.style.display = "none";
        }
    }
});