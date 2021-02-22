
from whoosh.fields import Schema, TEXT, ID
from whoosh.analysis import StemmingAnalyzer

import os, os.path
from whoosh import index

from whoosh.qparser import MultifieldParser

import logging
fflog = logging.getLogger("fflog")

 # Define Schema
schema = Schema(    
                    assumption_id=ID(stored=True, unique=True), #stored = will be part of search result, #unique to replace on document_update
                    user_id=ID(stored=True),
                    assumption=TEXT(analyzer=StemmingAnalyzer(), field_boost=3.0),
                    sources=TEXT(analyzer=StemmingAnalyzer())
                )

class Index():
    def __init__(self):
        # Init index
        if not os.path.exists("search_index"):
            os.mkdir("search_index")
        self.ix = index.create_in("search_index", schema) #will overwrite and recreate old index
        self.Assumption = None  

    # load latest sources and the title and stuff from db and update index
    def update_search_index(self, assumption_id):
        assumption = self.Assumption.query.filter_by(id=assumption_id).first()
        if assumption is None:
            fflog.warning("Assumption to update search index with not found")
            return

        fflog.info(f"Updating Index with Assumption {assumption_id}...")
        #ix = index.open_dir("search_index")

        sources_asstring = ". ".join([s.title for s in assumption.sources])

        writer = self.ix.writer()
        writer.update_document(
            assumption_id=str(assumption.id), 
            assumption=assumption.text,
            user_id=str(assumption.author.id),
            sources=sources_asstring)
        writer.commit()
        fflog.info("Index update done.")

    def search(self, query, page=1, per_page=5):
        qp = MultifieldParser(["assumption", "sources"], schema=self.ix.schema)
        q = qp.parse(query)

        assumptions = []
        with self.ix.searcher() as s: #searcher(weighting=scoring.TF_IDF())
            results = s.search_page(q, page, pagelen=per_page)
            for res in results:
                assumption = self.Assumption.query.filter_by(id=int(res["assumption_id"])).first()
                assumptions.append(assumption)
        return assumptions

    # Index Docs
    def init_app(self, app):
        with app.app_context():
            from flipfacts import db
            from flipfacts.models import Assumption
            self.Assumption = Assumption
            self.db = db
            assumptions = Assumption.query.all()

            #ix = index.open_dir("search_index")
            writer = self.ix.writer()
            for assumption in assumptions: # TODO: skip if embedding is already set, but add embedding to matrix

                sources_asstring = ". ".join([s.title for s in assumption.sources])

                writer.update_document(
                    assumption_id=str(assumption.id), 
                    assumption=assumption.text,
                    user_id=str(assumption.author.id),
                    sources=sources_asstring)
            writer.commit()
