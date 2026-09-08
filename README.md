# MyTradeJournal — Trading Journal Pro

Squelette de démarrage : backend Laravel 12 (API REST) + frontend React/Vite/TypeScript/Tailwind,
basé sur le modèle de données discuté (analyses / trades séparés, contexte marché, setups multi-tags,
dashboard réel vs opportunités manquées).

## Structure

```
trading-journal-pro/
├── backend/     # API Laravel — migrations, modèles, controllers, routes
└── frontend/    # App React — pages, composants, client API
```

## Ce qui est déjà là

**Backend**
- 10 migrations : `trading_accounts`, `trading_setups`, `zone_types`, `analyses`,
  deux tables pivot (`analysis_zone_type`, `analysis_trading_setup` — multi-sélection),
  `trades`, `market_contexts`, `screenshots`, `trade_events`.
- Modèles Eloquent avec les relations (`Analysis` a un `trade` en 1-1, plusieurs `zoneTypes`
  et `tradingSetups` en many-to-many).
- `Analysis::scopeActivated()` / `scopeMissed()` pour bien séparer trades réels et opportunités
  manquées, comme demandé au point 7 du cahier des charges.
- `AnalysisController`, `TradeController`, `DashboardController` (résumé, performance par
  combinaison de setup, equity curve).

**Frontend**
- Layout (sidebar + topbar), typo Inter + IBM Plex Mono, palette sobre finance
  (vert `#1f7a53` / rouge terracotta `#b3452c`, pas de style "SaaS card kit" générique).
- `AnalysisForm` avec sélecteur multi-zone (OB, FVG, Fibo, OTE, BOS, CHoCH, Liquidity).
- Dashboard avec `StatsCards` (win rate, R net, opportunités manquées) et `EquityCurveChart`
  (Recharts).
- Client Axios + hooks API typés (`api/analyses.ts`, `api/dashboard.ts`).

## Ce qu'il reste à faire

1. **Backend** : lancer un vrai projet Laravel (`composer create-project laravel/laravel backend`)
   et copier ces fichiers dedans — ils ne remplacent pas le squelette Laravel standard
   (`app/Providers`, `bootstrap`, `config`, etc.), qui n'a pas pu être généré ici faute d'accès
   réseau à Packagist.
2. Authentification (Sanctum SPA) — les routes sont déjà protégées par `auth:sanctum`.
3. Endpoints `GET /zone-types` et `GET /trading-setups` (actuellement en dur côté frontend).
4. Upload des screenshots (Cloudinary ou Supabase Storage), formulaire d'activation du trade,
   page de détail d'une analyse.
5. `GROUP_CONCAT` dans `DashboardController::performanceBySetup` est du MySQL — à adapter en
   `STRING_AGG` si vous partez sur PostgreSQL comme recommandé.

## Démarrage rapide (une fois Laravel installé)

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```
