document.addEventListener('DOMContentLoaded', function() {
    var currentIpParagraph = document.getElementById('currentip');

    fetch('https://ipv4-a.jsonip.com/')
    .then(response => response.json())
    .then(data => {
        currentIpParagraph.textContent = 'Current IP: ' + data.ip;
        // Add event listener to the button for adding to the firewall
        var addButton = document.getElementById('myButton');
        var hiddenText = document.getElementById('hiddenText');
        const btnbg=document.getElementsByClassName('box-1')
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
                hiddenText.textContent = data.message || data.error || data.alreadyexists;
                hiddenText.style.display = 'block';
                if (data.error) {
                document.body.style.transition = 'background-color 0.7s ease-in-out';
                document.body.style.backgroundColor = '#480000';     
                hiddenText.style.color = 'yellow';
                }else if(data.alreadyexists){
                document.body.style.transition = 'background-color 0.7s ease-in-out';       
                document.body.style.backgroundColor = '#84a98c';     
                hiddenText.style.color = '#000000';
                } 
                else {
                document.body.style.transition = 'background-color 0.7s ease-in-out';
                document.body.style.backgroundColor = '#020047';
                hiddenText.style.color = '#5eec4b';
                }
            })
        });
    })
    .catch(error => {
        console.error('Error getting user IP:', error);
        
    });
});
