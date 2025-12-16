"""
ml_scheduler.py
Smarter ML + heuristic recommender for CPU scheduling algorithms.
"""

from __future__ import annotations

import pickle
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Supported algorithms (aligned with frontend names)
ALGORITHMS = ["FCFS", "SJF", "SRJF", "RR", "Priority", "RR+Priority"]


@dataclass
class ProcessSample:
    burst: int
    priority: int
    arrival: int


def _safe_std(values: List[float]) -> float:
    return float(np.std(values)) if values else 0.0


class MLScheduler:
    """
    Provides two layers of intelligence:
    1) A heuristic scorer for immediate suggestions.
    2) A trained ML model that learns from simulated optimal choices.
    """

    def __init__(
        self,
        model_type: str = "rf",
        model_path: str = "ml_scheduler.pkl",
        time_quantum: int = 2,
    ):
        self.model_type = model_type
        self.model_path = Path(model_path)
        self.time_quantum = max(1, time_quantum)
        self.model = None

    # ---------------------------
    # Synthetic data + labeling
    # ---------------------------
    def _simulate_algorithm(self, processes: List[ProcessSample], algo: str) -> Dict[str, float]:
        """
        Rough simulation to estimate average waiting/turnaround for a process set.
        """
        procs = [
            {
                "burst": p.burst,
                "priority": p.priority,
                "arrival": p.arrival,
                "remaining": p.burst,
                "start": None,
                "finish": None,
            }
            for p in processes
        ]

        current_time = 0
        gantt: List[Tuple[int, str]] = []
        finished = 0

        def record(pid: str, duration: int):
            if duration <= 0:
                return
            start = gantt[-1][0] if gantt else current_time
            gantt.append((start + duration, pid))

        if algo == "FCFS":
            procs.sort(key=lambda p: p["arrival"])
            for p in procs:
                current_time = max(current_time, p["arrival"])
                p["start"] = current_time
                record("P", p["burst"])
                current_time += p["burst"]
                p["finish"] = current_time

        elif algo == "SJF":
            queue = procs[:]
            while queue:
                available = [p for p in queue if p["arrival"] <= current_time]
                if not available:
                    current_time = min(p["arrival"] for p in queue)
                    continue
                shortest = min(available, key=lambda p: p["burst"])
                current_time = max(current_time, shortest["arrival"])
                shortest["start"] = current_time if shortest["start"] is None else shortest["start"]
                record("P", shortest["burst"])
                current_time += shortest["burst"]
                shortest["finish"] = current_time
                queue.remove(shortest)

        elif algo == "Priority":
            queue = procs[:]
            while queue:
                available = [p for p in queue if p["arrival"] <= current_time]
                if not available:
                    current_time = min(p["arrival"] for p in queue)
                    continue
                chosen = min(available, key=lambda p: (p["priority"], p["arrival"]))
                current_time = max(current_time, chosen["arrival"])
                chosen["start"] = current_time if chosen["start"] is None else chosen["start"]
                record("P", chosen["burst"])
                current_time += chosen["burst"]
                chosen["finish"] = current_time
                queue.remove(chosen)

        elif algo == "SRJF":
            while finished < len(procs):
                available = [p for p in procs if p["arrival"] <= current_time and p["remaining"] > 0]
                if not available:
                    current_time = min(p["arrival"] for p in procs if p["remaining"] > 0)
                    continue
                shortest = min(available, key=lambda p: p["remaining"])
                if shortest["start"] is None:
                    shortest["start"] = current_time
                shortest["remaining"] -= 1
                record("P", 1)
                current_time += 1
                if shortest["remaining"] == 0:
                    shortest["finish"] = current_time
                    finished += 1

        elif algo in ("RR", "RR+Priority"):
            queue: List[Dict] = []
            procs.sort(key=lambda p: p["arrival"])
            idx = 0
            while finished < len(procs):
                while idx < len(procs) and procs[idx]["arrival"] <= current_time:
                    queue.append(procs[idx])
                    idx += 1

                if not queue:
                    if idx < len(procs):
                        current_time = max(current_time + 1, procs[idx]["arrival"])
                    continue

                if algo == "RR+Priority":
                    queue.sort(key=lambda p: (p["priority"], p["arrival"]))

                proc = queue.pop(0)
                if proc["start"] is None:
                    proc["start"] = current_time
                slice_time = min(self.time_quantum, proc["remaining"])
                record("P", slice_time)
                proc["remaining"] -= slice_time
                current_time += slice_time

                while idx < len(procs) and procs[idx]["arrival"] <= current_time:
                    queue.append(procs[idx])
                    idx += 1

                if proc["remaining"] == 0:
                    proc["finish"] = current_time
                    finished += 1
                else:
                    queue.append(proc)

        else:
            raise ValueError(f"Unknown algorithm: {algo}")

        waiting_times = []
        turnaround_times = []
        response_times = []
        for p in procs:
            start = p["start"] if p["start"] is not None else 0
            finish = p["finish"] if p["finish"] is not None else start + p["burst"]
            waiting = (finish - p["arrival"] - p["burst"])
            turnaround = finish - p["arrival"]
            response = start - p["arrival"]
            waiting_times.append(waiting)
            turnaround_times.append(turnaround)
            response_times.append(response)

        return {
            "avg_waiting": float(np.mean(waiting_times)),
            "avg_turnaround": float(np.mean(turnaround_times)),
            "avg_response": float(np.mean(response_times)),
        }

    def _label_best_algorithm(self, processes: List[ProcessSample]) -> str:
        scores = {}
        for algo in ALGORITHMS:
            metrics = self._simulate_algorithm(processes, algo)
            # Lower is better; weight turnaround slightly more than waiting.
            score = (0.6 * metrics["avg_turnaround"]) + (0.3 * metrics["avg_waiting"]) + (0.1 * metrics["avg_response"])
            scores[algo] = score
        # pick algorithm with minimal score
        return min(scores.items(), key=lambda kv: kv[1])[0]

    def generate_dataset(self, n_samples: int = 1200, n_processes_range: Tuple[int, int] = (3, 10)):
        """
        Generate synthetic datasets and label them by simulated best algorithm.
        Returns X (features) and y (labels).
        """
        rng = random.Random(42)
        X, y = [], []
        for _ in range(n_samples):
            n_proc = rng.randint(*n_processes_range)
            processes = []
            for _ in range(n_proc):
                burst = rng.randint(1, 25)
                priority = rng.randint(1, 10)
                arrival = rng.randint(0, 12)
                processes.append(ProcessSample(burst=burst, priority=priority, arrival=arrival))

            label = self._label_best_algorithm(processes)
            X.append(self.extract_features(processes))
            y.append(label)

        return np.vstack(X), np.array(y)

    # ---------------------------
    # Model lifecycle
    # ---------------------------
    def train(self, X=None, y=None):
        """
        Train the ML model. If X/y not provided, generate synthetic data.
        """
        if X is None or y is None:
            X, y = self.generate_dataset()

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=7, stratify=y)
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=None,
            random_state=7,
            n_jobs=-1,
        )
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        print(f"ML Scheduler model accuracy: {acc:.3f}")
        return acc

    def save(self, path: str | Path = None):
        """Persist trained model to disk."""
        path = Path(path) if path else self.model_path
        if self.model is None:
            raise ValueError("No model to save. Train first.")
        with open(path, "wb") as f:
            pickle.dump(self.model, f)
        return path

    def load(self, path: str | Path = None):
        """Load trained model from disk."""
        path = Path(path) if path else self.model_path
        if not path.exists():
            return False
        try:
            with open(path, "rb") as f:
                self.model = pickle.load(f)
            return True
        except Exception as exc:
            # Version mismatch or corrupted pickle; ignore and retrain.
            print(f"[MLScheduler] Failed to load cached model ({exc}). Will retrain.")
            self.model = None
            return False

    def _is_model_compatible(self, features: np.ndarray) -> bool:
        """
        Check whether the loaded model expects the same feature size.
        """
        if self.model is None:
            return False
        expected = getattr(self.model, "n_features_in_", None)
        return expected == features.shape[1]

    # ---------------------------
    # Feature extraction
    # ---------------------------
    def extract_features(self, processes: List[ProcessSample]) -> np.ndarray:
        """
        Extract numeric features from a list of process dicts/samples.
        Each process: {burst, priority, arrival}
        """
        burst = [p.burst if isinstance(p, ProcessSample) else p["burst"] for p in processes]
        priority = [p.priority if isinstance(p, ProcessSample) else p["priority"] for p in processes]
        arrival = [p.arrival if isinstance(p, ProcessSample) else p.get("arrival", 0) for p in processes]

        # Coefficient of variation captures skew/imbalance.
        burst_cv = (_safe_std(burst) / max(np.mean(burst), 1e-6)) if burst else 0.0
        priority_cv = (_safe_std(priority) / max(np.mean(priority), 1e-6)) if priority else 0.0
        arrival_cv = (_safe_std(arrival) / max(np.mean(arrival), 1e-6)) if arrival else 0.0

        features = np.array([
            len(processes),
            np.mean(burst), _safe_std(burst), burst_cv,
            np.mean(priority), _safe_std(priority), priority_cv,
            np.mean(arrival), _safe_std(arrival), arrival_cv,
            float(sum(burst)),  # workload size
        ], dtype=float)
        return features

    # ---------------------------
    # Prediction
    # ---------------------------
    def _heuristic_fallback(self, processes: List[ProcessSample]) -> Tuple[str, float]:
        """
        Rule-based fallback when model is unavailable. Returns (algorithm, confidence).
        """
        burst = [p.burst if isinstance(p, ProcessSample) else p["burst"] for p in processes]
        priority = [p.priority if isinstance(p, ProcessSample) else p["priority"] for p in processes]
        arrival = [p.arrival if isinstance(p, ProcessSample) else p.get("arrival", 0) for p in processes]

        burst_std = _safe_std(burst)
        arrival_std = _safe_std(arrival)
        priority_std = _safe_std(priority)
        avg_burst = float(np.mean(burst)) if burst else 0.0
        avg_priority = float(np.mean(priority)) if priority else 0.0
        avg_arrival = float(np.mean(arrival)) if arrival else 0.0

        # Simple interpretable rules.
        if burst_std < 1.5 and arrival_std < 1.0:
            return "FCFS", 0.55
        if arrival_std > 4.0 or avg_arrival > 6.0:
            return "RR", 0.58
        if priority_std > 2.5 and avg_priority < 6:
            return "Priority", 0.60
        if burst_std < 4.0 and avg_burst <= 6:
            return "SJF", 0.62
        if burst_std >= 6.0:
            return "SRJF", 0.60
        return "RR+Priority", 0.50

    def predict(self, processes: List[Dict]) -> str:
        """
        Predict the best algorithm for a given process list.
        """
        algo, _ = self.predict_with_confidence(processes)
        return algo

    def predict_with_confidence(self, processes: List[Dict]) -> Tuple[str, float]:
        """
        Predict the best algorithm and a confidence score.
        """
        if not processes:
            raise ValueError("No processes provided for prediction.")

        samples = [
            ProcessSample(
                burst=int(max(1, p.get("burst", p.get("burstTime", 1)))),
                priority=int(max(0, p.get("priority", 0))),
                arrival=int(max(0, p.get("arrival", p.get("arrivalTime", 0)))),
            )
            for p in processes
        ]

        # Ensure model is ready; otherwise train quickly on synthetic data.
        if self.model is None:
            loaded = self.load()
            if not loaded:
                self.train()

        features = self.extract_features(samples).reshape(1, -1)
        if not self._is_model_compatible(features):
            # Retrain if a stale model uses old feature dimensions.
            self.model = None
            self.train()

        probs = self.model.predict_proba(features)[0]
        classes = self.model.classes_
        top_idx = int(np.argmax(probs))
        predicted = classes[top_idx]
        confidence = float(probs[top_idx])
        return predicted, confidence


# Usage example (manual training):
# ml = MLScheduler()
# ml.train()          # Train on synthetic data
# ml.save()           # Save to disk (ml_scheduler.pkl)
# algo, conf = ml.predict_with_confidence([{"burst": 5, "priority": 2, "arrival": 0}])
# print(algo, conf)
