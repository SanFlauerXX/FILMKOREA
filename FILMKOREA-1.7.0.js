/*
 * @name FILMKOREA
 * @author SanFlauerXX
 * @version 1.7.0
 * @description Южнокорейские полнометражные фильмы
 */
(function () {
    'use strict';

    if (window.filmkorea_170_ready) return;

    var NAME = 'FILMKOREA';
    var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M4 3h16v18H4zM7 6v12h10V6z"/></svg>';

    function openCatalog() {
        var items = [
            { title: 'Новинки', sort_by: 'primary_release_date.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', 'primary_release_date.gte': '2023-01-01' } },
            { title: 'Популярные фильмы', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR' } },
            { title: 'Лучшие по рейтингу', sort_by: 'vote_average.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', 'vote_count.gte': '30' } },
            { title: 'Скоро выйдут', sort_by: 'primary_release_date.asc', filter: { with_original_language: 'ko', with_origin_country: 'KR', 'primary_release_date.gte': new Date().toISOString().slice(0, 10) } },
            { title: 'Боевики', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '28' } },
            { title: 'Криминал', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '80' } },
            { title: 'Триллеры', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '53' } },
            { title: 'Ужасы', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '27' } },
            { title: 'Драмы', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '18' } },
            { title: 'Комедии', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '35' } },
            { title: 'Мелодрамы', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '10749' } },
            { title: 'Детективы', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '9648' } },
            { title: 'Фантастика', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '878' } },
            { title: 'Приключения', sort_by: 'popularity.desc', filter: { with_original_language: 'ko', with_origin_country: 'KR', with_genres: '12' } }
        ];

        Lampa.Select.show({
            title: NAME,
            items: items,
            onSelect: function (item) {
                Lampa.Select.close();
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
        });
    }

    function init() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Select || !Lampa.Menu) return;
        if (window.filmkorea_170_ready) return;

        Lampa.Menu.addButton(ICON, NAME, openCatalog);
        window.filmkorea_170_ready = true;
        console.log('[FILMKOREA] 1.7.0 initialized');
    }

    if (window.appready) init();
    else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }
})();