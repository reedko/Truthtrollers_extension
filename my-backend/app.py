from flask import Flask, request, jsonify
from flask_cors import CORS
import gensim
from gensim import corpora
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string
from flask import request



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
    content = request.json.get('content')
    import spacy
nlp = spacy.load("en_core_web_sm")

text = "Matt Gaetz spoke about El Salvador prisons."
doc = nlp(text)
processed_text = " ".join([token.text if token.ent_type_ != "PERSON" else "[PERSON]" for token in doc])
print(processed_text)

    if not content:
        return jsonify({"error": "No content provided"}), 400

    # Tokenizing and cleaning the text
    tokens = word_tokenize(content.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]

    # Create a dictionary and a corpus for LDA
    dictionary = corpora.Dictionary([tokens])
    corpus = [dictionary.doc2bow(tokens)]

    # Apply LDA model
    lda_model = gensim.models.LdaMulticore(corpus, num_topics=3, id2word=dictionary, passes=15)
    topics = lda_model.print_topics(num_words=3)


    # Extract the highest-probability and second-highest-probability words
    topic_descriptions = []
    for topic in topics:
        topic_words = topic[1]  # Get the string like '0.500*"test" + 0.500*"content"'
        words = [
            word.split('*')[1].strip().strip('"') for word in topic_words.split('+')
        ]  # Extract words only
        topic_descriptions.append(words)  # Add list of words for each topic

    # Pick the first topic's top two words
    if topic_descriptions:
        main_topic_words = topic_descriptions[0]  # First topic's word list
        topic = main_topic_words[0] if len(main_topic_words) > 0 else None
        subtopic = main_topic_words[1] if len(main_topic_words) > 1 else None
    else:
        topic, subtopic = None, None

    # Return the extracted topic and subtopic
    return jsonify({"topic": topic, "subtopic": subtopic})

if __name__ == '__main__':
    app.run(debug=True)
