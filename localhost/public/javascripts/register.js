
slide = () => {
  document.getElementById('btn').addEventListener('click', function (event) {
    event.preventDefault();
    // Get the divs
    const div1 = document.getElementById('div1');
    const div2 = document.getElementById('div2');

    // Hide the current div and show the next div
    div1.style.transform = 'translateX(-130%)';
    div1.style.opacity = '0';
    div2.style.transform = 'translateX(-110%)';
    div2.style.opacity = '1';

    // Optionally, add a transition effect
    div1.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
    div2.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
  });

  document.getElementById('backbtn').addEventListener('click', function (event) {
    event.preventDefault();

    // Get the divs
    const div1 = document.getElementById('div1');
    const div2 = document.getElementById('div2');

    // Hide the current div and show the next div
    div1.style.transform = 'translateX(0%)';
    div1.style.opacity = '1';
    div2.style.transform = 'translateX(120%)';
    div2.style.opacity = '0';

    // Optionally, add a transition effect
    div1.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
    div2.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
  });
}

combine = () => {
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const form1 = document.getElementById('registrationForm');
      const formData1 = new FormData(form1);

      const form2 = document.getElementById('confirmForm');
      const formData2 = new FormData(form2);

      let combinedData = {};

      for (let [key, value] of formData1.entries()) {
        combinedData[key] = value;
      }

      for (let [key, value] of formData2.entries()) {
        combinedData[key] = value;
      }

      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ combinedData })
        });
      } catch (error) {
        console.error('Error:', error);
        // Display error message on the page
        alert('An error occurred while registering the user');
      }

      window.location.replace('/profile'); // Replace with actual redirect URL
      alert('Registered Successfully');

    });
  });
};

combine();

slide();
combine();
