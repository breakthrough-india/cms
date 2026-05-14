// Membership Form - Pincode Lookup
(function() {
  var form      = document.getElementById('membership-form');
  var errBox    = document.getElementById('m-error');
  var okBox     = document.getElementById('m-success');
  var btn       = document.getElementById('m-submit');
  var workerUrl = window.membershipFormConfig?.workerUrl || '';
  var pincodeInput = document.getElementById('m-pincode');
  var cityInput = document.getElementById('m-city');
  var stateInput = document.getElementById('m-state');
  var lastLookup = null;

  // Visual debugging - show status
  function setStatus(msg, color) {
    stateInput.placeholder = msg;
    stateInput.style.borderColor = color;
  }

  // Client-side pincode lookup
  async function lookupPincode(pincode) {
    setStatus('Fetching location...', '#fbbf24');
    try {
      var res = await fetch('https://api.postalpincode.in/pincode/' + encodeURIComponent(pincode), {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        setStatus('API error', '#ef4444');
        return null;
      }
      var data = await res.json();
      if (data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length) {
        var po = data[0].PostOffice[0];
        var result = { city: po.District || po.Name || '', state: po.State || '' };
        setStatus(result.state, '#10b981');
        return result;
      }
    } catch (e) {
      setStatus('Network error', '#ef4444');
    }
    return null;
  }

  // Auto-fill city and state when pincode is entered
  pincodeInput.addEventListener('change', async function() {
    var pincode = pincodeInput.value.trim();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      stateInput.value = '';
      setStatus('Invalid pincode', '#ef4444');
      return;
    }
    if (pincode === lastLookup) return;
    lastLookup = pincode;
    var location = await lookupPincode(pincode);
    if (location) {
      if (!cityInput.value) cityInput.value = location.city;
      stateInput.value = location.state;
    }
  });

  pincodeInput.addEventListener('blur', async function() {
    var pincode = pincodeInput.value.trim();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      stateInput.value = '';
      setStatus('Invalid pincode', '#ef4444');
      return;
    }
    if (pincode === lastLookup) return;
    lastLookup = pincode;
    var location = await lookupPincode(pincode);
    if (location) {
      if (!cityInput.value) cityInput.value = location.city;
      stateInput.value = location.state;
    }
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    errBox.hidden = true;
    okBox.hidden  = true;
    btn.disabled  = true;
    btn.textContent = 'Submitting\u2026';

    var pincode = document.getElementById('m-pincode').value.trim();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      showErr('Please enter a valid 6-digit pincode.');
      reset(); return;
    }

    var body = {
      name:       document.getElementById('m-name').value.trim(),
      email:      document.getElementById('m-email').value.trim(),
      pincode:    pincode,
      city:       document.getElementById('m-city').value.trim(),
      state:      document.getElementById('m-state').value.trim(),
      occupation: document.getElementById('m-occupation').value.trim(),
      phone:      document.getElementById('m-phone').value.trim(),
      website:    form.querySelector('[name="website"]').value,
    };

    try {
      var res  = await fetch(workerUrl + '/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      var data = await res.json().catch(function() { return {}; });
      if (res.status === 409) {
        showErr('This email address is already registered.');
      } else if (!res.ok) {
        showErr(data.error || 'Something went wrong. Please try again.');
      } else {
        form.style.display = 'none';
        okBox.hidden = false;
        return;
      }
    } catch {
      showErr('Network error. Please check your connection and try again.');
    }
    reset();
  });

  function showErr(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
  }
  function reset() {
    btn.disabled    = false;
    btn.textContent = 'Submit Application \u2192';
  }
})();
