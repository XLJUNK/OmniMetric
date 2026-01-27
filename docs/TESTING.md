# Testing Guide

## Overview

This project includes automated tests for core functionality:

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test API endpoints and data flows
- **GitHub Actions**: Automated testing on every push

## Running Tests Locally

### Prerequisites

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt
```

### Run All Tests

```bash
# From project root
python tests/test_log_utils.py
python tests/test_health_api.py
```

### Run Specific Test

```bash
# Run only logging tests
python tests/test_log_utils.py

# Run only health API tests
python tests/test_health_api.py
```

## Test Coverage

### Unit Tests (`test_log_utils.py`)

Tests for centralized logging utility:

- ✅ Logger initialization
- ✅ API key redaction
- ✅ Log file rotation
- ✅ JSON format output
- ✅ Structured context fields
- ✅ Multiple log levels (INFO, WARN, ERROR, DEBUG)

### Integration Tests (`test_health_api.py`)

Tests for health check API:

- ✅ Response structure validation
- ✅ Status level logic (healthy/warning/critical/error)
- ✅ Data freshness calculation

## GitHub Actions

Tests run automatically on:

- Every push to `main` branch
- Every pull request
- Manual trigger via `workflow_dispatch`

**Workflow**: `.github/workflows/test.yml`

View test results in the Actions tab of your GitHub repository.

## Writing New Tests

### Unit Test Template

```python
class TestMyFeature:
    def setup_method(self):
        """Setup before each test."""
        pass
    
    def teardown_method(self):
        """Cleanup after each test."""
        pass
    
    def test_my_feature(self):
        """Test description."""
        # Arrange
        input_data = "test"
        
        # Act
        result = my_function(input_data)
        
        # Assert
        assert result == expected, "Error message"
```

### Integration Test Template

```python
class TestMyAPI:
    def test_api_endpoint(self):
        """Test API endpoint returns correct data."""
        # Mock or call actual endpoint
        response = call_api()
        
        # Validate response
        assert "field" in response
        assert response["field"] == expected_value
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Use descriptive test names (e.g., `test_api_key_redaction`)
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Cleanup**: Always clean up temporary files/data
5. **Fast Tests**: Keep tests fast (<1s per test)

## Continuous Integration

The test workflow runs on every commit to ensure:

- No regressions in existing functionality
- New features work as expected
- Code quality is maintained

**Failed tests will block merges** to protect production stability.

## Future Enhancements

Potential testing improvements:

- [ ] Code coverage reporting
- [ ] Performance benchmarks
- [ ] End-to-end browser tests
- [ ] Load testing for APIs
- [ ] Security scanning

## Related Documentation

- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Health Check API](./HEALTH_CHECK_API.md)
- [Project Specification](../PROJECT_SPEC.md)
