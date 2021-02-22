import string
import math
import time
import sys
import hashlib
import base64

import numpy as np
import torch
from scipy.spatial import cKDTree
import spacy
#!python -m spacy download en_core_web_sm

import en_core_web_sm
from flair.embeddings import WordEmbeddings
from flair.data import Sentence

import logging
fflog = logging.getLogger("fflog")


fflog.info("Loading NLP models...")
fflog.info(">en_core_web_sm ...")
nlp = en_core_web_sm.load()
fflog.info(">fasttext ...")
fasttext_embedding = WordEmbeddings('en')
fflog.info("Done.")

class Semantic():
    def __init__(self):
        self.THE_MATRIX = np.empty((0,300))
        self.Assumption = None
        self.db = None


    def embed(self, sequence):
        doc = nlp(sequence)
        important_tokens = set()
        #noun_phrases = [chunk.text for chunk in doc.noun_chunks]
        #fflog.info("Noun Phrases", noun_phrases)
        #for np in noun_phrases:
        #    for t in np.split(" "):
        #        important_tokens.add(t)
        for t in doc:
            if t.is_stop or t.is_punct:
                continue
            if t.is_punct:
                continue
            important_tokens.add(str(t.lemma_))

        if len(important_tokens) <= 0:
            return None

        #fflog.info(" ".join(sorted(important_tokens)))
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
        str_repr = np_vector.tostring()
        return base64.b64encode(str_repr)

    def string2vec(self, string):
        str_repr = base64.b64decode(string)
        return np.frombuffer(str_repr, dtype=np.float32)

    # embed a string and look for highest cos_sim (dot product) vectors of all docs. return hashes of vectors to find documents that produced them
    def nearest_documents(self, query, num_results=5):
        if num_results < 2:
            return "num results can not be less than 2"
        query_vec = self.embed(query)
        if query_vec is None:
            return []
        
        query_results = cKDTree(self.THE_MATRIX).query(query_vec, k=num_results)

        vector_indexes = query_results[1] #can only iterate of k>1
        #fflog.info(query_results[0]) # dot products
        hashes = []
        for i, vi in enumerate(vector_indexes):
            score = 1-query_results[0][i]
            if np.isinf(score) or np.isnan(score):
                continue
            if score < -0.8:
                continue

            vector=self.THE_MATRIX[vi]
            vector_hash = self.hash_vector(vector)
            if vector_hash not in hashes:
                hashes.append(vector_hash)

        results = []
        for hash in hashes:
            assumptions = self.Assumption.query.filter_by(embedding_hash=hash).all()
            # unlikley that two assumptions produce same embedding but hey...
            # ok if they do then they will also be found multiple times they might duplicate here...
            # but i cant just skip i need to get every post once...
            # so find all docs for any hash, but dont look for the same hash twice (adding if vector_hash not in hashes: above)
            for ass in assumptions:
                results.append(ass)
        return results

    def update_vector_matrix(self, assumption_id):
        assumption = self.Assumption.query.filter_by(id=assumption_id).first()
        embedding = self.embed(assumption.text)
        assumption.embedding = self.vec2string(embedding)
        assumption.embedding_hash = self.hash_vector(embedding)
        self.db.session.commit()
        print(self.THE_MATRIX.shape)
        self.THE_MATRIX = np.append(self.THE_MATRIX, [embedding], axis=0)
        print(self.THE_MATRIX.shape)


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
        fflog.info("Initialized Embeddings")
