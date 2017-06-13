const addressInput = input => {
    if (!input) 
        return;
    
    const addressDropdown = new google.maps.places.Autocomplete(input);

    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    });
};

export default addressInput;