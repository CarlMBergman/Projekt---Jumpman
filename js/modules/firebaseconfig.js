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
    highScores = [];
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
    
    sortScores()
    displayScores()

  }

  function sortScores() {
    highScores.sort((a,b) => {
      return b.score - a.score;
    })
    console.log(highScores);
  }

  async function displayScores() {


    for (let i = 0; i < highScores.length; i++) {
      if (i < 5) {
        const elem = `
          <div class="highscore">
            <p class="highscore__name">${i+1}.Name: ${highScores[i].name}</p>
            <p class="highscore__score">Score: ${highScores[i].score}</p>
          </div>
          `
      document.querySelector('#highscoreBtn').insertAdjacentHTML('beforebegin', elem);
      console.log(i);
      }
      
    } 
  }
  // async function deleteLowScores() {
  //   await deleteDoc(doc(db, 'Highscores', '2'))
  // }

  // deleteLowScores()

  async function saveHighscore(playerHighscore) {
    try {
      await addDoc(collection(db, 'Highscores'), playerHighscore)
      console.log('sparar');
    } catch (error) {
      console.log(error);
    }
  }
  export{ getScores, displayScores, saveHighscore }
