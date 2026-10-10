"""Four read-only demo routes. All case values come from prepared JSON."""
import json
from pathlib import Path
from typing import Annotated, Literal

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field, ValidationError

ROOT = Path(__file__).resolve().parents[1]
CaseId = Literal['UC1', 'UC2']
CaseQuery = Annotated[CaseId, Query()]
Nonnegative = Annotated[float, Field(ge=0)]
Percentage = Annotated[float, Field(ge=0, le=100)]


class ResponseModel(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True, allow_inf_nan=False)


class HealthResponse(ResponseModel):
    status: Literal['ok'] = 'ok'
    service: Literal['autotrace'] = 'autotrace'
    mode: Literal['prepared_demo'] = 'prepared_demo'


class DocumentResponse(ResponseModel):
    case_id: CaseId
    fictional_company: Annotated[str, Field(min_length=1)]
    crop: Literal['maize']
    total_purchase_quantity: Nonnegative
    purchase_from: Annotated[str, Field(min_length=1)]
    area_purchase_percentage: Percentage
    area_purchase_quantity_t: Nonnegative


class ImageryResponse(ResponseModel):
    before_url: str
    after_url: str


class CalculationResponse(ResponseModel):
    case_id: CaseId
    total_yield_t: Nonnegative
    burn_linked_percentage: Percentage
    non_burn_yield_t: Nonnegative


def create_app(data_dir: Path | None = None, assets_dir: Path | None = None) -> FastAPI:
    data_dir = data_dir if data_dir is not None else ROOT / 'data/demo'
    assets_dir = assets_dir if assets_dir is not None else ROOT / 'frontend/assets/selected-aois'
    api = FastAPI(title='AutoTrace prepared demo', redoc_url=None)

    def fail(status: int, code: str, message: str, case_id: CaseId):
        raise HTTPException(status, detail={'code': code, 'message': message, 'case_id': case_id})

    def read_section(case_id: CaseId, name: str, model: type[ResponseModel]) -> ResponseModel:
        try:
            record = json.loads((data_dir / f'{case_id}.json').read_text(encoding='utf-8'))
        except FileNotFoundError:
            fail(503, 'case_not_ready', f'Prepared data is not available for {case_id}.', case_id)
        except (OSError, ValueError):
            fail(500, 'invalid_prepared_data', f'Prepared data could not be read for {case_id}.', case_id)
        if not isinstance(record, dict):
            fail(500, 'invalid_prepared_data', 'Prepared record must be a JSON object.', case_id)
        section = record.get(name)
        if section is None or (isinstance(section, dict) and any(v is None for v in section.values())):
            fail(503, 'case_not_ready', f'Prepared {name} data is not available for {case_id}.', case_id)
        try:
            response = model.model_validate(section)
        except ValidationError:
            fail(500, 'invalid_prepared_data', f'Prepared {name} data is invalid for {case_id}.', case_id)
        if hasattr(response, 'case_id') and response.case_id != case_id:
            fail(500, 'invalid_prepared_data', 'Prepared case ID does not match the requested case.', case_id)
        return response

    @api.exception_handler(RequestValidationError)
    async def invalid_case(_request: Request, _error: RequestValidationError):
        return JSONResponse(status_code=422, content={'detail': {
            'code': 'invalid_case_id', 'message': 'case_id must be UC1 or UC2.', 'case_id': None,
        }})

    @api.get('/health', response_model=HealthResponse)
    def health():
        return HealthResponse()

    @api.get('/extract-doc', response_model=DocumentResponse)
    def document(case_id: CaseQuery):
        """Read prepared mock-company fields; no PDF extraction runs here."""
        return read_section(case_id, 'document', DocumentResponse)

    @api.get('/sentinel-pic', response_model=ImageryResponse)
    def imagery(case_id: CaseQuery):
        response = read_section(case_id, 'imagery', ImageryResponse)
        for url in [response.before_url, response.after_url]:
            prefix = f'/assets/selected-aois/{case_id}/'
            if not url.startswith(prefix):
                fail(500, 'invalid_prepared_data', 'Image URL must refer to the requested case.', case_id)
            filename = url[len(prefix):]
            # Accept a single filename only: no filesystem paths or traversal.
            if '/' in filename or '\\' in filename or Path(filename).suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp'}:
                fail(500, 'invalid_prepared_data', 'Image URL has an invalid filename.', case_id)
            image = (assets_dir / case_id / filename).resolve()
            if not image.is_relative_to(assets_dir.resolve()):
                fail(500, 'invalid_prepared_data', 'Image path is outside the approved asset directory.', case_id)
            if not image.is_file():
                fail(503, 'case_not_ready', f'An image is missing for {case_id}.', case_id)
        return response

    @api.get('/calculations', response_model=CalculationResponse)
    def calculations(case_id: CaseQuery):
        """Return stored Q, burn-linked percentage and C unchanged."""
        response = read_section(case_id, 'calculation', CalculationResponse)
        if response.non_burn_yield_t > response.total_yield_t:
            fail(500, 'invalid_prepared_data', 'Non-burn yield exceeds total yield.', case_id)
        return response

    # Only selected-case assets are exposed, not the repository or old research packets.
    api.mount('/assets/selected-aois', StaticFiles(directory=assets_dir, check_dir=False), name='case-images')
    return api


app = create_app()
