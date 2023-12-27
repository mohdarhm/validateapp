document.addEventListener('DOMContentLoaded', function() {
    var currentIpParagraph = document.getElementById('currentip');

    fetch('https://ipv4-a.jsonip.com/')
    .then(response => response.json())
    .then(data => {
        currentIpParagraph.textContent = 'Current IP: ' + data.ip;

        // Add event listener to the button for adding to the firewall
        var addButton = document.getElementById('myButton');
        var hiddenText = document.getElementById('hiddenText');

        addButton.addEventListener('click', function() {
            // Fetch the response from the Django view for adding to the firewall
            fetch('https://plenary-anagram-408413.el.r.appspot.com/add_ip_to_firewall/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_ip: data.ip }), 
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                hiddenText.textContent = data.message;
                hiddenText.style.display = 'block';
            })
            .catch(error => {
                console.log(error)
                hiddenText.textContent = 'Error allowing user IP: ' + error;
                hiddenText.style.display = 'block';
            });
        });
    })
    .catch(error => {
        console.error('Error getting user IP:', error);
    });
});
