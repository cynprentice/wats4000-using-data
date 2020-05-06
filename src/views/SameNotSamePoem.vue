<template>
  <div class="rhymesaurus">
    <h2>Same Not Same Poem</h2>
    <form v-on:submit.prevent="writePoem">
      <p>
        Write Same Not Same Poem for
        <input type="text" v-model="subject" />
        <button type="submit">Search</button>
      </p>
    </form>
        <div class="poem">
          <h3> version 1 </h3>
      <p>{{this.poemLine1}}</p>
      <p>{{this.poemLine2}}</p>
    </div>
    <div class="poem">
      <h3> version 2</h3>
      <p> {{this.antonym1}} {{this.antonym2}} {{this.synonym1}} {{this.synonym2}} {{this.subject}}</p>
      <p>{{this.rhymeAntonym1}} {{this.rhymeAntonym2}} {{this.rhymeSynonym1}} {{this.rhymeSynonym2}} {{this.rhyme}}</p>
    </div>

    <ul v-if="errors.length > 0" class="errors">
      <!-- CYPR - get the correct key for the error array -->
      <li v-for="error of errors" :key="error.net">{{error.message}}</li>
    </ul>
  </div>
</template>

<script>
// TODO: Import axios properly here.
import axios from "axios";

export default {
  name: "SameNotSamePoem",
  data() {
    return {
      synResults: null,
      antResults: null,
      rhymeResults: null,
      errors: [],
      subject: "",
      rhyme: "right",
      synonym1: "white",
      synonym2: "light",
      antonym1: "dark",
      antonym2: "fear",
      rhymeSynonym1: "war",
      rhymeSynonym2: "brawl",
      rhymeAntonym1: "love",
      rhymeAntonym2: "care",
      poemLine1:"",
      poemLine2: ""

    };
  },

  methods: {
    findNotSameWords: function(word) {
      console.log("calling findNotSameWords with " + word)
      let poemLine = ''
    axios
       .get("https://api.datamuse.com/words", {
          params: {
            rel_ant: word,
            max: 2
          }
        })
        .then(response => {
          this.antResults = response.data;
          console.log("antResults.length is " + this.antResults.length)
          if(this.antResults && this.antResults.length >=2) {
            this.antonym1 = this.antResults[0].word;
            this.antonym2 = this.antResults[1].word;
          } 
          for (let i = 0; i<this.antResults.length; i++) {
            console.log("adding antonym " + this.antResults[i].word + " to poem")
          poemLine += this.antResults[i].word
          poemLine += ' '
             console.log ("poemLine is " + poemLine);
          }
          poemLine.concat(word)
                  console.log (" findNotSame with " + word + " returning poemLine " + poemLine);
        return poemLine
        })
        .catch(error => {
          this.errors.push(error);
        });

    },

    findSameWords: function(word) {
      console.log("called findSameWords with " + word)
      let poemLine = ''
      axios
          .get("https://api.datamuse.com/words", {
            params: {
              ml: word,
              max: 2
            }
          })
          .then(response => {
            this.synResults = response.data;
            console.log("synResults.length is " + this.synResults.length)
            if(this.synResults && this.synResults.length >=2) {
              this.synonym1 = this.synResults[0].word;
              this.synonym2 = this.synResults[1].word;
            } 
            for (let i = 0; i<this.synResults.length; i++) {
              console.log("adding synonym " + this.synResults[i].word + " to poem")
              poemLine += this.synResults[i].word 
              poemLine += ' '
          console.log ("poemLine is " + poemLine);
          } 
            poemLine += word
           console.log (" findSame with " + word + " returning poemLine " + poemLine);
          return poemLine
          })
          .catch(error => {
            this.errors.push(error);
          });

      },
      findRhyme: function(word){
       axios.get('https://api.datamuse.com/words', {
        params: {
          rel_rhy: word
        }
        })
      .then(response => {
        this.rhymeResults = response.data;
         if(this.rhymeResults && this.rhymeResults.length >=1) {
              this.rhyme = this.rhymeResults[0].word;
            } 
          })
      .catch(error => {
        this.errors.push(error);
       });
     },

      writePoem: function() {
        console.log("before calling findRhyme rhyme is: " + this.rhyme);
        /* Figure out how to use promises to ensure synonyms and antonyms and rhymes are returned before executing code? 
   
        this.poemLine1 = this.findSameWords(this.subject) + this.findNotSameWords(this.subject) + this.subject
        this.findRhyme(this.subject)
        .then((response => {
          this.poemLine2 = this.findSameWords(this.rhyme)
        }
     */
        //this.rhyme = this.findRhyme(this.subject);
        //console.log("after calling findRhyme rhyme is: " + this.rhyme);
        console.log("test: " + 
        this.findSameWords(this.subject))
        this.poemLine1 = this.findSameWords(this.subject) + this.findNotSameWords(this.subject) + this.subject
        this.poemLine2 = this.findSameWords(this.rhyme) + this.findNotSameWords(this.rhyme) + this.rhyme
        
      
      /*
        this.findSameWords(this.subject, this.poemLine1);
        console.log("write poem before findNotSameWords")
        this.findNotSameWords(this.subject, this.poemLine1);
        this.findRhyme();
        this.findSameWords(this.rhyme, this.poemLine2);
        this.findSameWords(this.rhyme, this.poemLine2);
        */
      }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rhymesaurus {
  font-size: 1.4rem;
}
input[type="text"] {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #333;
  width: 300px;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 300;
  background: rgba(0, 0, 0, 0.02);
  padding: 0.5rem;
}
button {
  background: #333;
  padding: 0.5rem;
  font-weight: 300;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
}
h1,
h2 {
  font-weight: normal;
}
ul.results {
  list-style-type: none;
  padding: 0;
}
.results li {
  display: inline-block;
  margin: 10px;
  border: solid 1px #333;
  padding: 0.5rem;
  width: 200px;
  min-height: 100px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
}
ul.errors {
  list-style-type: none;
}
.errors li {
  border: 1px solid red;
  color: red;
  padding: 0.5rem;
  margin: 10px 0;
}
a {
  color: #42b983;
}
.poem {
  border: 3px solid green;
}
</style>