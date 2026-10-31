# Moje gry

Ekran wyboru gier dla dziecka: https://jacekmoss.github.io/

Kafelki prowadzą do gier, a każda gra żyje w swoim własnym repo i pod swoim adresem:

| Kafelek | Adres | Repo |
|---|---|---|
| Tropiciel Zwierząt | `/tropiciel/zwierzeta/` | jacekmoss/tropiciel |
| Tropiciel Pod Wodą | `/tropiciel/pod-woda/` | jacekmoss/tropiciel |
| Rybki | `/rybki/` | jacekmoss/rybki |
| Kuchcik | `/kuchcik/` | jacekmoss/kuchcik |
| Rysowanka | `/rysowanka/` | jacekmoss/rysowanka |

To repo nazywa się `jacekmoss.github.io`, więc GitHub Pages publikuje je pod samym `https://jacekmoss.github.io/`.
Manifest ma `scope: "/"`, więc zainstalowana na telefonie aplikacja „Moje gry” obejmuje wszystkie gry:
przechodzenie między ekranem wyboru a grami nie otwiera paska przeglądarki.

## Pliki

- `games.js` – lista kafelków (jedyne miejsce, które zmienia się przy nowej grze)
- `home.js` – przycisk domku dołączany do każdej gry
- `index.html` – ekran z kafelkami; w tle zapisuje w pamięci urządzenia pliki wszystkich gier (raz na 12 h), żeby działały offline
- `sw.js` – działanie bez internetu dla samego ekranu wyboru
- `icons/` – obrazki kafelków dla gier, które nie mają własnej ikony (dwie gry Tropiciela)

## Nowa gra = nowy kafelek

1. Gra w osobnym repo `jacekmoss/<nazwa>` z włączonym GitHub Pages (jak dotąd).
2. W `games.js` dopisz wpis:
   ```js
   { id: 'nazwa', url: '/nazwa/', icon: '/nazwa/icon.svg', color: '#RRGGBB', name: 'Nazwa' },
   ```
3. W `index.html` gry, przed `</body>`, dodaj domek:
   ```html
   <!-- domek: powrót do wyboru gier (https://jacekmoss.github.io/), widoczny tylko w menu gry -->
   <script>window.gryHomeVisible = () => !window.__nazwa || window.__nazwa.S.scene === 'title';</script>
   <script src="/home.js" data-corner="tl" defer></script>
   ```
   `gryHomeVisible` mówi, kiedy domek ma być widać (zwykle tylko na ekranie startowym/mapie gry,
   żeby nie zasłaniał niczego w trakcie gry). Bez tej linijki domek jest widoczny cały czas.
   `data-corner`: `tl`, `tr`, `bl`, `br` albo `tc`.
4. Klucze w `localStorage`/IndexedDB poprzedzaj nazwą gry (np. `nazwa-postep`) – wszystkie gry są pod tym samym adresem i dzielą pamięć.

Domek trzeba przytrzymać ok. 0,6 s (wypełnia się kółko), żeby maluch nie wychodził z gry przypadkiem.

## Test lokalnie

Ekran i gry muszą być pod jednym serwerem, tak jak na GitHub Pages: zrób folder z tym repo
i dowiązaniami (junction) do folderów gier, np. `mklink /J rybki ..\rybki`, i uruchom
`python -m http.server` w tym folderze.
