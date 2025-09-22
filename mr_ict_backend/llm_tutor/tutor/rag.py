import json
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from cacheout import Cache

cache = Cache()

import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CURRICULUM_DIR = os.path.join(BASE_DIR, "data", "curriculum")
INDEX_PATH = os.path.join(BASE_DIR, "data", "vectors", "curriculum_index.faiss")
METADATA_PATH = os.path.join(BASE_DIR, "data", "vectors", "curriculum_metadata.json")

class RAGRetriever:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = faiss.read_index(INDEX_PATH)
        with open(METADATA_PATH, 'r', encoding='utf-8') as f:
            self.metadata = json.load(f)

    def retrieve(self, query, k=2):
        cache_key = f"rag_{query[:50]}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        query_embedding = self.model.encode([query])[0]
        distances, indices = self.index.search(np.array([query_embedding]), k)

        results = [self.metadata[i] for i in indices[0]]
        documents = []

        for meta in results:
            lesson_path = os.path.join(CURRICULUM_DIR, f"{meta['lesson_id']}.json")
            with open(lesson_path, 'r', encoding='utf-8') as f:
                lesson = json.load(f)
                if meta['step_number'] is None:
                    documents.append(lesson['general_notes'])
                else:
                    step = next(s for s in lesson['steps'] if s['step_number'] == meta['step_number'])
                    documents.append(f"{step['description']} {step.get('expected_code', '')} {step.get('notes', '')}")

        cache.set(cache_key, documents, ttl=3600)
        return documents
