from flask import Flask, request, jsonify
import gensim
from gensim import corpora
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

app = Flask(__name__)

# Sample stopwords
stop_words = set(stopwords.words('english') + list(string.punctuation))

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    # Get content from the request
    content = request.json.get('content')
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

    # Return the topics as response
    return jsonify({"topics": topics})

if __name__ == '__main__':
    app.run(debug=True)
