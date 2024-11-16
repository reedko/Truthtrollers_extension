from flask import Flask, request, jsonify
from flask_cors import CORS
import gensim
from gensim import corpora
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
from flask import request
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

from services.removeNames import remove_person_names  # Import your function



app = Flask(__name__)
CORS(app)

@app.before_request
def log_request_info():
    app.logger.info("Request Headers: %s", request.headers)
    app.logger.info("Request Body: %s", request.get_data(as_text=True))
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error("An error occurred: %s", str(e))
    return jsonify({"error": "An internal error occurred"}), 500
# Sample stopwords
stop_words = set(stopwords.words('english') + list(string.punctuation))

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    # Get content from the request
    contentWithNames = request.json.get('content')
    content=remove_person_names(contentWithNames)




    if not content:
        return jsonify({"error": "No content provided"}), 400

    # Tokenizing and cleaning the text
    tokens = word_tokenize(content.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

    # Create a dictionary and a corpus for LDA
    dictionary = corpora.Dictionary([tokens])
    corpus = [dictionary.doc2bow(tokens)]

  # Apply LDA model
    lda_model = gensim.models.LdaMulticore(corpus, num_topics=5, id2word=dictionary, passes=15)
    topics = lda_model.print_topics(num_words=3)

    # Parse probabilities and words from the topics
    word_probabilities = {}
    for topic in topics:
        topic_details = topic[1].split('+')  # Split into components like '0.500*"word"'
        for detail in topic_details:
            weight, word = detail.split('*')
            word = word.strip().strip('"')  # Extract word
            weight = float(weight.strip())  # Convert weight to float
            if word not in word_probabilities or word_probabilities[word] < weight:
                word_probabilities[word] = weight  # Update with max weight
        print(topic)
    # Sort words by probabilities (highest first)
    sorted_words = sorted(word_probabilities.items(), key=lambda x: x[1], reverse=True)

    # Extract topic and subtopic
    topic = sorted_words[0][0] if len(sorted_words) > 0 else None  # Highest-probability word
    subtopic = sorted_words[1][0] if len(sorted_words) > 1 else None  # Second-highest-probability word

    # Return the extracted topic and subtopic
    return jsonify({"topic": topic, "subtopic": subtopic})
if __name__ == '__main__':
    app.run(debug=True)
