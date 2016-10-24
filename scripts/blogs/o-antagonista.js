// ==UserScript==
// @name         O Antagonista - Speed Reading
// @namespace    http://oantagonista.com/speedread
// @version      0.6.3
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

    function procArticles($articles){
        var baseUrlPosts = 'http://www.oantagonista.com';

        $articles.each(function(i, itemPost) {
            var url = baseUrlPosts + $(itemPost).first().find('a').first().attr('href');

            $.get(url)
                .success(function(response) {

                var $content = $(response).find('div.l-main-right:first');
                $content.find('h2').remove();
                $content.find('span.post-meta').remove();
                $content.find('div.cpt-post.container-cpt').remove();
                $content.find('div.share').remove();
                $content.find('div.OUTBRAIN').remove();
                $content.find('div.l-main-right').remove();
                $content.find('script').remove();

                $(itemPost).attr('processed', 1);
                $(itemPost).find('p').remove();
                $(itemPost).find('.post-more').remove();
                $(itemPost).find('.post-summary').append($content);
            });
        });
    }

    function cleanAds(){
        $('div.banner').remove();
        $('aside').remove();
        $('ins').remove();
    }

    var procArticle = true;
    var procClean = true;

    $(document).scroll(function(){
        if (procArticle){
            setTimeout(function(){
                procArticles($('article.post[processed!=1]'));
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
    addGlobalStyle('div.post-summary { width: auto; }');
    addGlobalStyle('article.post.first-post { margin-top: 25px; }');

    cleanAds();
    procArticles($('article.post[processed!=1]'));

})(jQuery);

//Init on global context
$(document).ready(function(){
    //specific site function in case of overlay adds
    if (dclk_hide_overlay)
        dclk_hide_overlay();
});