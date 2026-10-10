import hashlib
import json
import socket
import subprocess
import sys
import tempfile
import time
import unittest
from urllib.error import HTTPError, URLError
from urllib.request import urlopen
from unittest.mock import patch
from pathlib import Path

from fastapi.testclient import TestClient

from backend.app import app, create_app


class DemoApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

    def test_health(self):
        with TestClient(app) as client:
            response = client.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            'status': 'ok', 'service': 'autotrace', 'mode': 'prepared_demo',
        })

    def test_uc1_document_and_calculation(self):
        document = self.client.get('/extract-doc?case_id=UC1')
        self.assertEqual(document.status_code, 200)
        self.assertEqual(document.json(), {
            'case_id': 'UC1', 'fictional_company': 'Factory A', 'crop': 'maize',
            'total_purchase_quantity': 5000, 'purchase_from': 'Area-1',
            'area_purchase_percentage': 20, 'area_purchase_quantity_t': 1000,
        })
        result = self.client.get('/calculations?case_id=UC1')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json(), {
            'case_id': 'UC1', 'total_yield_t': 1513.61,
            'burn_linked_percentage': 82.47, 'non_burn_yield_t': 265.37,
        })
        # Independent reference arithmetic using the agreed rounded areas.
        self.assertAlmostEqual(result.json()['total_yield_t'], 216.23 * 7)
        self.assertAlmostEqual(result.json()['non_burn_yield_t'], (216.23 - 178.32) * 7)
        self.assertAlmostEqual(result.json()['burn_linked_percentage'], 178.32 / 216.23 * 100, delta=0.005)

    def test_uc2_document_and_calculation(self):
        document = self.client.get('/extract-doc?case_id=UC2')
        self.assertEqual(document.status_code, 200)
        self.assertEqual(document.json(), {
            'case_id': 'UC2', 'fictional_company': 'Factory B', 'crop': 'maize',
            'total_purchase_quantity': 5000, 'purchase_from': 'Area-2',
            'area_purchase_percentage': 20, 'area_purchase_quantity_t': 1000,
        })
        result = self.client.get('/calculations?case_id=UC2')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json(), {
            'case_id': 'UC2', 'total_yield_t': 1109.91,
            'burn_linked_percentage': 0, 'non_burn_yield_t': 1109.91,
        })

    def test_image_urls_and_original_bytes(self):
        root = Path(__file__).resolve().parents[1] / 'frontend'
        for case in ['UC1', 'UC2']:
            response = self.client.get(f'/sentinel-pic?case_id={case}')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(set(response.json()), {'before_url', 'after_url'})
            for url in response.json().values():
                with self.subTest(url=url):
                    self.assertTrue(url.startswith(f'/assets/selected-aois/{case}/'))
                    image = self.client.get(url)
                    self.assertEqual(image.status_code, 200)
                    self.assertTrue(image.headers['content-type'].startswith('image/'))
                    self.assertEqual(hashlib.sha256(image.content).hexdigest(), hashlib.sha256((root / url.lstrip('/')).read_bytes()).hexdigest())

    def test_invalid_or_missing_case(self):
        for endpoint in ['extract-doc', 'sentinel-pic', 'calculations']:
            for query in ['', '?case_id=UC3', '?case_id=uc1', '?case_id=', '?case_id=../../README.md']:
                with self.subTest(endpoint=endpoint, query=query):
                    response = self.client.get('/' + endpoint + query)
                    self.assertEqual(response.status_code, 422)
                    self.assertEqual(response.json()['detail']['code'], 'invalid_case_id')
                    self.assertIsNone(response.json()['detail']['case_id'])

    def test_only_four_application_routes(self):
        self.assertEqual(set(self.client.get('/openapi.json').json()['paths']), {
            '/health', '/extract-doc', '/sentinel-pic', '/calculations',
        })
        swagger = self.client.get('/docs')
        self.assertEqual(swagger.status_code, 200)
        self.assertIn('SwaggerUIBundle', swagger.text)
        self.assertEqual(self.client.post('/calculations?case_id=UC1').status_code, 405)

    def test_static_paths_are_bounded(self):
        for path in ['/assets/selected-aois/%2e%2e/%2e%2e/%2e%2e/README.md', '/data/demo/UC1.json', '/assets/usecase2/README.md']:
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 404)

    def test_missing_or_corrupt_records(self):
        with tempfile.TemporaryDirectory() as folder:
            data_dir = Path(folder)
            with TestClient(create_app(data_dir=data_dir)) as client:
                self.assertEqual(client.get('/calculations?case_id=UC1').status_code, 503)
                (data_dir / 'UC1.json').write_text('{invalid', encoding='utf-8')
                response = client.get('/calculations?case_id=UC1')
                self.assertEqual(response.status_code, 500)
                self.assertEqual(response.json()['detail']['code'], 'invalid_prepared_data')

    def test_editing_uc2_template_needs_no_code_change(self):
        root = Path(__file__).resolve().parents[1]
        record = json.loads((root / 'data/demo/UC2.json').read_text())
        record['calculation'].update(total_yield_t=100, burn_linked_percentage=0, non_burn_yield_t=100)
        with tempfile.TemporaryDirectory() as folder:
            data_dir = Path(folder)
            path = data_dir / 'UC2.json'
            path.write_text(json.dumps(record), encoding='utf-8')
            with TestClient(create_app(data_dir=data_dir)) as client:
                response = client.get('/calculations?case_id=UC2')
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()['non_burn_yield_t'], 100)
                record['calculation']['non_burn_yield_t'] = -1
                path.write_text(json.dumps(record), encoding='utf-8')
                self.assertEqual(client.get('/calculations?case_id=UC2').status_code, 500)

    def test_invalid_numbers_and_case_mismatch(self):
        root = Path(__file__).resolve().parents[1]
        record = json.loads((root / 'data/demo/UC1.json').read_text())
        with tempfile.TemporaryDirectory() as folder:
            data_dir = Path(folder)
            path = data_dir / 'UC1.json'
            with TestClient(create_app(data_dir=data_dir)) as client:
                for value in [-1, 101, float('nan'), '82.47', True]:
                    with self.subTest(value=value):
                        record['calculation']['burn_linked_percentage'] = value
                        path.write_text(json.dumps(record), encoding='utf-8')
                        self.assertEqual(client.get('/calculations?case_id=UC1').status_code, 500)
                record['calculation'].update(burn_linked_percentage=82.47, case_id='UC2')
                path.write_text(json.dumps(record), encoding='utf-8')
                self.assertEqual(client.get('/calculations?case_id=UC1').status_code, 500)

    def test_missing_image_or_unsafe_url(self):
        root = Path(__file__).resolve().parents[1]
        record = json.loads((root / 'data/demo/UC1.json').read_text())
        with tempfile.TemporaryDirectory() as folder:
            data_dir = Path(folder)
            path = data_dir / 'UC1.json'
            with TestClient(create_app(data_dir=data_dir)) as client:
                for url, status in [('/assets/selected-aois/UC1/missing.jpg', 503), ('/assets/selected-aois/UC1/../../../README.md', 500), ('https://example.com/image.jpg', 500)]:
                    with self.subTest(url=url):
                        record['imagery']['before_url'] = url
                        path.write_text(json.dumps(record), encoding='utf-8')
                        self.assertEqual(client.get('/sentinel-pic?case_id=UC1').status_code, status)

    def test_real_uvicorn_launch(self):
        root = Path(__file__).resolve().parents[1]
        with socket.socket() as port_probe:
            port_probe.bind(('127.0.0.1', 0))
            port = port_probe.getsockname()[1]
        with tempfile.TemporaryFile() as logs:
            process = subprocess.Popen([
                sys.executable, '-m', 'uvicorn', 'backend.app:app',
                '--host', '127.0.0.1', '--port', str(port),
            ], cwd=root, stdout=logs, stderr=logs)
            try:
                base = f'http://127.0.0.1:{port}'
                deadline = time.monotonic() + 10
                while True:
                    try:
                        with urlopen(base + '/health', timeout=1) as response:
                            self.assertEqual(json.load(response)['status'], 'ok')
                        break
                    except URLError:
                        if process.poll() is not None or time.monotonic() >= deadline:
                            logs.seek(0)
                            self.fail('Server failed to become ready: ' + logs.read().decode(errors='replace'))
                        time.sleep(0.1)
                with urlopen(base + '/calculations?case_id=UC1', timeout=2) as response:
                    self.assertEqual(json.load(response)['total_yield_t'], 1513.61)
                for case in ['UC1', 'UC2']:
                    with urlopen(base + '/sentinel-pic?case_id=' + case, timeout=2) as response:
                        urls = json.load(response)
                    for url in urls.values():
                        with urlopen(base + url, timeout=2) as image:
                            self.assertTrue(image.headers['Content-Type'].startswith('image/'))
                            self.assertGreater(len(image.read()), 0)
                with urlopen(base + '/extract-doc?case_id=UC2', timeout=2) as response:
                    self.assertEqual(json.load(response)['case_id'], 'UC2')
            finally:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)

    def test_prepared_routes_with_external_network_denied(self):
        original_connect = socket.socket.connect
        original_lookup = socket.getaddrinfo

        def connect_guard(sock, address):
            if isinstance(address, tuple) and address[0] not in {'127.0.0.1', '::1'}:
                raise OSError('External network denied for offline test')
            return original_connect(sock, address)

        def lookup_guard(host, *args, **kwargs):
            if host not in {'127.0.0.1', '::1', 'localhost', None}:
                raise OSError('External DNS denied for offline test')
            return original_lookup(host, *args, **kwargs)

        with patch.object(socket.socket, 'connect', connect_guard), patch.object(socket, 'getaddrinfo', lookup_guard):
            # Prove the guard is active, then exercise the real application.
            with socket.socket() as denied:
                with self.assertRaisesRegex(OSError, 'External network denied'):
                    denied.connect(('203.0.113.1', 443))
            with self.assertRaisesRegex(OSError, 'External DNS denied'):
                socket.getaddrinfo('example.com', 443)
            with TestClient(app) as client:
                self.assertEqual(client.get('/health').status_code, 200)
                self.assertEqual(client.get('/extract-doc?case_id=UC1').status_code, 200)
                self.assertEqual(client.get('/calculations?case_id=UC1').status_code, 200)
                self.assertEqual(client.get('/calculations?case_id=UC2').status_code, 200)
                for case in ['UC1', 'UC2']:
                    urls = client.get('/sentinel-pic?case_id=' + case).json()
                    for url in urls.values():
                        self.assertEqual(client.get(url).status_code, 200)


if __name__ == '__main__':
    unittest.main()
