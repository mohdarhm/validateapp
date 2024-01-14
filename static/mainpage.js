document.addEventListener('DOMContentLoaded', function() {
    var currentIpParagraph = document.getElementById('currentip');
    var addButton = document.getElementById('myButton');
    var hiddenText = document.getElementById('hiddenText');
    const btnbg = document.getElementsByClassName('box-1');

    // Fetch the public IP address
    fetch('https://api.ipify.org/?format=json')
    .then(response => response.json())
    .then(publicData => {
        currentIpParagraph.textContent = 'Current IP: ' + publicData.ip;

        // Fetch the response from the Django view for simulating local external IP
        fetch('https://plenary-anagram-408413.el.r.appspot.com/getserverip/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch simulated external IP');
            }
            return response.json();
        })
        .then(data => {
            // Display the simulated external IP
            currentIpParagraph.textContent += ' | Server IP: ' + data.external_ip;

            // Add event listener to the button for adding to the firewall
            addButton.addEventListener('click', function() {
                // Fetch the response from the Django view for adding to the firewall
                fetch('https://plenary-anagram-408413.el.r.appspot.com/add_ip_to_firewall/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_ip: data.external_ip }), 
                })
                .then(response => response.json())
                .then(data => {
                    hiddenText.textContent = data.message || data.error || data.alreadyexists;
                    hiddenText.style.display = 'block';

                    // Adjust styling based on the response
                    if (data.error) {
                        document.body.style.transition = 'background-color 0.7s ease-in-out';
                        document.body.style.backgroundColor = '#480000';     
                        hiddenText.style.color = 'yellow';
                    } else if(data.alreadyexists){
                        document.body.style.transition = 'background-color 0.7s ease-in-out';       
                        document.body.style.backgroundColor = '#84a98c';     
                        hiddenText.style.color = '#000000';
                    } else {
                        document.body.style.transition = 'background-color 0.7s ease-in-out';
                        document.body.style.backgroundColor = '#020047';
                        hiddenText.style.color = '#5eec4b';
                    }
                })
                .catch(error => {
                    console.error('Error adding to firewall:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error getting simulated external IP:', error);

            // Set a default value for the simulated IP or handle it accordingly
            currentIpParagraph.textContent += ' | Server IP: N/A';
        });
    })
    .catch(error => {
        console.error('Error getting public IP:', error);
        // Handle error for public IP fetch
    });
});
