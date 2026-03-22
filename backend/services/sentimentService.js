const natural = require("natural");
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

function analyzeSentiment(text) {
  const tokens = tokenizer.tokenize(text);
  const rawScore = analyzer.getSentiment(tokens); // Ranges -1 to 1

  // ✅ Scale -1...1 to 1...10
  const scaledScore = ((rawScore + 1) / 2) * 9 + 1;

  let sentiment = "neutral";
  if (rawScore > 0.2) sentiment = "positive";
  if (rawScore < -0.2) sentiment = "negative";

  return {
    sentiment,
    score: parseFloat(scaledScore.toFixed(2)) 
  };
}

module.exports = analyzeSentiment;