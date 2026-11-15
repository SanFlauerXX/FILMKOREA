/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.4.0
 * @description Каталог южнокорейских полнометражных фильмов для Lampa.
 */
(function () {
    'use strict';

    if (window.filmkorea_140_ready) return;

    var NAME = 'FILMKOREA';
    var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function dateString(date) {
        var y = date.getFullYear();
        var m = ('0' + (date.getMonth() + 1)).slice(-2);
        var d = ('0' + date.getDate()).slice(-2);
        return y + '-' + m + '-' + d;
    }

    function shiftDate(days) {
        var d = new Date();
        d.setDate(d.getDate() + days);
        return dateString(d);
    }

    function categories() {
        var today = shiftDate(0);
        var korea = {
            with_original_language: 'ko',
            with_origin_country: 'KR'
        };

        function make(title, sort, extra) {
            return {
                title: title,
                media_type: 'movie',
                sort_by: sort || 'popularity.desc',
                filter: Object.assign({}, korea, extra || {})
            };
        }

        return [
            make('Новинки', 'primary_release_date.desc', {
                'primary_release_date.gte': shiftDate(-730),
                'primary_release_date.lte': today,
                include_adult: false,
                'vote_count.gte': 3
            }),
            make('Популярные фильмы', 'popularity.desc', {
                include_adult: false,
                'vote_count.gte': 5
            }),
            make('Лучшие по рейтингу', 'vote_average.desc', {
                include_adult: false,
                'vote_count.gte': 30
            }),
            make('Скоро выйдут', 'primary_release_date.asc', {
                'primary_release_date.gte': today,
                'primary_release_date.lte': shiftDate(730),
                include_adult: false
            }),
            make('Боевики', 'popularity.desc', { with_genres: '28' }),
            make('Криминал', 'popularity.desc', { with_genres: '80' }),
            make('Триллеры', 'popularity.desc', { with_genres: '53' }),
            make('Ужасы', 'popularity.desc', { with_genres: '27' }),
            make('Драмы', 'popularity.desc', { with_genres: '18' }),
            make('Комедии', 'popularity.desc', { with_genres: '35' }),
            make('Мелодрамы', 'popularity.desc', { with_genres: '10749' }),
            make('Детективы', 'popularity.desc', { with_genres: '9648' }),
            make('Фантастика', 'popularity.desc', { with_genres: '878' }),
            make('Приключения', 'popularity.desc', { with_genres: '12' })
        ];
    }

    function openCategory(item) {
        Lampa.Activity.push({
            url: 'discover/movie',
            title: NAME + ' — ' + item.title,
            component: 'category_full',
            source: 'tmdb',
            page: 1,
            sort_by: item.sort_by,
            filter: item.filter
        });
    }

    function openCatalog() {
        Lampa.Select.show({
            title: NAME + ' — Южная Корея',
            items: categories(),
            onSelect: function (item) {
                Lampa.Select.close();
                openCategory(item);
            }
        });
    }

    function addMenuItem() {
        var list = $('.menu .menu__list').eq(0);
        if (!list.length) return false;
        if ($('.filmkorea-menu-item').length) return true;

        var button = $('<li class="menu__item selector filmkorea-menu-item"><div class="menu__ico">' +
            ICON + '</div><div class="menu__text"></div></li>');
        button.find('.menu__text').text(NAME);
        button.on('hover:enter', openCatalog);
        list.append(button);
        return true;
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select || typeof window.$ !== 'function') return false;
        if (window.filmkorea_140_ready) return true;

        if (addMenuItem()) {
            window.filmkorea_140_ready = true;
            console.log('[FILMKOREA] initialized 1.4.0');
            return true;
        }
        return false;
    }

    function start() {
        if (init()) return;

        // Меню Lampa может появиться чуть позже события готовности приложения.
        var attempts = 0;
        var timer = window.setInterval(function () {
            attempts++;
            if (init() || attempts >= 40) window.clearInterval(timer);
        }, 250);
    }

    if (window.appready) start();

    if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') start();
        });
    }
})();
