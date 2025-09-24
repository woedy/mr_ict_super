from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path, PurePosixPath
from typing import Dict, Iterable, List, Optional, Tuple


class CodeExecutionError(Exception):
    """Raised when execution input is invalid."""


class CodeExecutionResult(Dict[str, object]):
    """Dictionary-based result for easier JSON serialization."""

    @property
    def stdout(self) -> str:
        return self.get("stdout", "")  # type: ignore[return-value]

    @property
    def stderr(self) -> str:
        return self.get("stderr", "")  # type: ignore[return-value]


MAX_FILE_COUNT = 25
MAX_FILE_BYTES = 200_000


def _clean_relative_path(raw_name: str) -> str:
    """Ensure file names remain within the temp directory."""

    candidate = str(raw_name or "").strip()
    if not candidate:
        raise CodeExecutionError("File name cannot be empty.")

    # Normalise Windows-style separators before validation.
    candidate = candidate.replace("\\", "/")
    path = PurePosixPath(candidate)

    if path.is_absolute():
        raise CodeExecutionError("File name must be relative.")

    cleaned_parts = []
    for part in path.parts:
        if part in {"", "."}:
            continue
        if part == "..":
            raise CodeExecutionError("File name cannot traverse directories.")
        cleaned_parts.append(part)

    if not cleaned_parts:
        raise CodeExecutionError("File name must reference a valid path segment.")

    return str(PurePosixPath(*cleaned_parts))


def _normalise_files(files: Iterable[Dict[str, object]]) -> List[Dict[str, str]]:
    normalised: List[Dict[str, str]] = []
    for raw in files:
        name = raw.get("name") or raw.get("path")
        if not isinstance(name, str):
            raise CodeExecutionError("Each file requires a non-empty name.")
        safe_name = _clean_relative_path(name)
        content = raw.get("content", "")
        if not isinstance(content, str):
            raise CodeExecutionError("File content must be a string.")
        if len(content.encode("utf-8")) > MAX_FILE_BYTES:
            raise CodeExecutionError("File content exceeds the 200kB limit.")
        language = raw.get("language") or ""
        if language and not isinstance(language, str):
            raise CodeExecutionError("Language must be a string if provided.")
        normalised.append({
            "name": safe_name,
            "content": content,
            "language": language,
        })
    if not normalised:
        raise CodeExecutionError("At least one file is required for execution.")
    if len(normalised) > MAX_FILE_COUNT:
        raise CodeExecutionError("Too many files supplied for execution.")
    return normalised


def normalise_execution_files(files: Iterable[Dict[str, object]]) -> List[Dict[str, str]]:
    """Public helper for views/services to sanitise student-provided files."""

    return _normalise_files(files)


def run_python_files(
    files: Iterable[Dict[str, object]],
    entrypoint: str,
    *,
    stdin: Optional[str] = None,
    time_limit: int = 5,
    files_are_normalised: bool = False,
) -> CodeExecutionResult:
    """Execute Python files within a temporary directory."""

    normalised = list(files) if files_are_normalised else _normalise_files(files)
    entrypoint = entrypoint or "main.py"
    entrypoint = _clean_relative_path(entrypoint)

    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)
        for file in normalised:
            path = root / file["name"]
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(file["content"], encoding="utf-8")

        env = os.environ.copy()
        env["PYTHONUNBUFFERED"] = "1"
        env["PYTHONPATH"] = f"{root}{os.pathsep}{env.get('PYTHONPATH', '')}"

        command = [sys.executable, entrypoint]
        start = time.perf_counter()
        try:
            completed = subprocess.run(
                command,
                cwd=root,
                input=stdin,
                capture_output=True,
                text=True,
                timeout=time_limit,
                env=env,
            )
            duration = time.perf_counter() - start
            return CodeExecutionResult(
                stdout=completed.stdout,
                stderr=completed.stderr,
                exit_code=completed.returncode,
                timed_out=False,
                duration=duration,
            )
        except subprocess.TimeoutExpired as exc:
            duration = time.perf_counter() - start
            stdout = exc.stdout if isinstance(exc.stdout, str) else ""
            stderr = exc.stderr if isinstance(exc.stderr, str) else ""
            return CodeExecutionResult(
                stdout=stdout,
                stderr=stderr,
                exit_code=-1,
                timed_out=True,
                duration=duration,
            )


def run_test_cases(
    files: Iterable[Dict[str, object]],
    entrypoint: str,
    test_cases: Iterable[Dict[str, object]],
    *,
    time_limit: int = 5,
) -> Tuple[bool, List[Dict[str, object]]]:
    """Run the supplied files against structured test cases."""

    normalised_tests = list(test_cases)
    if not normalised_tests:
        return True, []

    results: List[Dict[str, object]] = []
    all_passed = True
    prepared_files = _normalise_files(files)

    for index, case in enumerate(normalised_tests, start=1):
        name = case.get("name") or f"case_{index}"
        stdin = case.get("stdin")
        if stdin is not None and not isinstance(stdin, str):
            raise CodeExecutionError("Test case stdin must be a string.")
        expected_output = case.get("expected_output", "")
        if not isinstance(expected_output, str):
            raise CodeExecutionError("Test case expected_output must be a string.")
        comparison = case.get("comparison", "equals")
        if comparison not in {"equals", "contains"}:
            raise CodeExecutionError("Unsupported comparison type.")
        strip_output = bool(case.get("strip_output", True))

        execution = run_python_files(
            prepared_files,
            entrypoint,
            stdin=stdin,
            time_limit=time_limit,
            files_are_normalised=True,
        )

        actual_output = execution.stdout
        expected_compare = expected_output.strip() if strip_output else expected_output
        actual_compare = actual_output.strip() if strip_output else actual_output

        if comparison == "equals":
            passed = (
                not execution.get("timed_out")
                and execution.get("exit_code") == 0
                and actual_compare == expected_compare
            )
        else:  # contains
            passed = (
                not execution.get("timed_out")
                and execution.get("exit_code") == 0
                and expected_compare in actual_compare
            )

        result_payload = {
            "name": name,
            "stdin": stdin,
            "expected_output": expected_output,
            "actual_output": actual_output,
            "comparison": comparison,
            "strip_output": strip_output,
            "exit_code": execution.get("exit_code"),
            "timed_out": execution.get("timed_out"),
            "stderr": execution.stderr,
            "duration": execution.get("duration"),
            "passed": passed,
        }
        results.append(result_payload)

        if not passed:
            all_passed = False
            if case.get("stop_on_failure", True):
                break

    return all_passed, results
