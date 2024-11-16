import spacy

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

def remove_person_names(text):
    """
    Remove all named entities labeled as 'PERSON' from the input text.
    """
    doc = nlp(text)

    # Remove tokens that are PERSON entities
    cleaned_text = " ".join(
        [token.text for token in doc if token.ent_type_ != "PERSON"]
    )

    return cleaned_text
