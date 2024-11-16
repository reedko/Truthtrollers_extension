import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("Matt Gaetz thinks El Salvador's prison policies are a model for the US.")
print([(ent.text, ent.label_) for ent in doc.ents])