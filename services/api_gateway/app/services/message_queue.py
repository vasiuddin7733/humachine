from __future__ import annotations

import json
from collections import deque
from typing import Any

from app.config import settings

try:
    import redis
except ImportError:  # pragma: no cover - optional runtime dependency
    redis = None


class MessageQueue:
    """FIFO queue for ingestion commands. Memory backend is default; Redis is optional."""

    def __init__(self) -> None:
        self._memory: deque[dict[str, Any]] = deque()
        self._redis = None
        if settings.queue_backend == "redis":
            if redis is None:
                raise RuntimeError("redis package is required when API_GATEWAY_QUEUE_BACKEND=redis")
            self._redis = redis.Redis.from_url(settings.redis_url, decode_responses=True)

    def publish(self, message: dict[str, Any]) -> None:
        if self._redis is not None:
            self._redis.rpush(settings.queue_name, json.dumps(message))
            return
        self._memory.append(message)

    def consume(self) -> dict[str, Any] | None:
        if self._redis is not None:
            payload = self._redis.lpop(settings.queue_name)
            return json.loads(payload) if payload else None
        if not self._memory:
            return None
        return self._memory.popleft()

    def drain(self) -> list[dict[str, Any]]:
        messages: list[dict[str, Any]] = []
        while True:
            message = self.consume()
            if message is None:
                break
            messages.append(message)
        return messages


message_queue = MessageQueue()
