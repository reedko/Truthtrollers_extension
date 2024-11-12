from flask import Flask, request, jsonify
import gensim
from gensim import corpora
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

app = Flask(__name__)

# Sample stopwords
stop_words = set(stopwords.words('english') + list(string.punctuation))

@app.route('/analyze', methods=['POST'])
def analyze_text():
    content = request.json.get('content')
    
    # Tokenizing and cleaning the text
    tokens = word_tokenize(content.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    
    # Create a dictionary and a corpus for LDA
    dictionary = corpora.Dictionary([tokens])
    corpus = [dictionary.doc2bow(tokens)]
    
    # Apply LDA model
    lda_model = gensim.models.LdaMulticore(corpus, num_topics=3, id2word=dictionary, passes=15)
    topics = lda_model.print_topics(num_words=3)
    
    # Extract the most likely topic
    main_topic = topics[0][1]  # Take the first topic as the main topic
    
    return jsonify({"topic": main_topic, "topics": topics})

if __name__ == '__main__':
    app.run(debug=True)
