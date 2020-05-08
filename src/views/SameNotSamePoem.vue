<template>
  <div class="rhymesaurus">
    <h2>Poem Generator</h2>
    <form v-on:submit.prevent="writePoem">
      <p>
        Write "Same Not Same Poem" for
        <input type="text" v-model="subject" />
        <button type="submit" v-show="ready">Search</button>
      </p>
    </form>
    <div class="poem">
      <h3 class="poemTitle">{{this.subject}}</h3>
      <p>{{this.synonym1}} {{this.synonym2}} {{this.antonym1}} {{this.antonym2}} {{this.subject}}</p>
      <p>{{this.rhymeSynonym1}} {{this.rhymeSynonym2}} {{this.rhymeAntonym1}} {{this.rhymeAntonym2}} {{this.rhyme}}</p>
      <!--if no subject is provided, display instructions -->
      <p>{{this.instructions}}</p>
    </div>

    <ul v-if="errors.length > 0" class="errors">
      <li v-for="error of errors">{{error.message}}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SameNotSamePoem",
  data() {
    return {
      synResults: null,
      antResults: null,
      rhymeResults: null,
      errors: [],
      instructions: "",
      subject: "whale",
      synonym1: "hippopotamus",
      synonym2: "rhinoceros",
      antonym1: "bird", 
      antonym2: "mouse",
      rhyme: "snail",
      rhymeSynonym1: "alligator",
      rhymeSynonym2: "komodo", 
      rhymeAntonym1: "donkey",
      rhymeAntonym2: "sheep",
      ready: true
    };
  },

  methods: {
    findSameWords: function(word, line) {
     // console.log("called findSameWords with " + word + " for line " + line);
      axios
        .get("https://api.datamuse.com/words", {
          params: {
            ml: word,
            max: 2
          }
        })
        .then(response => {
          this.synResults = response.data;
          console.log("findSameWords found " + this.synResults.length + " Same Words for " + word)
          // Set value of first synonym
          if (this.synResults.length >= 1) {
            if (line == 1) {
            this.synonym2 = this.synResults[0].word
           } else {
            this.rhymeSynonym2 = this.synResults[0].word
            }
          }
          // Set value of second synonym
          if (this.synResults.length == 2) {
            if (line == 1) {
            this.synonym1 = this.synResults[1].word
           } else {
            this.rhymeSynonym1 = this.synResults[1].word
            }
          }
        })
        .catch(error => {
          this.errors.push(error);
           this.ready = true
        });
     // console.log("*******completed executing findSameWords!");
    },
    findNotSameWords: function(word, line) {
      axios
        .get("https://api.datamuse.com/words", {
          params: {
            rel_ant: word,
            max: 2
          }
        })
        .then(response => {
          this.antResults = response.data;
           console.log("findNotSameWords found " + this.antResults.length + " Not Same Words for " + word)
          // Set value of first antonym
          if (this.antResults.length >= 1) {
            if (line == 1) {
            this.antonym2 = this.antResults[0].word
           } else {
            this.rhymeAntonym2 = this.antResults[0].word
            }
          }
          // Set value of second synonym
          if (this.antResults.length == 2) {
            if (line == 1) {
            this.antonym1 = this.antResults[1].word
           } else {
            this.rhymeAntonym1 = this.antResults[1].word
            }
          }
          this.ready = true
        })
        .catch(error => {
          this.errors.push(error);
           this.ready = true
        });
      //console.log("&&&&&&&&completed executing findNotSameWords!");
    },

    findRhyme: function(word) {
      axios
        .get("https://api.datamuse.com/words", {
          params: {
            rel_rhy: word
          }
        })
        .then(response => {
          this.rhymeResults = response.data;
          console.log("findRhyme found " + this.rhymeResults.length + " rhymes for " + word)
          if (this.rhymeResults && this.rhymeResults.length >= 1) {
            this.rhyme = this.rhymeResults[0].word;
            this.findSameWords(this.rhyme, 2)
            this.findNotSameWords(this.rhyme, 2)
          } else {
            this.ready = true
          }
        })
        .catch(error => {
          this.errors.push(error);
           this.ready = true
        });
    },

    writePoem: function() {
      console.log("subject is " + this.subject)
      this.ready = false
      this.instructions = ""
      this.synonym1 = ""
      this.synonym2 = ""
      this.antonym1 = ""
      this.antonym2 = ""
      this.rhyme = ""
      this.rhymeSynonym1 = ""
      this.rhymeSynonym2 = "" 
      this.rhymeAntonym1 = ""
      this.rhymeAntonym2 = ""
      if (!this.subject) {
        this.instructions = "Please enter a subject to generate a poem"
      }
      this.findSameWords(this.subject, 1)
      this.findNotSameWords(this.subject, 1) 
      this.findRhyme(this.subject)


     
    }
  }
};
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
.poemTitle {
  text-transform: uppercase;
}
</style>