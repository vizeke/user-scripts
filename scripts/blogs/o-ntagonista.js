// ==UserScript==
// @name         O Antagonista - Speed Reading
// @namespace    http://oantagonista.com/speedread
// @version      0.4.0
// @description  Fast reading of the micro blog!
// @author       ViZeke
// @match        http://www.oantagonista.com/
// @match        http://www.oantagonista.com/pagina/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function normalizeUrl(url) {
        return url.endsWith('/') ? url : url + '/';
    }

    function procArticles($articles){
        var baseUrlPosts = 'http://www.oantagonista.com';

        $articles.each(function(i, itemPost) {
            var url = baseUrlPosts + $(itemPost).first().find('a.title').attr('href');

            $.ajax({
                url: normalizeUrl(url),
                "X-Requested-With": "XMLHttpRequest"
            })
                .success(function(response) {

                var $content = $(response).find('article');
                var actualContent = [];

                $content.find('h1').remove();
                $content.find('div').remove();

                $(itemPost).attr('processed', 1);
                $(itemPost).find('a.more').remove();
                $(itemPost).find('div.post-excerpt').empty().append($content);
            });
        });
    }

    function cleanAds(){
        $('div.ad-header').remove();
        $('section.sidebar').remove();
        $('ng-include[src="\'template_anuncios.html\'"]').remove();
    }

    var procArticle = true;
    var procClean = true;

    $(document).scroll(function(){
        if (procArticle){
            setTimeout(function(){
                procArticles($('div.wppost[processed!=1]'));
                procArticle = true;
            }, 1000);
        }
        if (procClean){
            setTimeout(function(){
                cleanAds();
                procClean = true;
            }, 2000);
        }
        procArticle = false;
        procClean = false;
    });

    //Init
    addGlobalStyle('main.main-left { width: auto; }');
    cleanAds();
    $(document).ready(function(){
        procArticles($('div.wppost[processed!=1]'));

        $('h1.logo a, div.logo-mobile a').click(function(e) {
            e.preventDefault();
            window.location.reload();
        });
    });

})(jQuery);

//Init on global context
/*$(document).ready(function(){
    specific site function in case of overlay adds
    if (dclk_hide_overlay)
        dclk_hide_overlay();
});*/
