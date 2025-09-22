import json
import os
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Curriculum directory


#BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

CURRICULUM_DIR = os.path.join(BASE_DIR, "data", "curriculum")
INDEX_PATH = os.path.join(BASE_DIR, "data", "vectors", "curriculum_index.faiss")
METADATA_PATH = os.path.join(BASE_DIR, "data", "vectors", "curriculum_metadata.json")

# Collect documents
documents = []
metadata = []
for filename in os.listdir(CURRICULUM_DIR):
    if filename.endswith('.json'):
        with open(os.path.join(CURRICULUM_DIR, filename), 'r') as f:
            lesson = json.load(f)
            for step in lesson['steps']:
                text = f"{step['description']} {step.get('expected_code', '')} {step.get('notes', '')}"
                documents.append(text)
                metadata.append({
                    'lesson_id': lesson['lesson_id'],
                    'step_number': step['step_number'],
                    'description': step['description'],
                    'estimated_duration': step.get('estimated_duration', 30),
                    'assignment': step.get('assignment', False)
                })
            documents.append(lesson['general_notes'])
            metadata.append({
                'lesson_id': lesson['lesson_id'],
                'step_number': None,
                'description': 'General Notes',
                'estimated_duration': 0,
                'assignment': False
            })

# Generate embeddings
embeddings = model.encode(documents, show_progress_bar=True)

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

# Save index and metadata
faiss.write_index(index, INDEX_PATH)
with open(METADATA_PATH, 'w') as f:
    json.dump(metadata, f)