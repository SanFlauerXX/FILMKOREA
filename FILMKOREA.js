/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.3.0
 * @description Южнокорейские полнометражные фильмы для Lampa.
 */
(function () {
    'use strict';

    if (window.filmkorea_130_ready) return;

    var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function dateShift(days) {
        var d = new Date();
        d.setDate(d.getDate() + days);
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }

    function categories() {
        var today = dateShift(0);
        return [
            { title: 'Новинки', sort: 'primary_release_date.desc', votes: 3, from: dateShift(-730), to: today },
            { title: 'Популярные фильмы', sort: 'popularity.desc', votes: 5 },
            { title: 'Лучшие по рейтингу', sort: 'vote_average.desc', votes: 30 },
            { title: 'Скоро выйдут', sort: 'primary_release_date.asc', from: today, to: dateShift(730) },
            { title: 'Боевики', genre: 28 },
            { title: 'Криминал', genre: 80 },
            { title: 'Триллеры', genre: 53 },
            { title: 'Ужасы', genre: 27 },
            { title: 'Драмы', genre: 18 },
            { title: 'Комедии', genre: 35 },
            { title: 'Мелодрамы', genre: 10749 },
            { title: 'Детективы', genre: 9648 },
            { title: 'Фантастика', genre: 878 },
            { title: 'Приключения', genre: 12 }
        ];
    }

    function openCategory(item) {
        var query = [
            'with_original_language=ko',
            'with_origin_country=KR',
            'include_adult=false',
            'sort_by=' + (item.sort || 'popularity.desc')
        ];
        if (item.genre) query.push('with_genres=' + item.genre);
        if (item.votes) query.push('vote_count.gte=' + item.votes);
        if (item.from) query.push('primary_release_date.gte=' + item.from);
        if (item.to) query.push('primary_release_date.lte=' + item.to);

        Lampa.Activity.push({
            url: 'discover/movie?' + query.join('&'),
            title: 'FILMKOREA — ' + item.title,
            component: 'category_full',
            source: 'tmdb',
            page: 1
        });
    }

    function openCatalog() {
        Lampa.Select.show({
            title: 'FILMKOREA — Южная Корея',
            items: categories(),
            onSelect: function (item) {
                openCategory(item);
            }
        });
    }

    function addMenuItem() {
        var lists = $('.menu .menu__list');
        if (!lists.length || $('.filmkorea-menu-item').length) return;

        var button = $('<li class="menu__item selector filmkorea-menu-item">' +
            '<div class="menu__ico">' + ICON + '</div>' +
            '<div class="menu__text">FILMKOREA</div>' +
            '</li>');

        button.on('hover:enter', openCatalog);
        lists.eq(0).append(button);
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select || typeof window.$ !== 'function') return;

        addMenuItem();
        window.filmkorea_130_ready = true;
        console.log('[FILMKOREA] initialized 1.3.0');
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') init();
    });
})();