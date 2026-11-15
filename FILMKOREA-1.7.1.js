/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.7.1
 * @description Южнокорейские полнометражные фильмы для Lampa
 */
(function () {
    'use strict';

    if (window.filmkorea_171_ready) return;

    var PLUGIN_NAME = 'FILMKOREA';
    var MENU_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function categories() {
        var today = new Date();
        var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        var korea = { with_original_language: 'ko', with_origin_country: 'KR' };

        return [
            { title: 'Новинки', sort_by: 'primary_release_date.desc', filter: Object.assign({}, korea, { 'primary_release_date.gte': '2023-01-01', 'primary_release_date.lte': date }) },
            { title: 'Популярные фильмы', sort_by: 'popularity.desc', filter: Object.assign({}, korea) },
            { title: 'Лучшие по рейтингу', sort_by: 'vote_average.desc', filter: Object.assign({}, korea, { 'vote_count.gte': '30' }) },
            { title: 'Скоро выйдут', sort_by: 'primary_release_date.asc', filter: Object.assign({}, korea, { 'primary_release_date.gte': date }) },
            { title: 'Боевики', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '28' }) },
            { title: 'Криминал', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '80' }) },
            { title: 'Триллеры', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '53' }) },
            { title: 'Ужасы', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '27' }) },
            { title: 'Драмы', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '18' }) },
            { title: 'Комедии', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '35' }) },
            { title: 'Мелодрамы', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '10749' }) },
            { title: 'Детективы', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '9648' }) },
            { title: 'Фантастика', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '878' }) },
            { title: 'Приключения', sort_by: 'popularity.desc', filter: Object.assign({}, korea, { with_genres: '12' }) }
        ];
    }

    function openCatalog() {
        Lampa.Select.show({
            title: PLUGIN_NAME,
            items: categories(),
            onSelect: function (item) {
                Lampa.Select.close();
                Lampa.Activity.push({
                    url: 'discover/movie',
                    title: PLUGIN_NAME + ' — ' + item.title,
                    component: 'category_full',
                    source: 'tmdb',
                    page: 1,
                    sort_by: item.sort_by,
                    filter: item.filter
                });
            }
        });
    }

    function registerMenu() {
        if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function') {
            Lampa.Menu.addButton(MENU_ICON, PLUGIN_NAME, openCatalog);
        } else {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length) return false;
            var button = $('<li class="menu__item selector"><div class="menu__ico">' + MENU_ICON + '</div><div class="menu__text"></div></li>');
            button.find('.menu__text').text(PLUGIN_NAME);
            button.on('hover:enter', openCatalog);
            menu.append(button);
        }
        return true;
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select) return false;
        if (window.filmkorea_171_ready) return true;

        try {
            if (!registerMenu()) return false;
            window.filmkorea_171_ready = true;
            console.log('[FILMKOREA] 1.7.1 initialized');
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(PLUGIN_NAME + ' подключён');
            return true;
        } catch (error) {
            console.error('[FILMKOREA] initialization error', error);
            return false;
        }
    }

    if (window.appready) init();

    // Защита от обращения к Listener до его появления.
    if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }
})();