'use strict';
/* Lista gier na ekranie startowym. Każdy wpis = jeden kafelek, w tej kolejności.
   Nowa gra: dopisz tu wpis i dodaj do gry przycisk domku (patrz README.md).
   - url:   adres gry na jacekmoss.github.io (zawsze zaczyna się i kończy ukośnikiem)
   - icon:  obrazek kafelka (najlepiej kwadratowa ikona aplikacji gry)
   - color: kolor kafelka (tło pod ikoną)
   - name:  nazwa pod kafelkiem i czytana przez lektora */
window.GAMES = [
  { id: 'zwierzeta', url: '/tropiciel/zwierzeta/', icon: '/icons/zwierzeta.svg', color: '#2F6B45', name: 'Tropiciel Zwierząt' },
  { id: 'pod-woda',  url: '/tropiciel/pod-woda/',  icon: '/icons/pod-woda.svg',  color: '#145C86', name: 'Tropiciel Pod Wodą' },
  { id: 'rybki',     url: '/rybki/',               icon: '/rybki/icon.svg',      color: '#3B8A99', name: 'Rybki' },
  { id: 'kuchcik',   url: '/kuchcik/',             icon: '/kuchcik/icon.svg',    color: '#E8775A', name: 'Kuchcik' },
  { id: 'rysowanka', url: '/rysowanka/',           icon: '/rysowanka/icon.svg',  color: '#8A6FDF', name: 'Rysowanka' },
];
