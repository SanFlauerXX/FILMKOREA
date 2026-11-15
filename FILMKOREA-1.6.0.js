/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.6.0
 * @description Отдельный каталог южнокорейских полнометражных фильмов для Lampa.
 */
(function () {
    'use strict';

    if (window.filmkorea_160_ready) return;

    var PLUGIN_NAME = 'FILMKOREA';
    var SETTINGS_COMPONENT = 'filmkorea';
    var SETTINGS_BUTTON = 'filmkorea_open_catalog';
    var MENU_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function dateString(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    function categories() {
        var today = new Date();
        var from = new Date();
        from.setFullYear(from.getFullYear() - 3);

        var korea = {
            with_original_language: 'ko',
            with_origin_country: 'KR'
        };

        return [
            {
                title: 'Новинки',
                media_type: 'movie',
                sort_by: 'primary_release_date.desc',
                filter: Object.assign({}, korea, {
                    'primary_release_date.gte': dateString(from),
                    'primary_release_date.lte': dateString(today),
                    include_adult: false
                })
            },
            {
                title: 'Популярные фильмы',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea)
            },
            {
                title: 'Лучшие по рейтингу',
                media_type: 'movie',
                sort_by: 'vote_average.desc',
                filter: Object.assign({}, korea, {
                    'vote_count.gte': '30'
                })
            },
            {
                title: 'Скоро выйдут',
                media_type: 'movie',
                sort_by: 'primary_release_date.asc',
                filter: Object.assign({}, korea, {
                    'primary_release_date.gte': dateString(today)
                })
            },
            {
                title: 'Боевики',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '28' })
            },
            {
                title: 'Криминал',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '80' })
            },
            {
                title: 'Триллеры',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '53' })
            },
            {
                title: 'Ужасы',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '27' })
            },
            {
                title: 'Драмы',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '18' })
            },
            {
                title: 'Комедии',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '35' })
            },
            {
                title: 'Мелодрамы',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '10749' })
            },
            {
                title: 'Детективы',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '9648' })
            },
            {
                title: 'Фантастика',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '878' })
            },
            {
                title: 'Приключения',
                media_type: 'movie',
                sort_by: 'popularity.desc',
                filter: Object.assign({}, korea, { with_genres: '12' })
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
            url: 'discover/' + (category.media_type || 'movie'),
            title: PLUGIN_NAME + ' — ' + category.title,
            component: 'category_full',
            source: 'tmdb',
            page: 1,
            sort_by: category.sort_by,
            filter: category.filter
        });
    }

    function openSearch(mediaType) {
        var returnController = currentController();
        Lampa.Input.edit({
            title: 'Поиск корейского фильма',
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
                filter: {
                    with_original_language: 'ko',
                    with_origin_country: 'KR'
                }
            });
        });
    }

    function openCatalog() {
        var returnController = currentController();
        var items = categories();

        items.push({
            title: 'Поиск корейских фильмов',
            search: true,
            media_type: 'movie'
        });

        Lampa.Select.show({
            title: PLUGIN_NAME,
            items: items,
            onSelect: function (item) {
                Lampa.Select.close();
                if (item.search) openSearch(item.media_type);
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
                description: 'Южнокорейские полнометражные фильмы по жанрам'
            },
            onChange: openCatalog
        });
    }

    function registerMenu() {
        if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function') {
            Lampa.Menu.addButton(MENU_ICON, PLUGIN_NAME, openCatalog);
        } else {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length) return;
            var button = $('<li class="menu__item selector"><div class="menu__ico">' + MENU_ICON + '</div><div class="menu__text"></div></li>');
            button.find('.menu__text').text(PLUGIN_NAME);
            button.on('hover:enter', openCatalog);
            menu.append(button);
        }
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select) return false;
        if (window.filmkorea_160_ready) return true;

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
            window.filmkorea_160_ready = true;
            console.log('[FILMKOREA] plugin initialized');
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(PLUGIN_NAME + ' подключён');
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
