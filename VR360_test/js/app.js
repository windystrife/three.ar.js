/*jslint browser: true */
/*global VR, Hls, alert */

"use strict";

// define globals
var hls,
    video,
    stream_url,
    player_ready;

if (!Hls.isSupported()) {
    alert("HLS Streaming Video requires browsers supporting MediaSource Extensions. Please use a modern browser like Google Chrome.");

} else {
    hls = new Hls();
}

function validateUrl(value) {
    return /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

function loadScript(url, callback) {
    // Adding the script tag to the head
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = url;

    // bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function load_player() {
    video = VR.video({
        // stereo: 'horizontal',
        stereo: false,
        sphere: true,
    });

    // VR.zeroSensor()

    video.on('error', function (evt) {
        console.log('video error', evt);
    });

    video.on('play', function (evt) {
        console.log('video play', evt);
        video.muted - false;
    });

    video.on('pause', function (evt) {
        console.log('video play', evt);
    });

    // shake to pause/play the video
    VR.on('shake', function () {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    /*** hls ***/

    if (Hls.isSupported()) {
        hls = new Hls();
        hls.attachMedia(video.element);

        hls.on(Hls.Events.MANIFEST_PARSED, function (e) {
            video.element.play();
        });

        hls.on(Hls.Events.ERROR, function (e) {
            console.log("HLS Error", e);
            // alert("Error " + e.data.details);
        });

        // load the stream
        hls.loadSource(stream_url);

        player_ready = true;
    }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function onKeyPress(e) {
    console.log("onSubmit", e);

    var key = e.which || e.keyCode,
        url,
        container;

    if (key === 13 && e.target === document.getElementById("hls_url")) {  // enter

        url = e.target.value.trim();
        //url = "https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8";

        if (validateUrl(url) && endsWith(url, '.m3u8')) {

            stream_url = url;

            // remove the container div
            container = document.getElementById('main');
            container.parentNode.removeChild(container);

            // load the vr player
            loadScript("js/vr.js", load_player);

        } else if (url) {
            alert("Unrecognised url, please make sure it is a valid HLS .m3u8 stream.");
        }

    } else if (key === 32 && player_ready) {  // space
        if (video.element.paused) {
            video.element.play();
        } else {
            video.element.pause();
        }

        // } else {
        //     console.log("keyPress", e.keyCode);
    }
}

function init() {
    console.log("init");
    document.body.addEventListener("keypress", onKeyPress);
}
