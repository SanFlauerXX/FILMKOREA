/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.1.0
 * @description Каталог южнокорейских полнометражных фильмов для Lampa.
 * Только южнокорейские полнометражные фильмы. Подборки обновляются из TMDB при каждом открытии каталога; даты релизов пересчитываются ежедневно.
 */
(function () {
    'use strict';

    if (window.filmkorea_110_ready) return;

    var PLUGIN_NAME = 'FILMKOREA';
    var PLUGIN_VERSION = '1.1.0';
    var SETTINGS_COMPONENT = 'filmkorea';
    var SETTINGS_BUTTON = 'filmkorea_open_catalog';
    var MENU_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function dateString(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    function dateOffset(years, days) {
        var date = new Date();
        if (years) date.setFullYear(date.getFullYear() + years);
        if (days) date.setDate(date.getDate() + days);
        return dateString(date);
    }

    function koreaFilter(extra) {
        return Object.assign({
            with_original_language: 'ko',
            with_origin_country: 'KR',
            include_adult: false
        }, extra || {});
    }

    // Все пункты используют TMDB Discover Movie: это именно полнометражные фильмы,
    // а не сериалы. Списки обновляются при каждом открытии категории.
    function categories() {
        var today = dateString(new Date());
        var twoYearsAgo = dateOffset(-2, 0);
        var nextYear = dateOffset(1, 0);

        return [
            {
                title: 'Новинки',
                sort_by: 'primary_release_date.desc',
                filter: koreaFilter({
                    'primary_release_date.gte': twoYearsAgo,
                    'primary_release_date.lte': today,
                    'vote_count.gte': 3
                })
            },
            {
                title: 'Популярные фильмы',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ 'vote_count.gte': 5 })
            },
            {
                title: 'Лучшие по рейтингу',
                sort_by: 'vote_average.desc',
                filter: koreaFilter({ 'vote_count.gte': 30 })
            },
            {
                title: 'Скоро выйдут',
                sort_by: 'primary_release_date.asc',
                filter: koreaFilter({
                    'primary_release_date.gte': today,
                    'primary_release_date.lte': nextYear
                })
            },
            {
                title: 'Боевики',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '28' })
            },
            {
                title: 'Криминал',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '80' })
            },
            {
                title: 'Триллеры',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '53' })
            },
            {
                title: 'Ужасы',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '27' })
            },
            {
                title: 'Драмы',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '18' })
            },
            {
                title: 'Комедии',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '35' })
            },
            {
                title: 'Мелодрамы',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '10749' })
            },
            {
                title: 'Детективы',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '9648' })
            },
            {
                title: 'Фантастика',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '878' })
            },
            {
                title: 'Приключения',
                sort_by: 'popularity.desc',
                filter: koreaFilter({ with_genres: '12' })
            }
        ];
    }

    function currentController() {
        try {
            var active = Lampa.Controller.enabled();
            return active && active.name ? active.name : 'content';
        } catch (error) {
            return 'content';
        }
    }

    function openCategory(category) {
        Lampa.Activity.push({
            url: 'discover/movie',
            title: PLUGIN_NAME + ' — ' + category.title,
            component: 'category_full',
            source: 'tmdb',
            page: 1,
            sort_by: category.sort_by,
            filter: category.filter
        });
    }

    function openSearch() {
        var returnController = currentController();

        Lampa.Input.edit({
            title: 'Поиск южнокорейского фильма',
            value: '',
            free: true
        }, function (query) {
            query = String(query || '').trim();

            if (!query) {
                Lampa.Controller.toggle(returnController);
                return;
            }

            Lampa.Activity.push({
                url: 'search/movie',
                title: PLUGIN_NAME + ' — ' + query,
                component: 'category_full',
                source: 'tmdb',
                page: 1,
                query: encodeURIComponent(query),
                filter: koreaFilter({})
            });
        });
    }

    function openCatalog() {
        var returnController = currentController();
        var items = categories();

        items.push({
            title: 'Поиск корейских фильмов',
            search: true
        });

        Lampa.Select.show({
            title: PLUGIN_NAME,
            items: items,
            onSelect: function (item) {
                Lampa.Select.close();
                if (item.search) openSearch();
                else openCategory(item);
            },
            onBack: function () {
                Lampa.Controller.toggle(returnController);
            }
        });
    }

    function registerSettings() {
        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: SETTINGS_COMPONENT,
            name: PLUGIN_NAME,
            icon: MENU_ICON
        });

        Lampa.SettingsApi.addParam({
            component: SETTINGS_COMPONENT,
            param: {
                name: SETTINGS_BUTTON,
                type: 'button'
            },
            field: {
                name: 'Открыть каталог',
                description: 'Южнокорейские полнометражные фильмы: новинки, популярное и жанры'
            },
            onChange: openCatalog
        });
    }

    function registerMenu() {
        if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function') {
            Lampa.Menu.addButton(MENU_ICON, PLUGIN_NAME, openCatalog);
            return;
        }

        var menu = $('.menu .menu__list').eq(0);
        if (!menu.length) return;

        if (menu.find('.filmkorea-menu-item').length) return;

        var button = $('<li class="menu__item selector filmkorea-menu-item"><div class="menu__ico">' +
            MENU_ICON + '</div><div class="menu__text"></div></li>');
        button.find('.menu__text').text(PLUGIN_NAME);
        button.on('hover:enter', openCatalog);
        menu.append(button);
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select) return false;
        if (window.filmkorea_110_ready) return true;

        var initialized = false;

        try {
            registerSettings();
            initialized = true;
        } catch (settingsError) {
            console.error('[FILMKOREA] settings registration error', settingsError);
        }

        try {
            registerMenu();
            initialized = true;
        } catch (menuError) {
            console.error('[FILMKOREA] menu registration error', menuError);
        }

        if (initialized) {
            window.filmkorea_110_ready = true;
            console.log('[FILMKOREA] plugin initialized, version ' + PLUGIN_VERSION);
            if (Lampa.Noty && Lampa.Noty.show) {
                Lampa.Noty.show(PLUGIN_NAME + ' подключён');
            }
            return true;
        }

        return false;
    }

    if (window.appready) init();

    if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }
})();