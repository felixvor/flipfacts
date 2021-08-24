import threading
from sentence_transformers import SentenceTransformer, util
import torch

import logging
fflog = logging.getLogger("fflog")

class Semantic():
    def __init__(self):
        self.lock = threading.Lock()
        
        self.document_ids = []
        # self.corpus_embeddings = torch.empty([0, 768]) #roberta
        
        self.corpus_embeddings = torch.empty([0, 384]) #minilm

        fflog.info("Loading NLP model...")
        # self.embedder = SentenceTransformer('paraphrase-distilroberta-base-v1')
        self.embedder = SentenceTransformer("paraphrase-MiniLM-L6-v2")
        fflog.info("Done.")

    def add_document(self, doc_id, text):
        embedding = self.embedder.encode(text, convert_to_tensor=True)
        embedding = embedding[None, :] # change the shape from 768 to [1, 768]

        self.lock.acquire(blocking=True, timeout=-1)
        self.corpus_embeddings = torch.cat([self.corpus_embeddings, embedding], axis=0) # tells the torch that we need to concatenate over the last dimension
        self.document_ids.append(doc_id)
        self.lock.release()

    
    def search(self, query, max_results=5, threshold=0):
        fflog.info(f"Search: {query}")

        top_k = min(max_results, len(self.corpus_embeddings))

        fflog.debug(f" > Embedding Search Query")
        query_embedding = self.embedder.encode(query, convert_to_tensor=True)

        fflog.debug(f" > Calculating Cos Scores")
        # We use cosine-similarity and torch.topk to find the highest 5 scores
        cos_scores = util.pytorch_cos_sim(query_embedding, self.corpus_embeddings)[0]
        top_results = torch.topk(cos_scores, k=top_k)

        results = []
        for score, idx in zip(top_results[0], top_results[1]):
            fflog.debug(f" > DOC:{self.document_ids[idx]} SCORE:{score}")
            if score >= threshold:
                results.append(self.document_ids[idx])
        
        return results


    def init_app(self, app):
        with app.app_context():
            from flipfacts import db
            from flipfacts.models import Assumption
            assumptions = Assumption.query.all()
            
            fflog.info("Embedding Documents from DB...")
            for assumption in assumptions: # TODO: skip if embedding is already set, but add embedding to matrix
                self.add_document(doc_id=assumption.id, text=assumption.text)
            fflog.info("Done.")


