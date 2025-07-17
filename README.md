# 🎞️ Movies Electron App

**Movies** is a desktop app built with **Electron + Angular** that lists movies, shows details (credits, overview, etc.), and allows you to navigate to the movie's Wikipedia page with one click.

---

## 🛠️ Prerequisites

1. Have the **API backend** running on port `3000` (e.g., [movie-api](https://github.com/viniguidotti/movie-api))  
2. Node.js (v16+)  
3. NPM or Yarn  

---

## ⚙️ Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/viniguidotti/movies.git
cd movies
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

---

## 🧩 API Setup

Make sure your API (movie-api) is running at:

```
http://localhost:3000/movies
```

It should provide endpoints like:

- `GET /movies` – list of movies  
- `GET /movies/:movieId/credits` – movie credits

If needed, update the API URL in Angular:  
`src/app/movies.service.ts`.

---

## 🚀 Running the App

### Web Mode (optional)

You can run it as a regular Angular app:

```bash
npm start
```

Then access: `http://localhost:4200`

### With Electron (recommended – desktop mode)

1. Build Angular and start Electron:

```bash
npm run electron:build
npm run electron:start
```

or use a combined script if available:

```bash
npm run electron
```

---

## 🎯 Features

- 📦 Movie listing (integrated with `Response.results`)
- 🔍 Real-time search field
- 🎬 Detail page with credits
- 🌐 Button to open Wikipedia via `shell.openExternal`
- 💾 Selected movie saved via `localStorage`
- ✅ Unit testing with **Jest**

---

## 📦 Project Structure

```
/movie-api           ← Required API (clone separately)
/movies              ← Electron + Angular App
├─ src/
│   ├─ app/
│   │   ├─ movies/         ← Movie list component
│   │   ├─ movie-details/  ← Movie details screen
│   │   └─ services/       ← WikipediaService, etc.
│   └─ assets/
├─ angular.json
├─ main.js               ← Electron main process
├─ preload.js            ← Secure window.electronAPI
├─ package.json
└─ jest.config.js        ← Jest test config
```

---

## ✅ Testing

To run Jest tests and generate coverage reports:

```bash
npm test              # run all tests
npm run test:coverage # generate report in coverage/
```

Open `coverage/lcov-report/index.html` in your browser for details.

---

## 🧑‍💻 Tips and Improvements

- Add pagination to movie list
- Handle notifications and error states  
- Update URLs for production (live API, Electron build)
- Add theming/styling with Material or custom CSS

---

## 🤝 Contributions

Contributions are welcome! Fork, improve, and send a PR.  
Keep your `movie-api` running in parallel for full functionality.

---

## 👨‍🏫 Credits

Developed by Vinícius Guidotti and open-source community.  
**Backend/API**: [movie-api](https://github.com/viniguidotti/movie-api)

---

### Welcome aboard! 🛥️