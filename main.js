// Function to get a specific cookie by name
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function (event) {
    window.top.postMessage({
        action: 'wfx_iframe_loaded'
    }, '*');
    console.log('Iframe Window : wfx_iframe_loaded');
});

// Listen for messages sent to the window
window.addEventListener('message', function (event) {
    var data = event.data;

    // Function to set a new cookie with a name, value, and expiration period in days
    function setCookie(name, value, days) {
        var expiresDate = new Date(Date.now() + (days * 24 * 60 * 60 * 1000));
        var expiresString = expiresDate.toUTCString();
        var cookieString = `${name}=${value}; expires=${expiresString}; SameSite=None; Secure`;
        document.cookie = cookieString;
        console.log(`Iframe Window : Cookie Added -> ${cookieString}`);
    }

    // Function to remove a cookie by setting its expiration date to a date in the past
    function removeCookie(name) {
        var expiresString = "Thu, 01 Jan 1970 00:00:00 UTC";
        var cookieString = `${name}=; expires=${expiresString}; SameSite=None; Secure`;
        document.cookie = cookieString;
        console.log(`Iframe Window : Cookie Removed`);
    }

    // Check the action specified in the received data
    if (data.action === 'setWfxCookie') {
        setCookie(data.name, data.value, 7);
    }
    else if (data.action === 'removeWfxCookie') {
        removeCookie(data.name);
    }
    else if (data.action === 'check_flow_status') {
        // Check the status of a specific cookie ("wfx_playState")
        var myCookieValue = getCookie("wfx_playState");
        if (myCookieValue) {
            // If the cookie exists, post a message with the cookie value to the top window
            window.top.postMessage({
                action: 'flow_live',
                meta: myCookieValue
            }, '*');
            console.log(`Iframe Window : Flow Active -> Cookie fetched -> ${myCookieValue}`);
        }
        else {
            console.log(`Iframe Window : Flow Inactive -> Cookie not found -> ${myCookieValue}`);
        }
    }
});
