// Function to create and show the form
function createAndShowForm() {
  // Initialize form functionality
  const form = document.querySelector('form');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const submitButton = document.querySelector('button[type="submit"]');

  checkboxes.forEach((checkbox, index) => {
    if (index) {
      checkbox.parentElement.style.display = 'none';
    } else {
      checkbox.parentElement.style.display = 'block';
    }
    checkbox.addEventListener('change', () => {
      if (checkbox.checked && index < checkboxes.length - 1) {
        // Show next checkbox
        checkboxes[index + 1].parentElement.style.display = 'block';

        // Disable and fade out all previous checkboxes
        for (let i = 0; i <= index; i++) {
          checkboxes[i].disabled = true;
          checkboxes[i].parentElement.classList.add('disabled');
        }
      }

      // Check if all checkboxes are checked
      const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
      if (allChecked) {
        submitButton.style.display = 'block';
      } else {
        submitButton.style.display = 'none';
      }
    });
  });

  submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Add exiting class to trigger animation
    form.classList.add('exiting');

    // Wait for animation to complete before removing form and showing main
    setTimeout(() => {
      form.remove();
      // redirect to /landing
      window.location.href = '/landing';
    }, 800); // Match this duration with the CSS transition duration
  });

  // Add click handlers for iframes
  document.querySelectorAll('span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling up

      // Check if this span already has an iframe
      const existingIframe = span.querySelector('.iframe-wrapper');
      if (existingIframe) {
        existingIframe.remove();
        return;
      }

      // Create new iframe wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'iframe-wrapper';

      // Create close button
      const closeButton = document.createElement('div');
      closeButton.className = 'iframe-close';
      closeButton.innerHTML = '×';
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.remove();
      });
      wrapper.appendChild(closeButton);

      const iframe = document.createElement('iframe');
      iframe.src = `/static/consent/${span.id}.html`;

      // Add load event listener to scroll iframe to middle
      if (span.id == 'consciousness') {
        iframe.onload = function () {
          const scrollWidth =
            iframe.contentDocument.documentElement.scrollWidth;
          const iframeWidth = iframe.clientWidth;
          const scrollTo = (scrollWidth - iframeWidth) / 2;
          iframe.contentWindow.scrollTo(scrollTo, 0);
        };
      }

      wrapper.appendChild(iframe);

      // Position the iframe directly under the span
      wrapper.style.top = '100%';
      wrapper.style.marginTop = '10px';

      // Calculate if iframe would extend beyond viewport
      const spanRect = span.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const iframeWidth = 300; // Width of iframe

      // If iframe would extend beyond right edge, adjust its position
      if (spanRect.left + iframeWidth > viewportWidth) {
        wrapper.style.left = 'auto';
        wrapper.style.right = '0';
      }

      // Add to span
      span.appendChild(wrapper);

      // Add click handler to document to close iframe when clicking outside
      const closeIframe = (e) => {
        if (!wrapper.contains(e.target) && e.target !== span) {
          wrapper.remove();
          document.removeEventListener('click', closeIframe);
        }
      };

      // Add the click handler after a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', closeIframe);
      }, 0);
    });
  });
}

window.onload = () => createAndShowForm();
