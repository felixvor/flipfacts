import string
import math
import time
import sys
import hashlib

import numpy as np
import torch
from scipy.spatial import cKDTree
import spacy
#!python -m spacy download en_core_web_sm

import en_core_web_sm
from flair.embeddings import WordEmbeddings
from flair.data import Sentence


print("Loading NLP models...")
print(">en_core_web_sm ...")
nlp = en_core_web_sm.load()
print(">fasttext ...")
fasttext_embedding = WordEmbeddings('en')
print("Done.")

class Semantic():
    def __init__(self):
        self.THE_MATRIX = np.empty((0,300))
        self.Assumption = None
        self.db = None


    def embed(self, sequence):
        doc = nlp(sequence)
        important_tokens = set()
        #noun_phrases = [chunk.text for chunk in doc.noun_chunks]
        #print("Noun Phrases", noun_phrases)
        #for np in noun_phrases:
        #    for t in np.split(" "):
        #        important_tokens.add(t)
        for t in doc:
            if t.is_stop or t.is_punct:
                continue
            if t.is_punct:
                continue
            important_tokens.add(str(t.lemma_))
        #print(" ".join(sorted(important_tokens)))
        sentence = Sentence(" ".join(sorted(important_tokens))) #dont sort doesnt matter on average
        fasttext_embedding.embed(sentence)
        avg_vec = sentence[0].embedding - sentence[0].embedding # torch.empty([100])
        for t in sentence:
            avg_vec += t.embedding
        avg_vec = avg_vec.cpu().numpy()
        avg_vec /= len(sentence)
        
        # normalize (dot product will give same result as cos_sim after normalizing)
        squared_sum = 0
        for val in avg_vec:
            squared_sum += val*val
        normed_vec = avg_vec / math.sqrt(squared_sum)

        return normed_vec

    def hash_vector(self, vec):
        # same vector -> same hash - how can this be so fucking hard?
        string = str(vec.tolist()).encode("ascii") # ugly but finally working
        mysha1 = hashlib.sha1()
        mysha1.update(string)
        hash = mysha1.hexdigest()
        return hash

    def vec2string(self, np_vector):
        return np_vector.tostring()

    def string2vec(self, string):
        return np.frombuffer(string, dtype=np.float32)

    # embed a string and look for highest cos_sim (dot product) vectors of all docs. return hashes of vectors to find documents that produced them
    def nearest_documents(self, query, num_results=5):
        if num_results < 2:
            return "num results can not be less than 2"
        query_vec = self.embed(query)
        query_results = cKDTree(self.THE_MATRIX).query(query_vec, k=num_results)

        vector_indexes = query_results[1] #can only iterate of k>1
        #print(query_results[0]) # dot products
        hashes = []
        for i, vi in enumerate(vector_indexes):
            score = 1-query_results[0][i]
            if np.isinf(score) or np.isnan(score):
                continue
            if score < 0:
                continue

            vector=self.THE_MATRIX[vi]
            hashes.append(self.hash_vector(vector))

        
        results = []
        for hash in hashes:
            assumptions = self.Assumption.query.filter_by(embedding_hash=hash).all()
            # unlikley that two assumptions produce same embedding but hey...
            for ass in assumptions:
                results.append(ass)
        return results


    def init_app(self, app):
        with app.app_context():
            from flipfacts import db
            from flipfacts.models import Assumption
            self.Assumption = Assumption
            self.db = db
            assumptions = Assumption.query.all()
            for assumption in assumptions: # TODO: skip if embedding is already set, but add embedding to matrix
                embedding=None
                if assumption.embedding_hash:
                    embedding = self.string2vec(assumption.embedding)
                else:
                    embedding = self.embed(assumption.text)
                    assumption.embedding = self.vec2string(embedding)
                    assumption.embedding_hash = self.hash_vector(embedding)
                self.THE_MATRIX = np.append(self.THE_MATRIX, [embedding], axis=0)
            db.session.commit()
