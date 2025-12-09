"""
ml_scheduler.py
Machine Learning module to suggest the best CPU scheduling algorithm.
"""

import numpy as np
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

# Supported algorithms
ALGORITHMS = ["FCFS", "SJF", "SRJF", "Round Robin", "Priority", "RR+Priority"]

class MLScheduler:
    def __init__(self, model_type="rf"):
        self.model_type = model_type
        self.model = None

    def generate_dataset(self, n_samples=1000, n_processes_range=(3, 10)):
        """
        Generate synthetic datasets of process sets and their best algorithms.
        Returns X (features) and y (labels).
        """
        X, y = [], []
        for _ in range(n_samples):
            n_proc = random.randint(*n_processes_range)
            burst = np.random.randint(1, 20, n_proc)
            priority = np.random.randint(1, 10, n_proc)
            arrival = np.random.randint(0, 10, n_proc)
            features = [
                np.mean(burst), np.std(burst),
                np.mean(priority), np.std(priority),
                np.mean(arrival), np.std(arrival)
            ]
            # Simulate best algorithm (for demo, random or simple rules)
            if np.std(burst) < 2:
                label = "FCFS"
            elif np.mean(priority) < 5:
                label = "Priority"
            elif np.mean(arrival) > 5:
                label = "Round Robin"
            else:
                label = random.choice(ALGORITHMS)
            X.append(features)
            y.append(label)
        return np.array(X), np.array(y)

    def train(self, X=None, y=None):
        """
        Train the ML model. If X/y not provided, generate synthetic data.
        """
        if X is None or y is None:
            X, y = self.generate_dataset()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        if self.model_type == "mlp":
            self.model = MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=300)
        else:
            self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"ML Scheduler model accuracy: {acc:.2f}")
        return acc

    def save(self, path="ml_scheduler.pkl"):
        """
        Save trained model to disk.
        """
        with open(path, "wb") as f:
            pickle.dump(self.model, f)

    def load(self, path="ml_scheduler.pkl"):
        """
        Load trained model from disk.
        """
        with open(path, "rb") as f:
            self.model = pickle.load(f)

    def extract_features(self, processes):
        """
        Extract features from a list of process dicts.
        Each process: {burst, priority, arrival}
        """
        burst = [p["burst"] for p in processes]
        priority = [p["priority"] for p in processes]
        arrival = [p.get("arrival", 0) for p in processes]
        features = [
            np.mean(burst), np.std(burst),
            np.mean(priority), np.std(priority),
            np.mean(arrival), np.std(arrival)
        ]
        return np.array(features).reshape(1, -1)

    def predict(self, processes):
        """
        Predict the best algorithm for a given process list.
        """
        if self.model is None:
            self.load()
        features = self.extract_features(processes)
        return self.model.predict(features)[0]

# Usage example (for backend integration):
# ml = MLScheduler()
# ml.train()  # Train and save model
# ml.save()
# ml.load()
# result = ml.predict([{"burst": 5, "priority": 2, "arrival": 0}, ...])
# print(result)
