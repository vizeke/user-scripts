// ==UserScript==
// @name         Whatsapp Web - Image carrosel
// @namespace    http://whatsappweb.com/imagecarrosel
// @version      0.1.0
// @description  Fast reading of the micro blog!
// @author       ViZeke
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// ==/UserScript==

( function ( $ ) {
    'use strict';

    function addGlobalStyle( css ) {
        var head, style;
        head = document.getElementsByTagName( 'head' )[ 0 ];
        if ( !head ) { return; }
        style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild( style );
    }



    //Init
    addGlobalStyle( '.media-viewer-thumbs-container { display: none; }' );
    addGlobalStyle( '.menu.menu-horizontal.media-panel-tools { display: none; }' );

    addGlobalStyle( 'div.chat.media-chat { background-color: transparent; color: white; }' );
    addGlobalStyle( 'div.chat-body { background-color: rgba(255,255,255,0.8); flex-grow: 0; padding: 8px; border-radius: 4px; }' );

    addGlobalStyle( 'div.media-panel-header { z-index: 999; background-color: transparent; }' );

    addGlobalStyle( 'div.media-content { position: absolute; width: 100%; height: 100%; padding: 0; }' );
    addGlobalStyle( 'div.media-content button.btn-media-next { display: none; }' );
    addGlobalStyle( 'div.media-content button.btn-media-prev { display: none; }' );

    addGlobalStyle( 'div.media > div.object-fit > div { position: absolute; padding: 0; }' );

})( jQuery );

//Init on global context
$( document ).ready( function () {
    var imageObserver;
    function observeImages() {
        if ( imageObserver ) {
            imageObserver.disconnect();
        }

        // select the target node
        var target = $( '#app > div > div:nth-child(2) > span' )[ 0 ];
        // create an observer instance
        imageObserver = new MutationObserver( function ( mutations ) {
            var divParent = $( 'div.media > div.object-fit > div' );
            var h = divParent.height();
            var w = divParent.width();
            var img = $( divParent.children()[ 0 ] );

            if (w / h > 1.78) {
                img.css( 'width', '100%' ).css( 'height', 'auto' );
                divParent.css( 'width', '100%' ).css( 'height', 'auto' );
            } else {
                img.css( 'height', '100%' ).css( 'width', 'auto' );
                divParent.css( 'height', '100%' ).css( 'width', 'auto' );
            }

            // observer.disconnect();
        });

        // configuration of the observer:
        var config = { childList: true, subtree: true };

        // pass in the target node, as well as the observer options
        imageObserver.observe(target, config);
    }

    var messagesObserver;
    function observeMessages() {
        if ( messagesObserver ) {
            messagesObserver.disconnect();
        }

        var target = '#main > div.pane-body.pane-chat-tile-container > div > div > div.message-list';
        messagesObserver = new MutationObserver( function ( mutations ) {

        });

        // configuration of the observer:
        var config = { childList: true };

        // pass in the target node, as well as the observer options
        messagesObserver.observe( target, config );
    }

    var timeOutNext = undefined;

    function startObservers() {
        if (timeOutNext) {
            clearTimeout(myVar);
        }

        observeImages();
        // observeMessages();

        timeOutNext = setTimeout(function () {
            nextMedia();
        }, 5000);
    }

    function nextMedia() {
        $('.btn.btn-round.btn-media-next').click();
        timeOutNext = setTimeout(nextMedia, 5000);
    }

    $( 'body' ).on( 'click', '#pane-side > div > div > div > div', startObservers );
});
