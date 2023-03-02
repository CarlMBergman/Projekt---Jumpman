import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyDoS4zbGtNLqRlCnhBFOgJW8dy2QQ0iR-s",
    authDomain: "jumpman-179a8.firebaseapp.com",
    projectId: "jumpman-179a8",
    storageBucket: "jumpman-179a8.appspot.com",
    messagingSenderId: "630629558919",
    appId: "1:630629558919:web:1045a061ddde55fdd1a622"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  let highScores = [];

  async function getScores() {
    const highScoresList = await getDocs(collection(db, 'Highscores'));
    console.log(highScoresList);
    highScoresList.forEach((highScore) => {
      let score = {
        name: highScore.data().name,
        score: highScore.data().score
      }
      highScores.push(score)
      console.log(highScores);
    })
  }

  async function displayScores() {
  getScores()

    highScores.forEach((score) => {
      const elem = `
      <div class="highscore">
        <h4 class="highscore__name">${score.data().name}<span class="highscore__score">${score.data().score}</span></h4>
      </div>
      `
    })
  }

  export{ getScores }
  