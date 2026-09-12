const fs = require('fs');
const path = require('path');

const songsPath = path.join(__dirname, 'public', 'songs.json');
let songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

const englishArtists = [
  "NF", "Yeat", "Sxmpra", "Juice WRLD", "50 Cent", "Pop Smoke", "Ruth B", "Lana Del Rey", 
  "Ed Sheeran", "Justin Beiber", "Yung Kai", "Sam Smith", "Elvis Presley", "Chris Brown", 
  "KSI", "Lady Gaga", "Bruno Mars", "Justin Timberlake", "WALK THE MOON", "Weeknd", 
  "Dua Lipa", "AURORA", "One Direction", "Franz Liszt", "Beethoven", "Vivaldi", 
  "Logic", "Sheck Wes", "Rustage", "Daddyphatsnaps", "GameboyJones", "DJ Paul", "Eminem", 
  "John Lajole", "The Neighbourhood", "Bella Poarch", "Alan Walker", "Huntrix", 
  "Brttney Spears", "Demi Lovato", "Sia", "CKay", "Gracie Abrams", "Rickey Montogomery", 
  "Arctic Monkeys", "Libianca", "Sabrina Carpenter", "Connie Francis", "Ashe", 
  "Vanna Rainelle", "Isabel LaRosa", "Charlie Puth", "Ariana Grande", "Aaron Smith", 
  "Maneskin", "Shawn Mendes", "Marino", "Bambee", "Stephanie Poetri", "Chainsmokers", 
  "Cold Play", "Taylor Swift", "Rihanna", "One Republic", "Aftermath", "Various", "RADWIMPS", "Indila", "Fujji Kaze", "ENHYPHEN", "Jiandro", "IMase", "Bolbbalgan4", "Aydilge", "Arash"
];

const hindiArtists = [
  "KK", "Atif Aslam", "Pritam", "Tanvir Evan", "Kr$na", "MC STAN", "Divine", "Harshit Saxena", 
  "Shankar Ehsaan Loy", "Vishal Dadlani", "Sonu Nigam", "Papon", "MD Rafi", "Jeet Ganguly", 
  "Anuv Jain", "Adnan Sami", "Shubh", "Tailwinder", "Karma", "Arpit Bala", "Ap Dhillon", 
  "Aditya Rikhari", "Kushagra", "Nusrat Fateh Ali Khan", "Kailash Kher", "Rahat Fateh Ali Khan", 
  "The Local Train", "Fakira", "Mohit Chauhan", "Shafqat Amanat Ali", "Pt Ajoy Chakrabarty", 
  "Sanjay Leela Bhansali", "Shaan", "Kishore Kumar", "Mukesh", "SANAM"
];

const bengaliArtists = [
  "Anupam Roy", "Hemanta Kumar", "Shilajit Majumder", "Fossils", "Baayan", "Miles", 
  "Anjan Dutta", "Shantanu Moitro", "Ankan X Afrin", "Hooliganism", "Taalpatar Shepai", 
  "Backdoor Caravan", "Popeye Bangladesh", "Porinita", "Odd Signature", "Angel Noor"
];

songs = songs.map(song => {
  if (song.language) return song; // keep existing language if any

  let lang = null;
  const artist = song.artist;
  const genre = song.genre || "";

  if (genre.includes("Bong") || genre.includes("Rabindra") || genre.includes("Bengali")) {
    lang = "Bengali";
  } else if (genre.includes("Bollywood") || genre.includes("Hindi") || genre.includes("Desi")) {
    lang = "Hindi";
  } else if (englishArtists.includes(artist)) {
    lang = "English";
  } else if (hindiArtists.includes(artist)) {
    lang = "Hindi";
  } else if (bengaliArtists.includes(artist)) {
    lang = "Bengali";
  } else if (artist === "Arijit Singh" || artist === "Shreya Ghosal") {
    // Default to Hindi for Arijit/Shreya if no genre info, since most are Hindi
    lang = "Hindi";
  }

  // If still no language, default based on genre loosely
  if (!lang) {
    if (["Pop", "Hip-Hop", "Trap", "Phonk", "Indie"].includes(genre)) {
      // Very loose heuristic for unmapped artists
      lang = "English"; 
    } else if (["Indian Classical"].includes(genre)) {
      lang = "Hindi";
    } else {
      lang = "English"; // fallback
    }
  }

  return { ...song, language: lang };
});

fs.writeFileSync(songsPath, JSON.stringify(songs, null, 2));
console.log("Updated languages in songs.json");
