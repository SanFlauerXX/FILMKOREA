/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.2.0
 * @description Каталог южнокорейских полнометражных фильмов для Lampa.
 */
(function () {
    'use strict';

    if (window.filmkorea_120_ready) return;

    var NAME = 'FILMKOREA';
    var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function today(offsetYears, offsetDays) {
        var d = new Date();
        if (offsetYears) d.setFullYear(d.getFullYear() + offsetYears);
        if (offsetDays) d.setDate(d.getDate() + offsetDays);
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }

    function makeUrl(item) {
        var p = [
            'with_original_language=ko',
            'with_origin_country=KR',
            'include_adult=false'
        ];
        if (item.genre) p.push('with_genres=' + item.genre);
        if (item.sort) p.push('sort_by=' + item.sort);
        if (item.minVotes) p.push('vote_count.gte=' + item.minVotes);
        if (item.from) p.push('primary_release_date.gte=' + item.from);
        if (item.to) p.push('primary_release_date.lte=' + item.to);
        return 'discover/movie?' + p.join('&');
    }

    function categories() {
        var t = today(0, 0);
        return [
            { title: 'Новинки', sort: 'primary_release_date.desc', minVotes: 3, from: today(-2, 0), to: t },
            { title: 'Популярные фильмы', sort: 'popularity.desc', minVotes: 5 },
            { title: 'Лучшие по рейтингу', sort: 'vote_average.desc', minVotes: 30 },
            { title: 'Скоро выйдут', sort: 'primary_release_date.asc', from: t, to: today(1, 0) },
            { title: 'Боевики', genre: 28, sort: 'popularity.desc' },
            { title: 'Криминал', genre: 80, sort: 'popularity.desc' },
            { title: 'Триллеры', genre: 53, sort: 'popularity.desc' },
            { title: 'Ужасы', genre: 27, sort: 'popularity.desc' },
            { title: 'Драмы', genre: 18, sort: 'popularity.desc' },
            { title: 'Комедии', genre: 35, sort: 'popularity.desc' },
            { title: 'Мелодрамы', genre: 10749, sort: 'popularity.desc' },
            { title: 'Детективы', genre: 9648, sort: 'popularity.desc' },
            { title: 'Фантастика', genre: 878, sort: 'popularity.desc' },
            { title: 'Приключения', genre: 12, sort: 'popularity.desc' }
        ];
    }

    function openItem(item) {
        Lampa.Activity.push({
            url: makeUrl(item),
            title: NAME + ' — ' + item.title,
            component: 'category_full',
            source: 'tmdb',
            page: 1
        });
    }

    function openCatalog() {
        if (!Lampa.Select || !Lampa.Select.show) {
            if (Lampa.Noty) Lampa.Noty.show('FILMKOREA: меню недоступно');
            return;
        }
        Lampa.Select.show({
            title: NAME + ' — Южная Корея',
            items: categories(),
            onSelect: function (item) {
                Lampa.Select.close();
                openItem(item);
            }
        });
    }

    function register() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select) return false;
        if (window.filmkorea_120_ready) return true;

        var added = false;

        try {
            if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function') {
                var button = Lampa.Menu.addButton(ICON, NAME, openCatalog);
                if (button && button.addClass) button.addClass('filmkorea-menu-button');
                added = true;
            }
        } catch (e) {
            console.log('[FILMKOREA] menu error', e);
        }

        try {
            if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addComponent === 'function' &&
                typeof Lampa.SettingsApi.addParam === 'function') {
                Lampa.SettingsApi.addComponent({
                    component: 'filmkorea',
                    name: NAME,
                    icon: ICON
                });
                Lampa.SettingsApi.addParam({
                    component: 'filmkorea',
                    param: { name: 'filmkorea_open', type: 'button' },
                    field: { name: 'Открыть каталог', description: 'Южнокорейские полнометражные фильмы' },
                    onChange: openCatalog
                });
                added = true;
            }
        } catch (e2) {
            console.log('[FILMKOREA] settings error', e2);
        }

        if (added) {
            window.filmkorea_120_ready = true;
            console.log('[FILMKOREA] loaded 1.2.0');
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('FILMKOREA подключён');
            return true;
        }
        return false;
    }

    if (window.appready) register();
    else if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') register();
        });
    }
})();