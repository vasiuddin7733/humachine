from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from itertools import count

from app.schemas.product import IngestionRun, IngestionStatus, IngestionStep


def _utcnow() -> datetime:
    return datetime.now(UTC)


@dataclass
class StatusTracker:
    """Tracks per-service status for each product ingestion run."""

    _id_sequence: count = field(default_factory=lambda: count(1))
    _runs: dict[int, IngestionRun] = field(default_factory=dict)

    def start_run(self, product_id: int, services: list[str]) -> IngestionRun:
        run_id = next(self._id_sequence)
        now = _utcnow()
        run = IngestionRun(
            id=run_id,
            product_id=product_id,
            status=IngestionStatus.queued,
            steps=[
                IngestionStep(
                    service=service,
                    status=IngestionStatus.queued,
                    detail="Queued for dispatch",
                    updated_at=now,
                )
                for service in services
            ],
            created_at=now,
            updated_at=now,
        )
        self._runs[run_id] = run
        return run

    def mark_running(self, run_id: int, service: str) -> IngestionRun:
        return self._update_step(run_id, service, IngestionStatus.running, "Dispatching request")

    def mark_completed(
        self,
        run_id: int,
        service: str,
        detail: str,
        payload: dict | None = None,
    ) -> IngestionRun:
        return self._update_step(run_id, service, IngestionStatus.completed, detail, payload)

    def mark_failed(
        self,
        run_id: int,
        service: str,
        detail: str,
        payload: dict | None = None,
    ) -> IngestionRun:
        return self._update_step(run_id, service, IngestionStatus.failed, detail, payload)

    def get_run(self, run_id: int) -> IngestionRun | None:
        return self._runs.get(run_id)

    def list_runs(self) -> list[IngestionRun]:
        return list(self._runs.values())

    def _update_step(
        self,
        run_id: int,
        service: str,
        status: IngestionStatus,
        detail: str,
        payload: dict | None = None,
    ) -> IngestionRun:
        run = self._runs.get(run_id)
        if run is None:
            raise KeyError(f"Ingestion run {run_id} not found.")

        now = _utcnow()
        steps = []
        for step in run.steps:
            if step.service == service:
                steps.append(
                    step.model_copy(
                        update={
                            "status": status,
                            "detail": detail,
                            "payload": payload,
                            "updated_at": now,
                        }
                    )
                )
            else:
                steps.append(step)

        overall = self._overall_status(steps)
        updated = run.model_copy(update={"steps": steps, "status": overall, "updated_at": now})
        self._runs[run_id] = updated
        return updated

    def _overall_status(self, steps: list[IngestionStep]) -> IngestionStatus:
        statuses = {step.status for step in steps}
        if IngestionStatus.failed in statuses:
            return IngestionStatus.failed
        if statuses == {IngestionStatus.completed}:
            return IngestionStatus.completed
        if IngestionStatus.running in statuses:
            return IngestionStatus.running
        return IngestionStatus.queued


status_tracker = StatusTracker()
