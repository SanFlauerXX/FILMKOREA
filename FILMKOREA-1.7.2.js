/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.7.2
 * @description Южнокорейские полнометражные фильмы для Lampa
 */
(function () {
    'use strict';

    var PLUGIN_NAME = 'FILMKOREA';
    var READY_FLAG = 'filmkorea_172_ready';
    var MENU_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';
    var retryTimer = null;
    var retryCount = 0;

    if (window[READY_FLAG]) return;

    function dateString(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    function copyFilter(base, extra) {
        var result = {};
        var key;
        for (key in base) if (Object.prototype.hasOwnProperty.call(base, key)) result[key] = base[key];
        for (key in extra) if (Object.prototype.hasOwnProperty.call(extra, key)) result[key] = extra[key];
        return result;
    }

    function categories() {
        var today = new Date();
        var date = dateString(today);
        var from = new Date();
        from.setFullYear(from.getFullYear() - 3);
        var korea = { with_original_language: 'ko', with_origin_country: 'KR' };

        return [
            { title: 'Новинки', sort_by: 'primary_release_date.desc', filter: copyFilter(korea, { 'primary_release_date.gte': dateString(from), 'primary_release_date.lte': date }) },
            { title: 'Популярные фильмы', sort_by: 'popularity.desc', filter: copyFilter(korea, {}) },
            { title: 'Лучшие по рейтингу', sort_by: 'vote_average.desc', filter: copyFilter(korea, { 'vote_count.gte': '30' }) },
            { title: 'Скоро выйдут', sort_by: 'primary_release_date.asc', filter: copyFilter(korea, { 'primary_release_date.gte': date }) },
            { title: 'Боевики', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '28' }) },
            { title: 'Криминал', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '80' }) },
            { title: 'Триллеры', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '53' }) },
            { title: 'Ужасы', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '27' }) },
            { title: 'Драмы', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '18' }) },
            { title: 'Комедии', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '35' }) },
            { title: 'Мелодрамы', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '10749' }) },
            { title: 'Детективы', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '9648' }) },
            { title: 'Фантастика', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '878' }) },
            { title: 'Приключения', sort_by: 'popularity.desc', filter: copyFilter(korea, { with_genres: '12' }) }
        ];
    }

    function openCatalog() {
        if (!window.Lampa || !Lampa.Select || !Lampa.Activity) return;
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
            },
            onBack: function () {
                if (Lampa.Controller) Lampa.Controller.toggle('menu');
            }
        });
    }

    function registerMenu() {
        if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function') {
            Lampa.Menu.addButton(MENU_ICON, PLUGIN_NAME, openCatalog);
            return true;
        }

        if (typeof window.$ === 'function') {
            var menu = $('.menu .menu__list').eq(0);
            if (menu.length) {
                if (menu.find('.filmkorea-menu-item').length) return true;
                var button = $('<li class="menu__item selector filmkorea-menu-item"><div class="menu__ico">' + MENU_ICON + '</div><div class="menu__text"></div></li>');
                button.find('.menu__text').text(PLUGIN_NAME);
                button.on('hover:enter', openCatalog);
                menu.append(button);
                return true;
            }
        }
        return false;
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select || !Lampa.Menu) return false;
        if (window[READY_FLAG]) return true;

        try {
            if (!registerMenu()) return false;
            window[READY_FLAG] = true;
            if (retryTimer) {
                window.clearInterval(retryTimer);
                retryTimer = null;
            }
            console.log('[FILMKOREA] 1.7.2 initialized');
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(PLUGIN_NAME + ' подключён');
            return true;
        } catch (error) {
            console.error('[FILMKOREA] initialization error', error);
            return false;
        }
    }

    function start() {
        if (init()) return;

        // Повторно проверяем готовность Lampa: плагин мог загрузиться раньше API меню.
        if (!retryTimer && typeof window.setInterval === 'function') {
            retryTimer = window.setInterval(function () {
                retryCount++;
                if (init() || retryCount >= 80) {
                    window.clearInterval(retryTimer);
                    retryTimer = null;
                }
            }, 250);
        }

        if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (event) {
                if (event.type === 'ready') init();
            });
        }
    }

    start();
})();
